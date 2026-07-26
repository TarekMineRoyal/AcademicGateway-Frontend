import PropTypes from 'prop-types';
import { Edit3, CheckCircle2, Building2 } from 'lucide-react';

/**
 * Header sub-component for the Provider Profile.
 * Renders company name, verification status badge, and edit trigger button.
 */
export default function ProviderProfileHeader({ companyName, isVerified, onEditClick }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg mt-0.5">
          <Building2 size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight">
              {companyName || 'Unnamed Provider'}
            </h2>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                <CheckCircle2 size={12} />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                Pending Verification
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Corporate Provider Account</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditClick}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-btn hover:bg-slate-50 transition-all cursor-pointer self-start sm:self-auto"
      >
        <Edit3 size={15} />
        Edit Profile
      </button>
    </div>
  );
}

ProviderProfileHeader.propTypes = {
  companyName: PropTypes.string,
  isVerified: PropTypes.bool,
  onEditClick: PropTypes.func.isRequired,
};