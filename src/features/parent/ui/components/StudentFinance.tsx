import { CreditCard, Check, Printer } from 'lucide-react';
import { Payment } from '../../../../types';

interface StudentFinanceProps {
  finance: {
    monthly: number;
    remains: number;
    limitDate: string;
    status: 'PAID' | 'UNPAID';
    history: Payment[];
  };
  onOpenPay: () => void;
  onViewReceiptPdf: (payId: string) => void;
}

export function StudentFinance({ finance, onOpenPay, onViewReceiptPdf }: StudentFinanceProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-left select-none text-xs">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-500" /> Frais & Scolarité
        </h3>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
          finance.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {finance.status === 'PAID' ? 'À JOUR' : 'IMPAYÉ'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-2xl">
        <div>
          <span className="text-[9px] text-slate-400 block font-bold">Frais Mensuels</span>
          <p className="text-sm font-black text-slate-700 font-mono">{finance.monthly.toLocaleString()} FCFA</p>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 block font-bold">Reste à payer</span>
          <p className={`text-sm font-black font-mono ${finance.remains > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {finance.remains.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
        <span>Date limite de règlement : <strong>{finance.limitDate}</strong></span>
      </div>

      {finance.remains > 0 ? (
        <button
          onClick={onOpenPay}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
        >
          <CreditCard className="w-4 h-4" /> 💳 Payer maintenant
        </button>
      ) : (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-[10.5px] border border-emerald-100 flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-500" /> Aucun solde débiteur pour ce mois.
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Historique des reçus</span>
        {finance.history.length === 0 ? (
          <p className="text-slate-400 italic text-[10px] pl-2">Aucun reçu de paiement enregistré.</p>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {finance.history.map(p => (
              <div key={p.id} className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center text-[10px]">
                <div>
                  <span className="font-bold text-slate-700">{p.amount.toLocaleString()} FCFA</span>
                  <p className="text-[8.5px] text-slate-400 font-mono">Réf: {p.reference} | {p.date}</p>
                </div>
                <button
                  onClick={() => onViewReceiptPdf(p.id)}
                  className="text-[10px] font-bold text-sky-500 hover:text-sky-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Reçu PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
