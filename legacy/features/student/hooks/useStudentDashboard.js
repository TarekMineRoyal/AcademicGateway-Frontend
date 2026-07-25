import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentProfile, getStudentProjects } from '../studentDashboardApi';
import { transitionToSolo } from '../../project-instances';
import { ProjectInstanceStatus } from '../../../shared/constants/enums';

/**
 * Custom repository hook managing student metrics, allocations, and registry profiles.
 * Encapsulates data fetching, project categorization, and solo transition mutations.
 * 
 * @param {string} studentId - The unique GUID tracking identifier for the authenticated user.
 */
export function useStudentDashboard(studentId) {
  const queryClient = useQueryClient();

  // 1. Concurrent Dashboard Data Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studentDashboard', studentId],
    queryFn: async () => {
      const [profile, projects] = await Promise.all([
        getStudentProfile(studentId),
        getStudentProjects(studentId),
      ]);
      
      return {
        profile,
        projects: projects || [],
      };
    },
    enabled: !!studentId,
  });

  // 2. Solo Transition Mutation
  const transitionSoloMutation = useMutation({
    mutationFn: async (projectInstanceId) => {
      return await transitionToSolo(projectInstanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentDashboard', studentId] });
    },
  });

  // 3. Derived Workspace Categorizations
  const projects = data?.projects || [];
  const profile = data?.profile || {};

  const activeWorkspaces = projects.filter(
    (p) => p.status === ProjectInstanceStatus.ACTIVE
  );
  
  const pipelineApplications = projects.filter(
    (p) => p.status === ProjectInstanceStatus.AWAITING_SUPERVISION
  );
  
  const historicWorkspaces = projects.filter(
    (p) =>
      p.status === ProjectInstanceStatus.CONCLUDED ||
      p.status === ProjectInstanceStatus.CANCELED
  );

  return {
    dashboardData: data,
    profile,
    projects,
    activeWorkspaces,
    pipelineApplications,
    historicWorkspaces,
    isLoading: isLoading && !!studentId,
    error,
    refetch,

    // Solo Transition API Actions
    startSolo: transitionSoloMutation.mutateAsync,
    isStartingSolo: transitionSoloMutation.isPending,
    startSoloError: transitionSoloMutation.error,
  };
}