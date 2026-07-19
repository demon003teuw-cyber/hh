import { useCallback } from 'react';
import { Teacher, Student, Subject, Assignment } from '../../../types';
import { isScanAuthorized } from '../domain/courseMatcher';

export function useTeacherActions(
  me: Teacher,
  attendanceHistory: any,
  saveAttendanceHistory: (data: any) => void,
  observationsHistory: any,
  saveObservationsHistory: (data: any) => void,
  notifications: any[],
  saveNotifications: (data: any[]) => void,
  subjects: Subject[]
) {
  const triggerNotification = useCallback((student: Student, title: string, body: string, type: 'ATTENDANCE' | 'GRADE' | 'SYSTEM') => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      body,
      date: dateStr,
      time: timeStr,
      isRead: false,
      type,
    };
    saveNotifications([newNotif, ...notifications]);
  }, [notifications, saveNotifications]);

  const updateAttendance = useCallback((student: Student, course: Assignment, status: 'PRESENT' | 'ABSENT' | 'RETARD', justification = '') => {
    const subject = subjects.find(s => s.id === course.subjectId)?.name || 'Cours';
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const historyForStudent = [...(attendanceHistory[student.id] || [])];
    const existingIndex = historyForStudent.findIndex(r => r.date === dateStr && r.subjectName === subject);

    const record = { date: dateStr, status, subjectName: subject, time: status === 'ABSENT' ? '--:--' : timeStr, justification };

    if (existingIndex > -1) {
      historyForStudent[existingIndex] = record;
    } else {
      historyForStudent.unshift(record);
    }

    saveAttendanceHistory({ ...attendanceHistory, [student.id]: historyForStudent });

    const emoji = status === 'PRESENT' ? '✅' : status === 'ABSENT' ? '❌' : '⏰';
    const label = status === 'PRESENT' ? 'présent' : status === 'ABSENT' ? 'absent' : 'en retard';
    triggerNotification(
      student,
      `${emoji} Présence : ${status}`,
      `${student.firstName} ${student.lastName} a été noté ${label} au cours de ${subject} par ${me.fullName}.`,
      'ATTENDANCE'
    );
  }, [attendanceHistory, saveAttendanceHistory, subjects, me.fullName, triggerNotification]);

  const addObservation = useCallback((student: Student, subjectName: string, text: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const obsForStudent = [...(observationsHistory[student.id] || [])];
    obsForStudent.unshift({ date: dateStr, teacherName: me.fullName, subjectName, text });

    saveObservationsHistory({ ...observationsHistory, [student.id]: obsForStudent });

    triggerNotification(
      student,
      '📝 Nouvelle observation',
      `Le professeur de ${subjectName} (${me.fullName}) a ajouté une observation concernant ${student.firstName} : "${text}"`,
      'SYSTEM'
    );
  }, [observationsHistory, saveObservationsHistory, me.fullName, triggerNotification]);

  const scanQRCode = useCallback((cardNumber: string, course: Assignment, students: Student[], simulatedTime: string) => {
    const check = isScanAuthorized(course, simulatedTime);
    if (!check.authorized) {
      return { success: false, reason: check.reason || "Ce cours n'est pas disponible pour le scan." };
    }

    // Match card number SEN-2026-XXXX-X
    const cleanNo = cardNumber.trim();
    // Simulate lookup. In a real app we lookup std ID.
    // Let's find student whose ID ends with the number or matches card numbers.
    const student = students.find(s => s.id === cleanNo || cleanNo.includes(s.firstName) || cleanNo.includes(s.id));
    if (!student) {
      return { success: false, reason: "Carte QR Code introuvable ou invalide." };
    }

    updateAttendance(student, course, 'PRESENT');
    return { success: true, studentName: `${student.firstName} ${student.lastName}` };
  }, [updateAttendance]);

  return { updateAttendance, addObservation, scanQRCode };
}
