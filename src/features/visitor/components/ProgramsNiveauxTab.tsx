import React from 'react';
import { Award, BookOpen, GraduationCap, Compass, CheckCircle2 } from 'lucide-react';
import { Subject } from '../../../types';

interface NiveauxTabProps {
  subjects: Subject[];
}

export const ProgramsNiveauxTab: React.FC<NiveauxTabProps> = ({ subjects }) => {
  return (
    <div className="grid md:grid-cols-12 gap-8 animate-in fade-in duration-200">
      {/* Levels Scolaires Card */}
      <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="p-2 bg-sky-50 text-sky-500 rounded-xl"><Award className="w-5 h-5" /></div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-800">Niveaux Scolaires Pris en Charge</h3>
            <p className="text-[10px] text-slate-400">Préparation rigoureuse aux examens d'État du Sénégal</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3.5 items-start">
            <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg shrink-0 mt-0.5"><BookOpen className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Cycle Primaire</span>
              <p className="text-slate-500 mt-1 leading-relaxed">Classes : <strong>CI, CP, CE1, CE2, CM1, CM2</strong>. Acquisition des bases et préparation méthodique au <strong className="text-sky-600 font-bold">CFEE</strong>.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3.5 items-start">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5"><GraduationCap className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Cycle Moyen (Collège)</span>
              <p className="text-slate-500 mt-1 leading-relaxed">Classes : <strong>6e, 5e, 4e, 3e</strong>. Renforcement intensif et préparation épreuves du <strong className="text-indigo-600 font-bold">BFEM</strong>.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3.5 items-start">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg shrink-0 mt-0.5"><Compass className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Cycle Secondaire (Lycée)</span>
              <p className="text-slate-500 mt-1 leading-relaxed">Classes : <strong>Seconde, Première, Terminale (L & S)</strong>. Perfectionnement académique pour l'obtention du <strong className="text-amber-600 font-bold">Baccalauréat</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matières Clés Card */}
      <div className="md:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-800">Matières Clés Dispensées</h3>
              <p className="text-[10px] text-slate-400">Enseignement sur mesure par discipline</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            {subjects.filter(s => s.active).map(sub => (
              <div 
                key={sub.id} 
                className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 shrink-0" />
                <span>{sub.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 text-[11px] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
          <span className="font-bold block text-sky-400 uppercase tracking-wider text-[9px] mb-1">Approche Pédagogique</span>
          <p className="text-slate-300 leading-relaxed">
            Chaque cours intègre des fiches de résumé, des exercices progressifs et des examens blancs réguliers.
          </p>
        </div>
      </div>
    </div>
  );
};
