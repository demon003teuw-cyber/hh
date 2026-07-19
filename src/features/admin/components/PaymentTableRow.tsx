import React from 'react';
import { Printer } from 'lucide-react';
import { Payment, Student } from '../../../types';

interface PaymentTableRowProps {
  payment: Payment;
  student?: Student;
  onViewPdf: (paymentId: string) => void;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  student,
  onViewPdf,
}) => {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="p-3 font-mono font-bold text-slate-500">{payment.reference}</td>
      <td className="p-3 font-semibold text-slate-800">
        {student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}
      </td>
      <td className="p-3 font-bold text-slate-800">{payment.amount.toLocaleString()} F</td>
      <td className="p-3 text-slate-500">{payment.date}</td>
      <td className="p-3">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          {payment.method}
        </span>
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onViewPdf(payment.id)}
          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg font-semibold cursor-pointer"
        >
          <Printer className="w-3 h-3" /> PDF
        </button>
      </td>
    </tr>
  );
};
