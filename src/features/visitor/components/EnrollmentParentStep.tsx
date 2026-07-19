import React from 'react';

interface ParentStepProps {
  parent: { name: string; phone: string; whatsapp: string; address: string };
  setParent: React.Dispatch<React.SetStateAction<{ name: string; phone: string; whatsapp: string; address: string }>>;
}

export const EnrollmentParentStep: React.FC<ParentStepProps> = ({ parent, setParent }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Informations Parent</h4>
      <input 
        type="text" 
        placeholder="Nom complet du parent" 
        value={parent.name} 
        onChange={e => setParent({...parent, name: e.target.value})} 
        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
        required 
      />
      <input 
        type="text" 
        placeholder="Téléphone" 
        value={parent.phone} 
        onChange={e => setParent({...parent, phone: e.target.value})} 
        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
        required 
      />
      <input 
        type="text" 
        placeholder="Numéro WhatsApp" 
        value={parent.whatsapp} 
        onChange={e => setParent({...parent, whatsapp: e.target.value})} 
        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
        required 
      />
      <input 
        type="text" 
        placeholder="Adresse complète" 
        value={parent.address} 
        onChange={e => setParent({...parent, address: e.target.value})} 
        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-sky-500 outline-none" 
        required 
      />
    </div>
  );
};
