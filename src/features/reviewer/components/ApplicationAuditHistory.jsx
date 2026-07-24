import { History } from 'lucide-react';

/**
 * Renders audit log timeline and submission history for an application dossier.
 */
export function ApplicationAuditHistory({ history, application }) {
  const auditLogs = history ?? application?.history ?? [];

  if (auditLogs.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        <History size={14} className="text-primary" /> Audit & Submission History
      </div>
      <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-4 text-xs">
        {auditLogs.map((event, idx) => (
          <div key={idx} className="relative space-y-0.5">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
            <div className="font-bold text-slate-800">{event.action || event.status}</div>
            {event.notes && <p className="text-slate-500 italic">{event.notes}</p>}
            {(event.timestamp || event.submittedAt) && (
              <span className="text-[11px] text-slate-400 block">
                {new Date(event.timestamp || event.submittedAt).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}