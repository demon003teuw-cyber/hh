import React from 'react';
import { Edit, UserPlus, Save, X, Phone } from 'lucide-react';
import { Parent, Student } from '../../../types';

interface ParentMobileCardProps {
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

export const ParentMobileCard: React.FC<ParentMobileCardProps> = ({
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
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-4 hover:border-indigo-200 transition-all text-xs">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <div className="space-y-2 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nom Complet</label>
            <input
              type="text"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              className="p-2 border border-slate-200 rounded-xl w-full font-bold text-slate-800"
            />
          </div>
        ) : (
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{parent.fullName}</h4>
            <span className="text-[10px] font-medium text-slate-400">ID: {parent.id}</span>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="bg-slate-50/50 p-3 rounded-xl space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Téléphone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="p-1.5 border border-slate-200 rounded-lg text-xs w-full mt-0.5"
                  placeholder="Téléphone"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">WhatsApp</label>
                <input
                  type="text"
                  value={editForm.whatsapp}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                  className="p-1.5 border border-slate-200 rounded-lg text-xs w-full mt-0.5"
                  placeholder="WhatsApp"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Adresse</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="p-1.5 border border-slate-200 rounded-lg text-xs w-full mt-0.5"
                  placeholder="Adresse"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-[11px]">
              <p className="text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Tél: {parent.phone}</span>
              </p>
              <p className="text-slate-500">WhatsApp: {parent.whatsapp}</p>
              <p className="text-slate-500">Adresse: {parent.address}</p>
            </div>
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Enfants associés:</span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {myKids.map((k) => (
              <span key={k.id} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-sky-100">
                {k.firstName} {k.lastName}
              </span>
            ))}
            {myKids.length === 0 && <span className="text-slate-400 italic">Aucun enfant associé</span>}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
        {isEditing ? (
          <>
            <button onClick={onSave} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition font-bold"><Save className="w-3.5 h-3.5" /> Enregistrer</button>
            <button onClick={onCancelEdit} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold"><X className="w-3.5 h-3.5" /> Annuler</button>
          </>
        ) : isAssociating ? (
          <div className="flex items-center gap-1.5 w-full">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="flex-1 p-2 border border-slate-200 rounded-xl text-xs bg-white outline-none"
            >
              <option value="">Sélectionner l'élève</option>
              {students.filter((s) => s.parentId !== parent.id).map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            <button onClick={onAssociate} className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs">Lier</button>
            <button onClick={onCancelAssociate} className="p-1.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200"><X className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            <button onClick={onEdit} className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition font-bold cursor-pointer"><Edit className="w-3.5 h-3.5" /> Modifier</button>
            <button onClick={onStartAssociate} className="flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-xl transition font-bold cursor-pointer"><UserPlus className="w-3.5 h-3.5" /> Associer élève</button>
          </div>
        )}
      </div>
    </div>
  );
};
