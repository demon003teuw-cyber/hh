import React, { useState } from 'react';
import { Search, Plus, CreditCard, Printer, FileText, AlertTriangle, Phone, Check, Calendar } from 'lucide-react';
import { Payment, Student, Parent, Level } from '../../../types';

interface PaymentsProps {
  payments: Payment[];
  students: Student[];
  parents?: Parent[];
  levels?: Level[];
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => Payment | undefined;
  onViewPdf: (paymentId: string) => void;
}

export const AdminPayments: React.FC<PaymentsProps> = ({ 
  payments, 
  students, 
  parents = [], 
  levels = [], 
  onAddPayment, 
  onViewPdf 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [studentId, setStudentId] = useState('');
  const [method, setMethod] = useState<Payment['method']>('WAVE');
  const [search, setSearch] = useState('');
  const [showOverdueAlertPanel, setShowOverdueAlertPanel] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getCurrentYearMonthStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const getFrenchMonthName = () => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const currentMonthStr = getCurrentYearMonthStr();
  const currentMonthName = getFrenchMonthName();

  // Find all students who do not have a payment in the current month
  const overdueStudents = students.filter(student => {
    const hasPaid = payments.some(p => 
      p.studentId === student.id && 
      p.date.startsWith(currentMonthStr)
    );
    return !hasPaid;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !studentId) return;
    onAddPayment(Number(amount), studentId, method);
    setShowAdd(false);
    setAmount('');
    setStudentId('');
  };

  const filtered = payments.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    const searchStr = `${student?.firstName || ''} ${student?.lastName || ''} ${p.reference}`.toLowerCase();
    const matchesSearch = searchStr.includes(search.toLowerCase());
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && p.date >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && p.date <= endDate;
    }
    
    return matchesSearch && matchesDate;
  });

  const totalPeriodAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 text-xs">
      {/* Visual Indicator Alert Banner for overdue payments */}
      {overdueStudents.length > 0 && showOverdueAlertPanel && (
        <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 space-y-4 shadow-xs animate-in fade-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="bg-rose-100 text-rose-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Alerte Mensuelle : Retards de Paiement
                </span>
                <h3 className="font-display font-extrabold text-rose-950 text-base">
                  Règlements en attente - {currentMonthName}
                </h3>
                <p className="text-rose-700 text-[11px] leading-relaxed max-w-2xl">
                  Il y a <strong>{overdueStudents.length} élève(s)</strong> pour qui aucun paiement n'a été enregistré ce mois-ci. Les relances par WhatsApp sont configurables ci-dessous.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowOverdueAlertPanel(false)}
              className="text-rose-400 hover:text-rose-600 font-bold text-lg p-1.5 transition rounded-lg hover:bg-rose-100/50 cursor-pointer"
              title="Masquer l'alerte"
            >
              ×
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {overdueStudents.map(student => {
              const level = levels.find(l => l.id === student.levelId);
              const parent = parents.find(p => p.id === student.parentId);
              const cleanPhone = parent ? parent.whatsapp.trim().replace(/\s+/g, '') : '';
              
              // Generate pre-filled message for WhatsApp
              const whatsappMsg = `Bonjour ${parent?.fullName || ''}, nous vous contactons de la part du Centre d'Élite concernant le suivi de ${student.firstName}. Le paiement de la scolarité de ${student.firstName} pour le mois de ${currentMonthName} n'a pas encore été enregistré. Nous vous prions de régulariser la situation dans les plus brefs délais. Merci d'avance !`;
              const encodedMsg = encodeURIComponent(whatsappMsg);
              const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;

              return (
                <div key={student.id} className="bg-white border border-rose-100/80 p-4 rounded-2xl flex flex-col justify-between gap-4 shadow-2xs hover:shadow-xs transition relative">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-display font-bold text-slate-800 text-xs truncate">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="shrink-0 bg-rose-50 text-rose-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        En Retard
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-slate-500 space-y-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <p className="flex justify-between">
                        <span>Classe :</span>
                        <strong className="text-slate-700">{level?.name || 'Inconnue'}</strong>
                      </p>
                      {parent && (
                        <>
                          <p className="flex justify-between">
                            <span>Parent :</span>
                            <strong className="text-slate-700 truncate max-w-[120px]">{parent.fullName}</strong>
                          </p>
                          <p className="flex justify-between">
                            <span>Téléphone :</span>
                            <strong className="text-slate-700 font-mono">{parent.phone}</strong>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 text-[10px] font-bold">
                    <button
                      onClick={() => {
                        setStudentId(student.id);
                        setShowAdd(true);
                        // Auto-scroll or focus the form
                        setTimeout(() => {
                          const amtInput = document.querySelector('input[type="number"]');
                          if (amtInput) (amtInput as HTMLInputElement).focus();
                        }, 120);
                      }}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl transition text-center cursor-pointer shadow-xs shadow-rose-500/10 flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Enregistrer
                    </button>
                    {parent && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/60 font-bold px-3 py-2 rounded-xl transition flex items-center justify-center gap-1 shrink-0 shadow-2xs"
                        title="Relancer le parent sur WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" /> Relancer
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              id="search-payment-input"
              type="text" 
              placeholder="Rechercher par élève, reçu..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 transition-all font-medium text-slate-700" 
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {overdueStudents.length > 0 && (
              <button 
                id="toggle-overdue-alert-dashboard-btn"
                onClick={() => setShowOverdueAlertPanel(!showOverdueAlertPanel)}
                className={`flex items-center gap-1.5 font-bold px-4 py-2.5 rounded-xl transition w-full sm:w-auto justify-center border text-xs cursor-pointer ${
                  showOverdueAlertPanel 
                    ? 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-150' 
                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/70 animate-pulse'
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Retards ({overdueStudents.length})</span>
              </button>
            )}

            <button id="show-add-pay-btn" onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-xl transition w-full sm:w-auto justify-center shadow-md shadow-sky-500/10 cursor-pointer">
              <Plus className="w-4 h-4" /> Enregistrer un Paiement
            </button>
          </div>
        </div>

        {/* Date Plage de Filtrage (Start/End Date Filter) */}
        <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <span className="font-bold text-slate-700 text-xs shrink-0 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" /> Filtrer par période :
            </span>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <span className="absolute left-2.5 top-2.5 text-[9px] text-slate-400 font-bold uppercase pointer-events-none">Du</span>
                <input 
                  id="filter-payment-start-date"
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  className="w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs focus:border-sky-500 outline-none transition font-medium text-slate-700" 
                />
              </div>

              <div className="relative flex-1 sm:flex-initial">
                <span className="absolute left-2.5 top-2.5 text-[9px] text-slate-400 font-bold uppercase pointer-events-none">Au</span>
                <input 
                  id="filter-payment-end-date"
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  className="w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs focus:border-sky-500 outline-none transition font-medium text-slate-700" 
                />
              </div>
            </div>

            {(startDate || endDate) && (
              <button 
                id="clear-payment-date-filter-btn"
                onClick={() => { setStartDate(''); setEndDate(''); }} 
                className="text-rose-500 hover:text-rose-600 font-bold hover:underline cursor-pointer text-[10px]"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Financial summary for the period */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl md:self-end self-start shrink-0">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Période Sélectionnée</p>
              <p className="text-sm font-extrabold text-slate-800 font-mono">
                {totalPeriodAmount.toLocaleString()} FCFA <span className="text-slate-400 font-sans font-medium text-[11px]">({filtered.length} reçu{filtered.length > 1 ? 's' : ''})</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4 max-w-sm mx-auto animate-in zoom-in-95 duration-200">
          <h4 className="font-display font-bold text-slate-800 text-sm">Nouveau Paiement</h4>
          
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Élève concerné</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none transition font-medium" required>
              <option value="">Sélectionner l'élève</option>
              {students.map(s => {
                const isLate = overdueStudents.some(os => os.id === s.id);
                return (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} {isLate ? '⚠️ (En retard ce mois)' : '✓ (À jour)'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Montant (FCFA)</label>
            <input type="number" placeholder="Montant en FCFA" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500 transition font-mono font-bold" required />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Méthode de paiement</label>
            <select value={method} onChange={e => setMethod(e.target.value as Payment['method'])} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none transition font-medium">
              <option value="WAVE">Wave</option>
              <option value="ORANGE_MONEY">Orange Money</option>
              <option value="ESPECES">Espèces</option>
            </select>
          </div>

          <button type="submit" id="submit-add-pay-btn" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" /> Enregistrer le Paiement
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Référence</th>
                <th className="p-4">Élève</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Date</th>
                <th className="p-4">Méthode</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const std = students.find(s => s.id === p.studentId);
                const currentlyLate = overdueStudents.some(os => os.id === p.studentId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-slate-500">{p.reference}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      <div>
                        <span className="block font-bold text-slate-800">
                          {std ? `${std.firstName} ${std.lastName}` : 'Inconnu'}
                        </span>
                        {currentlyLate && (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-[8px] font-extrabold px-1.5 py-0.2 rounded-md mt-0.5 tracking-wide">
                            <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-rose-500" />
                            <span>Retard {currentMonthName}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{p.amount.toLocaleString()} FCFA</td>
                    <td className="p-4 text-slate-500">{p.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.method === 'ESPECES' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {p.method}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button id={`print-pay-receipt-${p.id}`} onClick={() => onViewPdf(p.id)} className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl transition font-semibold text-[10px] cursor-pointer">
                        <Printer className="w-3.5 h-3.5" /> Reçu PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

