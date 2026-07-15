import React from 'react';

function ProfessorRegisterForm({ formValues, onFieldChange }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Structural Subsection Header */}
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Faculty Mentor Profile</h2>
        <p className="text-xs text-slate-400">
          Provision your institutional identity credentials to oversee student capstone projects.
        </p>
      </div>

      {/* Full Name Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Full Name & Academic Title *
        </label>
        <input
          type="text"
          value={formValues.fullName}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          placeholder="e.g., Dr. Sarah Jenkins"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>

      {/* Institutional Department Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Faculty / Institutional Branch Name *
        </label>
        <input
          type="text"
          value={formValues.academicDepartment}
          onChange={(e) => onFieldChange('academicDepartment', e.target.value)}
          placeholder="e.g., Department of Computer Science"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>

      {/* Grid Configuration for Rank and Allocation Limits */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Academic Rank Title *
          </label>
          <input
            type="text"
            value={formValues.rank}
            onChange={(e) => onFieldChange('rank', e.target.value)}
            placeholder="e.g., Associate Professor"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Max Capacity *
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formValues.maxSupervisionCapacity}
            onChange={(e) => onFieldChange('maxSupervisionCapacity', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50 font-semibold text-slate-800"
            required
          />
        </div>
      </div>
    </div>
  );
}

export default ProfessorRegisterForm;