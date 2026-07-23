import { useProfessorDashboard } from '../hooks/useProfessorDashboard';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

export default function ProfessorDashboard() {
  const { isLoading, error } = useProfessorDashboard();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <GraduationCap size={22} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">
              Professor Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base ml-11">
            Oversee advised projects, track student milestones, and evaluate academic submissions.
          </p>
        </div>
      </div>

      {/* Overview Metric Placeholder Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects</p>
            <h3 className="text-base font-bold text-slate-800">Advised Projects</h3>
          </div>
        </div>

        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</p>
            <h3 className="text-base font-bold text-slate-800">Assigned Students</h3>
          </div>
        </div>

        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluations</p>
            <h3 className="text-base font-bold text-slate-800">Pending Reviews</h3>
          </div>
        </div>
      </div>

      {/* Workspace Container Placeholder */}
      <div className="bg-white rounded-card border border-slate-200/60 shadow-sm p-8 text-center text-slate-500">
        <p className="font-medium">
          {isLoading ? 'Loading workspace...' : error ? 'Error loading workspace.' : 'Professor workspace scaffold ready for feature development.'}
        </p>
      </div>
    </div>
  );
}

export { ProfessorDashboard };