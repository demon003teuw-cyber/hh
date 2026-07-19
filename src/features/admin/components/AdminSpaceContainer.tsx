import React from 'react';
import { LayoutDashboard, Users, BookOpen, Receipt, Settings } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsersSection } from './AdminUsersSection';
import { AdminAssignments } from './AdminAssignments';
import { AdminFinanceSection } from './AdminFinanceSection';
import { AdminSettings } from './AdminSettings';
import { AdminMobileMenu } from './AdminMobileMenu';

interface AdminSpaceContainerProps {
  db: any;
  state: any;
}

export function AdminSpaceContainer({ db, state }: AdminSpaceContainerProps) {
  const handleAddStudent = (std: any, parent: any) => {
    const parentId = `par-${Date.now()}`;
    const newParent = { id: parentId, ...parent };
    db.saveParents([...db.parents, newParent]);

    const newStudent = { ...std, id: `std-${Date.now()}`, parentId };
    db.saveStudents([...db.students, newStudent]);
  };

  const tabs = [
    { id: 'DASHBOARD', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-sky-500' },
    { id: 'UTILISATEURS', label: 'Utilisateurs', icon: Users, color: 'text-indigo-500' },
    { id: 'COURS', label: 'Cours & Groupes', icon: BookOpen, color: 'text-amber-500' },
    { id: 'FINANCE', label: 'Finance', icon: Receipt, color: 'text-emerald-500' },
    { id: 'PARAMETRES', label: 'Paramètres', icon: Settings, color: 'text-slate-500' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Menu de Navigation Desktop */}
      <div className="hidden md:grid grid-cols-5 gap-3 bg-slate-100/70 p-3 rounded-2xl border border-slate-200/40 text-sm font-semibold text-slate-500">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = state.adminTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => state.setAdminTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.06)] font-bold border border-slate-100'
                  : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu de Navigation Mobile (Pill + Hamburger) */}
      <AdminMobileMenu tabs={tabs} activeTab={state.adminTab} setActiveTab={state.setAdminTab} />

      {state.adminTab === 'DASHBOARD' && <AdminDashboard students={db.students} teachers={db.teachers} parents={db.parents} preinscriptions={db.preinscriptions} payments={db.payments} onNavigateToTab={state.setAdminTab} onApprovePre={db.approvePreinscription} />}
      {state.adminTab === 'UTILISATEURS' && (
        <AdminUsersSection
          students={db.students}
          parents={db.parents}
          teachers={db.teachers}
          levels={db.levels}
          subjects={db.subjects}
          onAddStudent={handleAddStudent}
          onAddTeacher={db.addTeacher}
          onUpdateStudents={db.saveStudents}
          onUpdateParents={db.saveParents}
          onUpdateTeachers={db.saveTeachers}
          onViewPdf={id => state.setPdfModal({ isOpen: true, type: 'FICHE_ELEVE', studentId: id })}
        />
      )}
      {state.adminTab === 'COURS' && <AdminAssignments assignments={db.assignments} students={db.students} teachers={db.teachers} subjects={db.subjects} groups={db.groups} levels={db.levels} onAddAssignment={db.addAssignment} onAddGroup={db.addGroup} />}
      {state.adminTab === 'FINANCE' && <AdminFinanceSection payments={db.payments} students={db.students} parents={db.parents} levels={db.levels} onAddPayment={db.addPayment} onViewPdf={id => state.setPdfModal({ isOpen: true, type: 'RECEIPT', paymentId: id })} />}
      {state.adminTab === 'PARAMETRES' && (
        <AdminSettings
          settings={db.settings}
          onUpdateSettings={db.updateSettings}
          subjects={db.subjects}
          onUpdateSubjects={db.saveSubjects}
          levels={db.levels}
          onUpdateLevels={db.saveLevels}
          courseOffers={db.courseOffers}
          onUpdateCourseOffers={db.saveCourseOffers}
        />
      )}
    </div>
  );
}
