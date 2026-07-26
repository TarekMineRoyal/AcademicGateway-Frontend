import PropTypes from 'prop-types';
import { Globe, ExternalLink } from 'lucide-react';
import ProviderProfileHeader from './ProviderProfileHeader';

/**
 * Presentational component for the Read-Only summary view of a provider profile.
 */
export default function ProviderProfileReadOnlyView({
  companyName,
  companyDescription,
  websiteUrl,
  isVerified,
  onEditClick,
}) {
  return (
    <div className="space-y-6">
      <ProviderProfileHeader
        companyName={companyName}
        isVerified={isVerified}
        onEditClick={onEditClick}
      />

      {/* Website Link Section */}
      {websiteUrl ? (
        <div className="flex items-center gap-2 text-sm">
          <Globe size={16} className="text-slate-400" />
          <span className="font-medium text-slate-600">Website:</span>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            {websiteUrl}
            <ExternalLink size={13} />
          </a>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No website URL provided.</p>
      )}

      {/* Description Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Company Description
        </h3>
        {companyDescription ? (
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
            {companyDescription}
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
            No company description provided yet.
          </p>
        )}
      </div>
    </div>
  );
}

ProviderProfileReadOnlyView.propTypes = {
  companyName: PropTypes.string,
  companyDescription: PropTypes.string,
  websiteUrl: PropTypes.string,
  isVerified: PropTypes.bool,
  onEditClick: PropTypes.func.isRequired,
};