import { useSoutienScolaire } from './features/shared/hooks/useSoutienScolaire';
import { useAppState } from './features/shared/hooks/useAppState';
import { AppHeader } from './features/shared/components/AppHeader';
import { VisitorSpaceContainer } from './features/visitor/components/VisitorSpaceContainer';
import { ParentSpaceContainer } from './features/parent/ui/ParentSpaceContainer';
import { AdminSpaceContainer } from './features/admin/components/AdminSpaceContainer';
import { TeacherSpace } from './features/teacher/components/TeacherSpace';
import { AdminPdfModal } from './features/admin/components/AdminPdfModal';
import { AdminLogin } from './features/admin/components/AdminLogin';
import { LoginModal } from './features/shared/components/LoginModal';

export default function App() {
  const db = useSoutienScolaire();
  const state = useAppState(db);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <AppHeader
        centerName={db.settings.centerName} space={state.space} setSpace={state.setSpace}
        setIsParentTab={state.setIsParentTab} setIsRegistering={state.setIsRegistering}
        activeUser={state.activeUser} isUserMenuOpen={state.isUserMenuOpen} setIsUserMenuOpen={state.setIsUserMenuOpen}
        isInOwnSpace={state.isInOwnSpace} isParentTab={state.isParentTab} setIsLoginModalOpen={state.setIsLoginModalOpen}
        unreadCount={state.unreadCount} activeNotifications={state.activeNotifications}
        onNotificationClick={state.handleNotificationClick} onMarkAllRead={state.onMarkAllRead}
        simulatedTime={state.simulatedTime} setSimulatedTime={state.setSimulatedTime}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {state.space === 'VISITEUR' && (
          state.isParentTab ? (
            <ParentSpaceContainer
              parents={db.parents} students={db.students} assignments={db.assignments}
              groups={db.groups} payments={db.payments} levels={db.levels} subjects={db.subjects} teachers={db.teachers}
              preinscriptions={db.preinscriptions} addPreinscription={db.addPreinscription}
              loggedInParent={{ phone: state.loggedInParentPhone }} onLogout={state.activeUser?.logout || (() => {})}
              onUpdateParentPhone={(ph) => { state.setLoggedInParentPhone(ph); sessionStorage.setItem('loggedInParentPhone', ph); }}
              addPayment={db.addPayment} saveParents={db.saveParents}
              onViewReceiptPdf={(pid) => state.setPdfModal({ isOpen: true, type: 'RECEIPT', paymentId: pid })}
              onViewStudentPdf={(id) => state.setPdfModal({ isOpen: true, type: 'FICHE_ELEVE', studentId: id })}
              onRegisterOpenProfile={state.setOpenParentProfileCallback}
            />
          ) : (
            <VisitorSpaceContainer db={db} state={state} />
          )
        )}
        
        {state.space === 'TEACHER' && (
          <TeacherSpace
            db={db} loggedInTeacher={state.loggedInTeacher}
            onLogout={state.activeUser?.logout} onOpenLoginModal={() => state.setIsLoginModalOpen(true)}
            simulatedTime={state.simulatedTime} setSimulatedTime={state.setSimulatedTime}
            onUpdateTeacher={(updated) => { db.saveTeachers(db.teachers.map((t: any) => t.id === updated.id ? updated : t)); state.setLoggedInTeacher(updated); }}
            onRegisterOpenSettings={state.setOpenTeacherSettingsCallback}
          />
        )}

        {state.space === 'ADMIN' && (
          !state.isAdminLoggedIn ? (
            <AdminLogin onLoginSuccess={state.handleAdminLogin} />
          ) : (
            <AdminSpaceContainer db={db} state={state} />
          )
        )}
      </main>

      <AdminPdfModal
        isOpen={state.pdfModal.isOpen} onClose={() => state.setPdfModal(prev => ({ ...prev, isOpen: false }))}
        type={state.pdfModal.type} studentId={state.pdfModal.studentId} paymentId={state.pdfModal.paymentId}
        students={db.students} parents={db.parents} levels={db.levels} subjects={db.subjects}
        assignments={db.assignments} groups={db.groups} payments={db.payments} settings={db.settings}
      />

      <LoginModal
        isOpen={state.isLoginModalOpen} onClose={() => state.setIsLoginModalOpen(false)}
        parents={db.parents} teachers={db.teachers}
        onParentLoginSuccess={state.handleParentLogin} onTeacherLoginSuccess={state.handleTeacherLogin} onAdminLoginSuccess={state.handleAdminLogin}
        initialTab={state.loginModalTab}
      />
    </div>
  );
}
