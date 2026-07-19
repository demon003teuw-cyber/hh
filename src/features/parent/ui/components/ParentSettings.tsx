import React, { useState } from 'react';
import { Save, CheckCircle, Bell, Shield, User, Smartphone, MapPin } from 'lucide-react';
import { Parent } from '../../../../types';

interface ParentSettingsProps { parent: Parent; onSave: (updated: Parent) => void; onUpdatePhone?: (phone: string) => void; }

export function ParentSettings({ parent, onSave, onUpdatePhone }: ParentSettingsProps) {
  const [fullName, setFullName] = useState(parent.fullName);
  const [phone, setPhone] = useState(parent.phone);
  const [address, setAddress] = useState(parent.address || '');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'NOTIFS' | 'SECURITY'>('PROFILE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); onSave({ ...parent, fullName, phone, address });
    if (onUpdatePhone && phone !== parent.phone) onUpdatePhone(phone);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 max-w-xl mx-auto text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-base">Mes Paramètres</h3>
          <p className="text-slate-400 text-[10px]">Gérez vos informations de profil, notifications et sécurité.</p>
        </div>
        <button onClick={handleSubmit} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
          <Save className="w-4 h-4" /> Enregistrer
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-150 text-emerald-600 p-2.5 rounded-xl flex items-center gap-2 font-semibold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Modifications enregistrées !
        </div>
      )}

      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50">
        {[{ id: 'PROFILE', label: 'Profil', icon: User }, { id: 'NOTIFS', label: 'Notifications', icon: Bell }, { id: 'SECURITY', label: 'Sécurité', icon: Shield }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 transition cursor-pointer ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-xs border' : 'text-slate-500 hover:text-slate-700'}`}>
            <tab.icon className="w-3.5 h-3.5 text-slate-400" /><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'PROFILE' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <label className="block text-slate-500 font-bold">Nom complet du Parent</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl outline-none font-medium transition" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Téléphone</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl outline-none font-bold font-mono transition" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl outline-none font-medium transition" required />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'NOTIFS' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <p className="font-bold text-slate-600 mb-1">Alertes de Suivi Scolaire</p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <div><p className="font-bold text-slate-800 font-sans">Alertes WhatsApp</p><p className="text-[9px] text-slate-400">Suivi instantané des présences et retards.</p></div>
            <input type="checkbox" checked={whatsappAlerts} onChange={(e) => setWhatsappAlerts(e.target.checked)} className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-sky-400 cursor-pointer" />
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <div><p className="font-bold text-slate-800 font-sans">Alertes par E-mail</p><p className="text-[9px] text-slate-400">Récapitulatif mensuel des notes et fiches.</p></div>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-sky-400 cursor-pointer" />
          </div>
        </div>
      )}

      {activeTab === 'SECURITY' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <p className="font-bold text-slate-600 mb-1">Sécurité du compte</p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800 font-sans">Code d'accès confidentiel</p>
            <p className="text-[9px] text-slate-400 mb-2">Votre code secret vous protège contre tout accès non autorisé.</p>
            <input type="password" disabled value="••••••••" className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-400 cursor-not-allowed" />
          </div>
        </div>
      )}
    </div>
  );
}
