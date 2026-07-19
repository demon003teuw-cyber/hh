import { useState, useMemo } from 'react';
import { ActiveUser } from '../../../types';
import { initialSystemNotifications, AppNotification } from '../../parent/domain/parentMockData';

export function useAppState(db: any) {
  const [space, setSpace] = useState<'VISITEUR' | 'ADMIN' | 'TEACHER'>(() =>
    sessionStorage.getItem('isAdminLoggedIn') === 'true' ? 'ADMIN' :
    sessionStorage.getItem('loggedInTeacherId') ? 'TEACHER' : 'VISITEUR'
  );
  const [adminTab, setAdminTab] = useState('DASHBOARD');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => sessionStorage.getItem('isAdminLoggedIn') === 'true');
  const [isParentTab, setIsParentTab] = useState(() => sessionStorage.getItem('isParentLoggedIn') === 'true');
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(() => sessionStorage.getItem('isParentLoggedIn') === 'true');
  const [loggedInParentPhone, setLoggedInParentPhone] = useState(() => sessionStorage.getItem('loggedInParentPhone') || '');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'PARENT' | 'TEACHER' | 'ADMIN'>('PARENT');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState('2026-07-18T10:15:00');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialSystemNotifications);
  const [openParentProfileCallback, setOpenParentProfileCallback] = useState<(() => void) | null>(null);
  const [openTeacherSettingsCallback, setOpenTeacherSettingsCallback] = useState<(() => void) | null>(null);

  const [loggedInTeacher, setLoggedInTeacher] = useState<any>(() => {
    const saved = sessionStorage.getItem('loggedInTeacherId');
    return saved ? (db.teachers.find((t: any) => t.id === saved) || null) : null;
  });

  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; type: 'FICHE_ELEVE' | 'RECEIPT'; studentId?: string; paymentId?: string }>({ isOpen: false, type: 'FICHE_ELEVE' });

  const activeNotifications = useMemo(() =>
    isParentLoggedIn ? notifications.filter(n => n.id.startsWith('notif-')) :
    loggedInTeacher ? notifications.filter(n => n.id.startsWith('t-')) :
    isAdminLoggedIn ? notifications.filter(n => n.id.startsWith('a-')) : [],
    [notifications, isParentLoggedIn, loggedInTeacher, isAdminLoggedIn]
  );

  const unreadCount = useMemo(() => activeNotifications.filter(n => !n.isRead).length, [activeNotifications]);
  const handleNotificationClick = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const onMarkAllRead = () => {
    const activeIds = new Set(activeNotifications.map(n => n.id));
    setNotifications(prev => prev.map(n => activeIds.has(n.id) ? { ...n, isRead: true } : n));
  };

  const handleParentLogin = (phone: string) => {
    setIsParentLoggedIn(true); setLoggedInParentPhone(phone);
    sessionStorage.setItem('isParentLoggedIn', 'true'); sessionStorage.setItem('loggedInParentPhone', phone);
    setIsParentTab(true); setSpace('VISITEUR'); setIsLoginModalOpen(false);
  };

  const handleTeacherLogin = (teacher: any) => {
    setLoggedInTeacher(teacher); sessionStorage.setItem('loggedInTeacherId', teacher.id); setSpace('TEACHER'); setIsLoginModalOpen(false);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true); sessionStorage.setItem('isAdminLoggedIn', 'true'); setSpace('ADMIN'); setAdminTab('DASHBOARD'); setIsLoginModalOpen(false);
  };

  const activeUser: ActiveUser | null = isParentLoggedIn ? {
    name: db.parents.find((p: any) => p.phone.trim().replace(/\s+/g, '') === loggedInParentPhone.trim().replace(/\s+/g, ''))?.fullName || 'Parent',
    role: 'Espace Parent', initials: 'PR', bg: 'bg-sky-500', text: 'text-sky-500',
    action: () => { setIsParentTab(true); setSpace('VISITEUR'); setIsRegistering(false); },
    logout: () => {
      setIsParentLoggedIn(false); setLoggedInParentPhone('');
      sessionStorage.removeItem('isParentLoggedIn'); sessionStorage.removeItem('loggedInParentPhone');
      setIsParentTab(false); setIsRegistering(false);
    },
    settingsAction: openParentProfileCallback ? () => {
      setIsParentTab(true); setSpace('VISITEUR'); setIsRegistering(false);
      setTimeout(() => openParentProfileCallback(), 100);
    } : undefined
  } : loggedInTeacher ? {
    name: loggedInTeacher.fullName, role: 'Enseignant', initials: 'EN', bg: 'bg-amber-500', text: 'text-amber-500',
    action: () => { setSpace('TEACHER'); setIsParentTab(false); setIsRegistering(false); },
    logout: () => { setLoggedInTeacher(null); sessionStorage.removeItem('loggedInTeacherId'); setSpace('VISITEUR'); setIsParentTab(false); setIsRegistering(false); },
    settingsAction: openTeacherSettingsCallback ? () => {
      setSpace('TEACHER'); setIsParentTab(false); setIsRegistering(false);
      setTimeout(() => openTeacherSettingsCallback(), 100);
    } : undefined
  } : isAdminLoggedIn ? {
    name: db.settings.directorName || 'Directeur', role: 'Administrateur', initials: 'AD', bg: 'bg-rose-500', text: 'text-rose-500',
    action: () => { setSpace('ADMIN'); setIsParentTab(false); setIsRegistering(false); },
    logout: () => { setIsAdminLoggedIn(false); sessionStorage.removeItem('isAdminLoggedIn'); setSpace('VISITEUR'); setIsParentTab(false); setIsRegistering(false); },
    settingsAction: () => { setSpace('ADMIN'); setIsParentTab(false); setIsRegistering(false); setAdminTab('PARAMETRES'); }
  } : null;

  const isInOwnSpace = (isParentLoggedIn && isParentTab) || (!!loggedInTeacher && space === 'TEACHER') || (isAdminLoggedIn && space === 'ADMIN');
  const isUserLoggedIn = isParentLoggedIn || !!loggedInTeacher || isAdminLoggedIn;

  return {
    space, setSpace, adminTab, setAdminTab, isRegistering, setIsRegistering,
    selectedOffer, setSelectedOffer, isAdminLoggedIn, setIsAdminLoggedIn,
    isParentTab, setIsParentTab, isParentLoggedIn, setIsParentLoggedIn,
    loggedInParentPhone, setLoggedInParentPhone, isLoginModalOpen, setIsLoginModalOpen,
    isUserMenuOpen, setIsUserMenuOpen, loggedInTeacher, setLoggedInTeacher,
    pdfModal, setPdfModal, isUserLoggedIn, activeUser, isInOwnSpace,
    handleParentLogin, handleTeacherLogin, handleAdminLogin,
    unreadCount, activeNotifications, handleNotificationClick, onMarkAllRead,
    simulatedTime, setSimulatedTime, loginModalTab, setLoginModalTab,
    openParentProfileCallback, setOpenParentProfileCallback,
    openTeacherSettingsCallback, setOpenTeacherSettingsCallback
  };
}
