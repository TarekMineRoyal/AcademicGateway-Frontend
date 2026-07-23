import React from 'react';

function RegisterStepReview({
  formValues,
  reviewItems = [],
  acceptedTerms,
  onAcceptedTermsChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
        Review Account Details
      </h3>

      {/* Structured Read-Only Context Grid */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-card space-y-3 text-sm">
        <div>
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Credential Email
          </span>
          <span className="text-slate-700 font-medium">{formValues.email}</span>
        </div>

        {reviewItems.map((item, index) => (
          <div key={index}>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              {item.label}
            </span>
            <span className={`text-slate-700 font-medium ${item.isUrl ? 'break-all' : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Mandatory Action Agreement Control */}
      <label className="flex items-start space-x-3 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded transition duration-150 ease-in-out"
          required
        />
        <span className="text-xs text-slate-600 leading-tight group-hover:text-slate-800 transition-colors">
          I accept the mandatory system Terms of Service, platform usage frameworks, and institutional Data Management Agreements.
        </span>
      </label>
    </form>
  );
}

export default RegisterStepReview;