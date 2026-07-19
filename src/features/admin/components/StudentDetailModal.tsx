import React, { useState } from 'react';
import { X, QrCode, Phone, MapPin, Calendar, Check } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';

interface StudentDetailModalProps {
  student: Student;
  parent: Parent | undefined;
  levels: Level[];
  onClose: () => void;
  onDelete?: () => void;
  onUpdate?: (updatedStudent: Student) => void;
}

export function StudentDetailModal({
  student,
  parent,
  levels,
  onClose,
  onDelete,
  onUpdate,
}: StudentDetailModalProps) {
  const [isQrMode, setIsQrMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    levelId: student.levelId,
    sex: student.sex,
  });

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({
        ...student,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        levelId: editForm.levelId,
        sex: editForm.sex,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden border border-slate-100 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
          <div>
            <h4 className="font-display font-bold text-sm">Profil de l'Élève</h4>
            <p className="text-[10px] text-slate-400">ID: {student.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1">
          {!isQrMode ? (
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                      placeholder="Prénom"
                    />
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                      placeholder="Nom"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editForm.sex}
                      onChange={(e) => setEditForm({ ...editForm, sex: e.target.value as 'M' | 'F' })}
                      className="p-2 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="M">Garçon</option>
                      <option value="F">Fille</option>
                    </select>
                    <select
                      value={editForm.levelId}
                      onChange={(e) => setEditForm({ ...editForm, levelId: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      {levels.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleUpdate} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
                    <Check className="w-3.5 h-3.5" /> Enregistrer les modifications
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 font-display">{student.firstName} {student.lastName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-200/50">
                      {levels.find((l) => l.id === student.levelId)?.name}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Né(e) le : {student.birthDate}</p>
                    <p className="flex items-center gap-2">Genre : {student.sex === 'M' ? 'Garçon' : 'Fille'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 mt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Parent Responsable</span>
                    <p className="font-bold text-slate-700 text-xs">{parent?.fullName || 'Non spécifié'}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {parent?.phone}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {parent?.address}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-[10px] transition">
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => { onDelete(); onClose(); }} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-3 py-2 rounded-xl text-[10px] transition">
                    Supprimer
                  </button>
                )}
                <button onClick={() => setIsQrMode(true)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3.5 py-2 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition">
                  <QrCode className="w-3.5 h-3.5" /> Carte QR
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg border-2 border-indigo-500 flex flex-col items-center space-y-2 max-w-[240px]">
                <span className="text-[8px] tracking-widest uppercase font-black text-indigo-400">CARTE SCOLARITÉ</span>
                <div className="bg-white p-3 rounded-2xl">
                  {/* Generated beautiful geometric mock QR code */}
                  <div className="w-28 h-28 bg-slate-100 border-2 border-slate-800 rounded-lg flex items-center justify-center relative p-1.5">
                    <div className="w-full h-full bg-white grid grid-cols-4 gap-1 opacity-90">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${(i % 3 === 0 || i === 7 || i === 14 || i === 1 || i === 12) ? 'bg-slate-900' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <div className="absolute inset-0 m-auto w-8 h-8 bg-slate-900 border-2 border-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-400">QR</div>
                  </div>
                </div>
                <div className="text-center pt-1.5">
                  <p className="font-display font-bold text-xs leading-none">{student.firstName} {student.lastName}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{levels.find(l => l.id === student.levelId)?.name || 'Élève'}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Cette carte d'accès avec QR code est générée automatiquement pour les émargements rapides de l'élève.</p>
              <button onClick={() => setIsQrMode(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-[10px] transition">
                Retour au profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
