import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Level, Subject, Preinscription, Settings } from '../../../types';
import { EnrollmentParentStep } from './EnrollmentParentStep';
import { EnrollmentStudentStep } from './EnrollmentStudentStep';
import { EnrollmentCourseStep } from './EnrollmentCourseStep';
import { EnrollmentReceipt } from './EnrollmentReceipt';

interface FormProps {
  levels: Level[];
  subjects: Subject[];
  settings: Settings;
  onSubmit: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => Preinscription;
  onClose: () => void;
  initialLevelId?: string;
  initialSubjectId?: string;
  initialCourseType?: 'INDIVIDUEL' | 'GROUPE';
}

export const PreinscriptionForm: React.FC<FormProps> = ({ 
  levels, subjects, settings, onSubmit, onClose, initialLevelId, initialSubjectId, initialCourseType 
}) => {
  const [step, setStep] = useState(1);
  const [parent, setParent] = useState({ name: '', phone: '', whatsapp: '', address: '' });
  const [student, setStudent] = useState({ firstName: '', lastName: '', sex: 'M' as const, birthDate: '', levelId: initialLevelId || '' });
  const [course, setCourse] = useState({ 
    type: initialCourseType || (settings.isIndividualPaused ? 'GROUPE' : 'INDIVIDUEL'), 
    subjectIds: initialSubjectId ? [initialSubjectId] : [] 
  });
  const [receipt, setReceipt] = useState<Preinscription | null>(null);

  const handleNext = () => {
    if (step === 1 && (!parent.name || !parent.phone || !parent.whatsapp || !parent.address)) return;
    if (step === 2 && (!student.firstName || !student.lastName || !student.birthDate || !student.levelId)) return;
    setStep(step + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReceipt(onSubmit({
      parentName: parent.name, parentPhone: parent.phone, parentWhatsapp: parent.whatsapp, parentAddress: parent.address,
      studentFirstName: student.firstName, studentLastName: student.lastName, studentSex: student.sex, studentBirthDate: student.birthDate,
      levelId: student.levelId, subjectIds: course.subjectIds, courseType: course.type
    }));
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full">
          <EnrollmentReceipt receipt={receipt} onClose={onClose} />
        </div>
      </div>
    );
  }

  const allPaused = !!settings.isIndividualPaused && !!settings.isGroupPaused;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <div className="border-b border-slate-150 pb-2">
          <h3 className="font-display font-black text-slate-800 text-sm">Fiche de Pré-inscription</h3>
          <p className="text-[10px] text-slate-400">Année Académique : {settings.schoolYear || '2026-2027'}</p>
        </div>

        {allPaused ? (
          <div className="text-center py-6 space-y-3">
            <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              <Lock className="w-6 h-6 animate-bounce" />
            </div>
            <p className="font-bold text-slate-800">Inscriptions Suspendues</p>
            <p className="text-[10px] text-slate-400">Le centre est complet pour cette période.</p>
            <button type="button" onClick={onClose} className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl cursor-pointer">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {step === 1 && <EnrollmentParentStep parent={parent} setParent={setParent} />}
            {step === 2 && <EnrollmentStudentStep levels={levels} student={student} setStudent={setStudent} />}
            {step === 3 && <EnrollmentCourseStep subjects={subjects} settings={settings} course={course} setCourse={setCourse} />}
            <div className="flex gap-2 pt-2 border-t border-slate-150 justify-between">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl flex items-center gap-1 transition cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="ml-auto px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1 transition cursor-pointer">
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={course.type === 'INDIVIDUEL' ? settings.isIndividualPaused : settings.isGroupPaused} className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1 transition cursor-pointer">
                  Valider
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
