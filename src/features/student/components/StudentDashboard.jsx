import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContextCore';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { ProjectInstanceStatus } from '../../../shared/constants/enums';
import { 
  PlusCircle, 
  Folder, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  User, 
  Building, 
  Zap 
} from 'lucide-react';

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
    isStartingSolo
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

  // Helper mapping to interpret ProjectInstanceStatus enum values strictly
  const getStatusBadge = (status) => {
    switch (status) {
      case ProjectInstanceStatus.AWAITING_SUPERVISION:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            <Clock size={14} /> Awaiting Supervision
          </span>
        );
      case ProjectInstanceStatus.ACTIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle size={14} /> Active
          </span>
        );
      case ProjectInstanceStatus.CONCLUDED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold">
            <Award size={14} /> Concluded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold">
            <AlertTriangle size={14} /> Canceled
          </span>
        );
    }
  };

  if (isLoading) {
    return <div className="text-slate-600 text-center py-24 font-medium">Re-indexing student workspaces...</div>;
  }

  if (error) {
    return <div className="text-red-600 font-semibold p-6 bg-red-50 border border-red-200 rounded-lg">{error?.message || 'Failed to sync workspace details.'}</div>;
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
            <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold">{activeWorkspaces.length}</span>
          </h2>
          
          {activeWorkspaces.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
              No active experimental project channels are assigned to your identity profile at this moment.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {activeWorkspaces.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => navigate(`/workspace/projects/${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/workspace/projects/${project.id}`);
                    }
                  }}
                  tabIndex={0}
                  className="border border-slate-200 rounded-lg p-5 bg-white transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer focus-within:ring-2 focus-within:ring-primary/20 outline-none"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-brand-dark line-clamp-2">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">{project.description}</p>

                  {/* Associated Stakeholder References Anchor Elements */}
                  <div className="flex flex-wrap gap-6 mb-5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {project.providerCompanyName && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building size={14} className="text-slate-400" />
                        <strong className="text-slate-500">Sponsor:</strong>{' '}
                        <span 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (project.providerId) navigate(`/providers/${project.providerId}`);
                          }}
                          className="text-primary hover:text-primary-hover cursor-pointer font-semibold transition-colors"
                        >
                          {project.providerCompanyName}
                        </span>
                      </span>
                    )}
                    
                    {!project.isSoloMode && project.professorName ? (
                      <span className="inline-flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <strong className="text-slate-500">Advisor:</strong>{' '}
                        <span 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (project.professorId) navigate(`/professors/${project.professorId}`);
                          }}
                          className="text-primary hover:text-primary-hover cursor-pointer font-semibold transition-colors"
                        >
                          {project.professorName}
                        </span>
                      </span>
                    ) : project.isSoloMode ? (
                      <span className="text-slate-500 font-medium inline-flex items-center gap-1.5">
                        <User size={14} /> Solo Project Track
                      </span>
                    ) : null}
                  </div>

                  {/* Double Progress Telemetry Elements */}
                  <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {/* Milestone Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium">
                          <strong className="text-brand-dark">Milestone Node:</strong> {project.currentMilestoneTitle || 'Initialization Stage'}
                        </span>
                        <span className="font-bold text-primary">{project.currentMilestoneProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-300" 
                          style={{ width: `${project.currentMilestoneProgress || 0}%` }} 
                        />
                      </div>
                    </div>

                    {/* Overall Completion Indicator */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span className="font-semibold text-slate-700">Overall Pipeline Completion</span>
                        <span className="font-bold text-emerald-600">{project.totalProjectProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-accent h-full rounded-full transition-all duration-300" 
                          style={{ width: `${project.totalProjectProgress || 0}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {project.endDate && (
                    <div className="text-xs text-slate-400 mt-3 text-right font-medium">
                      Administrative Deadline: {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section B: Vetting Pipeline Channels */}
        <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-sm">
          <h2 className="text-lg font-bold text-brand-dark mb-5 flex items-center gap-2">
            <Clock className="text-amber-600" size={18} /> Application Pipeline
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">{pipelineApplications.length}</span>
          </h2>

          {pipelineApplications.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
              Your pipeline registry is empty. Ready to launch a brand new initiative?
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipelineApplications.map((app) => (
                <div key={app.id} className="bg-amber-50/30 border border-amber-100 rounded-lg p-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="text-base font-bold text-brand-dark line-clamp-2">{app.title}</h3>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                      <span><strong className="text-slate-500">Sponsor Unit:</strong> {app.providerCompanyName || 'Unspecified Provider'}</span>
                      <span><strong className="text-slate-500">Supervisor:</strong> {app.requestedProfessorName || 'Pending Assignment'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-dashed border-amber-200/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs font-medium">
                        Opened {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <button
                      onClick={() => setSoloModalProject(app)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Zap size={13} />
                      Start Solo Instead
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section C: Historical / Archive Logs */}
        {historicWorkspaces.length > 0 && (
          <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-sm opacity-90">
            <h2 className="text-base font-bold text-slate-500 mb-4">Archived History Records</h2>
            <div className="flex flex-col gap-3">
              {historicWorkspaces.map((hist) => (
                <div key={hist.id} className="border border-slate-100 rounded-lg p-4 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{hist.title}</span>
                    {hist.overallGrade !== null && hist.overallGrade !== undefined && (
                      <span className="ml-3 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Grade: {hist.overallGrade}%
                      </span>
                    )}
                  </div>
                  {getStatusBadge(hist.status)}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Screen Overlay */}
      {soloModalProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-card shadow-xl border border-slate-200 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-brand-dark mb-3 flex items-center gap-2">
              <Zap size={18} className="text-amber-600" /> Start Project Solo
            </h3>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-5">
              You are launching <strong>{soloModalProject.title}</strong> independently. This initializes your workspace channel <strong>immediately</strong> (Status: Active).
              <br /><br />
              <span className="block bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-xs font-medium">
                <strong>Important Process Node:</strong> The advisor invitation issued to <strong>{soloModalProject.requestedProfessorName || 'Pending Assignment'}</strong> remains active in the registry. They can claim it and join your running workspace seamlessly at any later milestone point.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button 
                disabled={isStartingSolo}
                onClick={() => setSoloModalProject(null)}
                className="px-4 py-2 border border-slate-200 rounded-btn bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isStartingSolo}
                onClick={handleStartSolo}
                className="px-4 py-2 rounded-btn bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isStartingSolo ? 'Activating Workspace...' : 'Confirm & Start Solo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}