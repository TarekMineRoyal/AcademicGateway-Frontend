import { Building2, Code, ArrowUpRight, GraduationCap } from 'lucide-react';

/**
 * Reusable project card component for both recommended and marketplace grid projects.
 * Handles display of provider info, academic alignment tags, target capabilities,
 * verification badges, and match rankings.
 * 
 * @param {Object} props
 * @param {Object} props.project - The project blueprint data object
 * @param {Function} props.onSelect - Callback invoked when clicking "View Project Blueprint"
 * @param {boolean} [props.isRecommended=false] - Whether the card is rendered in the AI recommendation section
 * @param {number} [props.matchRank] - Optional recommendation rank number (e.g., 1 for #1 Match)
 */
export function ProjectCard({
  project,
  onSelect,
  isRecommended = false,
  matchRank,
}) {
  const isVerifiedProvider = project.isProviderVerified !== false;

  // Dynamic card container styling based on mode and provider verification
  const cardStyle = isRecommended
    ? 'bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 border border-indigo-200/80 hover:border-indigo-400'
    : isVerifiedProvider
    ? 'bg-white border border-slate-200 hover:border-primary'
    : 'bg-slate-50/50 border border-dashed border-slate-300';

  // Dynamic button styling based on mode
  const buttonStyle = isRecommended
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-primary hover:bg-primary-hover';

  return (
    <div
      className={`flex flex-col justify-between p-6 rounded-card shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${cardStyle}`}
    >
      {/* Top Rank Badge for AI Recommendations */}
      {isRecommended && matchRank != null && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
          #{matchRank} Match
        </div>
      )}

      <div>
        {/* Header: Provider & Verification Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <Building2
              size={14}
              className={isRecommended ? 'text-indigo-500' : 'text-slate-400'}
            />
            {project.providerCompanyName}
          </div>

          {!isRecommended && !isVerifiedProvider && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded">
              Unverified Provider
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3
          className={`text-base font-bold text-brand-dark mb-2 line-clamp-1 ${
            isRecommended ? 'pr-14' : ''
          }`}
        >
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="line-clamp-3 text-sm text-slate-600 mb-6">
          {project.description}
        </p>
      </div>

      <div>
        {/* Academic Alignment Tags */}
        {(project.majorName || project.specialtyName) && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <GraduationCap size={12} /> Academic Alignment
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.majorName && (
                <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2 py-0.5 rounded">
                  {project.majorName}
                </span>
              )}
              {project.specialtyName && (
                <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 font-semibold px-2 py-0.5 rounded">
                  {project.specialtyName}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Target Capabilities / Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Code size={12} /> Target Capabilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map((sk) => (
                <span
                  key={sk.id}
                  className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* View Details Action Button */}
        <button
          type="button"
          onClick={() => onSelect?.(project.id)}
          className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-white font-bold text-xs rounded-btn shadow-xs transition-colors cursor-pointer ${buttonStyle}`}
        >
          View Project Blueprint
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}