import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Utensils,
  Clock,
  Flame,
  Dna,
  Wheat,
  Droplets,
  X
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import type { MealLog, Recipe } from "../types";
import { storage } from "../services/storageService";
import RecipeViewModal from "./RecipeViewModal";

export default function MealPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [mealCategory, setMealCategory] = useState("Pranzo");
  const [servings, setServings] = useState("1");
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = () => {
    const start = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
    const end = format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
    
    setMeals(storage.getMealLogs(start, end));
    setRecipes(storage.getRecipes());
    setLoading(false);
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const recipe = recipes.find(r => r.id === parseInt(selectedRecipeId));
    if (!recipe || selectedDays.length === 0) return;

    const s = parseFloat(servings);
    
    selectedDays.forEach(dayDate => {
      storage.addMealLog({
        user_id: 1,
        recipe_id: recipe.id,
        title: recipe.title,
        category: mealCategory,
        calories: recipe.calories * s,
        protein: recipe.protein * s,
        carbs: recipe.carbs * s,
        fat: recipe.fat * s,
        servings: s,
        date: dayDate,
        notes: ""
      });
    });

    setShowAddModal(false);
    setSelectedDays([]);
    fetchData();
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const toggleDay = (date: string) => {
    setSelectedDays(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const filteredRecipes = recipes.filter(r => r.category === mealCategory);

  const deleteMeal = (id: number) => {
    storage.deleteMealLog(id);
    fetchData();
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));

  const getDayStats = (day: Date) => {
    const dayMeals = meals.filter(m => isSameDay(new Date(m.date), day));
    return dayMeals.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Piano Pasti</h2>
          <p className="text-zinc-400 font-medium mt-2">Organizza la tua alimentazione settimanale.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="p-2 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold text-[#1E3F20] px-2 min-w-[140px] text-center">
            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: it })} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: it })}
          </span>
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="p-2 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 gap-8">
        {weekDays.map((day, i) => {
          const dayMeals = meals.filter(m => isSameDay(new Date(m.date), day));
          const stats = getDayStats(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={i} 
              className={cn(
                "bg-white rounded-[2.5rem] border transition-all overflow-hidden",
                isToday ? "border-[#4A7C59]/30 shadow-xl shadow-[#4A7C59]/10 ring-1 ring-[#4A7C59]/20" : "border-zinc-100 shadow-sm"
              )}
            >
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-50">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex flex-col items-center justify-center border",
                    isToday ? "bg-[#3A6345] border-[#4A7C59] text-white" : "bg-zinc-50 border-zinc-100 text-zinc-400"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{format(day, "EEE", { locale: it })}</span>
                    <span className="text-2xl font-bold leading-none">{format(day, "d")}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#1E3F20]">
                      {isToday ? "Oggi" : format(day, "EEEE", { locale: it })}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs font-bold text-zinc-400">
                      <span className="flex items-center gap-1.5"><Flame size={14} className="text-orange-400" /> {stats.calories.toFixed(0)} kcal</span>
                      <span className="flex items-center gap-1.5"><Dna size={14} className="text-blue-400" /> {stats.protein.toFixed(1)}g</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1E3F20] text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100"
                >
                  <Plus size={16} />
                  Aggiungi Pasto
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dayMeals.length === 0 ? (
                  <div className="col-span-full py-8 text-center border border-dashed border-zinc-100 rounded-3xl">
                    <p className="text-zinc-300 text-sm font-medium italic">Nessun pasto programmato</p>
                  </div>
                ) : (
                  [...dayMeals].sort((a, b) => {
                    const order: Record<string, number> = {
                      'Colazione': 1,
                      'Pranzo': 2,
                      'Spuntino': 3,
                      'Cena': 4
                    };
                    return (order[a.category] || 99) - (order[b.category] || 99);
                  }).map((meal) => (
                    <div key={meal.id} className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 group relative">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMeal(meal.id);
                        }}
                        className="absolute top-4 right-4 z-10 p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer"
                      >
                        <Trash2 size={16} className="pointer-events-none" />
                      </button>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">{meal.category}</span>
                      <h4 className="text-sm font-bold text-[#1E3F20] mb-4 pr-6">{meal.title}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/50 p-2 rounded-xl text-center">
                          <p className="text-[8px] text-zinc-400 font-bold uppercase">Calorie</p>
                          <p className="text-xs font-bold text-zinc-700">{meal.calories.toFixed(0)}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded-xl text-center">
                          <p className="text-[8px] text-zinc-400 font-bold uppercase">Porzioni</p>
                          <p className="text-xs font-bold text-zinc-700">{meal.servings}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3F20]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-[#1E3F20]">Aggiungi Pasto</h3>
                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-zinc-50 rounded-2xl transition-colors text-zinc-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Giorni</label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map(day => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => toggleDay(dateStr)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                            selectedDays.includes(dateStr)
                              ? "bg-[#1E3F20] border-[#1E3F20] text-white"
                              : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-200"
                          )}
                        >
                          {format(day, "EEEE", { locale: it })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Tipo</label>
                    <select
                      value={mealCategory}
                      onChange={(e) => setMealCategory(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium"
                    >
                      <option>Colazione</option>
                      <option>Pranzo</option>
                      <option>Cena</option>
                      <option>Spuntino</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Porzioni</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Ricetta</label>
                  <select
                    required
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                  >
                    <option value="">Seleziona una ricetta...</option>
                    {filteredRecipes.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-zinc-50 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-100 transition-all">
                    Annulla
                  </button>
                  <button 
                    type="submit" 
                    disabled={selectedDays.length === 0}
                    className="flex-1 py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                  >
                    Aggiungi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
