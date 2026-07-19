import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Preinscription } from '../../../types';

interface ReceiptProps {
  receipt: Preinscription;
  onClose: () => void;
}

export const EnrollmentReceipt: React.FC<ReceiptProps> = ({ receipt, onClose }) => {
  return (
    <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border-4 border-emerald-50">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-display font-black text-slate-800 text-lg">Pré-inscription Enregistrée !</h3>
        <p className="text-slate-400 text-[10px] mt-1">Votre dossier a été transmis avec succès à notre équipe académique.</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
        <div className="flex justify-between border-b border-slate-200/50 pb-2">
          <span className="text-slate-400 font-semibold">Référence Dossier :</span>
          <span className="font-black text-slate-800 uppercase tracking-wider">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Élève :</span>
          <span className="font-bold text-slate-700">{receipt.studentFirstName} {receipt.studentLastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Format :</span>
          <span className="font-bold text-slate-700">{receipt.courseType === 'INDIVIDUEL' ? 'Individuel' : 'Groupe'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Statut :</span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-bold text-[9px] border border-amber-100">En attente</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 leading-relaxed px-4">
        Un conseiller pédagogique va analyser votre demande et vous recontacter sous 24h par téléphone pour confirmer la planification des cours.
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
      >
        Fermer la fenêtre <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
