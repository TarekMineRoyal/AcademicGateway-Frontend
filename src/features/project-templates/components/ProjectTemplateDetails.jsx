import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectTemplateDetails } from '../hooks/useProjectTemplateDetails';
import { useRecommendedProfessors } from '../../recommendations/hooks/useRecommendedProfessors';
import { initializeProjectInstance } from '../../project-instances/projectInstancesApi';
import { adaptMilestones } from '../../../utils/milestoneAdapter'; 
import MilestoneVisualizer from '../../../components/milestone/MilestoneVisualizer'; 
import { ProjectTemplateStatus } from '../../../constants/enums';
import { 
  ArrowLeft, 
  Building2, 
  GitMerge, 
  Activity, 
  AlertCircle,
  Search,
  User,
  Check,
  X,
  UserCheck,
  Zap,
  GraduationCap,
  Sparkles
} from 'lucide-react';

// Pure Presentation Component: Decoupled from session hooks and 100% testable
function ProjectTemplateDetails({ userSkills = [], isStudent = false, skillsLoading = false }) {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role; // Utilizing clean string token from normalized auth boundary
  
  // Workflow Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiationMode, setInitiationMode] = useState(null); 
  const [professorSearchQuery, setProfessorSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Manage UI-only side effects locally
  useEffect(() => {
    if (initiationMode !== 'supervised') return;

    const handler = setTimeout(() => {
      setDebouncedSearch(professorSearchQuery);
    }, 300); // 300ms debounce buffer

    return () => clearTimeout(handler);
  }, [professorSearchQuery, initiationMode]);

  // Pure presentation layer server-state data consumption
  const { 
    template, 
    directoryResults, 
    isLoading, 
    isSearching, 
    error: hookError 
  } = useProjectTemplateDetails(templateId, debouncedSearch);

  // AI Vector Recommendation Engine Integration for Faculty Advisors
  const { 
    recommendedProfessors = [], 
    isLoading: isRecsLoading 
  } = useRecommendedProfessors(
    templateId, 
    5, 
    isStudent && initiationMode === 'supervised'
  );

  const handleOpenInitiationModal = () => {
    setIsModalOpen(true);
    setInitiationMode(null);
    setProfessorSearchQuery('');
    setDebouncedSearch('');
    setSelectedProfessor(null);
    setModalError('');
  };

  const handleCloseInitiationModal = () => {
    if (submitLoading) return;
    setIsModalOpen(false);
  };

  const handleFinalizePipelineInstantiation = async () => {
    if (initiationMode === 'supervised' && !selectedProfessor) {
      setModalError('Please explicitly select a target supervisor to deploy the request.');
      return;
    }

    try {
      setSubmitLoading(true);
      setModalError('');
      
      await initializeProjectInstance(
        templateId, 
        initiationMode === 'supervised' ? selectedProfessor.id : null
      );

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['studentDashboard', user.id] });
      }

      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to dispatch allocation request commands to server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadgeConfig = (statusToken) => {
    switch (statusToken) {
      case ProjectTemplateStatus.DRAFT: 
        return { text: 'Draft', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
      case ProjectTemplateStatus.PENDING_REVIEW: 
        return { text: 'Pending Review', classes: 'bg-amber-100 text-amber-700 border-amber-700/20' };
      case ProjectTemplateStatus.CHANGES_REQUESED: 
        return { text: 'Changes Requested', classes: 'bg-red-50 text-red-600 border-red-600/20' };
      case ProjectTemplateStatus.PENDING_PROVIDER_ACCEPTANCE: 
        return { text: 'Pending Acceptance', classes: 'bg-sky-100 text-sky-700 border-sky-700/20' };
      case ProjectTemplateStatus.APPROVED: 
        return { text: 'Publicly Approved', classes: 'bg-green-50 text-green-700 border-green-700/20' };
      case ProjectTemplateStatus.REJECTED: 
        return { text: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-700/20' };
      case ProjectTemplateStatus.ARCHIVED: 
        return { text: 'Archived', classes: 'bg-slate-50 text-slate-400 border-slate-400/20' };
      default: 
        return { text: 'Unknown Identity', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
    }
  };

  if (isLoading) {
    return (
      <div className="text-slate-600 text-center py-16 font-medium">
        De-serializing comprehensive blueprint records...
      </div>
    );
  }

  if (hookError || !template) {
    return (
      <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl border border-red-200 text-center space-y-4">
        <AlertCircle size={40} className="text-red-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-700 mb-1">Blueprint Synchronization Error</h3>
        <p className="text-slate-500 text-sm mb-6">{hookError?.message || 'The requested template could not be mapped to an active dataset entity.'}</p>
        <button 
          onClick={() => navigate('/dashboard/marketplace')} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Return to Marketplace
        </button>
      </div>
    );
  }

  // Pure Contract Destructuring
  const {
    title,
    description,
    status: statusToken,
    providerCompanyName = 'Enterprise Sponsor Partner',
    requiredSkills = [],
    milestones = [],
    dependencies = [],
    discipline: primaryDiscipline = '',
    majorName = null,
    specialtyName = null
  } = template;

  const adaptedMilestones = adaptMilestones(milestones, dependencies);

  const totalEstimatedScope = adaptedMilestones.reduce((sum, m) => sum + (Number(m.expectedHours) || 0), 0);
  const totalCheckpoints = adaptedMilestones.length;

  // Real-time clean ID matching execution layer
  const totalRequirementCount = requiredSkills.length;
  const matchIntersectionCount = requiredSkills.filter(sk => 
    userSkills.some(userSk => userSk.id === sk.id)
  ).length;

  const statusBadge = getStatusBadgeConfig(statusToken);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative">
      <button 
        onClick={() => navigate('/dashboard/marketplace')}
        className="inline-flex items-center gap-2 py-1 text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer text-sm font-semibold mb-2 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Project Marketplace
      </button>

      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm mb-4">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
              <Building2 size={14} />
              <span className="text-slate-900 font-bold hover:text-primary hover:underline cursor-pointer transition-colors">
                {providerCompanyName}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">{title}</h1>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusBadge.classes}`}>
            Status: {statusBadge.text}
          </span>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-sm font-semibold text-slate-700 mb-6">
          <div>Total Estimated Scope: <span className="text-slate-900 font-extrabold">{totalEstimatedScope} hrs</span></div>
          <div className="w-px h-4 bg-slate-300/60" />
          <div>Total Checkpoints: <span className="text-slate-900 font-extrabold">{totalCheckpoints}</span></div>
        </div>

        <p className="text-slate-600 text-[0.95rem] leading-relaxed whitespace-pre-line mb-6">
          {description}
        </p>

        {/* Academic Alignment Details Section */}
        <div className="border-t border-slate-200/60 w-full pt-6 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <GraduationCap size={14} className="text-primary" />
            Academic Alignment
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {majorName || specialtyName ? (
              <>
                {majorName && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-bold px-3 py-1 rounded-md">
                    Major: {majorName}
                  </span>
                )}
                {specialtyName && (
                  <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200/70 font-bold px-3 py-1 rounded-md">
                    Specialty: {specialtyName}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-3 py-1 rounded-md italic">
                All Majors / General Alignment
              </span>
            )}
          </div>
        </div>

        {isStudent && !skillsLoading && totalRequirementCount > 0 && (
          <div className="border-t border-slate-200/60 w-full pt-6">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Capabilities & Prerequisites</span>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
                You possess {matchIntersectionCount} of {totalRequirementCount} required capabilities
              </div>

              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map((sk, idx) => {
                  const studentOwnsSkill = userSkills.some(userSk => userSk.id === sk.id);

                  return (
                    <span 
                      key={sk.id || idx} 
                      className={`text-xs px-2 py-0.5 rounded font-semibold border transition-colors ${
                        studentOwnsSkill
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {sk.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <GitMerge size={20} className="text-primary" />
          Project Architecture & Evaluation Graph Plan
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Analyze the sequential execution constraints mapping checkpoints below. Arrow branches represent strict prerequisite dependencies enforced by the pipeline engine.
        </p>

        <MilestoneVisualizer milestones={adaptedMilestones} isWorkspace={false} />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 mt-4">
        {isStudent && statusToken === ProjectTemplateStatus.APPROVED && (
          <button
            onClick={handleOpenInitiationModal}
            className="bg-primary hover:bg-primary-hover text-white rounded-btn font-bold text-sm px-6 py-2.5 transition-all duration-200 shadow-sm cursor-pointer"
          >
            Initialize Selection Pipeline
          </button>
        )}

        <button 
          onClick={() => navigate('/dashboard/marketplace')}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-btn font-semibold text-sm px-5 py-2.5 transition-all duration-200 cursor-pointer"
        >
          Cancel and Return
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Project Initialization Matrix</h3>
              <button 
                onClick={handleCloseInitiationModal} 
                disabled={submitLoading} 
                className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 transition-colors disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {modalError && (
                <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm font-medium mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{modalError}</span>
                </div>
              )}

              {initiationMode === null && (
                <div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Select how you want to deploy this capstone aggregate model workspace track. You can modify mentorship settings post-launch.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setInitiationMode('solo')}
                      className="w-full p-5 border-2 border-slate-200 hover:border-primary rounded-xl bg-white text-left cursor-pointer flex gap-4 items-center hover:bg-slate-50/60 transition-all duration-150 shadow-xs"
                    >
                      <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                        <Zap size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 mb-0.5">Deploy in Solo Execution Mode</h4>
                        <p className="text-slate-500 text-xs leading-normal">Instantiates the runtime workspace track immediately. You hold the ability to invite a faculty advisor later.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setInitiationMode('supervised')}
                      className="w-full p-5 border-2 border-slate-200 hover:border-primary rounded-xl bg-white text-left cursor-pointer flex gap-4 items-center hover:bg-slate-50/60 transition-all duration-150 shadow-xs"
                    >
                      <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                        <UserCheck size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 mb-0.5">Request Faculty Academic Supervision</h4>
                        <p className="text-slate-500 text-xs leading-normal">Search our verified faculty registry to route an invitation. Track status will remain pending until approved.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {initiationMode === 'supervised' && (
                <div>
                  <button 
                    onClick={() => { setInitiationMode(null); setSelectedProfessor(null); }} 
                    className="bg-transparent border-none text-primary hover:text-primary-hover text-xs font-bold cursor-pointer flex items-center gap-1 mb-4 p-0 transition-colors"
                  >
                    ← Back to selection options
                  </button>

                  {/* AI Recommended Advisors Block */}
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-2">
                      <Sparkles size={14} className="text-indigo-600" />
                      AI Recommended Advisors
                    </div>
                    {isRecsLoading ? (
                      <div className="p-3 text-xs text-slate-400 text-center bg-slate-50 rounded-lg animate-pulse font-medium">
                        Calculating vector-similarity faculty matches...
                      </div>
                    ) : recommendedProfessors.length > 0 ? (
                      <div className="space-y-2">
                        {recommendedProfessors.map((prof, idx) => {
                          const isChosen = selectedProfessor?.id === prof.id;
                          return (
                            <div
                              key={prof.id}
                              onClick={() => setSelectedProfessor(prof)}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                isChosen
                                  ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 shadow-xs'
                                  : 'bg-white border-indigo-100 hover:border-indigo-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <User size={15} className={isChosen ? 'text-indigo-600' : 'text-slate-500'} />
                                <div>
                                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span>{prof.fullName}</span>
                                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                                      #{idx + 1} Match
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500">{prof.email}</div>
                                </div>
                              </div>
                              {isChosen && <Check size={16} className="text-indigo-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center bg-slate-50 rounded-lg font-medium">
                        No AI advisor recommendations found for this template.
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                      Or Search Full Directory
                    </span>
                  </div>
                  
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Search Advisor Directory
                  </label>
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Type name, campus handle, or academic email..."
                      value={professorSearchQuery}
                      onChange={(e) => setProfessorSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="border border-slate-200 rounded-lg max-h-[220px] overflow-y-auto bg-slate-50/50">
                    {isSearching ? (
                      <div className="p-4 text-xs text-slate-500 text-center">Querying corporate faculty clusters...</div>
                    ) : directoryResults.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 text-center">
                        {professorSearchQuery ? 'No matching faculty identities found.' : 'Type to query directory grid...'}
                      </div>
                    ) : (
                      directoryResults.map(prof => {
                        const isChosen = selectedProfessor?.id === prof.id;
                        const isFull = Number(prof.slots) >= Number(prof.maxSupervisionCapacity);
                        
                        const isDomainExpert = primaryDiscipline && prof.specialties?.some(spec => {
                          const specStr = typeof spec === 'object' ? (spec.name || '') : String(spec);
                          return specStr.toLowerCase().includes(primaryDiscipline.toLowerCase()) || primaryDiscipline.toLowerCase().includes(specStr.toLowerCase());
                        });

                        return (
                          <div 
                            key={prof.id}
                            onClick={() => !isFull && setSelectedProfessor(prof)}
                            className={`flex items-start justify-between p-3 border-b border-slate-100 cursor-pointer transition-colors ${isChosen ? 'bg-sky-50/70' : 'bg-transparent hover:bg-slate-50'} ${isFull ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <div className="flex items-start gap-2.5 w-full">
                              <User size={15} className={`mt-0.5 ${isChosen ? 'text-primary' : 'text-slate-500'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                                  <span>{prof.fullName}</span>
                                  {isDomainExpert && (
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0">
                                      ✨ Domain Expert
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">{prof.email}</div>
                                
                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                                  <span>Available Slots: {prof.slots || 0}/{prof.maxSupervisionCapacity}</span>
                                </div>

                                {prof.specialties && prof.specialties.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {prof.specialties.map((spec, sIdx) => (
                                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                        {typeof spec === 'object' ? spec.name : spec}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {isChosen && <Check size={16} className="text-primary shrink-0 ml-2" />}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {selectedProfessor && (
                    <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
                      <Activity size={14} className="text-green-600" />
                      <span className="text-xs text-green-800">
                        Selected: <strong>{selectedProfessor.fullName}</strong> will receive the request.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {initiationMode === 'solo' && (
                <div className="text-center py-2">
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    You are initializing <strong>{title}</strong> in standalone mode. 
                  </p>
                  <p className="text-slate-500 text-xs">
                    Your pipeline record tracks as an active instance immediately upon checkout.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseInitiationModal} 
                disabled={submitLoading}
                className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              {initiationMode !== null && (
                <button 
                  onClick={handleFinalizePipelineInstantiation}
                  disabled={submitLoading || (initiationMode === 'supervised' && !selectedProfessor)}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? 'Deploying Track...' : 'Confirm and Initialize'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTemplateDetails;