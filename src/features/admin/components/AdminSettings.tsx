import React, { useState } from 'react';
import { Save, CheckCircle, Sliders, Shield, Award, GraduationCap, Tag } from 'lucide-react';
import { Settings, Subject, Level, CourseOffer } from '../../../types';
import { SettingsCenterTab } from './SettingsCenterTab';
import { SettingsTarifsTab } from './SettingsTarifsTab';
import { SettingsRolesTab } from './SettingsRolesTab';
import { SettingsProgramsTab } from './SettingsProgramsTab';
import { SettingsOffersTab } from './SettingsOffersTab';

interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  subjects: Subject[];
  onUpdateSubjects: (s: Subject[]) => void;
  levels: Level[];
  onUpdateLevels: (l: Level[]) => void;
  courseOffers: CourseOffer[];
  onUpdateCourseOffers: (o: CourseOffer[]) => void;
}

type SettingsSubTab = 'CENTRE' | 'TARIFS' | 'ROLES' | 'PROGRAMS' | 'OFFERS';

export const AdminSettings: React.FC<SettingsProps> = ({
  settings, onUpdateSettings, subjects, onUpdateSubjects, levels, onUpdateLevels, courseOffers, onUpdateCourseOffers
}) => {
  const [form, setForm] = useState<Settings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('CENTRE');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabsConfig = [
    { id: 'CENTRE', label: 'Centre', icon: Award },
    { id: 'TARIFS', label: 'Statuts', icon: Sliders },
    { id: 'PROGRAMS', label: 'Programmes', icon: GraduationCap },
    { id: 'OFFERS', label: 'Offres & Tarifs', icon: Tag },
    { id: 'ROLES', label: 'Rôles & Droits', icon: Shield },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-4xl w-full mx-auto text-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-lg">Configuration Générale</h3>
          <p className="text-slate-400 text-xs">Ajustez les paramètres administratifs de la plateforme.</p>
        </div>
        <button type="submit" id="save-settings-btn" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs md:text-sm">
          <Save className="w-4 h-4" /> Enregistrer
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-150 text-emerald-600 p-3 rounded-xl flex items-center gap-2 font-semibold text-xs md:text-sm">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> Modifications enregistrées !
        </div>
      )}

      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50 overflow-x-auto gap-0.5 scrollbar-none">
        {tabsConfig.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button key={sub.id} type="button" onClick={() => setActiveSubTab(sub.id as SettingsSubTab)} className={`flex-1 shrink-0 py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap ${isActive ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon className="w-4 h-4 text-slate-400" /> {sub.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'CENTRE' && <SettingsCenterTab form={form} onChange={setForm} />}
      {activeSubTab === 'TARIFS' && <SettingsTarifsTab form={form} onChange={setForm} />}
      {activeSubTab === 'ROLES' && <SettingsRolesTab />}
      {activeSubTab === 'PROGRAMS' && <SettingsProgramsTab subjects={subjects} onUpdateSubjects={onUpdateSubjects} levels={levels} onUpdateLevels={onUpdateLevels} />}
      {activeSubTab === 'OFFERS' && <SettingsOffersTab offers={courseOffers} onUpdateOffers={onUpdateCourseOffers} subjects={subjects} levels={levels} />}
    </form>
  );
};
