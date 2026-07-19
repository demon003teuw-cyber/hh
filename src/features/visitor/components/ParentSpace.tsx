import React, { useState, useMemo } from 'react';
import { 
  LogIn, Phone, Lock, ShieldAlert, Eye, EyeOff, User, Users, BookOpen, 
  Calendar, Clock, MapPin, Printer, LogOut, Download, FileText, 
  CheckCircle, UserCheck, Check, Home, Bell, ArrowLeft, ChevronRight, 
  XCircle, AlertCircle, CreditCard, QrCode, MessageSquare, Award, Search, 
  Sparkles, Loader2, DollarSign, RefreshCw
} from 'lucide-react';
import { Parent, Student, Assignment, Group, Payment, Level, Subject, Teacher } from '../../../types';

interface ParentSpaceProps {
  parents: Parent[];
  students: Student[];
  assignments: Assignment[];
  groups: Group[];
  payments: Payment[];
  levels: Level[];
  subjects: Subject[];
  teachers: Teacher[];
  onViewStudentPdf: (studentId: string) => void;
  onViewPaymentPdf: (paymentId: string) => void;
  isParentLoggedIn: boolean;
  onLogin: (phone: string) => boolean;
  onLogout: () => void;
  loggedInParentPhone: string;
  onOpenLoginModal?: () => void;
  onViewPublicSite?: () => void;
  saveParents?: (parents: Parent[]) => void;
  onUpdateParentPhone?: (phone: string) => void;
}

// Interne structures for high-fidelity interactive elements (not in standard types)
interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'RETARD';
  subjectName: string;
  time: string;
}

interface GradeRecord {
  subjectName: string;
  grades: number[];
  average: number;
  comment: string;
}

interface ObservationRecord {
  date: string;
  teacherName: string;
  subjectName: string;
  text: string;
}

interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  type: 'PAYMENT' | 'ATTENDANCE' | 'GRADE' | 'SYSTEM';
}

