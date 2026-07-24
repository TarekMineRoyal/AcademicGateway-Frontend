import { Eye, Check, X } from 'lucide-react';

/**
 * Action button cluster for table rows (Inspect, Approve, Reject).
 */
export function ReviewQueueActionGroup({
  onInspect,
  onApprove,
  onReject,
  inspectTitle = 'Inspect details',
  approveTitle = 'Approve',
  rejectTitle = 'Reject',
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onInspect}
        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
        title={inspectTitle}
      >
        <Eye size={14} className="text-slate-500" />
        <span>Inspect</span>
      </button>
      <button
        type="button"
        onClick={onApprove}
        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
        title={approveTitle}
      >
        <Check size={14} />
        <span>Approve</span>
      </button>
      <button
        type="button"
        onClick={onReject}
        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
        title={rejectTitle}
      >
        <X size={14} />
        <span>Reject</span>
      </button>
    </div>
  );
}

/**
 * Presentational table wrapper for reviewer queues.
 */
export function ReviewQueueTable({ headers, items, renderRow }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200/80">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
            {headers.map((header, index) => {
              const label = typeof header === 'string' ? header : header.label;
              const alignRight = typeof header === 'object' && header.align === 'right';
              return (
                <th
                  key={index}
                  className={`py-3 px-4 ${alignRight ? 'text-right' : ''}`}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {items.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}