import React, { useState } from 'react';
import { Assignment, Student, Teacher, Subject, Group } from '../../../types';

interface AddAssignmentFormProps {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  groups: Group[];
  onAddAssignment: (asg: Omit<Assignment, 'id'>) => void;
  onClose: () => void;
}

export function AddAssignmentForm({ students, teachers, subjects, groups, onAddAssignment, onClose }: AddAssignmentFormProps) {
  const [asgForm, setAsgForm] = useState({ type: 'INDIVIDUEL' as 'INDIVIDUEL'|'GROUPE', studentId: '', groupId: '', teacherId: '', subjectId: '', schedule: '', location: '' });

  const handleSaveAsg = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAssignment({
      type: asgForm.type,
      studentId: asgForm.type === 'INDIVIDUEL' ? asgForm.studentId : undefined,
      groupId: asgForm.type === 'GROUPE' ? asgForm.groupId : undefined,
      teacherId: asgForm.teacherId,
      subjectId: asgForm.subjectId,
      schedule: asgForm.schedule,
      location: asgForm.location
    });
    onClose();
  };

  return (
    <form onSubmit={handleSaveAsg} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-w-md mx-auto text-xs animate-in zoom-in-95 duration-150">
      <h4 className="font-bold text-slate-800 text-sm">Planifier une session de cours</h4>
      <div className="flex gap-2">
        <button type="button" onClick={() => setAsgForm({...asgForm, type: 'INDIVIDUEL'})} className={`flex-1 py-1.5 rounded-lg font-bold border transition ${asgForm.type === 'INDIVIDUEL' ? 'bg-sky-50 border-sky-400 text-sky-600' : 'border-slate-250 text-slate-500'}`}>Individuel</button>
        <button type="button" onClick={() => setAsgForm({...asgForm, type: 'GROUPE'})} className={`flex-1 py-1.5 rounded-lg font-bold border transition ${asgForm.type === 'GROUPE' ? 'bg-sky-50 border-sky-400 text-sky-600' : 'border-slate-250 text-slate-500'}`}>Groupe</button>
      </div>
      {asgForm.type === 'INDIVIDUEL' ? (
        <select value={asgForm.studentId} onChange={e => setAsgForm({...asgForm, studentId: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" required>
          <option value="">Sélectionner l'élève</option>{students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
      ) : (
        <select value={asgForm.groupId} onChange={e => setAsgForm({...asgForm, groupId: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" required>
          <option value="">Sélectionner le groupe</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      )}
      <select value={asgForm.teacherId} onChange={e => setAsgForm({...asgForm, teacherId: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" required>
        <option value="">Choisir un professeur</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
      </select>
      <select value={asgForm.subjectId} onChange={e => setAsgForm({...asgForm, subjectId: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" required>
        <option value="">Choisir la matière</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <input type="text" placeholder="Horaire (ex: Lundi 08h-10h)" value={asgForm.schedule} onChange={e => setAsgForm({...asgForm, schedule: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <input type="text" placeholder="Lieu / Salle (ex: Salle 2)" value={asgForm.location} onChange={e => setAsgForm({...asgForm, location: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition">Annuler</button>
        <button type="submit" id="submit-add-asg-btn" className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition">Planifier</button>
      </div>
    </form>
  );
}
