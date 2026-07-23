import PropTypes from 'prop-types';

/**
 * KanbanColumn
 * Reusable primitive component for Kanban columns.
 * Encapsulates outer wrapper, header badges, item counters, and empty state fallbacks.
 *
 * @param {Object} props
 * @param {string} props.title - Column header text
 * @param {number} props.count - Total item count in column
 * @param {React.ReactNode} [props.badge] - Optional badge or dot icon rendered beside title
 * @param {string} [props.titleClassName] - Optional text styling overrides for header title
 * @param {string} props.emptyMessage - Text displayed when column has zero items
 * @param {React.ReactNode} props.children - Kanban cards or content
 */
export function KanbanColumn({
  title,
  count,
  badge,
  titleClassName = 'text-brand-dark',
  emptyMessage,
  children,
}) {
  const isEmpty = count === 0;

  return (
    <div className="bg-slate-50/70 border border-slate-200/50 p-5 rounded-card min-h-[450px] flex flex-col">
      {/* Column Header */}
      <h2 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 ${titleClassName}`}>
        {badge}
        {title}
        <span className="text-xs font-normal text-slate-400 normal-case ml-auto">
          ({count})
        </span>
      </h2>

      {/* Column Body */}
      <div className="flex-1 flex flex-col justify-start">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium my-auto">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  badge: PropTypes.node,
  titleClassName: PropTypes.string,
  emptyMessage: PropTypes.string.isRequired,
  children: PropTypes.node,
};