import { useApplicationDetails } from '../hooks/useApplicationDetails';
import { 
  X, Building2, Globe, Calendar, AlertCircle, Check 
} from 'lucide-react';
import { ApplicationContactDetails } from './ApplicationContactDetails';
import { ApplicationDocumentsList } from './ApplicationDocumentsList';
import { ApplicationAuditHistory } from './ApplicationAuditHistory';

/**
 * Inspection drawer/modal for detailed provider application reviews.
 */
export function ApplicationDetailModal({
  applicationId,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) {
  const { application, isLoading, error } = useApplicationDetails(applicationId);

  if (!isOpen || !applicationId) return null;

  const companyName = application?.companyName || application?.providerName || 'Unspecified Entity';
  const submissionDate = application?.createdAt || application?.submittedAt;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Building2 size={20} className="text-primary" />
            <span>Provider Application Dossier</span>
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
              <p className="text-xs text-slate-500 font-medium">Loading full application record & documents...</p>
            </div>
          ) : error ? (
            <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg text-sm font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error.response?.data?.message || 'Unable to retrieve application details.'}</span>
            </div>
          ) : application ? (
            <>
              {/* Header Info / Company Overview */}
              <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                  {companyName.charAt(0) || <Building2 size={28} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{companyName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {application.websiteUrl && (
                      <a href={application.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-medium">
                        <Globe size={13} />
                        {application.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {submissionDate && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={13} /> Submitted: {new Date(submissionDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Contact & Credentials */}
              <ApplicationContactDetails application={application} />

              {/* Organization Bio / Description */}
              {application.description && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Building2 size={14} className="text-primary" /> Organization Overview
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-line">
                    {application.description}
                  </p>
                </div>
              )}

              {/* Verified Documents Links */}
              <ApplicationDocumentsList documents={application.documents} application={application} />

              {/* Application Lifecycle History */}
              <ApplicationAuditHistory history={application.history} application={application} />
            </>
          ) : null}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
            Close
          </button>
          {application && (
            <>
              <button type="button" onClick={() => onReject(application)} className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                <X size={14} /> Reject Application
              </button>
              <button type="button" onClick={() => onApprove(application)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm">
                <Check size={14} /> Approve Application
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}