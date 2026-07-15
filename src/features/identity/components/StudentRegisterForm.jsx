import React, { useState, useEffect } from 'react';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';

function StudentRegisterForm({ formValues, onFieldChange }) {
  // Lookup Data States populated by backend queries matching MediatR Query patterns
  const [majorsData, setMajorsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [error, setError] = useState('');
  
  // Local UI state for skills filtering/typing matching senior spec
  const [skillSearch, setSkillSearch] = useState('');

  // Fetch data on mount matching GetMajorsWithSpecialtiesQuery and GetSkills
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [majors, skills] = await Promise.all([
          getMajorsWithSpecialties(),
          getSkills()
        ]);
        setMajorsData(majors);
        setSkillsData(skills);
      } catch (err) {
        setError('Failed to load curriculum configuration or technical competency lookups.');
      } bits: {
        setLoadingLookups(false);
      }
    };
    fetchLookupData();
  }, []);

  // Universal toggle mapping handler updating the hoisted parent collection states
  const handleCollectionToggle = (field, id) => {
    const currentCollection = formValues[field] || [];
    if (currentCollection.includes(id)) {
      onFieldChange(field, currentCollection.filter(item => item !== id));
    } else {
      onFieldChange(field, [...currentCollection, id]);
    }
  };

  // Filter out sub-specialties to only show options belonging to checked parent majors
  const availableSpecialties = majorsData
    .filter(major => (formValues.majorIds || []).includes(major.id))
    .flatMap(major => major.specialties);

  // Filter skills based on text input for immediate search and tagging interaction
  const filteredSkills = skillsData.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  if (loadingLookups) {
    return (
      <div className="text-sm font-medium text-slate-500 animate-pulse py-4 text-center">
        Loading account initialization parameters...
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Student Academic Profile</h2>
        <p className="text-xs text-slate-400">Configure your academic specialization details and skill endorsements.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 rounded text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Profile Details Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Full Display Name *</label>
          <input
            type="text"
            value={formValues.fullName}
            onChange={(e) => onFieldChange('fullName', e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Graduation Target Year</label>
          <input
            type="number"
            value={formValues.graduationYear}
            onChange={(e) => onFieldChange('graduationYear', e.target.value)}
            placeholder="e.g. 2027"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Academic Majors Selection Layout */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Select Your Academic Majors</label>
        <div className="flex flex-wrap gap-2">
          {majorsData.map((major) => {
            const isSelected = (formValues.majorIds || []).includes(major.id);
            return (
              <button
                type="button"
                key={major.id}
                onClick={() => handleCollectionToggle('majorIds', major.id)}
                className={`text-xs font-semibold px-3 py-2 rounded-btn border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {major.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dependent Sub-Track Specialties Block */}
      {(formValues.majorIds || []).length > 0 && availableSpecialties.length > 0 && (
        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-card space-y-2 animate-slideDown">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Select Your Sub-Track Focus Areas</label>
          <div className="flex flex-wrap gap-2">
            {availableSpecialties.map((specialty) => {
              const isSelected = (formValues.specialtyIds || []).includes(specialty.id);
              return (
                <button
                  type="button"
                  key={specialty.id}
                  onClick={() => handleCollectionToggle('specialtyIds', specialty.id)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-btn border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {specialty.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Technical Competencies Tagging & Search Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Core Skills & Competencies</label>
        
        {/* Render Selected Skills as modern Tailwind Text Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skillsData
            .filter(skill => (formValues.skillIds || []).includes(skill.id))
            .map(skill => (
              <span
                key={skill.id}
                onClick={() => handleCollectionToggle('skillIds', skill.id)}
                className="inline-flex items-center bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-500 hover:line-through transition-all duration-150"
                title="Click to remove skill"
              >
                {skill.name}
                <span className="ml-1 text-[10px] font-black opacity-80">×</span>
              </span>
            ))}
          {(formValues.skillIds || []).length === 0 && (
            <span className="text-xs text-slate-400 italic">No verified competencies selected yet.</span>
          )}
        </div>

        {/* Text Input to filter down or toggle skill options */}
        <input
          type="text"
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="Type to filter core technology or platform skill tags..."
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-white mb-2"
        />

        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/50 border border-slate-100 rounded-btn text-xs">
          {filteredSkills.map((skill) => {
            const isSelected = (formValues.skillIds || []).includes(skill.id);
            return (
              <label
                key={skill.id}
                className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/5 font-semibold text-primary' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCollectionToggle('skillIds', skill.id)}
                  className="h-3.5 w-3.5 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <span className="truncate">{skill.name}</span>
              </label>
            );
          })}
          {filteredSkills.length === 0 && (
            <div className="col-span-2 text-center text-slate-400 py-3 italic">No matching skills found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentRegisterForm;