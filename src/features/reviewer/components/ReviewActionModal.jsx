import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Reusable action modal for reviewing (approving or rejecting) items.
 * Enforces business rules:
 *  - Approval: Prompts simple confirmation.
 *  - Rejection: Mandates non-empty/non-whitespace rejectionReason text area.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Callback triggered to dismiss the modal.
 * @param {Function} props.onSubmit - Callback triggered with { isApproved, rejectionReason }.
 * @param {boolean} props.isApproved - True if approving, false if rejecting.
 * @param {string} [props.targetTitle] - Name/title of item being reviewed for context.
 * @param {boolean} [props.isSubmitting=false] - Loading indicator state during API call.
 * @param {string|null} [props.error=null] - Backend error message if review request fails.
 */
export function ReviewActionModal({
  isOpen,
  onClose,
  onSubmit,
  isApproved,
  targetTitle,
  isSubmitting = false,
  error = null,
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevIsApproved, setPrevIsApproved] = useState(isApproved);

  // Sync/reset local state during render when modal opens or review action mode switches
  if (isOpen !== prevIsOpen || isApproved !== prevIsApproved) {
    setPrevIsOpen(isOpen);
    setPrevIsApproved(isApproved);
    if (isOpen) {
      setRejectionReason('');
    }
  }

  if (!isOpen) return null;

  const isRejectInvalid = !isApproved && rejectionReason.trim().length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isApproved && isRejectInvalid) return;

    onSubmit({
      isApproved,
      rejectionReason: isApproved ? null : rejectionReason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-base">
            {isApproved ? (
              <>
                <CheckCircle size={20} className="text-emerald-600" />
                <span className="text-emerald-900">Approve Submission</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-rose-600" />
                <span className="text-rose-900">Reject Submission</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 transition-colors rounded-lg disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form & Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Context Item Title */}
            {targetTitle && (
              <p className="text-xs text-slate-500 font-medium">
                Target: <span className="text-slate-800 font-semibold">{targetTitle}</span>
              </p>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-xs font-medium">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Approval Flow Confirmation Text */}
            {isApproved ? (
              <p className="text-slate-600 text-sm leading-relaxed">
                Are you sure you want to approve this submission? Once approved, the submitter will be notified and granted access to the platform.
              </p>
            ) : (
              /* Rejection Flow Text Area */
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide explicit feedback explaining why this submission was rejected..."
                  disabled={isSubmitting}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none transition-all placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 italic">
                  A non-empty reason is required so the applicant understands what changes are needed.
                </p>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!isApproved && isRejectInvalid)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 text-white ${
                isApproved
                  ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300'
                  : 'bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : isApproved ? (
                'Confirm Approval'
              ) : (
                'Confirm Rejection'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}