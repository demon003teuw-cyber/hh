import React, { useMemo } from 'react';
import { Users, BookOpen, CreditCard, Heart } from 'lucide-react';
import { Student, Teacher, Parent, Preinscription, Payment } from '../../../types';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  preinscriptions: Preinscription[];
  payments: Payment[];
  onNavigateToTab: (tab: string) => void;
  onApprovePre: (id: string) => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({
  students, teachers, parents, preinscriptions, payments, onNavigateToTab, onApprovePre
}) => {
  const pending = useMemo(() => preinscriptions.filter(p => p.status === 'EN_ATTENTE'), [preinscriptions]);
  const totalRevenus = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);

  return (
    <div className="space-y-6 text-xs">
      {/* Dynamic Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Élèves inscrits', count: students.length, icon: Users, color: 'text-sky-500 bg-sky-50', tab: 'UTILISATEURS' },
          { label: 'Professeurs', count: teachers.length, icon: BookOpen, color: 'text-violet-500 bg-violet-50', tab: 'UTILISATEURS' },
          { label: 'Parents inscrits', count: parents.length, icon: Heart, color: 'text-rose-500 bg-rose-50', tab: 'UTILISATEURS' },
          { label: 'Revenus totaux', count: `${totalRevenus.toLocaleString()} F`, icon: CreditCard, color: 'text-emerald-500 bg-emerald-50', tab: 'FINANCE' },
        ].map((stat, i) => (
          <button key={i} onClick={() => onNavigateToTab(stat.tab)} className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:shadow-xs transition flex items-center justify-between cursor-pointer">
            <div><span className="text-[10px] font-bold text-slate-400 block mb-0.5">{stat.label}</span><span className="text-base font-extrabold text-slate-800 font-display">{stat.count}</span></div>
            <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main stats on left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending pre-registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-sm">Dernières Demandes d'Inscription</h3>
              <button onClick={() => onNavigateToTab('DASHBOARD')} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1">Actualiser</button>
            </div>
            {pending.length === 0 ? (
              <p className="text-slate-400 text-[11px] py-4 text-center">Aucune inscription en attente.</p>
            ) : (
              <div className="space-y-2.5">
                {pending.slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in">
                    <div>
                      <h4 className="font-bold text-slate-800">{p.studentFirstName} {p.studentLastName}</h4>
                      <p className="text-[10px] text-slate-400">Parent : {p.parentName} | {p.parentPhone}</p>
                    </div>
                    <button onClick={() => onApprovePre(p.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer">Valider</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel on right */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-slate-800 text-sm">Raccourcis Administrateur</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Inscrire un nouvel élève', tab: 'UTILISATEURS' },
              { label: 'Ajouter un enseignant', tab: 'UTILISATEURS' },
              { label: 'Associer des cours & planning', tab: 'COURS' },
              { label: 'Gérer les paiements des parents', tab: 'FINANCE' },
            ].map((action, idx) => (
              <button key={idx} onClick={() => onNavigateToTab(action.tab)} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition font-bold text-slate-700 flex items-center justify-between cursor-pointer">
                <span>{action.label}</span>
                <span className="text-slate-300">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
