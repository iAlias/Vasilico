export interface User {
  id: number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  height?: number; // in cm
  initialWeight?: number; // in kg
  birthDate?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose' | 'maintain' | 'gain';
  password?: string;
}

export interface WeightLog {
  id: number;
  user_id: number;
  weight: number;
  date: string;
  notes?: string;
}

export interface Ingredient {
  id?: number;
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  instructions: string;
  ingredients: Ingredient[];
}

export interface MealLog {
  id: number;
  user_id: number;
  recipe_id?: number;
  title: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  date: string;
  notes?: string;
}

export interface ShoppingItem {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  unit: string;
  category: string;
  is_checked: boolean;
}
