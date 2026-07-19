import React from 'react';
import { Level } from '../../../types';

interface StudentStepProps {
  levels: Level[];
  student: { firstName: string; lastName: string; sex: 'M' | 'F'; birthDate: string; levelId: string };
  setStudent: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; sex: 'M' | 'F'; birthDate: string; levelId: string }>>;
}

export const EnrollmentStudentStep: React.FC<StudentStepProps> = ({ levels, student, setStudent }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Informations Élève</h4>
      <div className="flex gap-3">
        <input 
          type="text" 
          placeholder="Prénom" 
          value={student.firstName} 
          onChange={e => setStudent({...student, firstName: e.target.value})} 
          className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
          required 
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={student.lastName} 
          onChange={e => setStudent({...student, lastName: e.target.value})} 
          className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
          required 
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase">Genre</label>
          <select 
            value={student.sex} 
            onChange={e => setStudent({...student, sex: e.target.value as 'M' | 'F'})} 
            className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs outline-none"
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase">Date de naissance</label>
          <input 
            type="date" 
            value={student.birthDate} 
            onChange={e => setStudent({...student, birthDate: e.target.value})} 
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
            required 
          />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase">Classe scolaire</label>
        <select 
          value={student.levelId} 
          onChange={e => setStudent({...student, levelId: e.target.value})} 
          className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs outline-none"
        >
          <option value="">Sélectionner une classe</option>
          {levels.map(lvl => (
            <option key={lvl.id} value={lvl.id}>{lvl.name} ({lvl.cycle})</option>
          ))}
        </select>
      </div>
    </div>
  );
};
