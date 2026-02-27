import { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Plus, 
  Search, 
  Filter, 
  Utensils, 
  Clock, 
  Users, 
  Trash2, 
  Edit2,
  ChevronRight,
  X,
  Flame,
  Dna,
  Wheat,
  Droplets,
  Calendar as CalendarIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import type { Recipe, Ingredient } from "../types";
import { storage } from "../services/storageService";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pranzo");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servings, setServings] = useState("1");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIng, setNewIng] = useState({ name: "", amount: "", unit: "g", category: "Altro" });

  // Planning State
  const [showPlanModal, setShowPlanModal] = useState<Recipe | null>(null);
  const [planCategory, setPlanCategory] = useState("Pranzo");
  const [planServings, setPlanServings] = useState("1");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    setRecipes(storage.getRecipes());
    setLoading(false);
  };

  const handlePlanMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPlanModal || selectedDays.length === 0) return;

    const s = parseFloat(planServings);
    
    selectedDays.forEach(dayDate => {
      storage.addMealLog({
        user_id: 1,
        recipe_id: showPlanModal.id,
        title: showPlanModal.title,
        category: planCategory,
        calories: showPlanModal.calories * s,
        protein: showPlanModal.protein * s,
        carbs: showPlanModal.carbs * s,
        fat: showPlanModal.fat * s,
        servings: s,
        date: dayDate,
        notes: ""
      });
    });

    setShowPlanModal(null);
    setSelectedDays([]);
    alert("Pasti programmati con successo!");
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), "yyyy-MM-dd"));

  const toggleDay = (date: string) => {
    setSelectedDays(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleResetRecipes = () => {
    storage.resetRecipes();
    fetchRecipes();
  };

  const handleAddIngredient = () => {
    if (!newIng.name || !newIng.amount) return;
    setIngredients([...ingredients, { ...newIng, amount: parseFloat(newIng.amount) }]);
    setNewIng({ name: "", amount: "", unit: "g", category: "Altro" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeData = {
      user_id: 1,
      title, 
      category, 
      calories: parseFloat(calories), 
      protein: parseFloat(protein), 
      carbs: parseFloat(carbs), 
      fat: parseFloat(fat), 
      servings: parseInt(servings), 
      instructions, 
      ingredients
    };

    if (editingId) {
      storage.updateRecipe(editingId, recipeData);
    } else {
      storage.addRecipe(recipeData);
    }

    setShowAddModal(false);
    resetForm();
    fetchRecipes();
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setTitle(recipe.title);
    setCategory(recipe.category);
    setCalories(recipe.calories.toString());
    setProtein(recipe.protein.toString());
    setCarbs(recipe.carbs.toString());
    setFat(recipe.fat.toString());
    setServings(recipe.servings.toString());
    setInstructions(recipe.instructions);
    setIngredients(recipe.ingredients);
    setShowAddModal(true);
  };

  const deleteRecipe = (id: number) => {
    storage.deleteRecipe(id);
    fetchRecipes();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setCategory("Pranzo"); setCalories(""); setProtein(""); setCarbs(""); setFat(""); setServings("1"); setInstructions(""); setIngredients([]);
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Ricettario</h2>
          <p className="text-zinc-400 font-medium mt-2">Sfoglia e programma i tuoi pasti preferiti.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleResetRecipes}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
          >
            Ripristina Default
          </button>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E3F20] text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            <Plus size={18} />
            Crea Ricetta
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Cerca per nome o categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#1E3F20]/5 focus:border-zinc-200 shadow-sm transition-all font-medium"
          />
        </div>
        <button className="px-5 bg-white border border-zinc-100 rounded-3xl text-zinc-400 hover:text-[#1E3F20] hover:bg-zinc-50 transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="animate-pulse text-zinc-300 font-medium">Caricamento collezione...</div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
            <Utensils className="mx-auto text-zinc-200 mb-4" size={48} />
            <p className="text-zinc-400 font-medium">Nessuna ricetta trovata.</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <motion.div 
              layout
              key={recipe.id} 
              className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <span className="px-3 py-1 bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-100">
                    {recipe.category}
                  </span>
                  <div className="flex items-center gap-1 relative z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecipe(recipe);
                      }}
                      className="p-2 text-zinc-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Edit2 size={18} className="pointer-events-none" />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecipe(recipe.id);
                      }}
                      className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={18} className="pointer-events-none" />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1E3F20] mb-3 leading-tight group-hover:text-[#3A6345] transition-colors">{recipe.title}</h3>
                <div className="flex items-center gap-6 text-xs font-bold text-zinc-400 mb-8">
                  <span className="flex items-center gap-1.5"><Flame size={16} className="text-orange-400" /> {recipe.calories} <span className="font-medium">kcal</span></span>
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-400" /> {recipe.servings} <span className="font-medium">porzioni</span></span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-zinc-50 p-3 rounded-2xl text-center border border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Proteine</p>
                    <p className="text-sm font-bold text-[#1E3F20]">{recipe.protein}g</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-2xl text-center border border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Carbi</p>
                    <p className="text-sm font-bold text-[#1E3F20]">{recipe.carbs}g</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-2xl text-center border border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Grassi</p>
                    <p className="text-sm font-bold text-[#1E3F20]">{recipe.fat}g</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPlanModal(recipe)}
                    className="flex-1 py-3 bg-[#1E3F20] text-white text-xs font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100 flex items-center justify-center gap-2"
                  >
                    <CalendarIcon size={14} className="text-[#4A7C59]" />
                    Pianifica
                  </button>
                  <button className="p-3 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-zinc-100 hover:text-[#1E3F20] transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3F20]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1E3F20]">Pianifica Pasto</h3>
                  <p className="text-xs text-zinc-400 font-medium mt-1">{showPlanModal.title}</p>
                </div>
                <button onClick={() => setShowPlanModal(null)} className="p-3 hover:bg-zinc-50 rounded-2xl transition-colors text-zinc-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePlanMeal} className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Giorni</label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map(dateStr => (
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
                        {format(new Date(dateStr), "EEEE", { locale: it })}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Tipo Pasto</label>
                  <select
                    value={planCategory} onChange={(e) => setPlanCategory(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                  >
                    <option>Colazione</option><option>Pranzo</option><option>Cena</option><option>Spuntino</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Porzioni</label>
                  <input
                    type="number" step="0.1" required value={planServings} onChange={(e) => setPlanServings(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowPlanModal(null)} className="flex-1 py-4 bg-zinc-50 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-100 transition-all">
                    Annulla
                  </button>
                  <button 
                    type="submit" 
                    disabled={selectedDays.length === 0}
                    className="flex-1 py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                  >
                    Aggiungi al Piano
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3F20]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <h3 className="text-3xl font-serif font-bold text-[#1E3F20]">{editingId ? "Modifica Ricetta" : "Nuova Ricetta"}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-zinc-50 rounded-2xl transition-colors text-zinc-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Titolo</label>
                    <input
                      type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                      placeholder="es. Avocado Toast"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Categoria</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                    >
                      <option>Colazione</option>
                      <option>Pranzo</option>
                      <option>Cena</option>
                      <option>Spuntino</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Calorie</label>
                    <input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Proteine</label>
                    <input type="number" required value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Carbi</label>
                    <input type="number" required value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Grassi</label>
                    <input type="number" required value={fat} onChange={(e) => setFat(e.target.value)} className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Ingredienti</label>
                  <div className="space-y-3">
                    {ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between bg-zinc-50 px-5 py-3 rounded-2xl border border-zinc-100">
                        <span className="text-sm font-bold text-zinc-700">{ing.name} <span className="text-zinc-400 font-medium ml-2">{ing.amount}{ing.unit}</span></span>
                        <button type="button" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-red-500 transition-colors">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" placeholder="Nome" value={newIng.name} onChange={(e) => setNewIng({...newIng, name: e.target.value})}
                      className="flex-1 px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium"
                    />
                    <input 
                      type="number" placeholder="Qta" value={newIng.amount} onChange={(e) => setNewIng({...newIng, amount: e.target.value})}
                      className="w-24 px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium"
                    />
                    <select 
                      value={newIng.unit} onChange={(e) => setNewIng({...newIng, unit: e.target.value})}
                      className="w-24 px-3 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium"
                    >
                      <option>g</option><option>ml</option><option>pz</option><option>cucchiaio</option>
                    </select>
                    <button type="button" onClick={handleAddIngredient} className="p-3 bg-[#1E3F20] text-white rounded-2xl hover:bg-zinc-800 transition-all">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Istruzioni</label>
                  <textarea
                    rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium"
                    placeholder="Descrivi il processo di preparazione..."
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-zinc-50 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-100 transition-all">
                    Annulla
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
                    Salva Ricetta
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
