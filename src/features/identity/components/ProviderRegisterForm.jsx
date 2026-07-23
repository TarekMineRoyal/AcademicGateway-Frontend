
function ProviderRegisterForm({ formValues, onFieldChange }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Subsection Layout Header */}
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Researcher & Sponsor Profile</h2>
        <p className="text-xs text-slate-400">
          Register your organization or lab unit to propose and sponsor real-world academic projects.
        </p>
      </div>

      {/* Institution / Company Name Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Institution / Company Name *
        </label>
        <input
          type="text"
          value={formValues.companyName}
          onChange={(e) => onFieldChange('companyName', e.target.value)}
          placeholder="e.g., Quantum Computing Lab A"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>

      {/* Operational Focus & Strategic Lab Description Textarea */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Operational Focus & Lab Description *
        </label>
        <textarea
          value={formValues.companyDescription}
          onChange={(e) => onFieldChange('companyDescription', e.target.value)}
          placeholder="Describe your operational background, capability statements, and core industry focus areas..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50 resize-vertical font-sans"
          required
        />
      </div>

      {/* Optional Website Portal URL Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Portal Website URL (Optional)
        </label>
        <input
          type="url"
          value={formValues.websiteUrl}
          onChange={(e) => onFieldChange('websiteUrl', e.target.value)}
          placeholder="https://example.com/lab"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
        />
      </div>
    </div>
  );
}

export default ProviderRegisterForm;