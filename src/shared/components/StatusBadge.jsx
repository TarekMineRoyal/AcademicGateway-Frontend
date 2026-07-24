import PropTypes from 'prop-types';
import { Clock, CheckCircle, Award, AlertTriangle } from 'lucide-react';
import { ProjectInstanceStatus } from '../constants/enums';

const STATUS_CONFIG = {
  [ProjectInstanceStatus.AWAITING_SUPERVISION]: {
    label: 'Awaiting Supervision',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    Icon: Clock,
  },
  [ProjectInstanceStatus.ACTIVE]: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: CheckCircle,
  },
  [ProjectInstanceStatus.CONCLUDED]: {
    label: 'Concluded',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
    Icon: Award,
  },
};

const DEFAULT_CONFIG = {
  label: 'Canceled',
  className: 'bg-slate-50 text-slate-600 border-slate-200',
  Icon: AlertTriangle,
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;
  const { Icon, label, className } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold ${className}`}
    >
      <Icon size={14} /> {label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};