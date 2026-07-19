import React, { useState } from 'react';
import { Search, Calendar, CreditCard } from 'lucide-react';
import { Payment, Student } from '../../../types';
import { PaymentMobileCard } from './PaymentMobileCard';
import { PaymentTableRow } from './PaymentTableRow';

interface PaymentsListProps {
  payments: Payment[];
  students: Student[];
  onViewPdf: (paymentId: string) => void;
}

export function AdminPaymentsList({ payments, students, onViewPdf }: PaymentsListProps) {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = payments.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const searchStr = `${student?.firstName || ''} ${student?.lastName || ''} ${p.reference}`.toLowerCase();
    const matchesSearch = searchStr.includes(search.toLowerCase());
    const matchesStart = !startDate || p.date >= startDate;
    const matchesEnd = !endDate || p.date <= endDate;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const totalPeriodAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5 text-xs">
      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-2xs space-y-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un règlement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
          <div className="space-y-2">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
              <Calendar className="w-4 h-4 text-sky-500" /> Filtrer par Période
            </span>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:border-sky-500 outline-none text-xs w-[140px]"
              />
              <span className="text-slate-400 font-medium">à</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:border-sky-500 outline-none text-xs w-[140px]"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-rose-500 font-bold hover:text-rose-600 transition ml-2 text-xs"
                >
                  Vider
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/60 px-4 py-2.5 rounded-2xl self-start lg:self-auto w-full lg:w-auto">
            <CreditCard className="w-5 h-5 text-sky-500 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Filtré</p>
              <p className="font-extrabold text-slate-800 text-xs font-mono">
                {totalPeriodAmount.toLocaleString()} FCFA
                <span className="text-slate-500 font-sans font-normal ml-1">
                  ({filtered.length} reçu{filtered.length > 1 ? 's' : ''})
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((p) => (
          <PaymentMobileCard
            key={p.id}
            payment={p}
            student={students.find((s) => s.id === p.studentId)}
            onViewPdf={onViewPdf}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-6 text-slate-400 italic">Aucun règlement trouvé pour ces critères.</p>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Référence</th>
                <th className="p-4">Élève</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Date</th>
                <th className="p-4">Méthode</th>
                <th className="p-4 text-center">Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((p) => (
                <PaymentTableRow
                  key={p.id}
                  payment={p}
                  student={students.find((s) => s.id === p.studentId)}
                  onViewPdf={onViewPdf}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
