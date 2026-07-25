import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContextCore';
import { getMajorsWithSpecialties } from '@/features/curriculum';
import { getSkills, useRecommendedSkills } from '@/features/skills';
import { getStudentProfile } from '../../../studentApi';
import { useUpdateStudentProfile } from './useUpdateStudentProfile';

/**
 * Custom hook to aggregate profile data, curriculum lookups, skill options,
 * and profile mutation handlers for student profile management.
 */
export function useStudentProfileData() {
  const { user } = useAuth();
  const studentId = user?.id;

  // Direct Student Profile Fetching
  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ['studentProfile', studentId],
    queryFn: getStudentProfile,
    enabled: !!studentId,
  });

  // Lookup data queries
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

  return {
    studentId,
    profile,
    majorsData,
    skillsData,
    recommendedSkills,
    isLoading: isProfileLoading || majorsLoading || skillsLoading,
    isRecsSkillsLoading,
    updateProfileMutation,
  };
}