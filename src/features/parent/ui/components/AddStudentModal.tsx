import { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Level, Subject, Parent, Preinscription } from '../../../../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: Level[];
  subjects: Subject[];
  currentParent: Parent;
  onSubmit: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => void;
}

export function AddStudentModal({ isOpen, onClose, levels, subjects, currentParent, onSubmit }: AddStudentModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: currentParent.fullName.split(' ').slice(1).join(' ') || currentParent.fullName.split(' ')[0] || '',
    sex: 'M' as 'M' | 'F',
    birthDate: '',
    levelId: levels[0]?.id || '',
    courseType: 'GROUPE' as 'INDIVIDUEL' | 'GROUPE',
    selectedSubjects: [] as string[]
  });

  if (!isOpen) return null;

  const toggleSubject = (id: string) => {
    setForm(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(id)
        ? prev.selectedSubjects.filter(subId => subId !== id)
        : [...prev.selectedSubjects, id]
    }));
  };

  const handleSend = () => {
    onSubmit({
      parentName: currentParent.fullName,
      parentPhone: currentParent.phone,
      parentWhatsapp: currentParent.whatsapp,
      parentAddress: currentParent.address,
      studentFirstName: form.firstName,
      studentLastName: form.lastName,
      studentSex: form.sex,
      studentBirthDate: form.birthDate,
      levelId: form.levelId,
      subjectIds: form.selectedSubjects,
      courseType: form.courseType
    });
    setForm({
      firstName: '',
      lastName: currentParent.fullName.split(' ').slice(1).join(' ') || '',
      sex: 'M',
      birthDate: '',
      levelId: levels[0]?.id || '',
      courseType: 'GROUPE',
      selectedSubjects: []
    });
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none text-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-sm">Nouvelle inscription</h3>
              <p className="text-[10px] text-slate-400 font-medium">Pour : {currentParent.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-3 text-left">
              <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest block">Étape 1 sur 2 : Profil Élève</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Prénom</label>
                  <input type="text" placeholder="Ex: Omar" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Nom de famille</label>
                  <input type="text" placeholder="Ex: Diallo" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Genre</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setForm({ ...form, sex: 'M' })} className={`p-2.5 rounded-xl border font-bold transition flex justify-center items-center gap-1.5 ${form.sex === 'M' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Garçon</button>
                  <button onClick={() => setForm({ ...form, sex: 'F' })} className={`p-2.5 rounded-xl border font-bold transition flex justify-center items-center gap-1.5 ${form.sex === 'F' ? 'bg-pink-50 border-pink-300 text-pink-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Fille</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Date de naissance</label>
                <input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Classe scolaire (Niveau)</label>
                <select value={form.levelId} onChange={e => setForm({ ...form, levelId: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none bg-white text-slate-700 font-medium">
                  {levels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest block">Étape 2 sur 2 : Matières & Type</span>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Type de cours souhaité</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setForm({ ...form, courseType: 'GROUPE' })} className={`p-2.5 rounded-xl border font-bold transition text-left leading-normal ${form.courseType === 'GROUPE' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <span className="block font-black text-[11px]">En Groupe</span>
                    <span className="text-[9px] text-slate-400 font-normal">Cours de soutien en groupe</span>
                  </button>
                  <button onClick={() => setForm({ ...form, courseType: 'INDIVIDUEL' })} className={`p-2.5 rounded-xl border font-bold transition text-left leading-normal ${form.courseType === 'INDIVIDUEL' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <span className="block font-black text-[11px]">Individuel</span>
                    <span className="text-[9px] text-slate-400 font-normal">À domicile / Sur mesure</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Matières souhaitées</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.filter(s => s.active).map(sub => (
                    <button key={sub.id} onClick={() => toggleSubject(sub.id)} className={`p-2 rounded-xl border font-bold transition text-left truncate ${form.selectedSubjects.includes(sub.id) ? 'bg-sky-500 border-sky-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{sub.name}</button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Cette inscription sera envoyée à l'équipe administrative pour validation. Vous recevrez une notification dès sa confirmation.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          {step === 1 ? (
            <button onClick={onClose} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer">Annuler</button>
          ) : (
            <button onClick={() => setStep(1)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Retour</button>
          )}

          {step === 1 ? (
            <button onClick={() => setStep(2)} disabled={!form.firstName.trim() || !form.lastName.trim() || !form.birthDate} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1">Suivant <ArrowRight className="w-3.5 h-3.5" /></button>
          ) : (
            <button onClick={handleSend} disabled={form.selectedSubjects.length === 0} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black rounded-xl transition cursor-pointer">Inscrire l'élève</button>
          )}
        </div>
      </div>
    </div>
  );
}
