import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, Users, PiggyBank, ArrowDownRight, CreditCard } from 'lucide-react';
import { Payment, Student, Parent, Level } from '../../../types';
import { AddPaymentForm } from './AddPaymentForm';
import { FinanceOverdueBanner } from './FinanceOverdueBanner';
import { AdminPaymentsList } from './AdminPaymentsList';

interface AdminFinanceSectionProps {
  payments: Payment[];
  students: Student[];
  parents: Parent[];
  levels: Level[];
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => void;
  onViewPdf: (paymentId: string) => void;
}

export function AdminFinanceSection({
  payments,
  students,
  parents,
  levels,
  onAddPayment,
  onViewPdf,
}: AdminFinanceSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState('');

  // 1. Calculations
  const totalRevenus = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);
  // Simulating teacher salaries (e.g. 75,000 FCFA per teacher or flat mock 1,500,000 FCFA)
  const totalSalaires = 1500000;
  const benefice = totalRevenus - totalSalaires;

  // 2. Overdue calculations (students without any payment in current year-month)
  const currentMonthStr = '2026-07';
  const overdueStudents = useMemo(() => {
    return students.filter((s) => !payments.some((p) => p.studentId === s.id && p.date.startsWith(currentMonthStr)));
  }, [students, payments]);

  const handleOpenAddForStudent = (studentId: string) => {
    setTargetStudentId(studentId);
    setShowAdd(true);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Monthly Financial Stats Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="font-display font-extrabold text-sm mb-4 text-sky-400 uppercase tracking-widest">Rapport de Trésorerie Mensuelle</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Paiements reçus</p>
              <p className="text-sm font-extrabold text-emerald-400 font-mono">{totalRevenus.toLocaleString()} FCFA</p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/15 text-rose-400 rounded-xl"><ArrowDownRight className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Salaires</p>
              <p className="text-sm font-extrabold text-rose-400 font-mono">{totalSalaires.toLocaleString()} FCFA</p>
            </div>
          </div>

          <div className="bg-slate-850 p-4 rounded-2xl border border-indigo-500/30 flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/15 text-sky-400 rounded-xl"><PiggyBank className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Bénéfice net</p>
              <p className="text-sm font-extrabold text-sky-400 font-mono">{benefice.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-800 text-base">Transactions & Facturation</h3>
        <button
          onClick={() => { setTargetStudentId(''); setShowAdd(true); }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Enregistrer un Paiement
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <AddPaymentForm
            students={students}
            onAddPayment={onAddPayment}
            onClose={() => setShowAdd(false)}
          />
        </div>
      )}

      {/* Overdue alert banner */}
      <FinanceOverdueBanner
        overdueStudents={overdueStudents}
        parents={parents}
        levels={levels}
        onAddClick={handleOpenAddForStudent}
      />

      {/* Main transactions list */}
      <AdminPaymentsList
        payments={payments}
        students={students}
        onViewPdf={onViewPdf}
      />
    </div>
  );
}
