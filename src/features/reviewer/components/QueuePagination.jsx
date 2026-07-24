import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Presentational component for queue table pagination controls.
 */
export function QueuePagination({
  pageNumber,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center pt-2">
      <span className="text-xs text-slate-500">
        Page <strong className="text-slate-800">{pageNumber}</strong> of{' '}
        <strong className="text-slate-800">{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(Math.min(pageNumber + 1, totalPages))}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}