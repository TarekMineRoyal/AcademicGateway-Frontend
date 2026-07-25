import { Sparkles, Plus } from 'lucide-react';
import SearchableCombobox from '@/shared/components/SearchableCombobox';
import { useStudentSkills } from '../hooks/useSkillSelection';

export default function StudentSkillsSection({
  skillsData = [],
  selectedSkillIds = [],
  setSelectedSkillIds,
  recommendedSkills = [],
}) {
  const {
    selectedSkills,
    unaddedRecommendedSkills,
    hasUnaddedRecommendations,
    handleSkillsChange,
    handleAddRecommendedSkill,
  } = useStudentSkills({
    skillsData,
    selectedSkillIds,
    setSelectedSkillIds,
    recommendedSkills,
  });

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
        Technical Core Competencies
      </label>
      <SearchableCombobox
        placeholder="Type to search system core competencies..."
        options={skillsData}
        selected={selectedSkills}
        onChange={handleSkillsChange}
        isMulti={true}
      />

      {/* AI Suggested Skills Quick-Add */}
      {recommendedSkills.length > 0 && (
        <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-indigo-600" />
            AI Suggested Skills to Add
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unaddedRecommendedSkills.map((sk) => (
              <button
                key={sk.id}
                type="button"
                onClick={() => handleAddRecommendedSkill(sk.id)}
                className="inline-flex items-center gap-1 text-xs bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Plus size={12} />
                {sk.name}
              </button>
            ))}
            {!hasUnaddedRecommendations && (
              <span className="text-xs text-indigo-500 italic">
                All suggested skills have been added!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}