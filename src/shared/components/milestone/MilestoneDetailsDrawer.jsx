import PropTypes from 'prop-types';

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
  const associatedTasks = milestone.tasks || milestone.Tasks || [];

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
          <div className="grid grid-cols-2 gap-3.5 border-t border-b border-slate-100 py-4">
            <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Expected Effort
              </span>
              <span className="text-xs font-semibold text-slate-700 block">
                ⏱️ {milestone.expectedHours || 0} hrs allocated
              </span>
            </div>
            
            <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Deliverable Type
              </span>
              <span className="text-xs font-semibold text-slate-700 block">
                📦 Required: {milestone.deliverableType || 'None'}
              </span>
            </div>
          </div>

          {/* Scope Checklist Stack Section */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Granular Checklist Breakdown
            </h4>
            
            {associatedTasks.length > 0 ? (
              <div className="space-y-2">
                {associatedTasks.map((task, index) => {
                  const taskLabel = typeof task === 'string' ? task : (task.title || task.Name || 'Untitled Objective');
                  return (
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
                      <span className="leading-tight flex-1">{taskLabel}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Informational Empty Notice State Handle Target */
              <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg text-xs font-medium italic text-center">
                No granular tasks attached to this checkpoint blueprint.
              </div>
            )}
          </div>
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