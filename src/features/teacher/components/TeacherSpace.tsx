import React, { useEffect } from 'react';
import { Home, Calendar, Users, LogIn, Settings } from 'lucide-react';
import { TeacherHome } from './TeacherHome';
import { TeacherSchedule } from './TeacherSchedule';
import { TeacherClasses } from './TeacherClasses';
import { TeacherCourseDetail } from './TeacherCourseDetail';
import { TeacherSettings } from './TeacherSettings';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { useTeacherActions } from '../hooks/useTeacherActions';

interface TeacherProps {
  db: any;
  loggedInTeacher?: any;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
  simulatedTime: string;
  setSimulatedTime: (val: string) => void;
  onUpdateTeacher?: (updated: any) => void;
  onRegisterOpenSettings?: (opener: (() => void) | null) => void;
}

export const TeacherSpace: React.FC<TeacherProps> = ({
  db, loggedInTeacher, onLogout, onOpenLoginModal, simulatedTime, setSimulatedTime,
  onUpdateTeacher, onRegisterOpenSettings
}) => {
  const me = loggedInTeacher || null;

  if (!me) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-xs text-center mt-6">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-2xs"><Users className="w-6 h-6" /></div>
        <div className="space-y-2">
          <h3 className="font-display font-bold text-slate-800 text-base">Espace Enseignant</h3>
          <p className="text-slate-400 leading-relaxed">Veuillez vous connecter pour accéder à vos cours, classes et présences.</p>
        </div>
        <button id="teacher-open-popup-btn" onClick={onOpenLoginModal} className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-amber-500/20 cursor-pointer">
          <LogIn className="w-4 h-4" /> Se Connecter
        </button>
      </div>
    );
  }

  const dash = useTeacherDashboard(me, db.assignments, db.groups, db.students, db.subjects, simulatedTime, setSimulatedTime);
  const actions = useTeacherActions(me, db.attendanceHistory, db.saveAttendanceHistory, db.observationsHistory, db.saveObservationsHistory, db.notifications, db.saveNotifications, db.subjects);

  useEffect(() => {
    onRegisterOpenSettings?.(() => {
      dash.setActiveTab('PARAMETRES');
      dash.setSelectedCourseId(null);
    });
    return () => onRegisterOpenSettings?.(null);
  }, [dash.setActiveTab, dash.setSelectedCourseId, onRegisterOpenSettings]);

  const actCourse = db.assignments.find((a: any) => a.id === dash.selectedCourseId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 md:pb-8 text-xs select-none">
      <main className="min-h-[400px]">
        {actCourse ? (
          <TeacherCourseDetail course={actCourse} students={db.students} subjects={db.subjects} groups={db.groups} attendanceHistory={db.attendanceHistory} simulatedTime={dash.simulatedTime} onBack={() => dash.setSelectedCourseId(null)} onUpdateAttendance={actions.updateAttendance} onAddObservation={actions.addObservation} onScanQR={actions.scanQRCode} />
        ) : (
          <>
            {dash.activeTab === 'ACCUEIL' && <TeacherHome me={me} stats={dash.stats} nextCourse={dash.nextCourse} subjects={db.subjects} groups={db.groups} students={db.students} onSelectCourse={dash.handleSelectCourse} />}
            {dash.activeTab === 'SCHEDULE' && <TeacherSchedule myAssignments={dash.myAssignments} subjects={db.subjects} groups={db.groups} students={db.students} onSelectCourse={dash.handleSelectCourse} />}
            {dash.activeTab === 'CLASSES' && <TeacherClasses myGroups={dash.myGroups} myStudents={dash.myStudents} subjects={db.subjects} attendanceHistory={db.attendanceHistory} observationsHistory={db.observationsHistory} />}
            {dash.activeTab === 'PARAMETRES' && <TeacherSettings teacher={me} onUpdateTeacher={onUpdateTeacher || (() => {})} />}
          </>
        )}
      </main>

      {/* Bottom Navigation Menu */}
      {!actCourse && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-4 flex justify-around items-center md:hidden pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
          {[
            { id: 'ACCUEIL', label: 'Accueil', icon: Home },
            { id: 'SCHEDULE', label: 'Emploi du temps', icon: Calendar },
            { id: 'CLASSES', label: 'Mes classes', icon: Users },
            { id: 'PARAMETRES', label: 'Paramètres', icon: Settings },
          ].map(tab => {
            const active = dash.activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => dash.setActiveTab(tab.id as any)} className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer relative ${active ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
                <tab.icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px]">{tab.label}</span>
                {active && <span className="absolute bottom-0 w-1 h-1 bg-amber-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
