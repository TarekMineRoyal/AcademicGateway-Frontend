import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Building, User } from 'lucide-react';
import StatusBadge from '../../../shared/components/StatusBadge';
import ProgressBar from '../../../shared/components/ProgressBar';

export default function ActiveWorkspaceCard({ project }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workspace/projects/${project.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="border border-slate-200 rounded-lg p-5 bg-white transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer focus-within:ring-2 focus-within:ring-primary/20 outline-none"
    >
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="text-lg font-bold text-brand-dark line-clamp-2">{project.title}</h3>
        <StatusBadge status={project.status} />
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
        <ProgressBar
          progress={project.currentMilestoneProgress || 0}
          label={
            <>
              <strong className="text-brand-dark">Milestone Node:</strong>{' '}
              {project.currentMilestoneTitle || 'Initialization Stage'}
            </>
          }
        />

        <ProgressBar
          progress={project.totalProjectProgress || 0}
          label={<span className="font-semibold text-slate-700">Overall Pipeline Completion</span>}
          barColorClass="bg-accent"
          valueColorClass="text-emerald-600"
        />
      </div>

      {project.endDate && (
        <div className="text-xs text-slate-400 mt-3 text-right font-medium">
          Administrative Deadline: {new Date(project.endDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

ActiveWorkspaceCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    providerCompanyName: PropTypes.string,
    providerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isSoloMode: PropTypes.bool,
    professorName: PropTypes.string,
    professorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentMilestoneTitle: PropTypes.string,
    currentMilestoneProgress: PropTypes.number,
    totalProjectProgress: PropTypes.number,
    endDate: PropTypes.string,
  }).isRequired,
};