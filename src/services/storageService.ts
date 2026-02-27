import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";
import type { User, WeightLog, Recipe, MealLog, ShoppingItem } from "../types";
import { DEFAULT_RECIPES } from "../constants/defaultRecipes";

const STORAGE_KEYS = {
  USER: "nutritrack_user",
  WEIGHT_LOGS: "nutritrack_weight_logs",
  RECIPES: "nutritrack_recipes",
  MEAL_LOGS: "nutritrack_meal_logs",
  SHOPPING_LIST: "nutritrack_shopping_list",
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // User
  getUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.USER, null);
  }

  setUser(user: User | null): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  // Weight Logs
  getWeightLogs(): WeightLog[] {
    return this.get<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS, []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  addWeightLog(log: Omit<WeightLog, "id">): WeightLog {
    const logs = this.getWeightLogs();
    const newLog = { ...log, id: Date.now() };
    this.set(STORAGE_KEYS.WEIGHT_LOGS, [newLog, ...logs]);
    return newLog;
  }

  deleteWeightLog(id: number | string): void {
    const logs = this.getWeightLogs();
    this.set(STORAGE_KEYS.WEIGHT_LOGS, logs.filter(l => String(l.id) !== String(id)));
  }

  // Recipes
  getRecipes(): Recipe[] {
    const recipes = this.get<Recipe[]>(STORAGE_KEYS.RECIPES, []);
    if (recipes.length === 0) {
      this.set(STORAGE_KEYS.RECIPES, DEFAULT_RECIPES);
      return DEFAULT_RECIPES;
    }
    return recipes;
  }

  resetRecipes(): void {
    this.set(STORAGE_KEYS.RECIPES, DEFAULT_RECIPES);
  }

  addRecipe(recipe: Omit<Recipe, "id">): Recipe {
    const recipes = this.getRecipes();
    const newRecipe = { ...recipe, id: Date.now() };
    this.set(STORAGE_KEYS.RECIPES, [newRecipe, ...recipes]);
    return newRecipe;
  }

  updateRecipe(id: number | string, recipe: Partial<Recipe>): void {
    const recipes = this.getRecipes();
    const updatedRecipes = recipes.map(r => String(r.id) === String(id) ? { ...r, ...recipe } : r);
    // Put the updated recipe at the beginning
    const updatedRecipe = updatedRecipes.find(r => String(r.id) === String(id));
    const otherRecipes = updatedRecipes.filter(r => String(r.id) !== String(id));
    if (updatedRecipe) {
      this.set(STORAGE_KEYS.RECIPES, [updatedRecipe, ...otherRecipes]);
    }
  }

  deleteRecipe(id: number | string): void {
    const recipes = this.getRecipes();
    this.set(STORAGE_KEYS.RECIPES, recipes.filter(r => String(r.id) !== String(id)));
  }

  // Meal Logs
  getMealLogs(start?: string, end?: string): MealLog[] {
    let logs = this.get<MealLog[]>(STORAGE_KEYS.MEAL_LOGS, []);
    if (start && end) {
      const startDate = parseISO(start);
      const endDate = parseISO(end);
      logs = logs.filter(l => {
        const d = parseISO(l.date);
        return isWithinInterval(d, { start: startDate, end: endDate });
      });
    }
    return logs;
  }

  addMealLog(log: Omit<MealLog, "id">): MealLog {
    const logs = this.get<MealLog[]>(STORAGE_KEYS.MEAL_LOGS, []);
    const newLog = { ...log, id: Date.now() };
    const updatedLogs = [...logs, newLog];
    this.set(STORAGE_KEYS.MEAL_LOGS, updatedLogs);
    this.updateShoppingList();
    return newLog;
  }

  deleteMealLog(id: number | string): void {
    const logs = this.get<MealLog[]>(STORAGE_KEYS.MEAL_LOGS, []);
    this.set(STORAGE_KEYS.MEAL_LOGS, logs.filter(l => String(l.id) !== String(id)));
    this.updateShoppingList();
  }

  // Shopping List
  getShoppingList(): ShoppingItem[] {
    return this.get<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_LIST, []);
  }

  updateShoppingItem(id: number, is_checked: boolean): void {
    const list = this.getShoppingList();
    this.set(STORAGE_KEYS.SHOPPING_LIST, list.map(item => 
      item.id === id ? { ...item, is_checked } : item
    ));
  }

  clearShoppingList(): void {
    this.set(STORAGE_KEYS.SHOPPING_LIST, []);
  }

  private updateShoppingList(): void {
    const start = format(startOfWeek(new Date()), "yyyy-MM-dd");
    const end = format(endOfWeek(new Date()), "yyyy-MM-dd");
    const meals = this.getMealLogs(start, end);
    const recipes = this.getRecipes();
    
    const ingredientsMap = new Map();

    for (const meal of meals) {
      const recipe = recipes.find(r => r.id === meal.recipe_id);
      if (!recipe) continue;

      const multiplier = meal.servings / (recipe.servings || 1);

      for (const ing of recipe.ingredients) {
        const key = `${ing.name.toLowerCase().trim()}-${ing.unit.toLowerCase().trim()}`;
        if (ingredientsMap.has(key)) {
          const existing = ingredientsMap.get(key);
          existing.amount += ing.amount * multiplier;
        } else {
          ingredientsMap.set(key, {
            name: ing.name,
            amount: ing.amount * multiplier,
            unit: ing.unit,
            category: ing.category || "Altro",
            is_checked: false
          });
        }
      }
    }

    const newList: ShoppingItem[] = Array.from(ingredientsMap.values()).map((item, index) => ({
      ...item,
      id: index + 1,
      user_id: 0
    }));

    this.set(STORAGE_KEYS.SHOPPING_LIST, newList);
  }

  // Export / Import
  exportData(): string {
    const data = {
      weightLogs: this.getWeightLogs(),
      recipes: this.getRecipes(),
      mealLogs: this.get<MealLog[]>(STORAGE_KEYS.MEAL_LOGS, []),
      shoppingList: this.getShoppingList(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(json: string): void {
    try {
      const data = JSON.parse(json);
      if (data.weightLogs) this.set(STORAGE_KEYS.WEIGHT_LOGS, data.weightLogs);
      if (data.recipes) this.set(STORAGE_KEYS.RECIPES, data.recipes);
      if (data.mealLogs) this.set(STORAGE_KEYS.MEAL_LOGS, data.mealLogs);
      if (data.shoppingList) this.set(STORAGE_KEYS.SHOPPING_LIST, data.shoppingList);
    } catch (e) {
      console.error("Failed to import data", e);
      throw new Error("Formato file non valido");
    }
  }

  // Initial Seed
  async seedInitialRecipes(recipes: Recipe[]) {
    const existing = this.getRecipes();
    if (existing.length === 0) {
      this.set(STORAGE_KEYS.RECIPES, recipes);
    }
  }
}

export const storage = new StorageService();