export const ParentSpace: React.FC<ParentSpaceProps> = ({
  parents,
  students,
  assignments,
  groups,
  payments,
  levels,
  subjects,
  teachers,
  onViewStudentPdf,
  onViewPaymentPdf,
  isParentLoggedIn,
  onLogin,
  onLogout,
  loggedInParentPhone,
  onOpenLoginModal,
  onViewPublicSite,
  saveParents,
  onUpdateParentPhone,
}) => {
  // Navigation Tabs: ACCUEIL or ELEVES (Only 2 tabs allowed in Bottom Nav as per request!)
  const [activeSection, setActiveSection] = useState<'ACCUEIL' | 'ELEVES'>('ACCUEIL');
  
  // Selection of a student to view full Fiche Élève
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Search query to filter students
  const [studentSearch, setStudentSearch] = useState('');

  // UI state for dropdowns & modals
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [paymentModalStudentId, setPaymentModalStudentId] = useState<string | null>(null);
  const [digitalCardStudentId, setDigitalCardStudentId] = useState<string | null>(null);

  // Profile forms state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Simulated Mobile Money payment states
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'ORANGE_MONEY'>('WAVE');
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: Loading/Validate, 3: Success

  // Find logged-in parent
  const currentParent = parents.find(
    p => p.phone.trim().replace(/\s+/g, '') === loggedInParentPhone.trim().replace(/\s+/g, '')
  );

  // Find parent's children
  const myChildren = useMemo(() => {
    return currentParent ? students.filter(s => s.parentId === currentParent.id) : [];
  }, [currentParent, students]);

  // High-Fidelity Mock Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Rappel : Frais de scolarité',
      body: 'Le paiement des frais du mois pour Fatou Diallo est en attente (10 000 FCFA).',
      date: '2026-07-19',
      time: '08:30',
      isRead: false,
      type: 'PAYMENT',
    },
    {
      id: 'notif-2',
      title: 'Présence enregistrée',
      body: 'Moussa Diallo a été validé présent au cours de Mathématiques par M. Mamadou Ba.',
      date: '2026-07-18',
      time: '10:05',
      isRead: false,
      type: 'ATTENDANCE',
    },
    {
      id: 'notif-3',
      title: 'Nouvelle note d\'évaluation',
      body: 'Moussa Diallo a obtenu un 16/20 en Mathématiques. Commentaire : "Excellent devoir !"',
      date: '2026-07-15',
      time: '14:20',
      isRead: true,
      type: 'GRADE',
    },
  ]);

  // High-Fidelity Mock Payments State (synced with actual payments + simulated additions)
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);

  // Attendance History per child
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, AttendanceRecord[]>>({
    'std-01': [ // Moussa Diallo
      { date: '2026-07-18', status: 'PRESENT', subjectName: 'Mathématiques', time: '10:05' },
      { date: '2026-07-11', status: 'PRESENT', subjectName: 'Mathématiques', time: '10:02' },
      { date: '2026-07-04', status: 'RETARD', subjectName: 'Mathématiques', time: '10:15' },
      { date: '2026-06-27', status: 'ABSENT', subjectName: 'Mathématiques', time: '--:--' },
    ],
    'std-02': [ // Fatou Diallo
      { date: '2026-07-15', status: 'PRESENT', subjectName: 'Français', time: '15:32' },
      { date: '2026-07-08', status: 'PRESENT', subjectName: 'Français', time: '15:30' },
      { date: '2026-07-01', status: 'PRESENT', subjectName: 'Français', time: '15:31' },
    ]
  });

  // Grades per child
  const [gradesHistory, setGradesHistory] = useState<Record<string, GradeRecord[]>>({
    'std-01': [ // Moussa
      { subjectName: 'Mathématiques', grades: [15, 14, 16], average: 15.0, comment: 'Très actif, logique solide.' },
      { subjectName: 'Physique-Chimie', grades: [12, 13, 14], average: 13.0, comment: 'Bon travail, régulier.' },
      { subjectName: 'Français', grades: [11, 13], average: 12.0, comment: 'En progrès constant.' }
    ],
    'std-02': [ // Fatou
      { subjectName: 'Français', grades: [16, 17, 15], average: 16.0, comment: 'Élève modèle, expression écrite excellente.' },
      { subjectName: 'Mathématiques', grades: [12, 14], average: 13.0, comment: 'Bonne volonté, continue l\'effort.' }
    ]
  });

  // Observations from Teachers per child
  const [observationsHistory, setObservationsHistory] = useState<Record<string, ObservationRecord[]>>({
    'std-01': [
      { date: '2026-07-12', teacherName: 'M. Mamadou Ba', subjectName: 'Mathématiques', text: 'Moussa a fait d\'immenses progrès en géométrie. Il doit continuer à participer ainsi.' }
    ],
    'std-02': [
      { date: '2026-07-14', teacherName: 'Mme Aissatou Sow', subjectName: 'Français', text: 'Fatou est extrêmement attentive et apporte des réponses pertinentes. C\'est un plaisir de l\'avoir en classe.' }
    ]
  });

  // Static digital card info
  const studentCardNumbers: Record<string, string> = {
    'std-01': 'SEN-2026-9821-M',
    'std-02': 'SEN-2026-7734-F',
    'std-03': 'SEN-2026-4412-M'
  };

  // Static fees configurations
  const studentFees: Record<string, { monthly: number, limitDate: string }> = {
    'std-01': { monthly: 15000, limitDate: '05 Août 2026' },
    'std-02': { monthly: 10000, limitDate: '05 Août 2026' },
    'std-03': { monthly: 45000, limitDate: '05 Août 2026' }
  };

  // Helper for computing child's financial summary
  const getChildPaymentSummary = (studentId: string) => {
    const fees = studentFees[studentId] || { monthly: 15000, limitDate: '05 Août 2026' };
    const myPayments = localPayments.filter(p => p.studentId === studentId);
    const paidTotal = myPayments.reduce((sum, p) => sum + p.amount, 0);
    // Let's assume the current month fee is the target
    const currentMonthTarget = fees.monthly;
    const remains = Math.max(0, currentMonthTarget - paidTotal);
    const status = remains === 0 ? 'PAID' : 'PENDING';
    
    return {
      monthly: fees.monthly,
      paid: paidTotal,
      remains: remains,
      status: status,
      limitDate: fees.limitDate,
      history: myPayments
    };
  };

  // Compute next courses for a child
  const getChildNextCourse = (studentId: string) => {
    // Check group schedules
    const studentGroups = groups.filter(g => g.studentIds.includes(studentId));
    if (studentGroups.length > 0) {
      const g = studentGroups[0];
      const sub = subjects.find(s => s.id === g.subjectId);
      return {
        subject: sub?.name || 'Cours',
        schedule: g.schedule,
        room: g.room,
        type: 'Groupe'
      };
    }
    // Check individual schedules
    const individualAsg = assignments.find(a => a.type === 'INDIVIDUEL' && a.studentId === studentId);
    if (individualAsg) {
      const sub = subjects.find(s => s.id === individualAsg.subjectId);
      return {
        subject: sub?.name || 'Cours',
        schedule: individualAsg.schedule,
        room: individualAsg.location,
        type: 'Individuel'
      };
    }
    return null;
  };

  // Notifications Helpers
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // QR Scanning Simulation - Professor scans card
  const handleSimulateQRScan = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');

    // Find a course for this student to make the mock attendance realistic
    const nextCourse = getChildNextCourse(studentId);
    const subjectName = nextCourse?.subject || 'Cours de Soutien';

    // 1. Add attendance record
    const newRecord: AttendanceRecord = {
      date: dateStr,
      status: 'PRESENT',
      subjectName: subjectName,
      time: timeStr
    };

    setAttendanceHistory(prev => ({
      ...prev,
      [studentId]: [newRecord, ...(prev[studentId] || [])]
    }));

    // 2. Add real-time notification
    const newNotif: AppNotification = {
      id: `notif-scan-${Date.now()}`,
      title: 'Scan QR - Arrivée validée',
      body: `Votre enfant ${student.firstName} est arrivé à son cours de ${subjectName} à ${timeStr}.`,
      date: dateStr,
      time: timeStr,
      isRead: false,
      type: 'ATTENDANCE'
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Show temporary banner / Toast notification
    alert(`📢 [Notification Parent] : Votre enfant ${student.firstName} est arrivé à son cours de ${subjectName} à ${timeStr} !`);
  };

  // Simulated Mobile Money payment execution
  const handleExecutePayment = (studentId: string) => {
    if (!paymentPhoneNumber) {
      alert("Veuillez saisir votre numéro de téléphone pour la transaction.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStep(2);

    // Simulate multi-step network loading (WAVE / ORANGE MONEY integration)
    setTimeout(() => {
      // Step 2 complete: trigger success
      const fees = studentFees[studentId] || { monthly: 15000 };
      const finance = getChildPaymentSummary(studentId);
      const student = students.find(s => s.id === studentId);

      const newPay: Payment = {
        id: `pay-sim-${Date.now()}`,
        studentId: studentId,
        amount: finance.remains,
        date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
        method: paymentMethod,
        reference: `${paymentMethod === 'WAVE' ? 'WV' : 'OM'}-PAY-${Math.floor(1000 + Math.random() * 9000)}`
      };

      // Update payments array
      setLocalPayments(prev => [...prev, newPay]);

      // Add a notification
      const newNotif: AppNotification = {
        id: `notif-pay-${Date.now()}`,
        title: 'Paiement enregistré avec succès',
        body: `Le reçu pour le paiement de ${newPay.amount.toLocaleString()} FCFA pour ${student?.firstName} a été validé.`,
        date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'PAYMENT'
      };

      setNotifications(prev => [newNotif, ...prev]);
      
      setPaymentStep(3);
      setIsProcessingPayment(false);
    }, 2000);
  };

  const handleOpenPaymentModal = (studentId: string) => {
    if (currentParent) {
      setPaymentPhoneNumber(currentParent.phone);
    }
    setPaymentMethod('WAVE');
    setPaymentStep(1);
    setPaymentModalStudentId(studentId);
  };

  // Profile management
  const handleOpenProfileModal = () => {
    if (currentParent) {
      setProfileName(currentParent.fullName);
      setProfilePhone(currentParent.phone);
      setProfileWhatsapp(currentParent.whatsapp || '');
      setProfileAddress(currentParent.address);
      setProfileSuccess('');
      setShowProfileModal(true);
    }
  };

  const executeProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentParent || !saveParents) return;

    setIsSavingProfile(true);
    setProfileSuccess('');

    const updatedParents = parents.map(p => {
      if (p.id === currentParent.id) {
        return {
          ...p,
          fullName: profileName,
          phone: profilePhone,
          whatsapp: profileWhatsapp,
          address: profileAddress
        };
      }
      return p;
    });

    saveParents(updatedParents);

    if (onUpdateParentPhone && profilePhone !== currentParent.phone) {
      onUpdateParentPhone(profilePhone);
    }

    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSuccess('Votre profil parent a été mis à jour !');
      setTimeout(() => {
        setShowProfileModal(false);
      }, 1000);
    }, 600);
  };

  // Filter students based on search
  const filteredChildren = myChildren.filter(student => {
    const searchString = `${student.firstName} ${student.lastName}`.toLowerCase();
    return searchString.includes(studentSearch.toLowerCase());
  });

  // Calculate overall metrics for Dashboard
  const activeEnrolledCount = myChildren.length;
  
  // Find next global course among all children
  const nextGlobalCourse = useMemo(() => {
    for (const child of myChildren) {
      const course = getChildNextCourse(child.id);
      if (course) {
        return { ...course, childName: child.firstName };
      }
    }
    return null;
  }, [myChildren, groups, assignments]);

  // Total pending amount for all children
  const totalPendingPayments = useMemo(() => {
    return myChildren.reduce((sum, child) => {
      return sum + getChildPaymentSummary(child.id).remains;
    }, 0);
  }, [myChildren, localPayments]);


  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 md:pb-8 text-xs select-none">
      
      {/* 1. CUSTOM REDESIGNED APPBAR (Header) */}
      <header className="bg-white px-5 py-4 rounded-3xl border border-slate-100 shadow-xs flex justify-between items-center relative z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-display font-extrabold text-base shadow-md shadow-sky-500/25">
            SS
          </div>
          <div>
            <h1 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider">Soutien Élite</h1>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Espace Parent
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 relative">
          {/* Notifications Button */}
          <button 
            id="appbar-notif-btn"
            onClick={() => {
              setShowNotificationsDropdown(!showNotificationsDropdown);
              setShowProfileDropdown(false);
            }}
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50 flex items-center justify-center relative transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[8px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown Button */}
          <button 
            id="appbar-profile-btn"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotificationsDropdown(false);
            }}
            className="h-10 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50 flex items-center gap-2 transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 font-bold flex items-center justify-center uppercase">
              {currentParent.fullName.charAt(0)}
            </div>
            <span className="hidden sm:inline font-bold text-[11px] text-slate-600 max-w-[100px] truncate">{currentParent.fullName}</span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotificationsDropdown && (
            <div className="absolute right-12 top-12 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-sky-500" /> Notifications
                </span>
                {unreadNotificationsCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-sky-500 hover:underline font-bold"
                  >
                    Tout lire
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Aucune notification.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        n.isRead 
                          ? 'bg-slate-50/50 border-slate-100 text-slate-500' 
                          : 'bg-sky-50/20 border-sky-100 hover:bg-sky-50/40 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`font-bold text-[10px] ${!n.isRead ? 'text-slate-800' : 'text-slate-500'}`}>{n.title}</span>
                        <span className="text-[8px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[9px] mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Popup Menu (Dropdown) */}
          {showProfileDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-700">
              <div className="px-3.5 py-2 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Mon Espace
              </div>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  handleOpenProfileModal();
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition flex items-center gap-2 font-semibold text-slate-700 cursor-pointer text-xs"
              >
                <UserCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Mon Profil</span>
              </button>
              
              {onViewPublicSite && (
                <button 
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onViewPublicSite();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition flex items-center gap-2 font-semibold text-slate-700 cursor-pointer text-xs border-t border-slate-100"
                >
                  <Eye className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Mode Visiteur</span>
                </button>
              )}

              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  onLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 text-rose-600 transition flex items-center gap-2 font-bold cursor-pointer text-xs border-t border-slate-100"
              >
                <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. CHOSEN MAIN VIEW PANEL */}
      <main className="min-h-[400px]">
        {/* VIEW A: DASHBOARD (ACCUEIL) */}
        {activeSection === 'ACCUEIL' && !selectedStudentId && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Welcome banner */}
            <div className="bg-linear-to-r from-sky-600 to-sky-700 text-white p-6 rounded-3xl shadow-xs relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                <Users className="w-64 h-64" />
              </div>
              <div className="space-y-1.5 relative z-10">
                <span className="bg-white/15 text-white/90 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-white/10">
                  Sénégal - Dakar
                </span>
                <h2 className="font-display font-black text-lg md:text-xl">Bonjour, {currentParent.fullName} 👋</h2>
                <p className="text-sky-100 text-[10px] max-w-md leading-relaxed">
                  Bienvenue sur votre tableau de bord simplifié. Suivez en temps réel l'excellence académique de vos enfants.
                </p>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Students count */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Élèves inscrits</p>
                  <p className="text-lg font-black text-slate-800">{activeEnrolledCount} enfant{activeEnrolledCount > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Card 2: Next Course */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prochain cours</p>
                  {nextGlobalCourse ? (
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{nextGlobalCourse.childName} - {nextGlobalCourse.subject}</p>
                      <p className="text-[9px] text-slate-500 truncate font-medium">{nextGlobalCourse.schedule}</p>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-500">Aucun cours planifié</p>
                  )}
                </div>
              </div>

              {/* Card 3: Pending Payments */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reste à payer</p>
                  <p className={`text-lg font-black ${totalPendingPayments > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {totalPendingPayments.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent notifications feed */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-sky-500" /> Dernières notifications
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400">En direct</span>
                </div>

                <div className="space-y-3">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'PAYMENT' && <CreditCard className="w-4 h-4 text-amber-500" />}
                        {n.type === 'ATTENDANCE' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {n.type === 'GRADE' && <Award className="w-4 h-4 text-sky-500" />}
                        {n.type === 'SYSTEM' && <AlertCircle className="w-4 h-4 text-indigo-500" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-slate-700 text-[10.5px]">{n.title}</span>
                          <span className="text-[8px] text-slate-400 font-mono">{n.date} à {n.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{n.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Shortcut to Pupils */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">Fiches Scolaires des Élèves</h3>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Visualisez instantanément l'emploi du temps complet, le taux de présence certifié QR Code, les relevés de notes mensuels et téléchargez la carte numérique officielle de vos enfants.
                  </p>
                </div>

                <button
                  id="dash-shortcut-kids-btn"
                  onClick={() => setActiveSection('ELEVES')}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md shadow-sky-500/10"
                >
                  <span>Accéder à mes enfants</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW B: MY STUDENTS LIST (MES ELEVES) */}
        {activeSection === 'ELEVES' && !selectedStudentId && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Toolbar search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  id="pupil-search-bar"
                  type="text" 
                  placeholder="Rechercher un de vos enfants..." 
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 transition-all font-medium text-slate-700 text-xs"
                />
              </div>

              <div className="text-[10px] font-bold text-slate-400 shrink-0">
                {filteredChildren.length} élève{filteredChildren.length > 1 ? 's' : ''} trouvé{filteredChildren.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Students list */}
            {filteredChildren.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p>Aucun élève ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredChildren.map(student => {
                  const level = levels.find(l => l.id === student.levelId);
                  const nextCourse = getChildNextCourse(student.id);
                  const finance = getChildPaymentSummary(student.id);

                  return (
                    <div 
                      key={student.id}
                      id={`student-list-card-${student.id}`}
                      onClick={() => setSelectedStudentId(student.id)}
                      className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition duration-200 cursor-pointer text-left flex flex-col justify-between space-y-4 group"
                    >
                      {/* Top detail */}
                      <div className="flex gap-4 items-start">
                        {/* Avatar photo placeholder */}
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-display font-black text-base uppercase shrink-0">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-sky-500 transition">
                            {student.firstName} {student.lastName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold text-[8px] uppercase">
                              {level?.name || 'Classe'}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              Né(e) le {student.birthDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course preview */}
                      <div className="bg-slate-50/70 p-3 rounded-2xl space-y-1 text-[10px]">
                        <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Prochain cours programmé</span>
                        {nextCourse ? (
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-bold text-slate-700 truncate">{nextCourse.subject}</span>
                            <span className="text-slate-500 font-medium shrink-0 font-mono">{nextCourse.schedule}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Aucun cours planifié</span>
                        )}
                      </div>

                      {/* Statuses and CTA */}
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5">
                          {finance.status === 'PAID' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[8px] font-bold">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" /> À jour
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[8px] font-bold">
                              <span className="w-1 h-1 rounded-full bg-amber-500" /> Reste {finance.remains.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-sky-500 font-bold group-hover:translate-x-1 transition flex items-center gap-0.5">
                          Voir dossier <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW C: DETAILED STUDENT DOSSIER (FICHE ELEVE) - ACCESSIBLE IN 1 CLICK */}
        {selectedStudentId && (
          (() => {
            const student = students.find(s => s.id === selectedStudentId);
            if (!student) {
              setSelectedStudentId(null);
              return null;
            }

            const level = levels.find(l => l.id === student.levelId);
            const finance = getChildPaymentSummary(student.id);
            const timetable = groups.filter(g => g.studentIds.includes(student.id));
            const indivTimetable = assignments.filter(a => a.type === 'INDIVIDUEL' && a.studentId === student.id);
            
            // Attendance metrics
            const att = attendanceHistory[student.id] || [];
            const attendedCount = att.filter(a => a.status === 'PRESENT' || a.status === 'RETARD').length;
            const totalScheduledCount = att.length;
            const presenceRate = totalScheduledCount > 0 
              ? Math.round((attendedCount / totalScheduledCount) * 100) 
              : 100;

            const grades = gradesHistory[student.id] || [];
            const obs = observationsHistory[student.id] || [];
            const cardNumber = studentCardNumbers[student.id] || `SEN-2026-0000-${student.sex}`;

            return (
              <div className="space-y-6 animate-in fade-in duration-200 text-left">
                
                {/* Back button and profile title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button 
                    onClick={() => setSelectedStudentId(null)}
                    className="self-start inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-500 font-bold hover:bg-slate-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour aux élèves
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateQRScan(student.id)}
                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 animate-pulse" /> Simuler scan QR Professeur
                    </button>
                    
                    <button
                      onClick={() => onViewStudentPdf(student.id)}
                      className="bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Fiche Scolaire PDF
                    </button>
                  </div>
                </div>

                {/* Main pupil banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-display font-black text-xl uppercase shrink-0">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display font-black text-slate-800 text-lg">
                          {student.firstName} {student.lastName}
                        </h2>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${student.sex === 'M' ? 'bg-sky-50 text-sky-600' : 'bg-pink-50 text-pink-600'}`}>
                          {student.sex === 'M' ? 'Garçon' : 'Fille'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5">
                        Niveau : <span className="font-bold text-slate-600">{level?.name || 'CI'}</span> | Identifiant unique : <span className="font-mono font-bold text-slate-600">{cardNumber}</span>
                      </p>
                      <p className="text-slate-400 text-[10.5px]">Inscrit le : 05 Janvier 2026</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDigitalCardStudentId(student.id)}
                    className="bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 px-4 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" /> Voir la Carte Numérique
                  </button>
                </div>

                {/* Sub-sections grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* SECTION 1: EMPLOI DU TEMPS */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-500" /> Emploi du temps hebdomadaire
                    </h3>

                    {timetable.length === 0 && indivTimetable.length === 0 ? (
                      <p className="text-slate-400 italic text-[10px] py-4">Aucun cours planifié pour cet élève.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {/* Group courses */}
                        {timetable.map(group => {
                          const sub = subjects.find(s => s.id === group.subjectId);
                          const teach = teachers.find(t => t.id === group.teacherId);
                          return (
                            <div key={group.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-800 text-[11px]">{sub?.name}</span>
                                <p className="text-slate-400 text-[9px]">Professeur : <span className="font-bold text-slate-500">{teach?.fullName}</span></p>
                                <p className="text-slate-400 text-[9px] flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {group.room}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="bg-sky-50 text-sky-600 border border-sky-100 px-1.5 py-0.5 rounded font-extrabold text-[7.5px] uppercase tracking-wider">Groupe</span>
                                <p className="text-slate-700 font-bold font-mono text-[10px] mt-1">{group.schedule}</p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Individual courses */}
                        {indivTimetable.map(asg => {
                          const sub = subjects.find(s => s.id === asg.subjectId);
                          const teach = teachers.find(t => t.id === asg.teacherId);
                          return (
                            <div key={asg.id} className="p-3 bg-emerald-50/10 rounded-2xl border border-emerald-100 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-800 text-[11px]">{sub?.name}</span>
                                <p className="text-slate-400 text-[9px]">Professeur : <span className="font-bold text-slate-500">{teach?.fullName}</span></p>
                                <p className="text-slate-400 text-[9px] flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {asg.location}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-extrabold text-[7.5px] uppercase tracking-wider">Individuel</span>
                                <p className="text-slate-700 font-bold font-mono text-[10px] mt-1">{asg.schedule}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: PRESENCES */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Présences & Ponctualité
                      </h3>
                      
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Taux {presenceRate}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Cours suivis</span>
                        <p className="text-sm font-black text-slate-700 font-mono">{attendedCount} / {totalScheduledCount}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Retards constatés</span>
                        <p className="text-sm font-black text-amber-600 font-mono">
                          {att.filter(a => a.status === 'RETARD').length}
                        </p>
                      </div>
                    </div>

                    {/* Timeline list */}
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {att.length === 0 ? (
                        <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucun enregistrement de présence.</p>
                      ) : (
                        att.map((record, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              {record.status === 'PRESENT' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                              {record.status === 'RETARD' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                              {record.status === 'ABSENT' && <XCircle className="w-4 h-4 text-rose-500" />}
                              <div>
                                <span className="font-bold text-slate-700 text-[10.5px]">{record.subjectName}</span>
                                <span className="text-slate-400 text-[8.5px] block font-mono">Le {record.date} à {record.time}</span>
                              </div>
                            </div>

                            <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                              record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                              record.status === 'RETARD' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {record.status === 'PRESENT' ? 'Présent' : record.status === 'RETARD' ? 'Retard' : 'Absent'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: PAIEMENT */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-sky-500" /> Frais & Scolarité
                      </h3>
                      
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        finance.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {finance.status === 'PAID' ? 'À JOUR' : 'IMPAYÉ'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-2xl">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">Frais Mensuels</span>
                        <p className="text-sm font-black text-slate-700 font-mono">{finance.monthly.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">Reste à payer</span>
                        <p className={`text-sm font-black font-mono ${finance.remains > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {finance.remains.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                      <span>Date limite de règlement : <strong>{finance.limitDate}</strong></span>
                    </div>

                    {finance.remains > 0 ? (
                      <button
                        onClick={() => handleOpenPaymentModal(student.id)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
                      >
                        <CreditCard className="w-4 h-4" /> 💳 Payer maintenant
                      </button>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-[10.5px] border border-emerald-100 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500" /> Aucun solde débiteur pour ce mois.
                      </div>
                    )}

                    {/* Payments history list */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Historique des reçus</span>
                      {finance.history.length === 0 ? (
                        <p className="text-slate-400 italic text-[10px] pl-2">Aucun reçu de paiement enregistré.</p>
                      ) : (
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {finance.history.map(p => (
                            <div key={p.id} className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center text-[10px]">
                              <div>
                                <span className="font-bold text-slate-700">{p.amount.toLocaleString()} FCFA</span>
                                <p className="text-[8.5px] text-slate-400 font-mono">Réf: {p.reference} | {p.date}</p>
                              </div>
                              <button 
                                onClick={() => onViewPaymentPdf(p.id)}
                                className="text-[10px] font-bold text-sky-500 hover:text-sky-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" /> Reçu PDF
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: RESULTATS */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" /> Évaluations & Notes
                    </h3>

                    {grades.length === 0 ? (
                      <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucune note saisie pour l'instant.</p>
                    ) : (
                      <div className="space-y-3">
                        {grades.map((g, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-800 text-[11px]">{g.subjectName}</span>
                              <div className="flex flex-wrap gap-1">
                                {g.grades.map((grd, gIdx) => (
                                  <span key={gIdx} className="bg-white border border-slate-200 text-slate-700 font-bold font-mono px-1.5 py-0.5 rounded text-[10px]">
                                    {grd}/20
                                  </span>
                                ))}
                              </div>
                              <p className="text-[9.5px] text-slate-500 italic">"{g.comment}"</p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[8px] text-slate-400 block font-bold uppercase">Moyenne</span>
                              <span className="text-xs font-black text-sky-600 font-mono">{g.average.toFixed(1)}/20</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 5: OBSERVATIONS */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 md:col-span-2">
                    <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-500" /> Observations des enseignants
                    </h3>

                    {obs.length === 0 ? (
                      <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucune observation enregistrée.</p>
                    ) : (
                      <div className="space-y-3">
                        {obs.map((o, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                            <div className="flex justify-between items-center text-[9px] text-slate-400">
                              <span className="font-bold text-slate-500">{o.teacherName} ({o.subjectName})</span>
                              <span className="font-mono">{o.date}</span>
                            </div>
                            <p className="text-slate-600 text-[10.5px] leading-relaxed italic">
                              "{o.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })()
        )}
      </main>

      {/* 3. PWA BOTTOM NAVIGATION BAR (MAXIMUM 2 items, fully compliant with rules) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-4 flex justify-around items-center md:hidden pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
        {/* TAB 1: ACCUEIL */}
        <button
          id="pwa-bottom-tab-accueil"
          onClick={() => {
            setActiveSection('ACCUEIL');
            setSelectedStudentId(null);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer relative ${
            activeSection === 'ACCUEIL' && !selectedStudentId
              ? 'text-sky-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[9px]">Accueil</span>
          {activeSection === 'ACCUEIL' && !selectedStudentId && (
            <span className="absolute bottom-0 w-1 h-1 bg-sky-500 rounded-full" />
          )}
        </button>

        {/* TAB 2: MES ELEVES */}
        <button
          id="pwa-bottom-tab-eleves"
          onClick={() => {
            setActiveSection('ELEVES');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer relative ${
            activeSection === 'ELEVES' || selectedStudentId
              ? 'text-sky-500 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-5 h-5 shrink-0" />
          <span className="text-[9px]">Mes élèves</span>
          {(activeSection === 'ELEVES' || selectedStudentId) && (
            <span className="absolute bottom-0 w-1 h-1 bg-sky-500 rounded-full" />
          )}
        </button>
      </div>

      {/* 4. MODALS & DIALOGS */}

      {/* MODAL A: PROFILE UPDATE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <UserCheck className="text-sky-500 w-4 h-4" /> Mon Profil Parent
                </h3>
                <p className="text-slate-400 text-[9px]">Gérez vos coordonnées de contact pour les cours.</p>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {profileSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={executeProfileUpdate} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nom Complet Parent</label>
                <input
                  id="profile-name-modal-input"
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl px-3.5 py-2 transition outline-none font-medium text-slate-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Adresse de résidence</label>
                <input
                  id="profile-address-modal-input"
                  type="text"
                  required
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl px-3.5 py-2 transition outline-none font-medium text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Téléphone (Sert de Login)</label>
                  <input
                    id="profile-phone-modal-input"
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl px-3.5 py-2 transition outline-none font-bold text-slate-800 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Numéro WhatsApp</label>
                  <input
                    id="profile-whatsapp-modal-input"
                    type="text"
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl px-3.5 py-2 transition outline-none font-bold text-slate-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer text-[10px]"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition flex items-center gap-1 cursor-pointer text-[10px] shadow-sm"
                >
                  {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL B: DIGITAL ID CARD PREVIEW WITH QR CODE */}
      {digitalCardStudentId && (
        (() => {
          const student = students.find(s => s.id === digitalCardStudentId);
          if (!student) return null;
          
          const level = levels.find(l => l.id === student.levelId);
          const cardNo = studentCardNumbers[student.id] || `SEN-2026-0000-${student.sex}`;

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-150">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-display font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-sky-500" /> Carte Officielle de l'Élève
                  </span>
                  <button 
                    onClick={() => setDigitalCardStudentId(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Styled School Badge Card (Google Material / Apple aesthetic) */}
                <div className="bg-linear-to-b from-sky-600 to-sky-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden text-left border border-sky-700">
                  {/* Decorative element */}
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-y-2 translate-x-2">
                    <Sparkles className="w-32 h-32" />
                  </div>

                  {/* Header Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-display font-black text-[11px] uppercase tracking-wider text-white">Soutien Scolaire d'Élite</h4>
                      <p className="text-[7.5px] text-sky-200 uppercase font-bold tracking-widest">Dakar, Sénégal</p>
                    </div>
                    <span className="bg-white/15 text-white border border-white/25 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase font-mono">
                      Carte Numérique
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex items-start gap-3.5">
                    {/* ID Photo Placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-white text-sky-700 flex items-center justify-center font-display font-black text-2xl shadow-inner border border-sky-400 shrink-0">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <p className="text-[8px] uppercase text-sky-200 font-bold tracking-wider">Nom de l'élève</p>
                      <h3 className="font-display font-black text-[13px] tracking-tight leading-tight truncate">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-[8px] uppercase text-sky-200 font-bold tracking-wider mt-1.5">Niveau d'étude</p>
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[8.5px] font-bold font-sans">
                        {level?.name || 'Classe'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Part with Secured QR Code and ID No */}
                  <div className="mt-5 pt-3.5 border-t border-white/15 flex justify-between items-end">
                    <div>
                      <p className="text-[7.5px] uppercase text-sky-200 font-bold tracking-wider">Identifiant ID unique</p>
                      <p className="font-mono font-black text-[9.5px] text-white tracking-widest">{cardNo}</p>
                      <p className="text-[7px] text-sky-200 mt-0.5 italic">Validité : Année Scolaire 2025-2026</p>
                    </div>

                    {/* Highly aesthetic inline custom SVG QR code mock */}
                    <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-sm shrink-0 flex items-center justify-center">
                      <svg className="w-14 h-14 text-slate-950" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H7V7H0V0ZM2 2V5H5V2H2Z" fill="currentColor"/>
                        <path d="M22 0H29V7H22V0ZM24 2V5H27V2H24Z" fill="currentColor"/>
                        <path d="M0 22H7V29H0V22ZM2 24V27H5V24H2Z" fill="currentColor"/>
                        <path d="M10 0H12V4H10V0Z" fill="currentColor"/>
                        <path d="M14 0H18V2H14V0Z" fill="currentColor"/>
                        <path d="M10 6H14V8H10V6Z" fill="currentColor"/>
                        <path d="M22 10H24V14H22V10ZM26 10H29V12H26V10Z" fill="currentColor"/>
                        <path d="M0 10H4V12H0V10Z" fill="currentColor"/>
                        <path d="M6 10H8V14H6V10Z" fill="currentColor"/>
                        <path d="M10 14H18V18H10V14ZM12 16H16V17H12V16Z" fill="currentColor"/>
                        <path d="M22 22H24V26H22V22ZM26 24H29V28H26V24Z" fill="currentColor"/>
                        <path d="M10 22H12V25H10V22Z" fill="currentColor"/>
                        <path d="M14 24H18V26H14V24Z" fill="currentColor"/>
                        <path d="M12 28H16V29H12V28ZM18 28H20V29H18V28Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  💡 Le code QR contient un identifiant crypté sécurisé pour valider l'accès de l'élève au centre auprès des professeurs.
                </div>

                {/* Print & Download Sim Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-3">
                  <button
                    onClick={() => {
                      alert("Impression lancée...\n\nFormat : Carte ID Scolaire d'Élite");
                    }}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer text-[10.5px]"
                  >
                    <Printer className="w-4 h-4 text-slate-500" /> Imprimer
                  </button>
                  <button
                    onClick={() => {
                      alert("Téléchargement du fichier PDF sécurisé lancé...");
                    }}
                    className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-[10.5px]"
                  >
                    <Download className="w-4 h-4" /> Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* MODAL C: INTEGRATED SIMULATED MOBILE MONEY PAYMENT MODAL */}
      {paymentModalStudentId && (
        (() => {
          const student = students.find(s => s.id === paymentModalStudentId);
          if (!student) return null;
          
          const finance = getChildPaymentSummary(student.id);

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-800">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <CreditCard className="text-emerald-500 w-4 h-4" /> Paiement Mobile Money Sécurisé
                    </h3>
                    <p className="text-slate-400 text-[9px]">Règlement direct des frais de cours de soutien.</p>
                  </div>
                  <button 
                    onClick={() => setPaymentModalStudentId(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {paymentStep === 1 && (
                  <div className="space-y-4 text-left">
                    {/* Summary row */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl flex justify-between items-center border border-slate-100">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Élève bénéficiaire</span>
                        <span className="font-bold text-slate-700 text-[11px]">{student.firstName} {student.lastName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Montant dû</span>
                        <span className="font-mono font-black text-emerald-600 text-xs">{finance.remains.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Method Toggle */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">Moyen de paiement</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('WAVE')}
                          className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            paymentMethod === 'WAVE'
                              ? 'bg-sky-50 border-sky-400 text-sky-600 font-bold'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mb-1" />
                          <span className="font-extrabold text-[11px]">WAVE SÉNÉGAL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('ORANGE_MONEY')}
                          className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            paymentMethod === 'ORANGE_MONEY'
                              ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mb-1" />
                          <span className="font-extrabold text-[11px]">ORANGE MONEY</span>
                        </button>
                      </div>
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">Numéro de téléphone payeur</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="payment-sim-phone"
                          type="text"
                          required
                          value={paymentPhoneNumber}
                          onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                          placeholder="Ex: +221 77 123 45 67"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl transition outline-none font-bold text-slate-800 text-xs"
                        />
                      </div>
                      <p className="text-[8.5px] text-slate-400 leading-relaxed">
                        Saisissez le numéro rattaché à votre compte Wave ou Orange Money sur lequel l'autorisation de débit sera envoyée.
                      </p>
                    </div>

                    <button
                      onClick={() => handleExecutePayment(student.id)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
                    >
                      <CreditCard className="w-4 h-4" /> Procéder au règlement
                    </button>
                  </div>
                )}

                {paymentStep === 2 && (
                  <div className="py-8 text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs">Paiement en cours...</h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                        Une demande de débit de <strong className="text-slate-700">{finance.remains.toLocaleString()} FCFA</strong> a été envoyée sur votre téléphone. Veuillez valider la transaction avec votre code secret Wave / Orange Money.
                      </p>
                    </div>
                  </div>
                )}

                {paymentStep === 3 && (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="w-8 h-8 shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-slate-800 text-sm">Félicitations, Paiement validé !</h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                        Le paiement des cours de soutien a été enregistré avec succès par l'administration du centre d'Élite.
                      </p>
                    </div>

                    <button
                      onClick={() => setPaymentModalStudentId(null)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl transition cursor-pointer text-[10.5px]"
                    >
                      Retourner à l'Espace Parent
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })()
      )}

    </div>
  );
};
