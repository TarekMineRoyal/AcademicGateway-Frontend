import PropTypes from 'prop-types';
import { getTaskLabel } from './utils/milestoneUtils';

/**
 * MilestoneChecklistSection
 * Pure presentational component rendering a milestone's granular checklist breakdown.
 *
 * @param {Object} props
 * @param {Array} [props.tasks=[]] - Array of task items (strings or objects)
 */
export function MilestoneChecklistSection({ tasks = [] }) {
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Granular Checklist Breakdown
      </h4>

      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={task.id || index}
              className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600"
            >
              <input
                type="checkbox"
                disabled
                readOnly
                checked={false}
                className="mt-0.5 rounded border-slate-300 text-brand-dark focus:ring-0 opacity-60 pointer-events-none"
              />
              <span className="leading-tight flex-1">{getTaskLabel(task)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg text-xs font-medium italic text-center">
          No granular tasks attached to this checkpoint blueprint.
        </div>
      )}
    </div>
  );
}

MilestoneChecklistSection.propTypes = {
  tasks: PropTypes.array,
};