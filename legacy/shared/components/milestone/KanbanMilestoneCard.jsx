import PropTypes from 'prop-types';
import { getMilestoneSequenceInfo } from './utils/milestoneUtils';

/**
 * KanbanMilestoneCard
 * Pure presentational component for rendering a milestone card within the Execution Kanban Board.
 *
 * @param {Object} props
 * @param {Object} props.milestone - The milestone data object
 * @param {boolean} props.isSelected - Whether this card is currently selected
 * @param {boolean} props.isLocked - Whether this card is in a sequence-locked state
 * @param {Function} props.onClick - Callback function when the card is clicked
 * @param {Array} [props.allMilestones=[]] - Optional: The full array of milestones (needed for resolving prerequisite names when locked)
 */
export function KanbanMilestoneCard({ milestone, isSelected, isLocked, onClick, allMilestones = [] }) {
  return (
    <div
      onClick={() => onClick?.(milestone.id)}
      className={`bg-white border p-4 rounded-lg shadow-2xs hover:shadow-sm transition-all duration-150 mb-3 last:mb-0 cursor-pointer ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'
      }`}
    >
      {/* Card Upper Meta Row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-800 leading-snug">
          {milestone.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium shrink-0">
          <span>⏱️</span>
          <span>{milestone.expectedHours || 0} hrs</span>
        </div>
      </div>

      {/* Card Body Text with line-clamp truncation */}
      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 mb-3">
        {milestone.description || 'No description provided for this milestone.'}
      </p>

      {/* Conditional: Prerequisite Blockers Badge UI (Only render if locked and has prerequisites) */}
      {isLocked && milestone.prerequisiteIds && milestone.prerequisiteIds.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 flex flex-wrap items-center gap-1.5">
          {milestone.prerequisiteIds.map((predId) => {
            const { sequenceNum, title } = getMilestoneSequenceInfo(allMilestones, predId);

            return (
              <span
                key={predId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase"
                title={`Blocked by: ${title}`}
              >
                🔒 Awaits M{sequenceNum}: {title}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

KanbanMilestoneCard.propTypes = {
  milestone: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    expectedHours: PropTypes.number,
    prerequisiteIds: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  allMilestones: PropTypes.array,
};