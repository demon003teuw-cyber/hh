import { QrCode, Sparkles, Printer, Download } from 'lucide-react';
import { Student, Level } from '../../../../types';

interface StudentCardModalProps {
  student: Student;
  level?: Level;
  cardNo: string;
  onClose: () => void;
}

export function StudentCardModal({ student, level, cardNo, onClose }: StudentCardModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none text-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-150 text-slate-800">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="font-display font-extrabold text-slate-800 text-[11.5px] uppercase tracking-wider flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-sky-500" /> Carte Officielle de l'Élève
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="bg-gradient-to-b from-sky-600 to-sky-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden text-left border border-sky-700">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-y-2 translate-x-2">
            <Sparkles className="w-32 h-32" />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-display font-black text-[11px] uppercase tracking-wider text-white">Soutien Scolaire d'Élite</h4>
              <p className="text-[7.5px] text-sky-200 uppercase font-bold tracking-widest">Dakar, Sénégal</p>
            </div>
            <span className="bg-white/15 text-white border border-white/25 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase font-mono">
              Carte Numérique
            </span>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-white text-sky-700 flex items-center justify-center font-display font-black text-2xl shadow-inner border border-sky-400 shrink-0">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-[8px] uppercase text-sky-200 font-bold tracking-wider">Nom de l'élève</p>
              <h3 className="font-display font-black text-[13px] tracking-tight leading-tight truncate">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-[8px] uppercase text-sky-200 font-bold tracking-wider mt-1.5">Niveau d'étude</p>
              <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[8.5px] font-bold">
                {level?.name || 'Classe'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-white/15 flex justify-between items-end">
            <div>
              <p className="text-[7.5px] uppercase text-sky-200 font-bold tracking-wider">Identifiant ID unique</p>
              <p className="font-mono font-black text-[9.5px] text-white tracking-widest">{cardNo}</p>
              <p className="text-[7px] text-sky-200 mt-0.5 italic">Validité : Année 2025-2026</p>
            </div>

            <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-sm shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 text-slate-950" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H7V7H0V0ZM2 2V5H5V2H2Z" fill="currentColor"/>
                <path d="M22 0H29V7H22V0ZM24 2V5H27V2H24Z" fill="currentColor"/>
                <path d="M0 22H7V29H0V22ZM2 24V27H5V24H2Z" fill="currentColor"/>
                <path d="M10 0H12V4H10V0Z" fill="currentColor"/>
                <path d="M14 0H18V2H14V0Z" fill="currentColor"/>
                <path d="M10 6H14V8H10V6Z" fill="currentColor"/>
                <path d="M22 10H24V14H22V10ZM26 10H29V12H26V10Z" fill="currentColor"/>
                <path d="M0 10H4V12H0V10Z" fill="currentColor"/>
                <path d="M6 10H8V14H6V10Z" fill="currentColor"/>
                <path d="M10 14H18V18H10V14ZM12 16H16V17H12V16Z" fill="currentColor"/>
                <path d="M22 22H24V26H22V22ZM26 24H29V28H26V24Z" fill="currentColor"/>
                <path d="M10 22H12V25H10V22Z" fill="currentColor"/>
                <path d="M14 24H18V26H14V24Z" fill="currentColor"/>
                <path d="M12 28H16V29H12V28ZM18 28H20V29H18V28Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        <p className="text-[9.5px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          Le code QR contient un identifiant unique pour valider la présence de l'élève au centre d'Élite.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button onClick={() => alert("Impression lancée...\nFormat : Carte ID Scolaire")} className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer text-[10px]">
            <Printer className="w-4 h-4 text-slate-500" /> Imprimer
          </button>
          <button onClick={() => alert("Téléchargement du fichier PDF sécurisé lancé...")} className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-[10px]">
            <Download className="w-4 h-4" /> Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
