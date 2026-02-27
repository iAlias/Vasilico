import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Scale, 
  Utensils, 
  BookOpen, 
  ShoppingCart, 
  BarChart3, 
  LogOut, 
  Plus,
  ChevronRight,
  User as UserIcon,
  Download,
  Upload,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import type { User } from "./types";
import { storage } from "./services/storageService";

// Components
import Dashboard from "./components/Dashboard";
import WeightTracker from "./components/WeightTracker";
import MealPlanner from "./components/MealPlanner";
import RecipeBook from "./components/RecipeBook";
import ShoppingList from "./components/ShoppingList";
import Auth from "./components/Auth";
import Profile from "./components/Profile";

type View = "dashboard" | "weight" | "meals" | "recipes" | "shopping" | "stats" | "profile" | "auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    
    // Inizializza le ricette se necessario (gestito internamente da storage.getRecipes)
    storage.getRecipes();

    setLoading(false);
  }, []);

  const handleLogout = () => {
    storage.setUser(null);
    setUser(null);
  };

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vasilico-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        storage.importData(json);
        alert("Dati importati con successo!");
        window.location.reload();
      } catch (err) {
        alert("Errore durante l'importazione: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400 font-medium">Caricamento Vasilicò...</div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "weight", label: "Peso", icon: Scale },
    { id: "meals", label: "Piano Pasti", icon: Utensils },
    { id: "shopping", label: "Spesa", icon: ShoppingCart },
    { id: "recipes", label: "Ricette", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5F1] text-[#1E3F20] font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-zinc-100 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1E3F20] rounded-xl flex items-center justify-center text-white shadow-md">
            <Utensils size={20} />
          </div>
          <h1 className="font-serif font-bold text-xl tracking-tight leading-none">Vasilicò</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#1E3F20] hover:bg-zinc-50 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-zinc-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 hidden md:flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1E3F20] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-200">
            <Utensils size={24} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl tracking-tight leading-none">Vasilicò</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mt-1">Salute Premium</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group",
                activeView === item.id 
                  ? "bg-[#1E3F20] text-white shadow-xl shadow-zinc-200 translate-x-1" 
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-[#1E3F20]"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                activeView === item.id ? "text-[#4A7C59]" : "group-hover:text-[#1E3F20]"
              )} />
              {item.label}
              {activeView === item.id && (
                <motion.div 
                  layoutId="active-nav-dot"
                  className="ml-auto w-1.5 h-1.5 bg-[#4A7C59] rounded-full"
                />
              )}
            </button>
          ))}

          {/* User Profile / Auth Button moved here */}
          <div className="pt-4 mt-4 border-t border-zinc-100">
            {user ? (
              <div className="bg-zinc-50 rounded-3xl p-4 border border-zinc-100">
                <button 
                  onClick={() => {
                    setActiveView("profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 mb-3 text-left hover:bg-white p-2 rounded-2xl transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-100">
                    <UserIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 font-medium truncate">Profilo</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                >
                  <LogOut size={14} />
                  Esci
                </button>
              </div>
            ) : (
              <div className="bg-zinc-50 rounded-3xl p-4 border border-zinc-100">
                <button 
                  onClick={() => {
                    setActiveView("auth");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3F20] text-white rounded-2xl text-sm font-bold hover:bg-[#152e16] transition-all shadow-xl shadow-zinc-200"
                >
                  <UserIcon size={16} />
                  Accedi / Registrati
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 mt-auto space-y-2">
          <div className="px-4 py-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Dati Locali</span>
          </div>
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:bg-zinc-50 hover:text-[#1E3F20] transition-all group"
          >
            <Download size={16} className="text-zinc-300 group-hover:text-[#1E3F20]" />
            Esporta Dati
          </button>
          <label className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:bg-zinc-50 hover:text-[#1E3F20] transition-all group cursor-pointer">
            <Upload size={16} className="text-zinc-300 group-hover:text-[#1E3F20]" />
            Importa Dati
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} />}
            {activeView === "weight" && <WeightTracker />}
            {activeView === "meals" && <MealPlanner />}
            {activeView === "recipes" && <RecipeBook />}
            {activeView === "shopping" && <ShoppingList />}
            {activeView === "stats" && (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-zinc-200">
                <BarChart3 className="mx-auto text-zinc-200 mb-4" size={48} />
                <h3 className="text-xl font-serif font-bold text-[#1E3F20] mb-2">Statistiche Avanzate</h3>
                <p className="text-zinc-400 font-medium">Questa sezione è in fase di sviluppo. Presto potrai visualizzare grafici dettagliati sui tuoi progressi.</p>
              </div>
            )}
            {activeView === "profile" && user && <Profile user={user} onUpdate={setUser} />}
            {activeView === "auth" && (
              <Auth onLogin={(u) => {
                storage.setUser(u);
                setUser(u);
                setActiveView("dashboard");
              }} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
