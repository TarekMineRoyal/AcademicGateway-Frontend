import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Folder } from 'lucide-react';
import { useAuth } from '../../../context/AuthContextCore';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import StatusBadge from '../../../shared/components/StatusBadge';
import ActiveWorkspaceCard from './ActiveWorkspaceCard';
import ApplicationPipelineList from './ApplicationPipelineList';
import StartSoloModal from './StartSoloModal';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const targetId = user?.id; // Normalized at boundary layer

  // Consume server-state hook for zero-boilerplate cache synchronization & categorized datasets
  const {
    profile,
    activeWorkspaces,
    pipelineApplications,
    historicWorkspaces,
    isLoading,
    error,
    startSolo,
    isStartingSolo,
  } = useStudentDashboard(targetId);

  // Modal local operation state for interactive UI overlay tracking
  const [soloModalProject, setSoloModalProject] = useState(null);

  // Action Handler to commit project transition
  const handleStartSolo = async () => {
    if (!soloModalProject) return;
    try {
      await startSolo(soloModalProject.id);
      setSoloModalProject(null);
    } catch {
      alert('Failed to transition project channel to solo tracking mode. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-slate-600 text-center py-24 font-medium">Re-indexing student workspaces...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold p-6 bg-red-50 border border-red-200 rounded-lg">
        {error?.message || 'Failed to sync workspace details.'}
      </div>
    );
  }

  const studentFullName = profile.fullName || user?.name || 'Academic Scholar';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60">
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
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-btn shadow-sm transition-all duration-200 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          Start New Project App
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section A: Live Running Capstone Tracks */}
        <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-sm">
          <h2 className="text-lg font-bold text-brand-dark mb-5 flex items-center gap-2">
            <Folder className="text-primary" size={18} /> Active Research Projects
            <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold">
              {activeWorkspaces.length}
            </span>
          </h2>

          {activeWorkspaces.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
              No active experimental project channels are assigned to your identity profile at this moment.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {activeWorkspaces.map((project) => (
                <ActiveWorkspaceCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* Section B: Vetting Pipeline Channels */}
        <ApplicationPipelineList
          pipelineApplications={pipelineApplications}
          onStartSolo={(app) => setSoloModalProject(app)}
        />

        {/* Section C: Historical / Archive Logs */}
        {historicWorkspaces.length > 0 && (
          <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-sm opacity-90">
            <h2 className="text-base font-bold text-slate-500 mb-4">Archived History Records</h2>
            <div className="flex flex-col gap-3">
              {historicWorkspaces.map((hist) => (
                <div
                  key={hist.id}
                  className="border border-slate-100 rounded-lg p-4 flex justify-between items-center bg-slate-50/50"
                >
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{hist.title}</span>
                    {hist.overallGrade !== null && hist.overallGrade !== undefined && (
                      <span className="ml-3 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Grade: {hist.overallGrade}%
                      </span>
                    )}
                  </div>
                  <StatusBadge status={hist.status} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Screen Overlay */}
      <StartSoloModal
        project={soloModalProject}
        isStartingSolo={isStartingSolo}
        onConfirm={handleStartSolo}
        onClose={() => setSoloModalProject(null)}
      />
    </div>
  );
}