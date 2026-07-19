import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { CourseOffer, Settings } from '../../../types';

interface TarifsTabProps {
  settings: Settings;
  courseOffers: CourseOffer[];
  onSelectOffer?: (offer: CourseOffer) => void;
}

export const ProgramsTarifsTab: React.FC<TarifsTabProps> = ({ settings, courseOffers, onSelectOffer }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-200 text-xs">
      {courseOffers.map(offer => {
        const isPaused = offer.type === 'INDIVIDUEL' ? settings.isIndividualPaused : settings.isGroupPaused;
        const priceStr = `${offer.price.toLocaleString()} FCFA`;

        return (
          <div 
            key={offer.id} 
            onClick={() => {
              if (!isPaused) {
                onSelectOffer?.(offer);
              }
            }}
            className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative group text-xs ${
              isPaused 
                ? 'opacity-65 border-slate-200 cursor-not-allowed' 
                : 'border-slate-200 hover:border-sky-400 hover:shadow-lg cursor-pointer active:scale-[0.98]'
            }`}
          >
            {/* Header tags */}
            {isPaused ? (
              <div className="absolute top-4 right-4 bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-md text-[8px] uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 animate-pulse" /> Suspendu / Plein
              </div>
            ) : (
              <div className={`absolute top-4 right-4 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider ${
                offer.type === 'INDIVIDUEL' ? 'bg-amber-500/10 text-amber-600' : 'bg-sky-500/10 text-sky-600'
              }`}>
                {offer.type === 'INDIVIDUEL' ? 'Suivi Solo' : 'Petit Groupe'}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold mb-3 border ${
                  offer.type === 'INDIVIDUEL' 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}>
                  Formule {offer.type === 'INDIVIDUEL' ? 'À Domicile' : 'En Salle'}
                </span>
                <h4 className={`font-display font-black text-slate-800 text-base leading-snug transition ${!isPaused && 'group-hover:text-sky-600'}`}>
                  {offer.name}
                </h4>
              </div>
              
              <p className="text-slate-500 leading-relaxed">{offer.description}</p>
            </div>
            
            <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {priceStr}
                </div>
                <div className="text-slate-400 text-[10px] font-medium mt-0.5">{offer.duration}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold transition duration-300 ${
                  isPaused ? 'text-slate-400' : 'text-sky-500 opacity-0 group-hover:opacity-100'
                }`}>
                  {isPaused ? 'Complet' : "S'inscrire"}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition duration-350 ${
                  isPaused 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-slate-50 group-hover:bg-sky-500 group-hover:text-white text-slate-400'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
