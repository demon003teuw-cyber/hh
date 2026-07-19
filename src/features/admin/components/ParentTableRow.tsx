import React from 'react';
import { Edit, UserPlus, Save, X } from 'lucide-react';
import { Parent, Student } from '../../../types';

interface ParentTableRowProps {
  parent: Parent;
  students: Student[];
  isEditing: boolean;
  isAssociating: boolean;
  editForm: { fullName: string; phone: string; whatsapp: string; address: string };
  setEditForm: (form: any) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onStartAssociate: () => void;
  onCancelAssociate: () => void;
  onAssociate: () => void;
}

export const ParentTableRow: React.FC<ParentTableRowProps> = ({
  parent,
  students,
  isEditing,
  isAssociating,
  editForm,
  setEditForm,
  selectedStudentId,
  setSelectedStudentId,
  onEdit,
  onSave,
  onCancelEdit,
  onStartAssociate,
  onCancelAssociate,
  onAssociate,
}) => {
  const myKids = students.filter((s) => s.parentId === parent.id);

  return (
    <tr className="hover:bg-slate-50/50">
      <td className="p-4">
        {isEditing ? (
          <input
            type="text"
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            className="p-1.5 border border-slate-200 rounded-lg w-full font-bold"
          />
        ) : (
          <span className="font-bold text-slate-800">{parent.fullName}</span>
        )}
      </td>
      <td className="p-4 space-y-1">
        {isEditing ? (
          <div className="space-y-1">
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="p-1 border border-slate-200 rounded-lg text-[11px] w-full"
              placeholder="Téléphone"
            />
            <input
              type="text"
              value={editForm.whatsapp}
              onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
              className="p-1 border border-slate-200 rounded-lg text-[11px] w-full"
              placeholder="WhatsApp"
            />
          </div>
        ) : (
          <div>
            <p className="text-slate-700 font-medium">Tél: {parent.phone}</p>
            <p className="text-slate-400 text-[10px]">WhatsApp: {parent.whatsapp}</p>
          </div>
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            type="text"
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            className="p-1.5 border border-slate-200 rounded-lg w-full text-slate-500"
          />
        ) : (
          <span className="text-slate-500">{parent.address}</span>
        )}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {myKids.map((k) => (
            <span key={k.id} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-sky-100">
              {k.firstName} {k.lastName}
            </span>
          ))}
          {myKids.length === 0 && <span className="text-slate-400 text-[10px] italic">Aucun enfant</span>}
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {isEditing ? (
            <>
              <button onClick={onSave} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"><Save className="w-4 h-4" /></button>
              <button onClick={onCancelEdit} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"><X className="w-4 h-4" /></button>
            </>
          ) : isAssociating ? (
            <div className="flex items-center gap-1">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="p-1 border border-slate-200 rounded-lg text-[10px] bg-white outline-none"
              >
                <option value="">Sélectionner l'élève</option>
                {students.filter((s) => s.parentId !== parent.id).map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
              <button onClick={onAssociate} className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-[10px]">Lier</button>
              <button onClick={onCancelAssociate} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <>
              <button onClick={onEdit} className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg transition font-semibold text-[10px] cursor-pointer"><Edit className="w-3.5 h-3.5" /> Modifier</button>
              <button onClick={onStartAssociate} className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg transition font-semibold text-[10px] cursor-pointer"><UserPlus className="w-3.5 h-3.5" /> Associer</button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
