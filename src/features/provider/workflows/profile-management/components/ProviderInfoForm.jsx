import PropTypes from 'prop-types';

const MAX_DESCRIPTION_LENGTH = 2000;

/**
 * Form component for updating provider details.
 */
export default function ProviderInfoForm({
  companyName,
  setCompanyName,
  websiteUrl,
  setWebsiteUrl,
  companyDescription = '',
  setCompanyDescription,
}) {
  const currentDesc = companyDescription || '';

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_DESCRIPTION_LENGTH) {
      setCompanyDescription(val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Company Name & Website URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corporation"
            required
            className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Website URL
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Company Description Textarea */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Company Description
          </label>
          <span
            className={`text-xs font-medium ${
              currentDesc.length > MAX_DESCRIPTION_LENGTH
                ? 'text-red-500 font-bold'
                : 'text-slate-400'
            }`}
          >
            {currentDesc.length} / {MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          rows={5}
          value={currentDesc}
          onChange={handleDescriptionChange}
          placeholder="Describe your organization, mission, core offerings, or career/project opportunities..."
          className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        />
      </div>
    </div>
  );
}

ProviderInfoForm.propTypes = {
  companyName: PropTypes.string.isRequired,
  setCompanyName: PropTypes.func.isRequired,
  websiteUrl: PropTypes.string,
  setWebsiteUrl: PropTypes.func.isRequired,
  companyDescription: PropTypes.string,
  setCompanyDescription: PropTypes.func.isRequired,
};