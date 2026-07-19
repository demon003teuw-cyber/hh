import { CreditCard, Phone, Loader2, CheckCircle } from 'lucide-react';
import { Student } from '../../../../types';

interface StudentPaymentModalProps {
  student: Student;
  amount: number;
  paymentMethod: 'WAVE' | 'ORANGE_MONEY';
  setPaymentMethod: (method: 'WAVE' | 'ORANGE_MONEY') => void;
  paymentPhoneNumber: string;
  setPaymentPhoneNumber: (val: string) => void;
  paymentStep: 1 | 2 | 3;
  onExecute: () => void;
  onClose: () => void;
}

export function StudentPaymentModal({
  student,
  amount,
  paymentMethod,
  setPaymentMethod,
  paymentPhoneNumber,
  setPaymentPhoneNumber,
  paymentStep,
  onExecute,
  onClose
}: StudentPaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none text-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-800 text-left">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CreditCard className="text-emerald-500 w-4 h-4" /> Paiement Mobile Money Sécurisé
            </h3>
            <p className="text-slate-400 text-[9px]">Règlement direct des frais de cours de soutien.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {paymentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl flex justify-between items-center border border-slate-100">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Élève bénéficiaire</span>
                <span className="font-bold text-slate-700 text-[11px]">{student.firstName} {student.lastName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Montant dû</span>
                <span className="font-mono font-black text-emerald-600 text-xs">{amount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Moyen de paiement</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WAVE')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'WAVE' ? 'bg-sky-50 border-sky-400 text-sky-600 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mb-1" />
                  <span className="font-extrabold text-[11px]">WAVE SÉNÉGAL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ORANGE_MONEY')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'ORANGE_MONEY' ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mb-1" />
                  <span className="font-extrabold text-[11px]">ORANGE MONEY</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Numéro de téléphone payeur</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={paymentPhoneNumber}
                  onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                  placeholder="Ex: +221 77 123 45 67"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl transition outline-none font-bold text-slate-800 text-xs"
                />
              </div>
              <p className="text-[8.5px] text-slate-400 leading-relaxed">
                Saisissez le numéro rattaché à votre compte Wave ou Orange Money sur lequel l'autorisation de débit sera envoyée.
              </p>
            </div>

            <button
              onClick={onExecute}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
            >
              <CreditCard className="w-4 h-4" /> Procéder au règlement
            </button>
          </div>
        )}

        {paymentStep === 2 && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-xs">Paiement en cours...</h4>
              <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                Une demande de débit de <strong className="text-slate-700">{amount.toLocaleString()} FCFA</strong> a été envoyée sur votre téléphone. Veuillez valider la transaction avec votre code secret.
              </p>
            </div>
          </div>
        )}

        {paymentStep === 3 && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8 shrink-0" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-slate-800 text-sm">Félicitations, Paiement validé !</h4>
              <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                Le paiement des cours de soutien de {student.firstName} a été enregistré avec succès par l'administration du centre d'Élite.
              </p>
            </div>
            <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-[10.5px]">
              Retourner à l'Espace Parent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
