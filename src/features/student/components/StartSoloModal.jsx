import PropTypes from 'prop-types';
import { Zap } from 'lucide-react';

export default function StartSoloModal({
  project,
  isStartingSolo = false,
  onConfirm,
  onClose,
}) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-card shadow-xl border border-slate-200 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-brand-dark mb-3 flex items-center gap-2">
          <Zap size={18} className="text-amber-600" /> Start Project Solo
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          You are launching <strong>{project.title}</strong> independently. This initializes your workspace channel <strong>immediately</strong> (Status: Active).
          <br /><br />
          <span className="block bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-xs font-medium">
            <strong>Important Process Node:</strong> The advisor invitation issued to <strong>{project.requestedProfessorName || 'Pending Assignment'}</strong> remains active in the registry. They can claim it and join your running workspace seamlessly at any later milestone point.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            disabled={isStartingSolo}
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-btn bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isStartingSolo}
            onClick={onConfirm}
            className="px-4 py-2 rounded-btn bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isStartingSolo ? 'Activating Workspace...' : 'Confirm & Start Solo'}
          </button>
        </div>
      </div>
    </div>
  );
}

StartSoloModal.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    requestedProfessorName: PropTypes.string,
  }),
  isStartingSolo: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};