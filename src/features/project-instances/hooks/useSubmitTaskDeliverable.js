import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitTaskDeliverable } from '../projectInstancesApi';

/**
 * Custom mutation hook to handle task delivery submissions.
 * Automatically invalidates the project milestones query to sync the UI layer.
 * 
 * @param {string} projectInstanceId - The unique tracking GUID for the running instance.
 */
export function useSubmitTaskDeliverable(projectInstanceId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ milestoneId, taskId, submissionPayload }) => {
      return await submitTaskDeliverable(projectInstanceId, milestoneId, taskId, submissionPayload);
    },
    onSuccess: () => {
      // Invalidate query to trigger fresh background data hydration
      queryClient.invalidateQueries({ queryKey: ['projectMilestones', projectInstanceId] });
    },
  });
}