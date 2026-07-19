import { PreinscriptionForm } from './PreinscriptionForm';
import { LandingHero } from './LandingHero';
import { PricingPrograms } from './PricingPrograms';
import { ParentSpace } from './ParentSpace';

interface VisitorSpaceContainerProps {
  db: any;
  state: any;
}

export function VisitorSpaceContainer({ db, state }: VisitorSpaceContainerProps) {
  const handleAddStudent = (std: any, parent: any) => {
    const parentId = `par-${Date.now()}`;
    db.parents.push({ id: parentId, ...parent });
    db.saveStudents([...db.students, { ...std, id: `std-${Date.now()}`, parentId }]);
  };

  if (state.isRegistering) {
    return (
      <PreinscriptionForm
        levels={db.levels}
        subjects={db.subjects}
        settings={db.settings}
        onSubmit={db.addPreinscription}
        onClose={() => {
          state.setIsRegistering(false);
          state.setSelectedOffer(null);
        }}
        initialLevelId={state.selectedOffer?.levelId}
        initialSubjectId={state.selectedOffer?.subjectId}
        initialCourseType={state.selectedOffer?.type}
      />
    );
  }

  return (
    <div className="space-y-6">
      {!state.isParentTab ? (
        <>
          <LandingHero settings={db.settings} onStartPreinscription={() => state.setIsRegistering(true)} onGoToParentSpace={() => state.setIsParentTab(true)} />
          <PricingPrograms settings={db.settings} subjects={db.subjects} levels={db.levels} courseOffers={db.courseOffers} onSelectOffer={(offer) => { state.setSelectedOffer(offer); state.setIsRegistering(true); }} />
        </>
      ) : (
        <ParentSpace
          parents={db.parents} students={db.students} assignments={db.assignments} groups={db.groups} payments={db.payments} levels={db.levels} subjects={db.subjects} teachers={db.teachers}
          onViewStudentPdf={(id) => state.setPdfModal({ isOpen: true, type: 'FICHE_ELEVE', studentId: id })}
          onViewPaymentPdf={(id) => state.setPdfModal({ isOpen: true, type: 'RECEIPT', paymentId: id })}
          isParentLoggedIn={state.isParentLoggedIn}
          onLogin={(phone) => {
            const cleanPhone = phone.trim().replace(/\s+/g, '');
            const found = db.parents.find((p: any) => p.phone.trim().replace(/\s+/g, '') === cleanPhone);
            if (found) { state.handleParentLogin(found.phone); return true; }
            return false;
          }}
          onLogout={state.activeUser?.logout} loggedInParentPhone={state.loggedInParentPhone} onOpenLoginModal={() => state.setIsLoginModalOpen(true)}
          onViewPublicSite={() => { state.setIsParentTab(false); state.setSpace('VISITEUR'); }}
          saveParents={db.saveParents} onUpdateParentPhone={state.setLoggedInParentPhone}
        />
      )}
    </div>
  );
}
