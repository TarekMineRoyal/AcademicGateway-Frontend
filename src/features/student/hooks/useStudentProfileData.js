import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContextCore';
import { useStudentDashboard } from './useStudentDashboard';
import { useUpdateStudentProfile } from './useUpdateStudentProfile';
import { useRecommendedSkills } from '../../recommendations';
import { getMajorsWithSpecialties } from '../../curriculum';
import { getSkills } from '../../skills';

export function useStudentProfileData() {
  const { user } = useAuth();
  const studentId = user?.id;

  // Declarative Server-State Hydration
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

  const profile = dashboardData?.profile;

  return {
    studentId,
    profile,
    dashboardData,
    majorsData,
    skillsData,
    recommendedSkills,
    isLoading: dashboardLoading || majorsLoading || skillsLoading,
    isRecsSkillsLoading,
    updateProfileMutation,
  };
}