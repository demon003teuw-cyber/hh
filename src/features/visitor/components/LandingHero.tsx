import React from 'react';
import { BookOpen, Phone, Users, MapPin, Award, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { Settings } from '../../../types';
// @ts-ignore
import heroImage from '../../../assets/images/elite_tutoring_hero_1784394233686.jpg';

interface LandingHeroProps {
  settings: Settings;
  onStartPreinscription: () => void;
  onGoToParentSpace: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ settings, onStartPreinscription, onGoToParentSpace }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/\s+/g, '')}`;

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl mb-12 border border-slate-800">
      {/* Dynamic Background Blurs & Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -ml-24 -mb-24" />
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 opacity-90" />
      
      <div className="relative z-10 grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Left Column: Text & Actions */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-sky-400 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase border border-sky-500/20 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Direct par {settings.directorName}</span>
          </div>
          
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Soutien Scolaire <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">d'Élite</span>
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
            {settings.aboutText}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
            <button
              id="hero-enroll-btn"
              onClick={onStartPreinscription}
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-sky-500/20 text-center text-xs flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0"
            >
              Inscrire mon enfant <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              id="hero-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] text-center text-xs shadow-md shadow-emerald-950/30 cursor-pointer w-full sm:w-auto shrink-0"
            >
              <Phone className="w-4 h-4 fill-white" /> Nous écrire sur WhatsApp
            </a>
          </div>

          {/* Trust badges / Stats in bento style */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 border-t border-slate-800">
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">100%</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Présentiel</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">CI à Tle</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Tous Niveaux</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">Dakar</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Chez vous / Salle</div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium High-Quality Graphic Frame */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-4 lg:mt-0">
          {/* Decorative Backdrops */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur-md opacity-20" />
          
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 max-w-sm sm:max-w-md lg:max-w-full">
            <img 
              src={heroImage} 
              alt="Soutien Scolaire d'Élite" 
              className="w-full h-auto object-cover object-center max-h-[320px] lg:max-h-[380px] transition duration-500 hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant glassmorphism floating tag */}
            <div className="relative sm:absolute sm:bottom-4 sm:left-4 sm:right-4 m-3 sm:m-0 bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-sky-400">Encadrement d'Élite</p>
                <p className="text-[10px] text-slate-300">Rigueur, Méthode & Excellence Académique</p>
              </div>
            </div>

            {/* Glowing corner stamp */}
            <div className="absolute top-4 right-4 bg-emerald-500/90 text-white font-bold px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3 fill-white text-emerald-500" />
              <span>Label d'Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

