import React from 'react';
import { Clock, Check, User, Phone, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { Preinscription, Level, Subject } from '../../../types';
import { ApprovedPreinscriptionMobileCard } from './ApprovedPreinscriptionMobileCard';

interface PreinscriptionsProps {
  preinscriptions: Preinscription[];
  levels: Level[];
  subjects: Subject[];
  onApprove: (id: string) => void;
}

export const AdminPreinscriptions: React.FC<PreinscriptionsProps> = ({
  preinscriptions, levels, subjects, onApprove
}) => {
  const pending = preinscriptions.filter(p => p.status === 'EN_ATTENTE');
  const approved = preinscriptions.filter(p => p.status === 'CONFIRMEE');

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h3 className="font-display font-bold text-slate-800 text-lg">Inscriptions en Attente</h3>
        <p className="text-slate-400 text-[10px]">Modérez et approuvez les demandes des parents d'élèves.</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">Aucune demande en attente</p>
          <p className="text-slate-400 text-[10px]">Toutes les demandes de préinscription ont été traitées !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-slate-800 text-sm">{p.studentFirstName} {p.studentLastName}</h4>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{levels.find(l => l.id === p.levelId)?.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> <span className="font-medium">Parent : {p.parentName}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> <span>{p.parentPhone}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{p.parentAddress}</span></div>
                  <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> <span>{p.subjectIds.map(id => subjects.find(s => s.id === id)?.name).join(', ')} ({p.courseType})</span></div>
                </div>
              </div>

              <button
                id={`approve-btn-${p.id}`}
                onClick={() => onApprove(p.id)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Valider l'inscription
              </button>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-4 pt-6">
          <h4 className="font-display font-semibold text-slate-700 text-xs uppercase tracking-wider">Historique des Demandes Validées ({approved.length})</h4>
          
          {/* Mobile view */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {approved.map(p => (
              <ApprovedPreinscriptionMobileCard
                key={p.id}
                preinscription={p}
                levelName={levels.find(l => l.id === p.levelId)?.name}
              />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="p-4">Élève</th>
                    <th className="p-4">Parent</th>
                    <th className="p-4">Classe</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {approved.map(p => (
                    <tr key={p.id} className="text-slate-600 hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-800">{p.studentFirstName} {p.studentLastName}</td>
                      <td className="p-4">{p.parentName}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-sky-50 text-sky-600 font-semibold">
                          {levels.find(l => l.id === p.levelId)?.name}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] text-slate-400">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1 w-max">
                          <Check className="w-3 h-3" /> Validé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
