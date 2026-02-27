import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Scale, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import type { WeightLog } from "../types";
import { storage } from "../services/storageService";

export default function WeightTracker() {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(storage.getUser());
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    const data = storage.getWeightLogs();
    setLogs(data);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    storage.addWeightLog({
      user_id: 1,
      weight: parseFloat(weight),
      date,
      notes: ""
    });

    setWeight("");
    fetchLogs();
  };

  const deleteLog = (id: number) => {
    storage.deleteWeightLog(id);
    fetchLogs();
  };

  const calculateBMI = (w: number) => {
    const height = user?.height ? user.height / 100 : 1.75; 
    return (w / (height * height)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Sottopeso", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normopeso", color: "text-[#4A7C59]" };
    if (bmi < 30) return { label: "Sovrappeso", color: "text-orange-500" };
    return { label: "Obesità", color: "text-rose-500" };
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Monitoraggio Peso</h2>
          <p className="text-zinc-400 font-medium mt-2">Tieni traccia dei tuoi progressi fisici nel tempo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#1E3F20] mb-6">Nuova Registrazione</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Peso (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                    placeholder="70.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 group"
              >
                Salva Peso
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {logs.length > 0 && (
            <div className="bg-[#3A6345] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[#4A7C59]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={16} className="text-[#E6D5B8]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6D5B8]">Analisi BMI</span>
                </div>
                <p className="text-4xl font-serif font-bold mb-2">{calculateBMI(logs[0].weight)}</p>
                <p className={cn("text-sm font-bold px-3 py-1 bg-white/20 rounded-full inline-block", getBMICategory(parseFloat(calculateBMI(logs[0].weight))).color)}>
                  {getBMICategory(parseFloat(calculateBMI(logs[0].weight))).label}
                </p>
                <p className="text-xs text-[#F0E6D2] mt-4 leading-relaxed opacity-80">
                  Il BMI è un indicatore generale. Consulta sempre un professionista per un'analisi dettagliata.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-serif font-bold text-[#1E3F20] px-2">Cronologia</h3>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl" />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-zinc-200 text-center">
                <Scale className="mx-auto text-zinc-200 mb-4" size={48} />
                <p className="text-zinc-400 font-medium">Nessuna registrazione trovata. Inizia ora!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {logs.map((log, index) => {
                  const diff = index < logs.length - 1 ? log.weight - logs[index + 1].weight : 0;
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={log.id}
                      className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex flex-col items-center justify-center border border-zinc-100">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{format(new Date(log.date), "MMM", { locale: it })}</span>
                          <span className="text-lg font-bold text-[#1E3F20] leading-none">{format(new Date(log.date), "d")}</span>
                        </div>
                        <div>
                          <p className="text-2xl font-serif font-bold text-[#1E3F20]">{log.weight} <span className="text-sm font-sans text-zinc-400">kg</span></p>
                          <div className="flex items-center gap-2 mt-1">
                            {diff !== 0 && (
                              <span className={cn(
                                "flex items-center gap-0.5 text-[10px] font-bold",
                                diff < 0 ? "text-[#4A7C59]" : "text-rose-500"
                              )}>
                                {diff < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                                {Math.abs(diff).toFixed(1)} kg
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLog(log.id);
                        }}
                        className="relative z-10 p-3 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer"
                        title="Elimina registrazione"
                      >
                        <Trash2 size={20} className="pointer-events-none" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
