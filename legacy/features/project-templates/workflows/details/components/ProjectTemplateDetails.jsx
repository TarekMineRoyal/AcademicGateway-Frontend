import { useNavigate } from 'react-router-dom';
import { useProjectTemplateDetails } from "@/features/project-templates/workflows/details/hooks/useProjectTemplateDetails";
import { useProjectInitiation } from "@/features/project-templates/workflows/initiation/hooks/useProjectInitiation";
import TemplateHeader from "@/features/project-templates/shared/components/TemplateHeader";
import SkillMatchPrerequisites from './SkillMatchPrerequisites';
import ProjectInitiationModal from "@/features/project-templates/workflows/initiation/components/ProjectInitiationModal";
import MilestoneVisualizer from '@/shared/components/milestone/MilestoneVisualizer'; 
import { adaptMilestones } from '@/shared/utils/milestoneAdapter'; 
import { ProjectTemplateStatus } from '@/shared/constants/enums';
import { ArrowLeft, GitMerge, AlertCircle } from 'lucide-react';

function ProjectTemplateDetails({ templateId, userSkills = [], isStudent = false, skillsLoading = false }) {
  const navigate = useNavigate();
  
  const initiation = useProjectInitiation(templateId);

  const { 
    template, 
    directoryResults, 
    directoryPagination,
    isLoading, 
    isSearching, 
    error: hookError 
  } = useProjectTemplateDetails(templateId, initiation.debouncedSearch, initiation.searchPage);

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative">
      <button 
        onClick={() => navigate('/dashboard/marketplace')}
        className="inline-flex items-center gap-2 py-1 text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer text-sm font-semibold mb-2 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Project Marketplace
      </button>

      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm mb-4">
        <TemplateHeader
          title={title}
          description={description}
          statusToken={statusToken}
          providerCompanyName={providerCompanyName}
          totalEstimatedScope={totalEstimatedScope}
          totalCheckpoints={totalCheckpoints}
          majorName={majorName}
          specialtyName={specialtyName}
        />

        <SkillMatchPrerequisites
          requiredSkills={requiredSkills}
          userSkills={userSkills}
          isStudent={isStudent}
          skillsLoading={skillsLoading}
        />
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
            onClick={initiation.handleOpenInitiationModal}
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

      <ProjectInitiationModal
        templateId={templateId}
        title={title}
        primaryDiscipline={primaryDiscipline}
        isStudent={isStudent}
        directoryResults={directoryResults}
        directoryPagination={directoryPagination}
        isSearching={isSearching}
        {...initiation}
      />
    </div>
  );
}

export default ProjectTemplateDetails;