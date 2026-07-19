import React from 'react';
import { Printer, Calendar, CreditCard, Receipt } from 'lucide-react';
import { Payment, Student } from '../../../types';

interface PaymentMobileCardProps {
  payment: Payment;
  student?: Student;
  onViewPdf: (paymentId: string) => void;
}

export const PaymentMobileCard: React.FC<PaymentMobileCardProps> = ({
  payment,
  student,
  onViewPdf,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-3.5 hover:border-emerald-200 transition-all text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-slate-400" />
          <span className="font-mono font-bold text-slate-500">{payment.reference}</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          {payment.method}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Élève</p>
          <p className="font-bold text-slate-800 text-sm">
            {student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Date</p>
          <p className="text-slate-600 font-medium">{payment.date}</p>
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Montant</p>
          <p className="font-extrabold text-slate-900 text-sm font-mono">
            {payment.amount.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <button
        onClick={() => onViewPdf(payment.id)}
        className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl transition font-bold text-xs cursor-pointer border border-slate-200/60"
      >
        <Printer className="w-4 h-4 text-slate-500" />
        <span>Imprimer le Reçu PDF</span>
      </button>
    </div>
  );
};
