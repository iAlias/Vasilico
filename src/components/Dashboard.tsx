import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Flame, 
  Dna, 
  Wheat, 
  Droplets,
  Plus,
  ChevronRight,
  BookOpen,
  ShoppingCart
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import type { WeightLog, MealLog, Recipe } from "../types";
import { storage } from "../services/storageService";
import RecipeViewModal from "./RecipeViewModal";

interface DashboardProps {
  setActiveView: (view: any) => void;
}

export default function Dashboard({ setActiveView }: DashboardProps) {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [dailyMeals, setDailyMeals] = useState<MealLog[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchData = () => {
      setUser(storage.getUser());
      const logs = storage.getWeightLogs();
      setWeightLogs(logs);

      const today = format(new Date(), "yyyy-MM-dd");
      const dMeals = storage.getMealLogs(today, today);
      setDailyMeals(dMeals);

      const start = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const end = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const wMeals = storage.getMealLogs(start, end);
      setWeeklyMeals(wMeals);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const currentWeight = weightLogs[0]?.weight || 0;
  const previousWeight = weightLogs[1]?.weight || currentWeight;
  const weightDiff = currentWeight - previousWeight;

  const getBMICategory = (w: number) => {
    if (w === 0) return { label: "Nessun dato", color: "text-zinc-400" };
    const height = user?.height ? user.height / 100 : 1.75;
    const bmi = w / (height * height);
    if (bmi < 18.5) return { label: "Sottopeso", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normopeso", color: "text-[#4A7C59]" };
    if (bmi < 30) return { label: "Sovrappeso", color: "text-orange-500" };
    return { label: "Obesità", color: "text-rose-500" };
  };

  const bmiInfo = getBMICategory(currentWeight);

  const dailyStats = dailyMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const chartData = [...weightLogs].reverse().slice(-7).map(log => ({
    date: format(new Date(log.date), "dd MMM", { locale: it }),
    weight: log.weight
  }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-white rounded-[2.5rem]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-48 bg-white rounded-[2.5rem]" />
        <div className="h-48 bg-white rounded-[2.5rem]" />
        <div className="h-48 bg-white rounded-[2.5rem]" />
      </div>
    </div>;
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Ciao{user?.firstName ? ` ${user.firstName}` : ''}!</h2>
          <p className="text-zinc-400 font-medium mt-2">Ecco una panoramica dei tuoi progressi questa settimana.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveView("weight")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Plus size={18} className="text-[#4A7C59]" />
            Peso
          </button>
          <button 
            onClick={() => setActiveView("meals")}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E3F20] text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            <Plus size={18} className="text-[#4A7C59]" />
            Pasto
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Card */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#1E3F20] border border-zinc-100">
                  <Scale size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Peso Attuale</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-serif font-bold text-[#1E3F20]">{currentWeight} <span className="text-lg font-sans text-zinc-400">kg</span></p>
                    <div className="flex flex-col items-start gap-1">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100", bmiInfo.color)}>
                        {bmiInfo.label}
                      </span>
                      {currentWeight > 0 && (
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          BMI: {(currentWeight / ((user?.height ? user.height / 100 : 1.75) * (user?.height ? user.height / 100 : 1.75))).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold",
                weightDiff <= 0 ? "bg-[#E8F0E9] text-[#3A6345]" : "bg-rose-50 text-rose-600"
              )}>
                {weightDiff <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                {Math.abs(weightDiff).toFixed(1)} kg
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a1a1aa', fontSize: 12, fontWeight: 600}}
                    dy={10}
                  />
                  <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px'}}
                    labelStyle={{fontWeight: 700, marginBottom: '4px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-[#1E3F20] p-10 rounded-[3rem] text-white shadow-2xl shadow-zinc-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A7C59]/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Nutrizione Giornaliera</h3>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 text-sm font-bold"><Flame size={18} className="text-orange-400" /> Calorie</span>
                  <span className="text-sm font-bold">{dailyStats.calories.toLocaleString()} <span className="text-zinc-500">kcal</span></span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dailyStats.calories / 2000) * 100, 100)}%` }}
                    className="h-full bg-[#4A7C59]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    <Dna size={12} className="text-blue-400" /> Proteine
                  </div>
                  <p className="text-lg font-bold">{dailyStats.protein}g</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    <Wheat size={12} className="text-amber-400" /> Carbi
                  </div>
                  <p className="text-lg font-bold">{dailyStats.carbs}g</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    <Droplets size={12} className="text-rose-400" /> Grassi
                  </div>
                  <p className="text-lg font-bold">{dailyStats.fat}g</p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveView("meals")}
            className="relative z-10 mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            Dettagli Nutrizionali
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekly Meal Plan Calendar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif font-bold text-[#1E3F20]">Programma della Settimana</h3>
          <button 
            onClick={() => setActiveView("meals")}
            className="text-sm font-bold text-[#3A6345] hover:text-[#5A4C36] transition-colors flex items-center gap-1"
          >
            Vedi tutto <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {weekDays.map((day, i) => {
            const dayMeals = weeklyMeals.filter(m => isSameDay(new Date(m.date), day));
            const isToday = isSameDay(day, new Date());
            
            // Sort meals: Colazione, Pranzo, Spuntino, Cena
            const mealOrder: Record<string, number> = {
              'Colazione': 1,
              'Pranzo': 2,
              'Spuntino': 3,
              'Cena': 4
            };
            
            const sortedMeals = [...dayMeals].sort((a, b) => {
              return (mealOrder[a.category] || 99) - (mealOrder[b.category] || 99);
            });
            
            return (
              <div 
                key={i} 
                className={cn(
                  "p-5 rounded-[2rem] border transition-all",
                  isToday 
                    ? "bg-white border-[#4A7C59]/30 shadow-lg shadow-[#4A7C59]/10 ring-1 ring-[#4A7C59]/20" 
                    : "bg-white border-zinc-100 shadow-sm hover:border-zinc-200"
                )}
              >
                <div className="text-center mb-4">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-1",
                    isToday ? "text-[#3A6345]" : "text-zinc-400"
                  )}>
                    {format(day, "EEE", { locale: it })}
                  </p>
                  <p className={cn(
                    "text-lg font-bold",
                    isToday ? "text-[#1E3F20]" : "text-zinc-500"
                  )}>
                    {format(day, "d")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {sortedMeals.length > 0 ? (
                    sortedMeals.slice(0, 4).map((meal, idx) => (
                      <div key={idx} className="bg-zinc-50 p-2 rounded-xl border border-zinc-100/50">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase truncate">{meal.category}</p>
                        <p className="text-[10px] font-bold text-zinc-700 truncate">{meal.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="aspect-square flex items-center justify-center border border-dashed border-zinc-100 rounded-2xl">
                      <Plus size={14} className="text-zinc-200" />
                    </div>
                  )}
                  {sortedMeals.length > 4 && (
                    <p className="text-[9px] font-bold text-zinc-400 text-center">+{sortedMeals.length - 4} altri</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => setActiveView("recipes")}
          className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-[#E8F0E9] rounded-2xl flex items-center justify-center text-[#3A6345] group-hover:bg-[#3A6345] group-hover:text-white transition-all duration-500">
            <BookOpen size={28} />
          </div>
          <div className="text-left">
            <h4 className="text-lg font-bold text-[#1E3F20]">Il tuo Ricettario</h4>
            <p className="text-sm text-zinc-400 font-medium">Sfoglia e pianifica i tuoi pasti preferiti.</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-300 group-hover:text-[#1E3F20] transition-colors" />
        </button>

        <button 
          onClick={() => setActiveView("shopping")}
          className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <ShoppingCart size={28} />
          </div>
          <div className="text-left">
            <h4 className="text-lg font-bold text-[#1E3F20]">Lista della Spesa</h4>
            <p className="text-sm text-zinc-400 font-medium">Ingredienti necessari per questa settimana.</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-300 group-hover:text-[#1E3F20] transition-colors" />
        </button>
      </div>
    </div>
  );
}
