import React from 'react';

function RegisterStepCredentials({ formValues, onFieldChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
        Core Identity Credentials
      </h3>
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Institutional Email Address
        </label>
        <input
          type="email"
          value={formValues.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="you@university.edu"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Security Password
        </label>
        <input
          type="password"
          value={formValues.password}
          onChange={(e) => onFieldChange('password', e.target.value)}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Confirm Security Password
        </label>
        <input
          type="password"
          value={formValues.confirmPassword}
          onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
        {formValues.password &&
          formValues.confirmPassword &&
          formValues.password !== formValues.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              Passwords do not align.
            </p>
          )}
      </div>
    </div>
  );
}

export default RegisterStepCredentials;