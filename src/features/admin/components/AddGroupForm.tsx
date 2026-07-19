import React, { useState } from 'react';
import { Group, Teacher, Subject, Level } from '../../../types';

interface AddGroupFormProps {
  levels: Level[];
  subjects: Subject[];
  teachers: Teacher[];
  onAddGroup: (g: Omit<Group, 'id' | 'studentIds'>) => void;
  onClose: () => void;
}

export function AddGroupForm({ levels, subjects, teachers, onAddGroup, onClose }: AddGroupFormProps) {
  const [grpForm, setGrpForm] = useState({ name: '', levelId: '', subjectId: '', teacherId: '', maxStudents: 15, room: '', schedule: '' });

  const handleSaveGrp = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGroup(grpForm);
    onClose();
  };

  return (
    <form onSubmit={handleSaveGrp} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-w-md mx-auto text-xs">
      <h4 className="font-bold text-slate-800 text-sm">Nouveau Groupe de Cours</h4>
      <input type="text" placeholder="Nom (ex: TS Math A)" value={grpForm.name} onChange={e => setGrpForm({...grpForm, name: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <div className="grid grid-cols-2 gap-2">
        <select value={grpForm.levelId} onChange={e => setGrpForm({...grpForm, levelId: e.target.value})} className="p-2.5 rounded-xl border border-slate-200 bg-white" required>
          <option value="">Classe</option>{levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={grpForm.subjectId} onChange={e => setGrpForm({...grpForm, subjectId: e.target.value})} className="p-2.5 rounded-xl border border-slate-200 bg-white" required>
          <option value="">Matière</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select value={grpForm.teacherId} onChange={e => setGrpForm({...grpForm, teacherId: e.target.value})} className="p-2.5 rounded-xl border border-slate-200 bg-white" required>
          <option value="">Professeur</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
        </select>
        <input type="number" placeholder="Places max" value={grpForm.maxStudents} onChange={e => setGrpForm({...grpForm, maxStudents: Number(e.target.value)})} className="p-2.5 rounded-xl border border-slate-200" required />
      </div>
      <input type="text" placeholder="Salle de cours (ex: Salle 2)" value={grpForm.room} onChange={e => setGrpForm({...grpForm, room: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <input type="text" placeholder="Horaire (ex: Lundi 08h-10h)" value={grpForm.schedule} onChange={e => setGrpForm({...grpForm, schedule: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition">Annuler</button>
        <button type="submit" id="submit-add-grp-btn" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition">Créer</button>
      </div>
    </form>
  );
}
