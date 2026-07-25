import { useNavigate } from 'react-router-dom';
import { PlusCircle, Folder, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContextCore';
import { useStudentProfileData } from '@/features/student';

/**
 * Composition page root for the Student Dashboard layout.
 * Combines Student Profile state with project and application workspace sections.
 */
export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const targetId = user?.id;

  // Real Student Domain Hook
  const { profile, isLoading, error } = useStudentProfileData(targetId);

  if (isLoading) {
    return (
      <div className="text-slate-600 text-center py-24 font-medium animate-pulse">
        Loading student dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold p-6 bg-red-50 border border-red-200 rounded-lg max-w-6xl mx-auto my-8">
        {error?.message || 'Failed to load student profile details.'}
      </div>
    );
  }

  const studentFullName = profile?.fullName || user?.name || 'Academic Scholar';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">
            Welcome back, {studentFullName}
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-1">
            Overview and track your live graduation engineering workspaces and pending mentor claims.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/marketplace')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-btn shadow-xs transition-all duration-200 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={16} />
          Start New Project App
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* SECTION A: Active Research Projects (Placeholder) */}
        <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-xs">
          <h2 className="text-lg font-bold text-brand-dark mb-5 flex items-center gap-2">
            <Folder className="text-primary" size={18} /> Active Research Projects
            <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold">
              0
            </span>
          </h2>
          <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
            No active project channels assigned yet. [Projects domain pending migration]
          </div>
        </section>

        {/* SECTION B: Application Pipeline (Placeholder) */}
        <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-xs">
          <h2 className="text-lg font-bold text-brand-dark mb-5 flex items-center gap-2">
            <Clock className="text-amber-600" size={18} /> Application Pipeline
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
              0
            </span>
          </h2>
          <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
            Your pipeline registry is empty. [Applications domain pending migration]
          </div>
        </section>
      </div>
    </div>
  );
}