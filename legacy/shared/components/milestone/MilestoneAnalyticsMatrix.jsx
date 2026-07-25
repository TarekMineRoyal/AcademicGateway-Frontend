import PropTypes from 'prop-types';

/**
 * MilestoneAnalyticsMatrix
 * Pure presentational component rendering the Scope & Effort metrics grid for a milestone.
 *
 * @param {Object} props
 * @param {number} [props.expectedHours=0] - Allocated effort in hours
 * @param {string} [props.deliverableType='None'] - Deliverable type required for the milestone
 */
export function MilestoneAnalyticsMatrix({ expectedHours = 0, deliverableType = 'None' }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 border-t border-b border-slate-100 py-4">
      <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Expected Effort
        </span>
        <span className="text-xs font-semibold text-slate-700 block">
          ⏱️ {expectedHours || 0} hrs allocated
        </span>
      </div>

      <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Deliverable Type
        </span>
        <span className="text-xs font-semibold text-slate-700 block">
          📦 Required: {deliverableType || 'None'}
        </span>
      </div>
    </div>
  );
}

MilestoneAnalyticsMatrix.propTypes = {
  expectedHours: PropTypes.number,
  deliverableType: PropTypes.string,
};