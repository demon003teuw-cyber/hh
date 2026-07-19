import { Parent, Student, Teacher, Subject, Level, CourseOffer, Group, Assignment, Payment, Preinscription, Settings } from '../../../types';
import * as seeds from './mockDbData';
import * as actSeeds from './mockActivitiesData';
import { attendanceHistory, gradesHistory, observationsHistory } from '../../parent/domain/parentMockData';

const listeners: (() => void)[] = [];

export function subscribeToDb(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

export function notifyDbSubscribers() {
  listeners.forEach(cb => cb());
}

export function getDbTable<T>(key: string, seed: T[]): T[] {
  const data = localStorage.getItem(`soutien_scolaire_${key}`);
  if (!data) {
    localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
}

export function saveDbTable<T>(key: string, data: T[]): void {
  localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(data));
  notifyDbSubscribers();
}

export function getDbItem<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(`soutien_scolaire_${key}`);
  if (!data) {
    localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
}

export function saveDbItem<T>(key: string, data: T): void {
  localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(data));
  notifyDbSubscribers();
}

export const mockDb = {
  getSubjects: () => getDbTable<Subject>('subjects', seeds.initialSubjects),
  saveSubjects: (data: Subject[]) => saveDbTable<Subject>('subjects', data),
  
  getLevels: () => getDbTable<Level>('levels', seeds.initialLevels),
  saveLevels: (data: Level[]) => saveDbTable<Level>('levels', data),

  getParents: () => getDbTable<Parent>('parents', seeds.initialParents),
  saveParents: (data: Parent[]) => saveDbTable<Parent>('parents', data),

  getStudents: () => getDbTable<Student>('students', seeds.initialStudents),
  saveStudents: (data: Student[]) => saveDbTable<Student>('students', data),

  getTeachers: () => getDbTable<Teacher>('teachers', seeds.initialTeachers),
  saveTeachers: (data: Teacher[]) => saveDbTable<Teacher>('teachers', data),

  getCourseOffers: () => getDbTable<CourseOffer>('courseOffers', seeds.initialCourseOffers),
  saveCourseOffers: (data: CourseOffer[]) => saveDbTable<CourseOffer>('courseOffers', data),

  getGroups: () => getDbTable<Group>('groups', seeds.initialGroups),
  saveGroups: (data: Group[]) => saveDbTable<Group>('groups', data),

  getAssignments: () => getDbTable<Assignment>('assignments', seeds.initialAssignments),
  saveAssignments: (data: Assignment[]) => saveDbTable<Assignment>('assignments', data),

  getPayments: () => getDbTable<Payment>('payments', seeds.initialPayments),
  savePayments: (data: Payment[]) => saveDbTable<Payment>('payments', data),

  getPreinscriptions: () => getDbTable<Preinscription>('preinscriptions', seeds.initialPreinscriptions),
  savePreinscriptions: (data: Preinscription[]) => saveDbTable<Preinscription>('preinscriptions', data),

  getAttendanceHistory: () => {
    const data = getDbItem<Record<string, actSeeds.AttendanceRecord[]>>('attendanceHistory', actSeeds.initialAttendanceHistory);
    // Sync memory ref
    Object.keys(attendanceHistory).forEach(k => delete (attendanceHistory as any)[k]);
    Object.assign(attendanceHistory, data);
    return data;
  },
  saveAttendanceHistory: (data: Record<string, actSeeds.AttendanceRecord[]>) => {
    Object.keys(attendanceHistory).forEach(k => delete (attendanceHistory as any)[k]);
    Object.assign(attendanceHistory, data);
    saveDbItem('attendanceHistory', data);
  },

  getGradesHistory: () => {
    const data = getDbItem<Record<string, actSeeds.GradeRecord[]>>('gradesHistory', actSeeds.initialGradesHistory);
    // Sync memory ref
    Object.keys(gradesHistory).forEach(k => delete (gradesHistory as any)[k]);
    Object.assign(gradesHistory, data);
    return data;
  },
  saveGradesHistory: (data: Record<string, actSeeds.GradeRecord[]>) => {
    Object.keys(gradesHistory).forEach(k => delete (gradesHistory as any)[k]);
    Object.assign(gradesHistory, data);
    saveDbItem('gradesHistory', data);
  },

  getObservationsHistory: () => {
    const data = getDbItem<Record<string, actSeeds.ObservationRecord[]>>('observationsHistory', actSeeds.initialObservationsHistory);
    // Sync memory ref
    Object.keys(observationsHistory).forEach(k => delete (observationsHistory as any)[k]);
    Object.assign(observationsHistory, data);
    return data;
  },
  saveObservationsHistory: (data: Record<string, actSeeds.ObservationRecord[]>) => {
    Object.keys(observationsHistory).forEach(k => delete (observationsHistory as any)[k]);
    Object.assign(observationsHistory, data);
    saveDbItem('observationsHistory', data);
  },

  getNotifications: () => getDbItem<actSeeds.AppNotification[]>('notifications', actSeeds.initialNotifications),
  saveNotifications: (data: actSeeds.AppNotification[]) => saveDbItem('notifications', data),

  getSettings: (): Settings => {
    const data = localStorage.getItem('soutien_scolaire_settings');
    if (!data) {
      localStorage.setItem('soutien_scolaire_settings', JSON.stringify(seeds.initialSettings));
      return seeds.initialSettings;
    }
    return JSON.parse(data);
  },
  saveSettings: (data: Settings) => {
    localStorage.setItem('soutien_scolaire_settings', JSON.stringify(data));
    notifyDbSubscribers();
  }
};
