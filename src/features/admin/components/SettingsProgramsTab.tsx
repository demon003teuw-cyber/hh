import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { Subject, Level } from '../../../types';

interface ProgramsProps {
  subjects: Subject[];
  onUpdateSubjects: (s: Subject[]) => void;
  levels: Level[];
  onUpdateLevels: (l: Level[]) => void;
}

export const SettingsProgramsTab: React.FC<ProgramsProps> = ({
  subjects, onUpdateSubjects, levels, onUpdateLevels
}) => {
  const [subName, setSubName] = useState('');
  const [lvlName, setLvlName] = useState('');

  const addSubject = () => {
    if (!subName.trim()) return;
    const newSub: Subject = { id: `sub-${Date.now()}`, name: subName.trim(), active: true };
    onUpdateSubjects([...subjects, newSub]);
    setSubName('');
  };

  const removeSubject = (id: string) => {
    onUpdateSubjects(subjects.filter(s => s.id !== id));
  };

  const addLevel = () => {
    if (!lvlName.trim()) return;
    const newLvl: Level = { id: `lvl-${Date.now()}`, name: lvlName.trim() };
    onUpdateLevels([...levels, newLvl]);
    setLvlName('');
  };

  const removeLevel = (id: string) => {
    onUpdateLevels(levels.filter(l => l.id !== id));
  };

  return (
    <div className="grid md:grid-cols-2 gap-5 animate-in fade-in duration-150">
      {/* Levels section */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2.5">
        <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Niveaux Scolaires
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={lvlName}
            onChange={e => setLvlName(e.target.value)}
            placeholder="Ex: Terminale, 3e, CM2..."
            className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold outline-none"
          />
          <button type="button" onClick={addLevel} className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl transition cursor-pointer">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1 max-h-[140px] overflow-y-auto">
          {levels.map(l => (
            <span key={l.id} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg font-bold text-[10px]">
              {l.name}
              <button type="button" onClick={() => removeLevel(l.id)} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Subjects section */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2.5">
        <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Matières d'Enseignement
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={subName}
            onChange={e => setSubName(e.target.value)}
            placeholder="Ex: Mathématiques, SVT..."
            className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold outline-none"
          />
          <button type="button" onClick={addSubject} className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl transition cursor-pointer">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1 max-h-[140px] overflow-y-auto">
          {subjects.map(s => (
            <span key={s.id} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg font-bold text-[10px]">
              {s.name}
              <button type="button" onClick={() => removeSubject(s.id)} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
