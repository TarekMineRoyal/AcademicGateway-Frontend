import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContextCore';
import { useStudentDashboard } from './useStudentDashboard';
import { useUpdateStudentProfile } from './useUpdateStudentProfile';
import { useRecommendedSkills } from '../../recommendations';
import { getMajorsWithSpecialties } from '../../curriculum';
import { getSkills } from '../../skills';

export function useStudentProfileForm() {
  const { user } = useAuth();
  const studentId = user?.id;

  // 1. Declarative Server-State Hydration
  const { dashboardData, isLoading: dashboardLoading } = useStudentDashboard(studentId);

  const { data: majorsData = [], isLoading: majorsLoading } = useQuery({
    queryKey: ['majorsWithSpecialties'],
    queryFn: getMajorsWithSpecialties,
  });

  const { data: skillsData = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  const {
    recommendedSkills = [],
    isLoading: isRecsSkillsLoading,
  } = useRecommendedSkills(10);

  const updateProfileMutation = useUpdateStudentProfile(studentId);

  // 2. Encapsulated Local Form States
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [prevProfile, setPrevProfile] = useState(null);

  const profile = dashboardData?.profile;

  // Synchronize local state when server profile updates
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setFullName(profile.fullName || '');
    setGraduationYear(profile.graduationYear || '');
    setAboutMe(profile.aboutMe || '');
    setSelectedMajorIds(profile.majors?.map((m) => m.id) || []);
    setSelectedSpecialtyIds(profile.specialties?.map((s) => s.id) || []);
    setSelectedSkillIds(profile.skills?.map((sk) => sk.id) || []);
  }

  // 3. Computed Data & Resolved Entities (Pre-resolved for clean JSX rendering)
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

  // 4. Action Handlers
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
    e.preventDefault();

    const commandPayload = {
      fullName: fullName.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      aboutMe: aboutMe.trim() || null,
      majorIds: selectedMajorIds,
      specialtyIds: selectedSpecialtyIds,
      skillIds: selectedSkillIds,
    };

    updateProfileMutation.mutate(commandPayload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return {
    // Loading States & Mutation
    isLoading: dashboardLoading || majorsLoading || skillsLoading,
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