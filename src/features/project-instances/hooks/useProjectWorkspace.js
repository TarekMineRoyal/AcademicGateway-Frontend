import { useQuery } from '@tanstack/react-query';
import { getProjectDetails, getProjectMilestones } from '../projectInstancesApi';
import { adaptLocalMilestones } from '../../../shared/utils/localMilestoneAdapter';

export function useProjectWorkspace(projectInstanceId) {
  const projectQuery = useQuery({
    queryKey: ['projectInstance', projectInstanceId],
    queryFn: () => getProjectDetails(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  const milestonesQuery = useQuery({
    queryKey: ['projectMilestones', projectInstanceId],
    queryFn: () => getProjectMilestones(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  // Safe runtime processing using local contracts mapping execution data parameters
  const adaptedMilestones = (projectQuery.data && milestonesQuery.data)
    ? adaptLocalMilestones(milestonesQuery.data, projectQuery.data.dependencies || []) // 👈 Call local mapper
    : [];

  return {
    project: projectQuery.data,
    milestones: adaptedMilestones,
    isLoading: projectQuery.isLoading || milestonesQuery.isLoading,
    error: projectQuery.error || milestonesQuery.error,
  };
}