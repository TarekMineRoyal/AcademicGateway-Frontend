import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails, getProjectMilestones } from '../projectInstancesApi'; 
import MilestoneActionCenter from './MilestoneActionCenter';
import { adaptMilestones } from '../../../utils/milestoneAdapter';
import MilestoneVisualizer from '../../../components/milestone/MilestoneVisualizer';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Building, 
  User, 
  Award, 
  ShieldAlert, 
  CheckCircle
} from 'lucide-react'; 

export default function ProjectWorkspace() {
  const { projectInstanceId } = useParams(); 
  const navigate = useNavigate(); 
  
  // Core Local State Matrices
  const [project, setProject] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Lifted Milestone Timeline & Selection States
  const [milestones, setMilestones] = useState([]); 
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null); 
  const [milestonesLoading, setMilestonesLoading] = useState(true); 
  const [milestonesError, setMilestonesError] = useState(null); 

  // Retrieve Core Data Lifecycle
  useEffect(() => {
    if (!projectInstanceId) return;
    
    setLoading(true);
    setError(null);

    getProjectDetails(projectInstanceId) 
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        console.error("Workspace synchronization failed:", err);
        setError(err.message || "Failed to load project details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectInstanceId]); 

  // Re-fetch milestones and auto-select active sequences dynamically
  const fetchMilestones = (autoSelect = false) => {
    if (!projectInstanceId) return Promise.resolve();

    if (autoSelect) {
      setMilestonesLoading(true);
    }
    setMilestonesError(null);

    return getProjectMilestones(projectInstanceId)
      .then((data) => {
        const rawLoaded = data || [];

        // Pass raw milestones and an optional dependencies edge matrix if present
        const adaptedData = adaptMilestones(rawLoaded, project?.dependencies || []);

        setMilestones(adaptedData);

        if (autoSelect && adaptedData.length > 0) {
          const firstActive = adaptedData.find(m => m.status === 'InProgress') 
            || adaptedData.find(m => m.status !== 'Completed') 
            || adaptedData[0];

          if (firstActive) {
            setSelectedMilestoneId(firstActive.id);
          }
        }
      })
      .catch((err) => {
        console.error("Milestone tree synchronization failed:", err);
        setMilestonesError(err.message || "Failed to load project milestones roadmap.");
      })
      .finally(() => {
        if (autoSelect) {
          setMilestonesLoading(false);
        }
      });
  };

  // Retrieve Milestones & Auto-select first active sequence on load
  useEffect(() => {
    fetchMilestones(true);
  }, [projectInstanceId]);

  // Status-badge configuration mapper using beautiful Tailwind utility classes
  const getStatusConfig = (statusValue) => {
    switch (statusValue) {
      case 1: 
        return { 
          text: 'Awaiting Supervision', 
          className: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: <Clock size={14} /> 
        }; 
      case 2: 
        return { 
          text: 'Active Workspace', 
          className: 'bg-green-50 text-green-800 border-green-200', 
          icon: <CheckCircle size={14} /> 
        }; 
      case 3: 
        return { 
          text: 'Concluded', 
          className: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: <Award size={14} /> 
        }; 
      default: 
        return { 
          text: 'Canceled', 
          className: 'bg-gray-50 text-gray-600 border-gray-200', 
          icon: <ShieldAlert size={14} /> 
        }; 
    }
  };

  // Human-readable date-string conversion helper
  const formatDateString = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  }; 

  // Main Loading Screen in Tailwind
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 text-center py-32 px-8 font-medium font-sans">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
        <div className="text-sm tracking-wide">Decrypting academic sandbox environment parameters...</div>
      </div>
    );
  } 

  // Error Boundary Screen in Tailwind
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-red-50 border border-red-200 rounded-2xl text-center font-sans shadow-sm">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">Workspace Handshake Interrupted</h3>
        <p className="text-gray-600 text-sm mb-6">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg font-semibold cursor-pointer shadow-sm transition duration-150 text-sm"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    );
  } 

  // Empty Registry Screen in Tailwind
  if (!project) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-gray-200 rounded-2xl text-center font-sans shadow-sm">
        <ShieldAlert size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Workspace Registry Empty</h3>
        <p className="text-gray-500 text-sm mb-6">The requested live workspace instance could not be located in academic registers.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg font-semibold cursor-pointer shadow-sm transition duration-150 text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  } 

  // Defensive casing-resilient data-binding mapping
  const projectTitle = project.titleSnapshot || project.TitleSnapshot || project.title || project.Title || 'Dynamic Project Stream'; 
  const projectDesc = project.descriptionSnapshot || project.DescriptionSnapshot || project.description || project.Description || 'Academic development workspace initialized.'; 
  const rawStatus = project.status !== undefined ? project.status : (project.Status !== undefined ? project.Status : 1); 
  const statusBadge = getStatusConfig(rawStatus); 

  const supervisor = project.supervisorName || project.SupervisorName || project.professorName || project.ProfessorName || null; 
  const providerName = project.providerCompanyName || project.ProviderCompanyName || project.providerName || project.ProviderName || null; 
  const skillsArray = project.snapshotSkills || project.SnapshotSkills || project.requiredSkills || project.RequiredSkills || []; 
  
  const createdDate = project.createdAt || project.CreatedAt || null; 
  const targetEndDate = project.endDate || project.EndDate || null; 
  const isSoloMode = project.isSoloMode !== undefined ? project.isSoloMode : (!supervisor); 

  // Find the currently active milestone object to pass into the Action Center
  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-sans">
      
      {/* 1. Header Navigation Breadcrumb */}
      <button 
        onClick={() => navigate('/dashboard')} 
        className="inline-flex items-center gap-2 py-2 text-gray-600 hover:text-blue-600 bg-transparent border-none cursor-pointer text-sm font-semibold mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* 2. Workspace Meta Summary Card */}
      <div className="bg-white p-6 md:p-8 rounded-card border border-slate-200/60 shadow-2xs mb-8">
        
        {/* Row 1: Title & Status Badge */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
              {projectTitle}
            </h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed m-0">
              {projectDesc}
            </p>
          </div>
          
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold ${statusBadge.className}`}>
            {statusBadge.icon} {statusBadge.text}
          </span>
        </div>

        {/* Row 2: Stakeholder & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6 mt-6">
          
          {/* Faculty Supervisor Node */}
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Academic Advisor
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
              <User size={15} className="text-gray-500" />
              {!isSoloMode && supervisor ? supervisor : 'Solo Project Mode'}
            </span>
          </div>

          {/* Industry Sponsor Node */}
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Sponsor Unit
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
              <Building size={15} className="text-gray-500" />
              <span className="text-slate-800 font-bold hover:text-primary hover:underline cursor-pointer transition-colors duration-150">
                {providerName ? `${providerName}` : 'Independent Core Blueprint'}
              </span>
            </span>
          </div>

          {/* Timeline Range Node */}
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Timeline Windows
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
              <Calendar size={15} className="text-gray-500" />
              {formatDateString(createdDate)} &mdash; {formatDateString(targetEndDate)}
            </span>
          </div>

        </div>

        {/* Row 3: Visual Capstone Capability Pills */}
        {skillsArray.length > 0 && (
          <div className="border-t border-gray-100 pt-5 mt-5">
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Workspace Snapshot Capability Focus
            </span>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((sk, idx) => (
                <span 
                  key={sk.id || sk.Id || sk.skillId || idx} 
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-semibold border border-gray-200"
                >
                  {sk.name || sk.Name || 'System Skill'}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. Operational Division Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        
        {/* Left Column: Milestone Visualizer Interface Shell */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {milestonesLoading ? (
            <div className="bg-white border border-slate-200/60 rounded-xl py-24 px-8 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="inline-block w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-slate-600 text-sm font-medium">Synchronizing operational roadmap matrices...</p>
            </div>
          ) : milestonesError ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl py-16 px-8 text-center shadow-2xs">
              <ShieldAlert size={36} className="text-rose-500 mx-auto mb-4" />
              <p className="text-rose-700 text-sm font-semibold">Workspace Sync Interrupted</p>
              <p className="text-slate-500 text-xs mt-1">{milestonesError}</p>
            </div>
          ) : (
            <MilestoneVisualizer 
              milestones={milestones} 
              isWorkspace={true} 
              selectedMilestoneId={selectedMilestoneId}
              onSelectMilestone={setSelectedMilestoneId}
            />
          )}
        </div>

        {/* Right Column: Dynamic Comments / Detail Action Center Drawer */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <MilestoneActionCenter 
            projectInstanceId={projectInstanceId}
            milestone={selectedMilestone}
            project={project} 
            onRefresh={() => fetchMilestones(false)}
          />
        </div>

      </div>
    </div>
  );
}