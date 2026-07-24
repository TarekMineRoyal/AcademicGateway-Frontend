import { useStudentProfileData } from './useStudentProfileData';
import { useStudentProfileFormState } from './useStudentProfileFormState';

export function useStudentProfileForm() {
  const {
    profile,
    majorsData,
    skillsData,
    recommendedSkills,
    isLoading,
    isRecsSkillsLoading,
    updateProfileMutation,
  } = useStudentProfileData();

  const {
    fullName,
    setFullName,
    graduationYear,
    setGraduationYear,
    aboutMe,
    setAboutMe,
    isEditing,
    setIsEditing,
    selectedMajorIds,
    selectedSpecialtyIds,
    setSelectedSpecialtyIds,
    selectedSkillIds,
    setSelectedSkillIds,
    selectedMajors,
    selectedSpecialties,
    selectedSkills,
    availableSpecialties,
    handleMajorsChange,
    handleCancel,
    handleSubmit,
  } = useStudentProfileFormState({
    profile,
    majorsData,
    skillsData,
    updateProfileMutation,
  });

  return {
    // Loading States & Mutation
    isLoading,
    isRecsSkillsLoading,
    updateProfileMutation,

    // Form Field States & Setters
    fullName,
    setFullName,
    graduationYear,
    setGraduationYear,
    aboutMe,
    setAboutMe,
    isEditing,
    setIsEditing,

    // Raw Lookup Datasets
    majorsData,
    skillsData,
    recommendedSkills,

    // Selection State IDs & Setters
    selectedMajorIds,
    selectedSpecialtyIds,
    setSelectedSpecialtyIds,
    selectedSkillIds,
    setSelectedSkillIds,

    // Pre-Resolved Entity Lists (for Read-Only display)
    selectedMajors,
    selectedSpecialties,
    selectedSkills,
    availableSpecialties,

    // Handlers
    handleMajorsChange,
    handleCancel,
    handleSubmit,
  };
}