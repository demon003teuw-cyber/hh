import React, { useState } from 'react';
import { Student, Parent, Level } from '../../../types';

interface AddStudentFormProps {
  levels: Level[];
  onAddStudent: (std: Omit<Student, 'id'>, p: Omit<Parent, 'id'>) => void;
  onClose: () => void;
}

export function AddStudentForm({ levels, onAddStudent, onClose }: AddStudentFormProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    sex: 'M' as 'M' | 'F',
    birthDate: '',
    levelId: levels[0]?.id || '',
    parentName: '',
    parentPhone: '',
    parentAddress: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        sex: form.sex,
        birthDate: form.birthDate,
        levelId: form.levelId,
        parentId: '',
      },
      {
        fullName: form.parentName,
        phone: form.parentPhone,
        whatsapp: form.parentPhone,
        address: form.parentAddress,
      }
    );
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-w-lg mx-auto text-xs">
      <h3 className="font-display font-bold text-slate-800 text-sm">Inscription manuelle d'un élève</h3>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Prénom de l'élève"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Nom de l'élève"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select
          value={form.sex}
          onChange={(e) => setForm({ ...form, sex: e.target.value as 'M' | 'F' })}
          className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 bg-white outline-none"
        >
          <option value="M">Garçon</option>
          <option value="F">Fille</option>
        </select>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
      </div>
      <select
        value={form.levelId}
        onChange={(e) => setForm({ ...form, levelId: e.target.value })}
        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 bg-white outline-none"
      >
        {levels.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <hr className="border-slate-100" />
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nom complet du parent"
          value={form.parentName}
          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Téléphone du parent"
          value={form.parentPhone}
          onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Adresse complète"
          value={form.parentAddress}
          onChange={(e) => setForm({ ...form, parentAddress: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          id="submit-add-std-btn"
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition"
        >
          Inscrire l'élève
        </button>
      </div>
    </form>
  );
}
