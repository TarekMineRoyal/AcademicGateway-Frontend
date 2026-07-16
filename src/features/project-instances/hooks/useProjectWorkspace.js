import { useQuery } from '@tanstack/react-query';
import { getProjectDetails, getProjectMilestones } from '../projectInstancesApi';
import { adaptMilestones } from '../../../utils/milestoneAdapter';

export function useProjectWorkspace(projectInstanceId) {
  // Concurrent request 1: Fetch Project Details
  const projectQuery = useQuery({
    queryKey: ['projectInstance', projectInstanceId],
    queryFn: () => getProjectDetails(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  // Concurrent request 2: Fetch Project Milestones (Fires in parallel)
  const milestonesQuery = useQuery({
    queryKey: ['projectMilestones', projectInstanceId],
    queryFn: () => getProjectMilestones(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  // Stitch and adapt data safely right on the active render thread
  const adaptedMilestones = (projectQuery.data && milestonesQuery.data)
    ? adaptMilestones(milestonesQuery.data, projectQuery.data.dependencies || [])
    : [];

  return {
    project: projectQuery.data,
    milestones: adaptedMilestones,
    isLoading: projectQuery.isLoading || milestonesQuery.isLoading,
    error: projectQuery.error || milestonesQuery.error,
  };
}