import { useState } from 'react';
import { User, GraduationCap, BookOpen, Plus, X } from 'lucide-react';

/**
 * Form component allowing professors to edit their academic metadata,
 * supervision capacity, research interests tags, and bio.
 */
export function ProfessorInfoForm({
  fullName,
  setFullName,
  department,
  setDepartment,
  rank,
  setRank,
  maxSupervisionCapacity,
  setMaxSupervisionCapacity,
  researchInterests,
  setResearchInterests,
  aboutMe,
  setAboutMe,
}) {
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = (e) => {
    e?.preventDefault();
    const trimmed = newInterest.trim();
    if (trimmed && !researchInterests.includes(trimmed)) {
      setResearchInterests([...researchInterests, trimmed]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (indexToRemove) => {
    setResearchInterests(researchInterests.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal & Academic Details */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <User size={15} className="text-primary" /> Personal & Academic Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Eleanor Vance"
              required
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Rank
            </label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. Associate Professor"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Supervision Capacity
            </label>
            <input
              type="number"
              min="0"
              value={maxSupervisionCapacity}
              onChange={(e) => setMaxSupervisionCapacity(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Research Interests Tags */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap size={15} className="text-primary" /> Research Interests & Expertise
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a research topic (e.g. Machine Learning) and press Enter"
            className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {/* Existing Interest Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {researchInterests.map((topic, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold px-2.5 py-1 rounded-md"
            >
              {topic}
              <button
                type="button"
                onClick={() => handleRemoveInterest(idx)}
                className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {researchInterests.length === 0 && (
            <p className="text-xs text-slate-400 italic">No research interests added yet.</p>
          )}
        </div>
      </div>

      {/* About & Bio */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen size={15} className="text-primary" /> About & Academic Background
        </h3>

        <textarea
          rows={4}
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Describe your background, lab focus, research interests, or student expectations..."
          className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
        />
      </div>
    </div>
  );
}

export default ProfessorInfoForm;