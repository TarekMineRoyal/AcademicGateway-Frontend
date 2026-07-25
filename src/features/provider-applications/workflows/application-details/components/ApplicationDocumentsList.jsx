import { FileText, ExternalLink } from 'lucide-react';

/**
 * Renders a list of submitted verification documents for an application dossier.
 */
export function ApplicationDocumentsList({ documents, application }) {
  const docs = documents ?? application?.documents ?? [];

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        <FileText size={14} className="text-primary" /> Submitted Verification Documents
      </div>
      {docs.length > 0 ? (
        <div className="space-y-2">
          {docs.map((doc, idx) => (
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
  );
}