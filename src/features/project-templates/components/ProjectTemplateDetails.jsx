import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProjectTemplateById } from '../projectTemplatesApi';
import { initializeProjectInstance } from '../../project-instances/projectInstancesApi';
import { searchProfessors } from '../../professor/professorApi';
import { adaptMilestones } from '../../../utils/milestoneAdapter'; // Updated to use the global shared utils path
import MilestoneVisualizer from '../../../components/milestone/MilestoneVisualizer'; // Phase 2 Shared Master Shell Component
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
  Zap
} from 'lucide-react';

function ProjectTemplateDetails() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Workflow Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiationMode, setInitiationMode] = useState(null); // 'solo' | 'supervised' | null
  const [professorSearchQuery, setProfessorSearchQuery] = useState('');
  const [professorResults, setProfessorResults] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [searchingProfessors, setSearchingProfessors] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    async function fetchTemplateData() {
      try {
        setLoading(true);
        setError('');
        const data = await getProjectTemplateById(templateId);
        setTemplate(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to sync detailed project aggregate specifications from database.');
      } finally {
        setLoading(false);
      }
    }
    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId]);

  // Real-time Professor Directory lookup handler
  useEffect(() => {
    if (initiationMode !== 'supervised') return;
    
    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearchingProfessors(true);
        setModalError('');
        const results = await searchProfessors(professorSearchQuery);
        setProfessorResults(results);
      } catch (err) {
        setModalError('Failed to fetch matching faculty listings from directory.');
      } finally {
        setSearchingProfessors(false);
      }
    }, 300); // 300ms built-in debounce slider to ease network hammering

    return () => clearTimeout(delayDebounceFn);
  }, [professorSearchQuery, initiationMode]);

  const handleOpenInitiationModal = () => {
    setIsModalOpen(true);
    setInitiationMode(null);
    setProfessorSearchQuery('');
    setProfessorResults([]);
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
      
      // Dispatch the runtime initialization command to the new domain workspace engine
      await initializeProjectInstance(
        templateId, 
        initiationMode === 'supervised' ? selectedProfessor.id : null
      );

      setIsModalOpen(false);
      // Clean cross-domain redirection bringing them home to manifest the new entry instantly
      navigate('/dashboard');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to dispatch allocation request commands to server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Backend ProjectTemplateStatus Enum Interpreters modernized to support clean Tailwind utility mapping
  const getStatusBadgeConfig = (statusInt) => {
    switch (statusInt) {
      case 1: return { text: 'Draft', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
      case 2: return { text: 'Pending Review', classes: 'bg-amber-100 text-amber-700 border-amber-700/20' };
      case 3: return { text: 'Changes Requested', classes: 'bg-red-50 text-red-600 border-red-600/20' };
      case 4: return { text: 'Pending Acceptance', classes: 'bg-sky-100 text-sky-700 border-sky-700/20' };
      case 5: return { text: 'Publicly Approved', classes: 'bg-green-50 text-green-700 border-green-700/20' };
      case 6: return { text: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-700/20' };
      case 7: return { text: 'Archived', classes: 'bg-slate-50 text-slate-400 border-slate-400/20' };
      default: return { text: 'Unknown Identity', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
    }
  };

  if (loading) {
    return (
      <div className="text-slate-600 text-center py-16 font-medium">
        De-serializing comprehensive blueprint records...
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl border border-red-200 text-center space-y-4">
        <AlertCircle size={40} className="text-red-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-700 mb-1">Blueprint Synchronization Error</h3>
        <p className="text-slate-500 text-sm mb-6">{error || 'The requested template could not be mapped to an active dataset entity.'}</p>
        <button 
          onClick={() => navigate('/dashboard/marketplace')} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Return to Marketplace
        </button>
      </div>
    );
  }

  const title = template.title || template.Title;
  const description = template.description || template.Description;
  const statusInt = template.status !== undefined ? template.status : template.Status;
  const companyName = template.providerCompanyName || template.ProviderCompanyName || 'Enterprise Sponsor Partner';
  const requiredSkills = template.requiredSkills || template.RequiredSkills || template.skills || template.Skills || [];
  const milestones = template.milestones || template.Milestones || [];
  const dependencies = template.dependencies || template.Dependencies || [];
  const primaryDiscipline = template.discipline || template.Discipline || template.category || template.Category || '';

  // Invoke the milestone transformer payload adapter and trigger state verification log
  const adaptedMilestones = adaptMilestones(milestones, dependencies);
  console.log(adaptedMilestones);

  // Math Data Aggregations & Target Estimations
  const totalEstimatedScope = adaptedMilestones.reduce((sum, m) => sum + (Number(m.expectedHours) || 0), 0);
  const totalCheckpoints = adaptedMilestones.length;

  // Real-time Capabilities Intersection Computations aligned with StudentProfileDto Contract
  const userSkills = user?.skills || [];
  const matchIntersectionCount = requiredSkills.filter(sk => {
    const skId = String(sk.id || sk.skillId || sk.Id || '').toLowerCase().trim();
    const skName = String(sk.name || sk.Name || '').toLowerCase().trim();
    
    return userSkills.some(userSk => {
      const uId = String(userSk?.id || userSk?.skillId || userSk?.Id || '').toLowerCase().trim();
      const uName = String(userSk?.name || userSk?.Name || '').toLowerCase().trim();
      
      // Bulletproof match evaluation via lowercased GUID strings or normalized names
      return (skId && uId && skId === uId) || (skName && uName && skName === uName);
    });
  }).length;
  const totalRequirementCount = requiredSkills.length;

  const statusBadge = getStatusBadgeConfig(statusInt);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Upper Navigation Anchor */}
      <button 
        onClick={() => navigate('/dashboard/marketplace')}
        className="inline-flex items-center gap-2 py-1 text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer text-sm font-semibold mb-2 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Project Marketplace
      </button>

      {/* Main Core Briefing Sheet (Structural Shell Wrapper) */}
      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm mb-4">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
              <Building2 size={14} />
              {/* Interactive Hover-Sensitive Link Element for Directory Linkage */}
              <span className="text-slate-900 font-bold hover:text-primary hover:underline cursor-pointer transition-colors">
                {companyName}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">{title}</h1>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusBadge.classes}`}>
            Status: {statusBadge.text}
          </span>
        </div>

        {/* Aggregate Scope Banner */}
        <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-sm font-semibold text-slate-700 mb-6">
          <div>Total Estimated Scope: <span className="text-slate-900 font-extrabold">{totalEstimatedScope} hrs</span></div>
          <div className="w-px h-4 bg-slate-300/60" />
          <div>Total Checkpoints: <span className="text-slate-900 font-extrabold">{totalCheckpoints}</span></div>
        </div>

        <p className="text-slate-600 text-[0.95rem] leading-relaxed whitespace-pre-line mb-6">
          {description}
        </p>

        {/* Modernized layout separation rule using strict parameters */}
        <div className="border-t border-slate-200/60 w-full pt-6">
          {requiredSkills.length > 0 && (
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Capabilities & Prerequisites</span>
              
              {/* Automated System Notification Profile Matcher Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
                You possess {matchIntersectionCount} of {totalRequirementCount} required capabilities
              </div>

              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map((sk, idx) => (
                  <span key={sk.skillId || sk.Id || idx} className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-semibold">
                    {sk.name || sk.Name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Milestone Dependencies Graph Map Section */}
      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <GitMerge size={20} className="text-primary" />
          Project Architecture & Evaluation Graph Plan
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Analyze the sequential execution constraints mapping checkpoints below. Arrow branches represent strict prerequisite dependencies enforced by the pipeline engine.
        </p>

        {/* Forced view layout integration parameters configured to Graph view exclusively */}
        <MilestoneVisualizer milestones={adaptedMilestones} isWorkspace={false} />
      </div>

      {/* Interface Action Control Panel Row (Strictly Student Flow Routing Only) */}
      <div className="flex flex-wrap items-center justify-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 mt-4">
        {userRole === 'student' && statusInt === 5 && (
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

      {/* ================= WORKFLOW INITIALIZATION GATE OVERLAY MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
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

            {/* Modal Body Canvas */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {modalError && (
                <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm font-medium mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* STEP 1: Route Selection Fork */}
              {initiationMode === null && (
                <div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Select how you want to deploy this capstone aggregate model workspace track. You can modify mentorship settings post-launch.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    {/* Option A: Go Solo */}
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

                    {/* Option B: Seek Supervision */}
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

              {/* STEP 2: Supervised Faculty Directory Search Deck */}
              {initiationMode === 'supervised' && (
                <div>
                  <button 
                    onClick={() => { setInitiationMode(null); setSelectedProfessor(null); }} 
                    className="bg-transparent border-none text-primary hover:text-primary-hover text-xs font-bold cursor-pointer flex items-center gap-1 mb-4 p-0 transition-colors"
                  >
                    ← Back to selection options
                  </button>
                  
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

                  {/* Directory Results Matrix */}
                  <div className="border border-slate-200 rounded-lg max-h-[220px] overflow-y-auto bg-slate-50/50">
                    {searchingProfessors ? (
                      <div className="p-4 text-xs text-slate-500 text-center">Querying corporate faculty clusters...</div>
                    ) : professorResults.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 text-center">
                        {professorSearchQuery ? 'No matching faculty identities found.' : 'Type to query directory grid...'}
                      </div>
                    ) : (
                      professorResults.map(prof => {
                        const isChosen = selectedProfessor?.id === prof.id;
                        const isFull = Number(prof.slots) >= 4;
                        
                        // Check if any professor concentration matches the template's active discipline field
                        const isDomainExpert = primaryDiscipline && prof.specialties?.some(spec => {
                          const specStr = typeof spec === 'object' ? (spec.name || spec.Name || '') : String(spec);
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
                                  {/* Domain Expert Match Badge */}
                                  {isDomainExpert && (
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0">
                                      ✨ Domain Expert
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">{prof.email}</div>
                                
                                {/* Capacity Meter Allocation Safeguard */}
                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                                  Available Slots: {prof.slots || 0}/4
                                </div>

                                {/* Core Specialties Row of Micro-tags */}
                                {prof.specialties && prof.specialties.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {prof.specialties.map((spec, sIdx) => (
                                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                        {typeof spec === 'object' ? (spec.name || spec.Name) : spec}
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

              {/* STEP 3: Solo Trigger Summary Checkout Confirmation */}
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

            {/* Modal Actions Footer Bar */}
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