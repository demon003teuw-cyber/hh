import { Calendar, Users, BookOpen, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Teacher, Assignment, Group, Student, Subject } from '../../../types';

interface TeacherHomeProps {
  me: Teacher;
  stats: { coursesCount: number; classesCount: number; studentsCount: number };
  nextCourse: Assignment | null;
  subjects: Subject[];
  groups: Group[];
  students: Student[];
  onSelectCourse: (id: string) => void;
}

export function TeacherHome({
  me,
  stats,
  nextCourse,
  subjects,
  groups,
  students,
  onSelectCourse,
}: TeacherHomeProps) {
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Matière';
  const getGroupName = (id?: string) => groups.find(g => g.id === id)?.name || 'Classe';
  const getStudentName = (id?: string) => {
    const s = students.find(std => std.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Élève';
  };

  const getStudentCount = (course: Assignment) => {
    if (course.type === 'INDIVIDUEL') return 1;
    const g = groups.find(grp => grp.id === course.groupId);
    return g ? g.studentIds.length : 0;
  };

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-radial from-amber-600 to-amber-700 text-white p-6 rounded-3xl space-y-2 shadow-lg shadow-amber-600/10 border border-amber-500/10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">Tableau de bord</span>
        <h1 className="font-display font-bold text-lg md:text-xl">Bonjour, {me.fullName} 👋</h1>
        <p className="text-amber-100 leading-relaxed max-w-xl text-[11px]">
          Bienvenue sur votre assistant de cours particuliers. Suivez les présences de vos élèves et envoyez vos remarques pédagogiques en temps réel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Cours programmés", value: stats.coursesCount, icon: Calendar, color: "text-amber-500 bg-amber-50" },
          { label: "Classes & Groupes", value: stats.classesCount, icon: BookOpen, color: "text-sky-500 bg-sky-50" },
          { label: "Élèves suivis", value: stats.studentsCount, icon: Users, color: "text-violet-500 bg-violet-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">{item.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Next Course Card */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Prochain cours programmé
        </h3>
        {nextCourse ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4 hover:border-amber-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-wide">
                  {nextCourse.type}
                </span>
                <h4 className="font-display font-bold text-slate-800 text-sm mt-1">
                  📚 {getSubjectName(nextCourse.subjectId)}
                </h4>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Horaire</span>
                <span className="font-bold text-slate-700 flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {nextCourse.schedule}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-[11px] font-medium text-slate-500">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-semibold">Bénéficiaire</span>
                <span className="text-slate-700 font-bold">
                  {nextCourse.type === 'INDIVIDUEL' ? getStudentName(nextCourse.studentId) : getGroupName(nextCourse.groupId)}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-semibold">Lieu / Salle</span>
                <span className="text-slate-700 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {nextCourse.location}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-semibold">Élèves</span>
                <span className="text-slate-700 font-bold">
                  {getStudentCount(nextCourse)} élève{getStudentCount(nextCourse) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectCourse(nextCourse.id)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md group-hover:scale-[1.01] active:scale-95 duration-200 cursor-pointer"
            >
              Entrer dans le cours <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-3xs text-center text-slate-400">
            Aucun cours programmé aujourd'hui. Profitez de votre temps libre !
          </div>
        )}
      </div>
    </div>
  );
}
