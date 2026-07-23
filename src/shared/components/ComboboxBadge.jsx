/**
 * ComboboxBadge Component
 * Renders a selected option badge with a dismiss button for the combobox primitive.
 *
 * @param {Object} props
 * @param {string} props.label - Display text rendered inside the badge.
 * @param {Function} props.onRemove - Click event callback to dismiss/unselect the item.
 */
function ComboboxBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md">
      {label}
      <button 
        type="button" 
        onClick={onRemove}
        className="hover:text-primary-hover font-bold ml-0.5 transition-colors cursor-pointer"
        aria-label={`Remove ${label}`}
      >
        ×
      </button>
    </span>
  );
}

export default ComboboxBadge;