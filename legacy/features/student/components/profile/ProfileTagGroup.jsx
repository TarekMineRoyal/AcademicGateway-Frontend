import PropTypes from 'prop-types';

/**
 * Reusable presentational component for rendering labeled badge lists.
 */
function ProfileTagGroup({
  title,
  items = [],
  emptyText,
  badgeClassName = 'bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/10',
}) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-sm text-slate-400 italic">{emptyText}</span>
        ) : (
          items.map((item) => (
            <span key={item.id} className={badgeClassName}>
              {item.name}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

ProfileTagGroup.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  emptyText: PropTypes.string.isRequired,
  badgeClassName: PropTypes.string,
};

export default ProfileTagGroup;