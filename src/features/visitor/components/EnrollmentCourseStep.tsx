import React from 'react';
import { Subject, Settings } from '../../../types';
import { AlertCircle, Lock } from 'lucide-react';

interface CourseStepProps {
  subjects: Subject[];
  settings: Settings;
  course: { type: 'INDIVIDUEL' | 'GROUPE'; subjectIds: string[] };
  setCourse: React.Dispatch<React.SetStateAction<{ type: 'INDIVIDUEL' | 'GROUPE'; subjectIds: string[] }>>;
}

export const EnrollmentCourseStep: React.FC<CourseStepProps> = ({ subjects, settings, course, setCourse }) => {
  const isIndivPaused = !!settings.isIndividualPaused;
  const isGroupPaused = !!settings.isGroupPaused;

  const handleToggleSubject = (id: string) => {
    const ids = course.subjectIds.includes(id)
      ? course.subjectIds.filter(x => x !== id)
      : [...course.subjectIds, id];
    setCourse({ ...course, subjectIds: ids });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
      <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Format d'Accompagnement</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Individuel */}
        <button
          type="button"
          disabled={isIndivPaused}
          onClick={() => setCourse({ ...course, type: 'INDIVIDUEL' })}
          className={`relative p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer select-none ${
            isIndivPaused 
              ? 'opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed' 
              : course.type === 'INDIVIDUEL' 
                ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-400/25 text-sky-950 font-bold' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-50/50'
          }`}
        >
          {isIndivPaused && (
            <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Complet
            </span>
          )}
          <span className="font-bold text-xs text-slate-800">Individuel</span>
          <span className="text-[10px] text-slate-400">À domicile</span>
          <span className="mt-2 font-black text-slate-700 text-[10px]">{settings.individualPrice || '75 000 FCFA/mois'}</span>
        </button>

        {/* Groupe */}
        <button
          type="button"
          disabled={isGroupPaused}
          onClick={() => setCourse({ ...course, type: 'GROUPE' })}
          className={`relative p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer select-none ${
            isGroupPaused 
              ? 'opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed' 
              : course.type === 'GROUPE' 
                ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-400/25 text-sky-950 font-bold' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-50/50'
          }`}
        >
          {isGroupPaused && (
            <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Complet
            </span>
          )}
          <span className="font-bold text-xs text-slate-800">Groupe</span>
          <span className="text-[10px] text-slate-400">En salle</span>
          <span className="mt-2 font-black text-slate-700 text-[10px]">{settings.groupPrice || '40 000 FCFA/mois'}</span>
        </button>
      </div>

      {(course.type === 'INDIVIDUEL' ? isIndivPaused : isGroupPaused) && (
        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-700 text-[10px] flex items-start gap-1.5 leading-normal">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>Ce format de cours est complet pour l'instant. Veuillez sélectionner l'autre format disponible.</span>
        </div>
      )}

      <div>
        <label className="block text-slate-500 font-bold mb-2">Matières souhaitées</label>
        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
          {subjects.filter(s => s.active).map(sub => (
            <button
              key={sub.id}
              type="button"
              onClick={() => handleToggleSubject(sub.id)}
              className={`p-2 rounded-xl border text-left font-semibold transition text-[10px] cursor-pointer ${
                course.subjectIds.includes(sub.id)
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
