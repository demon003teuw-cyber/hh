import { Search, Users, ChevronRight, Calendar, CreditCard, UserPlus, Clock } from 'lucide-react';
import { Student, Level, Preinscription } from '../../../../types';

interface ParentStudentListProps {
  students: Student[];
  preinscriptions: Preinscription[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  levels: Level[];
  onSelectStudent: (id: string) => void;
  getChildNextCourse: (id: string) => { subject: string; schedule: string } | null;
  getChildPaymentSummary: (id: string) => { remains: number; [key: string]: any };
  onAddStudent: () => void;
}

export function ParentStudentList({
  students, preinscriptions, searchQuery, onSearchChange, levels, onSelectStudent,
  getChildNextCourse, getChildPaymentSummary, onAddStudent
}: ParentStudentListProps) {
  const filtered = students.filter(student => `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const pending = preinscriptions.filter(p => p.status === 'EN_ATTENTE');

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none text-xs">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center text-left">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Rechercher un de vos enfants..." value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 transition-all font-medium text-slate-700 text-xs"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[10px] font-bold text-slate-400 shrink-0">
            {filtered.length} élève{filtered.length > 1 ? 's' : ''} inscrit{filtered.length > 1 ? 's' : ''}
          </div>
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 transition cursor-pointer text-xs shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter un élève</span>
          </button>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-display font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Demandes d'inscription en attente d'approbation</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {pending.map(p => {
              const lvl = levels.find(l => l.id === p.levelId)?.name || 'Classe';
              return (
                <div key={p.id} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/70 flex justify-between items-center relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">{lvl}</span>
                    <h5 className="font-display font-bold text-slate-700 text-xs">{p.studentFirstName} {p.studentLastName}</h5>
                    <p className="text-[9px] text-slate-400 font-medium">Type : {p.courseType === 'GROUPE' ? 'En Groupe' : 'Individuel'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1 bg-amber-100/80 text-amber-800 text-[8.5px] font-bold px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
                      En attente d'approbation
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p>Aucun élève ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {filtered.map(student => {
            const level = levels.find(l => l.id === student.levelId);
            const nextCourse = getChildNextCourse(student.id);
            const finance = getChildPaymentSummary(student.id);

            return (
              <button
                key={student.id} onClick={() => onSelectStudent(student.id)}
                className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition duration-200 cursor-pointer text-left flex flex-col justify-between space-y-4 group w-full"
              >
                <div className="flex gap-4 items-start w-full">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-display font-black text-lg flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-all duration-200">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">{level?.name || 'Classe'}</span>
                    <h3 className="font-display font-black text-slate-800 text-sm mt-1 truncate leading-tight group-hover:text-sky-600 transition-all">{student.firstName} {student.lastName}</h3>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-sky-50 group-hover:text-sky-500 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100/70 text-[10px]">
                  <div className="space-y-1 min-w-0">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[8px]">Prochain cours</span>
                    {nextCourse ? (
                      <p className="font-bold text-slate-700 truncate flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{nextCourse.subject}</span>
                      </p>
                    ) : (
                      <p className="text-slate-400 italic">Aucun</p>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[8px]">Frais de scolarité</span>
                    <p className={`font-bold flex items-center gap-1 ${finance.remains > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      <CreditCard className="w-3.5 h-3.5 shrink-0" />
                      <span>{finance.remains === 0 ? 'À jour' : `${finance.remains.toLocaleString()} CFA`}</span>
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
