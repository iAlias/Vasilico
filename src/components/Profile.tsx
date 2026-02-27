import { useState } from "react";
import { User as UserIcon, Mail, Ruler, Scale, Calendar, Activity, Target, Save } from "lucide-react";
import { motion } from "motion/react";
import { storage } from "../services/storageService";
import type { User } from "../types";

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default function Profile({ user, onUpdate }: ProfileProps) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthDate, setBirthDate] = useState(user.birthDate || "");
  const [gender, setGender] = useState<User['gender']>(user.gender || 'other');
  const [height, setHeight] = useState(user.height?.toString() || "");
  const [activityLevel, setActivityLevel] = useState<User['activityLevel']>(user.activityLevel || 'moderate');
  const [goal, setGoal] = useState<User['goal']>(user.goal || 'maintain');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: User = {
      ...user,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || user.name,
      email,
      birthDate,
      gender,
      height: parseFloat(height) || user.height,
      activityLevel,
      goal
    };

    storage.setUser(updatedUser);
    onUpdate(updatedUser);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Profilo</h2>
          <p className="text-zinc-400 font-medium mt-2">Gestisci i tuoi dati personali e le tue preferenze.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-zinc-100 border border-zinc-100"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informazioni Personali */}
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1E3F20] mb-6 border-b border-zinc-100 pb-4">Informazioni Personali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Cognome</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  />
                </div>
              </div>
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
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Data di Nascita</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="date"
                    required
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
          </div>

          {/* Dati Fisici e Obiettivi */}
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1E3F20] mb-6 border-b border-zinc-100 pb-4">Dati Fisici e Obiettivi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Altezza (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="number"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] font-medium transition-all"
                  />
                </div>
              </div>
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
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-100">
            {saved && (
              <span className="text-[#4A7C59] font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4A7C59] rounded-full animate-pulse" />
                Modifiche salvate
              </span>
            )}
            <button
              type="submit"
              className="px-8 py-4 bg-[#1E3F20] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-zinc-200 flex items-center gap-2"
            >
              <Save size={18} />
              Salva Modifiche
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
