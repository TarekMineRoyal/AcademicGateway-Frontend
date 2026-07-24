import PropTypes from 'prop-types';

export default function ProgressBar({
  progress = 0,
  label,
  barColorClass = 'bg-primary',
  valueColorClass = 'text-primary',
}) {
  const normalizedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${valueColorClass}`}>{normalizedProgress}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${barColorClass} h-full rounded-full transition-all duration-300`}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
  label: PropTypes.node,
  barColorClass: PropTypes.string,
  valueColorClass: PropTypes.string,
};