import React, { useState } from 'react';
import { ArrowLeft, Camera, CheckCircle, Users, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Assignment, Student, Subject, Group } from '../../../types';
import { StudentRow } from './StudentRow';
import { isScanAuthorized } from '../domain/courseMatcher';

interface TeacherCourseDetailProps {
  course: Assignment;
  students: Student[];
  subjects: Subject[];
  groups: Group[];
  attendanceHistory: any;
  simulatedTime: string;
  onBack: () => void;
  onUpdateAttendance: (student: Student, course: Assignment, status: 'PRESENT' | 'ABSENT' | 'RETARD', justification?: string) => void;
  onAddObservation: (student: Student, subjectName: string, text: string) => void;
  onScanQR: (cardNo: string, course: Assignment, students: Student[], simTime: string) => { success: boolean; studentName?: string; reason?: string };
}

export function TeacherCourseDetail({
  course, students, subjects, groups, attendanceHistory, simulatedTime, onBack, onUpdateAttendance, onAddObservation, onScanQR
}: TeacherCourseDetailProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [courseEnded, setCourseEnded] = useState(false);

  const subjectName = subjects.find(s => s.id === course.subjectId)?.name || 'Matière';
  const groupName = course.type === 'GROUPE' ? (groups.find(g => g.id === course.groupId)?.name || 'Classe') : 'Individuel';
  const courseStudents = course.type === 'INDIVIDUEL' ? students.filter(s => s.id === course.studentId) : students.filter(s => groups.find(g => g.id === course.groupId)?.studentIds.includes(s.id));

  const scanCheck = isScanAuthorized(course, simulatedTime);

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;
    const res = onScanQR(qrCodeInput.trim(), course, courseStudents, simulatedTime);
    if (res.success) {
      setScanResult({ success: true, msg: `✅ Scan réussi ! Présence de ${res.studentName} enregistrée.` });
      setQrCodeInput('');
    } else {
      setScanResult({ success: false, msg: `❌ Échec : ${res.reason}` });
    }
    setTimeout(() => setScanResult(null), 4000);
  };

  return (
    <div className="space-y-4 text-xs animate-fade-in pb-12">
      <button onClick={onBack} className="flex items-center gap-1.5 text-amber-600 font-bold hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> Retour
      </button>

      {courseEnded ? (
        <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md"><CheckCircle className="w-6 h-6" /></div>
          <h3 className="font-display font-bold text-slate-800 text-base">Félicitations ! Cours terminé.</h3>
          <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">Toutes les présences et les remarques ont été enregistrées et envoyées en temps réel aux parents.</p>
          <button onClick={onBack} className="bg-slate-900 text-white font-bold py-2 px-5 rounded-xl cursor-pointer hover:bg-slate-800">Retour au tableau de bord</button>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-850 space-y-3 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Détails du cours</span>
                <h2 className="font-display font-bold text-base mt-0.5">📚 {subjectName}</h2>
                <p className="text-slate-400 text-[10px] mt-1">🎯 {groupName} | 📍 {course.location}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.schedule}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button onClick={() => { if (!scanCheck.authorized) { alert(`Scan impossible : ${scanCheck.reason}`); return; } setShowScanner(!showScanner); }} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${showScanner ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                <Camera className="w-4 h-4" /> {showScanner ? 'Fermer le scan' : '📷 Scanner les présences'}
              </button>
              <button onClick={() => setCourseEnded(true)} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md">
                <CheckCircle className="w-4 h-4" /> ✅ Terminer le cours
              </button>
            </div>
          </div>

          {!scanCheck.authorized && (
            <div className="bg-rose-50 border border-rose-150 p-3 rounded-2xl text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Ce cours n'est pas disponible pour le scan : {scanCheck.reason}</span>
            </div>
          )}

          {showScanner && scanCheck.authorized && (
            <form onSubmit={handleSimulateScan} className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200/80 space-y-3 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Simulateur de Scan QR Code</span>
              <p className="text-slate-500 text-[10.5px]">Scannez virtuellement la carte en sélectionnant un élève ou saisissez son identifiant :</p>
              
              <div className="flex gap-2 max-w-sm mx-auto">
                <select value={qrCodeInput} onChange={e => setQrCodeInput(e.target.value)} className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-[11px] outline-none text-slate-700">
                  <option value="">-- Choisir un élève à scanner --</option>
                  {courseStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (SEN-2026-{s.id})</option>)}
                </select>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer text-xs">Scanner</button>
              </div>

              {scanResult && <p className={`text-[10px] font-bold ${scanResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>{scanResult.msg}</p>}
            </form>
          )}

          <div className="space-y-3">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Élèves de la classe ({courseStudents.length})</h3>
            <div className="space-y-3">
              {courseStudents.map(s => {
                const todayRecord = (attendanceHistory[s.id] || []).find((r: any) => r.subjectName === subjectName && r.date === new Date().toISOString().split('T')[0]);
                return (
                  <StudentRow key={s.id} student={s} currentStatus={todayRecord?.status} currentJustification={todayRecord?.justification} onUpdateStatus={(status: 'PRESENT' | 'ABSENT' | 'RETARD', just?: string) => onUpdateAttendance(s, course, status, just)} onAddObservation={text => onAddObservation(s, subjectName, text)} />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
