import { useQuery } from '@tanstack/react-query';
import { getProjectTemplateById } from '../reviewerApi';
import { adaptMilestones } from '../../../shared/utils/milestoneAdapter';
import MilestoneVisualizer from '../../../shared/components/milestone/MilestoneVisualizer';
import { 
  X, Layers, Building2, GitMerge, Check, AlertCircle, Clock 
} from 'lucide-react';
import { TemplateAcademicAlignment } from './TemplateAcademicAlignment';
import { TemplateSkillsList } from './TemplateSkillsList';

/**
 * Inspection modal for reviewing unapproved project template blueprints.
 */
export function TemplateDetailModal({
  templateId,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) {
  const { data: template, isLoading, error } = useQuery({
    queryKey: ['reviewerTemplateDetails', templateId],
    queryFn: () => getProjectTemplateById(templateId),
    enabled: !!templateId && isOpen,
  });

  if (!isOpen || !templateId) return null;

  const milestones = template?.milestones || [];
  const dependencies = template?.dependencies || [];
  const requiredSkills = template?.requiredSkills || template?.skills || [];
  
  const adaptedMilestones = adaptMilestones(milestones, dependencies);
  const totalEstimatedScope = adaptedMilestones.reduce((sum, m) => sum + (Number(m.expectedHours) || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Layers size={20} className="text-primary" />
            <span>Project Template Blueprint Inspection</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 transition-colors rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">De-serializing template architecture & graph plan...</p>
            </div>
          ) : error ? (
            <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg text-sm font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error.response?.data?.message || 'Unable to retrieve template details.'}</span>
            </div>
          ) : template ? (
            <>
              {/* Header Info Block */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
                    <Building2 size={14} />
                    <span>{template.providerCompanyName || 'Provider / Organization Blueprint'}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {template.title}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 shrink-0">
                  <Clock size={13} /> Pending Review
                </span>
              </div>

              {/* Metrics Summary Strip */}
              <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs font-semibold text-slate-700">
                <div>
                  Total Estimated Scope: <span className="text-slate-900 font-extrabold">{totalEstimatedScope} hrs</span>
                </div>
                <div className="w-px h-4 bg-slate-300/60" />
                <div>
                  Milestones: <span className="text-slate-900 font-extrabold">{adaptedMilestones.length} Checkpoints</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description & Objectives</h4>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {template.description || 'No description provided for this template.'}
                </p>
              </div>

              {/* Academic Alignment */}
              <TemplateAcademicAlignment template={template} />

              {/* Required Capabilities / Skills */}
              <TemplateSkillsList skills={requiredSkills} template={template} />

              {/* Milestone Graph Visualizer Component */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <GitMerge size={18} className="text-primary" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Execution Graph & Dependency Plan
                  </h4>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <MilestoneVisualizer milestones={adaptedMilestones} isWorkspace={false} />
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>

          {template && (
            <>
              <button
                type="button"
                onClick={() => onReject(template)}
                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <X size={14} /> Reject Template
              </button>

              <button
                type="button"
                onClick={() => onApprove(template)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Check size={14} /> Approve Template
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}