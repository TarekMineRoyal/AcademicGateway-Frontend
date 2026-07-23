import PropTypes from 'prop-types';
import { getAssociatedTasks } from './utils/milestoneUtils';
import { MilestoneAnalyticsMatrix } from './MilestoneAnalyticsMatrix';
import { MilestoneChecklistSection } from './MilestoneChecklistSection';

/**
 * MilestoneDetailsDrawer
 * Slide-out drawer component displaying detailed milestone information, analytics, and task checklist.
 *
 * @param {Object} props
 * @param {Object|null} props.milestone - The selected milestone details object, or null if closed
 * @param {Function} props.onClose - Callback function to close the drawer
 */
export function MilestoneDetailsDrawer({ milestone, onClose }) {
  if (!milestone) return null;

  // Safely resolve backend payload array casing variances for underlying work matrices
  const associatedTasks = getAssociatedTasks(milestone);

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fade-in"
      onClick={onClose} // Seamless background vector backdrop tap dismissal
    >
      <div 
        className="bg-white h-full w-full max-w-md p-6 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Stop bubble events from closing drawer unexpectedly on interior interaction
      >
        {/* Drawer Section Scroll Container Area */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-6">
          
          {/* Header Context Action Container */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black text-brand-dark mb-2">
                {milestone.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {milestone.description || "No supplemental descriptions attached to this blueprint checkpoint blueprint."}
              </p>
            </div>
            
            {/* Close Drawer Button */}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-150 p-1 rounded-md cursor-pointer ml-4"
              aria-label="Dismiss details"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scope & Effort Analytics Matrix */}
          <MilestoneAnalyticsMatrix
            expectedHours={milestone.expectedHours}
            deliverableType={milestone.deliverableType}
          />

          {/* Scope Checklist Stack Section */}
          <MilestoneChecklistSection tasks={associatedTasks} />
        </div>
      </div>
    </div>
  );
}

MilestoneDetailsDrawer.propTypes = {
  milestone: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    expectedHours: PropTypes.number,
    deliverableType: PropTypes.string,
    tasks: PropTypes.array,
    Tasks: PropTypes.array,
  }),
  onClose: PropTypes.func.isRequired,
};