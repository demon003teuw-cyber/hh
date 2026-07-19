import React from 'react';
import { Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';
import { Settings } from '../../../types';

interface TarifsTabProps {
  form: Settings;
  onChange: (updated: Settings) => void;
}

export const SettingsTarifsTab: React.FC<TarifsTabProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Année scolaire active</label>
          <select 
            value={form.schoolYear || '2026-2027'} 
            onChange={e => onChange({...form, schoolYear: e.target.value})} 
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
          >
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027 (En cours)</option>
            <option value="2027-2028">2027-2028</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Notifications système</label>
          <span className="block mt-2 font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100 text-center">✓ WhatsApp activé</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-slate-700 text-[11px] border-b border-slate-100 pb-1 uppercase tracking-wider">Formats d'Inscription & Tarifs</h4>
        
        {/* Cours Individuel */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">Cours Individuel (À domicile)</span>
            {form.isIndividualPaused ? (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" /> Suspendu / Plein
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Ouvert
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-slate-400 text-[9px] font-bold mb-1 uppercase">Tarif par défaut</label>
              <input 
                type="text" 
                value={form.individualPrice || '75 000 FCFA / mois'} 
                onChange={e => onChange({...form, individualPrice: e.target.value})} 
                className="w-full p-2 bg-white rounded-lg border border-slate-200 font-semibold text-xs" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[9px] font-bold mb-1 uppercase">Statut Inscription</label>
              <button
                type="button"
                onClick={() => onChange({...form, isIndividualPaused: !form.isIndividualPaused})}
                className={`w-full p-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition ${form.isIndividualPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer' : 'bg-amber-500 hover:bg-amber-450 text-white shadow-xs cursor-pointer'}`}
              >
                {form.isIndividualPaused ? (
                  <><Play className="w-3.5 h-3.5" /> Ouvrir</>
                ) : (
                  <><Pause className="w-3.5 h-3.5" /> Suspendre / Plein</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cours de Groupe */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">Cours de Groupe (En Salle)</span>
            {form.isGroupPaused ? (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" /> Suspendu / Plein
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Ouvert
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-slate-400 text-[9px] font-bold mb-1 uppercase">Tarif par défaut</label>
              <input 
                type="text" 
                value={form.groupPrice || '40 000 FCFA / mois'} 
                onChange={e => onChange({...form, groupPrice: e.target.value})} 
                className="w-full p-2 bg-white rounded-lg border border-slate-200 font-semibold text-xs" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[9px] font-bold mb-1 uppercase">Statut Inscription</label>
              <button
                type="button"
                onClick={() => onChange({...form, isGroupPaused: !form.isGroupPaused})}
                className={`w-full p-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition ${form.isGroupPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer' : 'bg-amber-500 hover:bg-amber-450 text-white shadow-xs cursor-pointer'}`}
              >
                {form.isGroupPaused ? (
                  <><Play className="w-3.5 h-3.5" /> Ouvrir</>
                ) : (
                  <><Pause className="w-3.5 h-3.5" /> Suspendre / Plein</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
