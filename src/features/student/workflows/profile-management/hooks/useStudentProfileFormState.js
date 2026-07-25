import { useState } from 'react';

/**
 * Encapsulates form state management, entity mapping, and action handlers
 * for updating student academic and personal profile details.
 */
export function useStudentProfileFormState({
  profile,
  majorsData = [],
  skillsData = [],
  updateProfileMutation,
}) {
  // 1. Declarative Local Form States
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [prevProfile, setPrevProfile] = useState(null);

  // Synchronize local state when server profile updates during render
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setFullName(profile.fullName || '');
    setGraduationYear(profile.graduationYear || '');
    setAboutMe(profile.aboutMe || '');
    setSelectedMajorIds(profile.majors?.map((m) => m.id) || []);
    setSelectedSpecialtyIds(profile.specialties?.map((s) => s.id) || []);
    setSelectedSkillIds(profile.skills?.map((sk) => sk.id) || []);
  }

  // 2. Computed Data & Resolved Entities
  const availableSpecialties = majorsData
    .filter((major) => selectedMajorIds.includes(major.id))
    .flatMap((major) => major.specialties || []);

  const selectedMajors = majorsData.filter((major) =>
    selectedMajorIds.includes(major.id)
  );

  const selectedSpecialties = availableSpecialties.filter((specialty) =>
    selectedSpecialtyIds.includes(specialty.id)
  );

  const selectedSkills = skillsData.filter((skill) =>
    selectedSkillIds.includes(skill.id)
  );

  // 3. Action Handlers
  const handleMajorsChange = (selectedObjects) => {
    const nextMajorIds = selectedObjects.map((o) => o.id);
    setSelectedMajorIds(nextMajorIds);

    const dynamicSpecialties = majorsData
      .filter((major) => nextMajorIds.includes(major.id))
      .flatMap((major) => major.specialties || []);
    const dynamicSpecialtyIds = dynamicSpecialties.map((s) => s.id);

    setSelectedSpecialtyIds((prev) =>
      prev.filter((id) => dynamicSpecialtyIds.includes(id))
    );
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setGraduationYear(profile.graduationYear || '');
      setAboutMe(profile.aboutMe || '');
      setSelectedMajorIds(profile.majors?.map((m) => m.id) || []);
      setSelectedSpecialtyIds(profile.specialties?.map((s) => s.id) || []);
      setSelectedSkillIds(profile.skills?.map((sk) => sk.id) || []);
    }
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const commandPayload = {
      fullName: fullName.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      aboutMe: aboutMe.trim() || null,
      majorIds: selectedMajorIds,
      specialtyIds: selectedSpecialtyIds,
      skillIds: selectedSkillIds,
    };

    updateProfileMutation?.mutate(commandPayload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return {
    // Form Field States & Setters
    fullName,
    setFullName,
    graduationYear,
    setGraduationYear,
    aboutMe,
    setAboutMe,
    isEditing,
    setIsEditing,

    // Selection State IDs & Setters
    selectedMajorIds,
    setSelectedMajorIds,
    selectedSpecialtyIds,
    setSelectedSpecialtyIds,
    selectedSkillIds,
    setSelectedSkillIds,

    // Pre-Resolved Entity Lists
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