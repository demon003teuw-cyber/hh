import React, { useState } from 'react';
import { Settings, Subject, Level, CourseOffer } from '../../../types';
import { ProgramsNiveauxTab } from './ProgramsNiveauxTab';
import { ProgramsTarifsTab } from './ProgramsTarifsTab';

interface PricingProgramsProps {
  settings: Settings;
  subjects: Subject[];
  levels: Level[];
  courseOffers: CourseOffer[];
  onSelectOffer?: (offer: CourseOffer) => void;
}

export const PricingPrograms: React.FC<PricingProgramsProps> = ({ settings, subjects, levels, courseOffers, onSelectOffer }) => {
  const [activeTab, setActiveTab] = useState<'NIVEAUX' | 'TARIFS'>('NIVEAUX');

  return (
    <div className="space-y-8 mb-12">
      {/* Premium Segmented Tab Selector */}
      <div className="flex justify-center">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 w-full max-w-lg shadow-3xs font-semibold">
          {(['NIVEAUX', 'TARIFS'] as const).map(tab => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs rounded-xl transition-all duration-300 cursor-pointer text-center ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab === 'NIVEAUX' ? 'Programmes & Matières' : 'Offres & Tarifs'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents with Elegant Transitions */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'NIVEAUX' && <ProgramsNiveauxTab subjects={subjects} />}
        {activeTab === 'TARIFS' && <ProgramsTarifsTab settings={settings} courseOffers={courseOffers} onSelectOffer={onSelectOffer} />}
      </div>
    </div>
  );
};
