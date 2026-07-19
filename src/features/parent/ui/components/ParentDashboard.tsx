import { Users, Calendar, CreditCard, Bell, Sparkles, ChevronRight, CheckCircle, Award, AlertCircle } from 'lucide-react';
import { Parent } from '../../../../types';
import { AppNotification } from '../../domain/parentMockData';

interface ParentDashboardProps {
  currentParent: Parent;
  enrolledCount: number;
  pendingAmount: number;
  nextCourse: { childName: string; subject: string; schedule: string } | null;
  notifications: AppNotification[];
  onNavigateToStudents: () => void;
}

export function ParentDashboard({
  currentParent,
  enrolledCount,
  pendingAmount,
  nextCourse,
  notifications,
  onNavigateToStudents
}: ParentDashboardProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none text-xs">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-6 rounded-3xl shadow-xs relative overflow-hidden text-left">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
          <Users className="w-64 h-64" />
        </div>
        <div className="space-y-1.5 relative z-10">
          <span className="bg-white/15 text-white/90 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-white/10">
            Sénégal - Dakar
          </span>
          <h2 className="font-display font-black text-lg md:text-xl">Bonjour, {currentParent.fullName} 👋</h2>
          <p className="text-sky-100 text-[10px] max-w-md leading-relaxed">
            Bienvenue sur votre tableau de bord simplifié. Suivez en temps réel l'excellence académique de vos enfants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Élèves inscrits</p>
            <p className="text-lg font-black text-slate-800">{enrolledCount} enfant{enrolledCount > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prochain cours</p>
            {nextCourse ? (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{nextCourse.childName} - {nextCourse.subject}</p>
                <p className="text-[9.5px] text-slate-500 truncate font-medium">{nextCourse.schedule}</p>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500">Aucun cours planifié</p>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reste à payer</p>
            <p className={`text-lg font-black ${pendingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {pendingAmount.toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-sky-500" /> Dernières notifications
            </h3>
            <span className="text-[9px] font-bold text-slate-400">En direct</span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map(n => (
              <div key={n.id} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-3">
                <div className="mt-0.5 shrink-0">
                  {n.type === 'PAYMENT' && <CreditCard className="w-4 h-4 text-amber-500" />}
                  {n.type === 'ATTENDANCE' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {n.type === 'GRADE' && <Award className="w-4 h-4 text-sky-500" />}
                  {n.type === 'SYSTEM' && <AlertCircle className="w-4 h-4 text-indigo-500" />}
                </div>
                <div className="space-y-0.5 w-full">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-700 text-[10.5px]">{n.title}</span>
                    <span className="text-[8px] text-slate-400 font-mono">{n.date} à {n.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Fiches Scolaires des Élèves</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Visualisez instantanément l'emploi du temps complet, le taux de présence certifié QR Code, les relevés de notes mensuels et téléchargez la carte numérique officielle de vos enfants.
            </p>
          </div>

          <button
            onClick={onNavigateToStudents}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md shadow-sky-500/10"
          >
            <span>Accéder à mes enfants</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
