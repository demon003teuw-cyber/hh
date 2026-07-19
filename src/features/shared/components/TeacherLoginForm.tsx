import React, { useState } from 'react';
import { LogIn, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Teacher } from '../../../types';

interface TeacherLoginFormProps {
  teachers: Teacher[];
  onSuccess: (teacher: Teacher) => void;
  onError: (msg: string) => void;
}

export function TeacherLoginForm({ teachers, onSuccess, onError }: TeacherLoginFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const found = teachers.find(t => t.phone.trim().replace(/\s+/g, '') === cleanPhone);
    if (found) {
      onError('');
      onSuccess(found);
    } else {
      onError('Aucun professeur trouvé avec ce numéro. Essayez un des comptes de démonstration ci-dessous.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1">
        <label className="block text-slate-500 font-semibold">Numéro de téléphone de l'Enseignant</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            id="teacher-popup-phone" type="text" placeholder="+221 77 222 33 44" value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-slate-500 font-semibold">Code secret</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            id="teacher-popup-password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50"
            required
          />
          <button
            type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit" id="teacher-popup-submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md"
      >
        <LogIn className="w-4 h-4" /> Se connecter (Espace Prof)
      </button>

      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2 text-slate-500 mt-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Professeurs de démo</span>
        <div className="space-y-1">
          {teachers.map(t => (
            <button
              key={t.id} type="button"
              onClick={() => {
                setPhone(t.phone);
                setPassword('1234');
              }}
              className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/20 transition flex justify-between items-center text-[10px] text-slate-600"
            >
              <span className="font-semibold">{t.fullName}</span>
              <span className="font-mono text-slate-400">{t.phone}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
