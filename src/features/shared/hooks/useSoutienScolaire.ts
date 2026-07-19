import { useState, useEffect, useCallback } from 'react';
import { mockDb, subscribeToDb } from '../infrastructure/mockDb';
import { Parent, Student, Teacher, Group, Assignment, Payment, Preinscription } from '../../../types';

export function useSoutienScolaire() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeToDb(() => setTick(t => t + 1)), []);

  const addPreinscription = useCallback((data: Omit<Preinscription, 'id' | 'status' | 'date'>) => {
    const newPre: Preinscription = { ...data, id: `pre-${Date.now()}`, status: 'EN_ATTENTE', date: new Date().toISOString() };
    mockDb.savePreinscriptions([...mockDb.getPreinscriptions(), newPre]);
    return newPre;
  }, []);

  const approvePreinscription = useCallback((id: string) => {
    const preins = mockDb.getPreinscriptions();
    const target = preins.find(p => p.id === id);
    if (!target) return;

    // Check if parent already exists by phone number
    const parents = mockDb.getParents();
    const existingParent = parents.find(p => p.phone.replace(/\s+/g, '') === target.parentPhone.replace(/\s+/g, ''));
    let parentId = existingParent?.id;

    if (!existingParent) {
      parentId = `par-${Date.now()}`;
      const newParent: Parent = {
        id: parentId,
        fullName: target.parentName,
        phone: target.parentPhone,
        whatsapp: target.parentWhatsapp,
        address: target.parentAddress
      };
      mockDb.saveParents([...parents, newParent]);
    }

    // Create Student
    const students = mockDb.getStudents();
    const studentId = `std-${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      parentId: parentId || '',
      firstName: target.studentFirstName,
      lastName: target.studentLastName,
      sex: target.studentSex,
      birthDate: target.studentBirthDate,
      levelId: target.levelId
    };
    mockDb.saveStudents([...students, newStudent]);

    // Mark preinscription as CONFIRMEE
    mockDb.savePreinscriptions(preins.map(p => p.id === id ? { ...p, status: 'CONFIRMEE' } : p));
  }, []);

  const addPayment = useCallback((amount: number, studentId: string, method: Payment['method']) => {
    const newPay: Payment = {
      id: `pay-${Date.now()}`, studentId, amount, date: new Date().toISOString().split('T')[0],
      method, reference: `REC-${Date.now().toString().slice(-4)}`
    };
    mockDb.savePayments([...mockDb.getPayments(), newPay]);
    return newPay;
  }, []);

  const addTeacher = useCallback((t: Omit<Teacher, 'id'>) => {
    mockDb.saveTeachers([...mockDb.getTeachers(), { ...t, id: `tch-${Date.now()}` }]);
  }, []);

  const addAssignment = useCallback((asg: Omit<Assignment, 'id'>) => {
    mockDb.saveAssignments([...mockDb.getAssignments(), { ...asg, id: `asg-${Date.now()}` }]);
  }, []);

  const addGroup = useCallback((g: Omit<Group, 'id' | 'studentIds'>) => {
    mockDb.saveGroups([...mockDb.getGroups(), { ...g, id: `grp-${Date.now()}`, studentIds: [] }]);
  }, []);

  return {
    subjects: mockDb.getSubjects(), levels: mockDb.getLevels(), parents: mockDb.getParents(),
    students: mockDb.getStudents(), teachers: mockDb.getTeachers(), courseOffers: mockDb.getCourseOffers(),
    groups: mockDb.getGroups(), assignments: mockDb.getAssignments(), payments: mockDb.getPayments(),
    preinscriptions: mockDb.getPreinscriptions(), settings: mockDb.getSettings(),
    attendanceHistory: mockDb.getAttendanceHistory(), saveAttendanceHistory: mockDb.saveAttendanceHistory,
    gradesHistory: mockDb.getGradesHistory(), saveGradesHistory: mockDb.saveGradesHistory,
    observationsHistory: mockDb.getObservationsHistory(), saveObservationsHistory: mockDb.saveObservationsHistory,
    notifications: mockDb.getNotifications(), saveNotifications: mockDb.saveNotifications,
    addPreinscription, approvePreinscription, addPayment, addTeacher, addAssignment, addGroup,
    updateSettings: mockDb.saveSettings, saveStudents: mockDb.saveStudents, saveGroups: mockDb.saveGroups, saveParents: mockDb.saveParents, saveTeachers: mockDb.saveTeachers,
    saveSubjects: mockDb.saveSubjects, saveLevels: mockDb.saveLevels, saveCourseOffers: mockDb.saveCourseOffers
  };
}
