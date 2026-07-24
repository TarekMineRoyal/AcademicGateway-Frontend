import PropTypes from 'prop-types';
import { Edit3 } from 'lucide-react';

/**
 * Header sub-component for the Student Profile read-only view.
 */
export default function StudentProfileHeader({ fullName, graduationYear, onEditClick }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
      <div>
        <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight">
          {fullName}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Class of {graduationYear}
        </p>
      </div>
      <button
        type="button"
        onClick={onEditClick}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-btn hover:bg-slate-50 transition-all cursor-pointer self-start sm:self-auto"
      >
        <Edit3 size={15} />
        Edit Academic Profile
      </button>
    </div>
  );
}

StudentProfileHeader.propTypes = {
  fullName: PropTypes.string.isRequired,
  graduationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onEditClick: PropTypes.func.isRequired,
};