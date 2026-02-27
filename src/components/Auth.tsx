import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, Mail, Lock, User as UserIcon, ArrowRight, Scale, Ruler, Calendar, Activity, Target } from "lucide-react";
import { storage } from "../services/storageService";
import type { User } from "../types";

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // New Registration Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<User['gender']>('other');
  const [height, setHeight] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<User['activityLevel']>('moderate');
  const [goal, setGoal] = useState<User['goal']>('maintain');

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulazione locale
    setTimeout(() => {
      let user: User;
      
      if (isLogin) {
        // Mock login - in a real app, we'd fetch the user from DB
        const existingUser = storage.getUser();
        user = existingUser || { 
          id: 1, 
          email, 
          name: "Utente",
          firstName: "Utente",
          lastName: "Test"
        };
      } else {
        user = { 
          id: Date.now(), 
          email, 
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          birthDate,
          gender,
          height: parseFloat(height),
          initialWeight: parseFloat(initialWeight),
          activityLevel,
          goal
        };
        // Add initial weight to logs
        if (initialWeight) {
          storage.addWeightLog({
            user_id: user.id,
            weight: parseFloat(initialWeight),
            date: new Date().toISOString().split('T')[0],
            notes: "Peso iniziale"
          });
        }
      }
      
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#1E3F20] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-zinc-200">
            <Utensils size={32} className="text-[#4A7C59]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1E3F20] mb-2">Vasilicò</h1>
          <p className="text-zinc-400 font-medium">Nutrizione premium per il tuo benessere</p>
        </div>

        <motion.div 
          layout
          className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-zinc-100 border border-zinc-100"
        >
          <div className="flex gap-2 p-1.5 bg-zinc-50 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-white text-[#1E3F20] shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Accedi
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-white text-[#1E3F20] shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Registrati
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Nome</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="text"
                          required={!isLogin}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                          placeholder="Mario"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Cognome</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="text"
                          required={!isLogin}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                          placeholder="Rossi"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Data di Nascita</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="date"
                          required={!isLogin}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Sesso</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as User['gender'])}
                        className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                      >
                        <option value="male">Uomo</option>
                        <option value="female">Donna</option>
                        <option value="other">Altro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Altezza (cm)</label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="number"
                          required={!isLogin}
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                          placeholder="175"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Peso Iniziale (kg)</label>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="number"
                          step="0.1"
                          required={!isLogin}
                          value={initialWeight}
                          onChange={(e) => setInitialWeight(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                          placeholder="70.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Stile di Vita</label>
                      <div className="relative">
                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <select
                          value={activityLevel}
                          onChange={(e) => setActivityLevel(e.target.value as User['activityLevel'])}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                        >
                          <option value="sedentary">Sedentario</option>
                          <option value="light">Leggero (1-3 gg/sett)</option>
                          <option value="moderate">Moderato (3-5 gg/sett)</option>
                          <option value="active">Attivo (6-7 gg/sett)</option>
                          <option value="very_active">Molto Attivo (lavoro fisico)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Obiettivo</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <select
                          value={goal}
                          onChange={(e) => setGoal(e.target.value as User['goal'])}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                        >
                          <option value="lose">Dimagrire</option>
                          <option value="maintain">Mantenere</option>
                          <option value="gain">Aumentare Massa</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  placeholder="mario@esempio.it"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-rose-500 text-xs font-bold text-center bg-rose-50 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Accedi" : "Crea Account"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center mt-8 text-zinc-400 text-xs font-medium">
          I tuoi dati sono salvati localmente sul tuo dispositivo.
        </p>
      </div>
    </div>
  );
}
