import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMilestoneComment } from '../projectInstancesApi';

/**
 * Custom mutation hook to handle posting comments/discussion entries to a milestone feed.
 * Automatically invalidates milestone comment queries to trigger fresh hydration.
 * 
 * @param {string} projectInstanceId - The unique tracking GUID for the running instance.
 */
export function usePostMilestoneComment(projectInstanceId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ milestoneId, content }) => {
      return await postMilestoneComment(projectInstanceId, milestoneId, content);
    },
    onSuccess: (data, variables) => {
      // Invalidate the comments cache for this specific milestone to trigger background refetching
      queryClient.invalidateQueries({ 
        queryKey: ['milestoneComments', projectInstanceId, variables.milestoneId] 
      });
    },
  });
}