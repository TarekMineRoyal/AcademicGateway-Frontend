import { useApplicationDetails } from '../hooks/useApplicationDetails';
import { 
  X, Building2, Mail, Globe, FileText, History, 
  Check, AlertCircle, Calendar, User, ExternalLink, Phone, MapPin 
} from 'lucide-react';

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
  const contactEmail = application?.contactEmail;
  const contactPerson = application?.contactPersonName || application?.fullName;
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
              {/* Header Info Block */}
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

              {/* Primary Contact & Credentials Summary */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <User size={14} className="text-primary" /> Primary Contact & Organizational Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div className="sm:col-span-2 bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Primary Contact Email</span>
                      {contactEmail ? (
                        <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5 mt-0.5">
                          <Mail size={15} /><span>{contactEmail}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No contact email on record</span>
                      )}
                    </div>
                  </div>
                  {contactPerson && (
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Contact Person</span>
                      <span className="font-bold text-slate-800">{contactPerson}</span>
                    </div>
                  )}
                  {application.phoneNumber && (
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Phone Number</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1"><Phone size={12} /> {application.phoneNumber}</span>
                    </div>
                  )}
                  {application.address && (
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Address</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1"><MapPin size={12} /> {application.address}</span>
                    </div>
                  )}
                  {application.taxRegistrationNumber && (
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Tax Registration / ID</span>
                      <span className="font-mono font-semibold text-slate-800">{application.taxRegistrationNumber}</span>
                    </div>
                  )}
                </div>
              </div>

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
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <FileText size={14} className="text-primary" /> Submitted Verification Documents
                </div>
                {application.documents && application.documents.length > 0 ? (
                  <div className="space-y-2">
                    {application.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={16} className="text-primary shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{doc.title || doc.fileName || `Document #${idx + 1}`}</span>
                        </div>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer shrink-0">
                            <span>View</span><ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    No attachment documents provided for this application.
                  </p>
                )}
              </div>

              {/* Application Lifecycle History */}
              {application.history && application.history.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <History size={14} className="text-primary" /> Audit & Submission History
                  </div>
                  <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-4 text-xs">
                    {application.history.map((event, idx) => (
                      <div key={idx} className="relative space-y-0.5">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                        <div className="font-bold text-slate-800">{event.action || event.status}</div>
                        {event.notes && <p className="text-slate-500 italic">{event.notes}</p>}
                        {(event.timestamp || event.submittedAt) && (
                          <span className="text-[11px] text-slate-400 block">{new Date(event.timestamp || event.submittedAt).toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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