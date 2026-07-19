import { ArrowLeft, QrCode, Download } from 'lucide-react';
import { Student, Level, Group, Assignment, Subject, Teacher, Payment } from '../../../../types';
import { AttendanceRecord, GradeRecord, ObservationRecord } from '../../domain/parentMockData';
import { StudentTimetable } from './StudentTimetable';
import { StudentAttendance } from './StudentAttendance';
import { StudentFinance } from './StudentFinance';
import { StudentGrades } from './StudentGrades';

interface ParentStudentDetailProps {
  student: Student;
  level?: Level;
  cardNumber: string;
  onBack: () => void;
  onShowCard: () => void;
  onShowPay: () => void;
  attendance: AttendanceRecord[];
  presenceRate: number;
  attendedCount: number;
  totalScheduledCount: number;
  retardCount: number;
  finance: {
    monthly: number;
    remains: number;
    limitDate: string;
    status: 'PAID' | 'UNPAID';
    history: Payment[];
  };
  grades: GradeRecord[];
  observations: ObservationRecord[];
  groups: Group[];
  assignments: Assignment[];
  subjects: Subject[];
  teachers: Teacher[];
  onViewReceiptPdf: (payId: string) => void;
  onViewStudentPdf: (id: string) => void;
  onSimulateScan: (id: string) => void;
}

export function ParentStudentDetail({
  student,
  level,
  cardNumber,
  onBack,
  onShowCard,
  onShowPay,
  attendance,
  presenceRate,
  attendedCount,
  totalScheduledCount,
  retardCount,
  finance,
  grades,
  observations,
  groups,
  assignments,
  subjects,
  teachers,
  onViewReceiptPdf,
  onViewStudentPdf,
  onSimulateScan
}: ParentStudentDetailProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left select-none text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={onBack} className="self-start inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-500 font-bold hover:bg-slate-100 px-3 py-1.5 rounded-xl transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour aux élèves
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => onSimulateScan(student.id)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer">
            <QrCode className="w-3.5 h-3.5 animate-pulse" /> Simuler scan QR Professeur
          </button>
          <button onClick={() => onViewStudentPdf(student.id)} className="bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Fiche Scolaire PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-display font-black text-xl uppercase shrink-0">
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-slate-800 text-lg">{student.firstName} {student.lastName}</h2>
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${student.sex === 'M' ? 'bg-sky-50 text-sky-600' : 'bg-pink-50 text-pink-600'}`}>
                {student.sex === 'M' ? 'Garçon' : 'Fille'}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] mt-0.5">
              Niveau : <span className="font-bold text-slate-600">{level?.name || 'Classe'}</span> | Identifiant unique : <span className="font-mono font-bold text-slate-600">{cardNumber}</span>
            </p>
            <p className="text-slate-400 text-[10.5px]">Inscrit le : 05 Janvier 2026</p>
          </div>
        </div>
        <button onClick={onShowCard} className="bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition cursor-pointer">
          <QrCode className="w-4 h-4" /> Voir la Carte Numérique
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-500" /> Emploi du temps hebdomadaire
          </h3>
          <StudentTimetable groups={groups} assignments={assignments} subjects={subjects} teachers={teachers} studentId={student.id} />
        </div>
        <StudentAttendance attendance={attendance} presenceRate={presenceRate} attendedCount={attendedCount} totalScheduledCount={totalScheduledCount} retardCount={retardCount} />
        <StudentFinance finance={finance} onOpenPay={onShowPay} onViewReceiptPdf={onViewReceiptPdf} />
        <StudentGrades grades={grades} observations={observations} />
      </div>
    </div>
  );
}
