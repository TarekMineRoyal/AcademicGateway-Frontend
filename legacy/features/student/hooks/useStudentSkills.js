import { useMemo } from 'react';

/**
 * Custom hook to pre-compute skill selections and encapsulate skill action handlers.
 */
export function useStudentSkills({
  skillsData = [],
  selectedSkillIds = [],
  setSelectedSkillIds,
  recommendedSkills = [],
}) {
  // Memoized Set for O(1) membership checks
  const selectedSkillIdsSet = useMemo(
    () => new Set(selectedSkillIds),
    [selectedSkillIds]
  );

  // Pre-compute selected skill objects for SearchableCombobox
  const selectedSkills = useMemo(
    () => skillsData.filter((sk) => selectedSkillIdsSet.has(sk.id)),
    [skillsData, selectedSkillIdsSet]
  );

  // Pre-compute unadded recommended skills (single pass)
  const unaddedRecommendedSkills = useMemo(
    () => recommendedSkills.filter((sk) => !selectedSkillIdsSet.has(sk.id)),
    [recommendedSkills, selectedSkillIdsSet]
  );

  const hasUnaddedRecommendations = unaddedRecommendedSkills.length > 0;

  // Encapsulated action handlers
  const handleSkillsChange = (items) => {
    if (setSelectedSkillIds) {
      setSelectedSkillIds(items.map((item) => item.id));
    }
  };

  const handleAddRecommendedSkill = (skillId) => {
    if (setSelectedSkillIds) {
      setSelectedSkillIds((prev) => [...prev, skillId]);
    }
  };

  return {
    selectedSkills,
    unaddedRecommendedSkills,
    hasUnaddedRecommendations,
    handleSkillsChange,
    handleAddRecommendedSkill,
  };
}