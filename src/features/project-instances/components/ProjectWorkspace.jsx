import { useNavigate } from 'react';
import { useProjectWorkspace } from '../hooks/useProjectWorkspace';
import MilestoneActionCenter from './MilestoneActionCenter';
import MilestoneVisualizer from '../../../shared/components/milestone/MilestoneVisualizer';
import { ProjectInstanceStatus } from '../../../shared/constants/enums';
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

export default function ProjectWorkspace({ projectInstanceId }) {
  const navigate = useNavigate(); 

  // Consume our encapsulated workspace state & logic hook
  const { 
    project, 
    milestones, 
    selectedMilestone, 
    selectedMilestoneId, 
    setSelectedMilestoneId, 
    isLoading, 
    error 
  } = useProjectWorkspace(projectInstanceId);

  // Status-badge configuration mapper
  const getStatusConfig = (statusValue) => {
    switch (statusValue) {
      case ProjectInstanceStatus.AWAITING_SUPERVISION:
        return {
          text: 'Awaiting Supervision',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock size={14} />
        };
      case ProjectInstanceStatus.ACTIVE:
        return {
          text: 'Active Workspace',
          className: 'bg-green-50 text-green-800 border-green-200',
          icon: <CheckCircle size={14} />
        };
      case ProjectInstanceStatus.CONCLUDED:
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
    } catch {
      return dateStr;
    }
  }; 

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 text-center py-32 px-8 font-medium font-sans">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
        <div className="text-sm tracking-wide">Synchronizing workspace metadata...</div>
      </div>
    );
  } 

  // Error Boundary Screen
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-red-50 border border-red-200 rounded-2xl text-center font-sans shadow-sm">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">Workspace Handshake Interrupted</h3>
        <p className="text-gray-600 text-sm mb-6">{error.message || 'An error occurred.'}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg font-semibold cursor-pointer shadow-sm transition duration-150 text-sm"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    );
  } 

  // Empty Registry Screen
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

  // Destructure project metadata
  const { 
    titleSnapshot, 
    descriptionSnapshot, 
    status, 
    supervisorName, 
    providerCompanyName, 
    snapshotSkills = [], 
    createdAt, 
    endDate, 
    isSoloMode 
  } = project;

  const statusBadge = getStatusConfig(status); 

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
              {titleSnapshot}
            </h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed m-0">
              {descriptionSnapshot}
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
              {!isSoloMode && supervisorName ? supervisorName : 'Solo Project Mode'}
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
                {providerCompanyName ? `${providerCompanyName}` : 'Independent Core Blueprint'}
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
              {formatDateString(createdAt)} &mdash; {formatDateString(endDate)}
            </span>
          </div>

        </div>

        {/* Row 3: Visual Capstone Capability Pills */}
        {snapshotSkills.length > 0 && (
          <div className="border-t border-gray-100 pt-5 mt-5">
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Workspace Snapshot Capability Focus
            </span>
            <div className="flex flex-wrap gap-2">
              {snapshotSkills.map((sk, idx) => (
                <span 
                  key={sk.id || idx} 
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-semibold border border-gray-200"
                >
                  {sk.name || 'System Skill'}
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
          <MilestoneVisualizer 
            milestones={milestones} 
            isWorkspace={true} 
            selectedMilestoneId={selectedMilestoneId}
            onSelectMilestone={setSelectedMilestoneId}
          />
        </div>

        {/* Right Column: Dynamic Comments / Detail Action Center Drawer */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <MilestoneActionCenter 
            projectInstanceId={projectInstanceId}
            milestone={selectedMilestone}
            project={project} 
          />
        </div>

      </div>
    </div>
  );
}