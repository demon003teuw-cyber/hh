import React from 'react';
import { User, Clock, Edit2, Check, X } from 'lucide-react';
import { Teacher, Subject, Level } from '../../../types';

interface TeacherCardProps {
  teacher: Teacher;
  subjects: Subject[];
  levels: Level[];
  editingId: string | null;
  editForm: { subjects: string[]; levels: string[] };
  onStartEdit: (t: Teacher) => void;
  onSaveEdit: (t: Teacher) => void;
  onCancelEdit: () => void;
  onToggleSub: (id: string, isNew: boolean) => void;
  onToggleLvl: (id: string, isNew: boolean) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher, subjects, levels, editingId, editForm,
  onStartEdit, onSaveEdit, onCancelEdit, onToggleSub, onToggleLvl
}) => {
  const isEditing = editingId === teacher.id;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-2xs flex flex-col justify-between space-y-4 text-xs">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs">{teacher.fullName}</h4>
              <p className="text-[9px] text-slate-400">{teacher.phone}</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-1">
              <button onClick={() => onSaveEdit(teacher)} className="p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 cursor-pointer">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={onCancelEdit} className="p-1 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => onStartEdit(teacher)} className="p-1 bg-slate-50 text-slate-500 rounded-md hover:bg-slate-100 cursor-pointer">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-55">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Matières affectées :</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {isEditing ? (
                subjects.map(s => (
                  <button key={s.id} onClick={() => onToggleSub(s.id, false)} className={`px-1.5 py-0.5 rounded text-[8px] font-medium border transition cursor-pointer ${editForm.subjects.includes(s.id) ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{s.name}</button>
                ))
              ) : (
                teacher.subjects.map(sId => <span key={sId} className="bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-sky-100">{subjects.find(s => s.id === sId)?.name}</span>)
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Classes affectées :</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {isEditing ? (
                levels.map(l => (
                  <button key={l.id} onClick={() => onToggleLvl(l.id, false)} className={`px-1.5 py-0.5 rounded text-[8px] font-medium border transition cursor-pointer ${editForm.levels.includes(l.id) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{l.name}</button>
                ))
              ) : (
                teacher.levels.map(lId => <span key={lId} className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-indigo-100">{levels.find(l => l.id === lId)?.name}</span>)
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">{teacher.availabilities}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
