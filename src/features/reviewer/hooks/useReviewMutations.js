import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewProviderApplication, reviewProjectTemplate } from '../reviewerApi';

/**
 * Mutation hook for reviewing (approving or rejecting) a Provider Application.
 * Automatically invalidates the pending provider applications query cache.
 */
export function useReviewProviderApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, isApproved, rejectionReason }) => {
      return await reviewProviderApplication(applicationId, {
        isApproved,
        rejectionReason: isApproved ? null : rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProviderApplications'] });
    },
  });
}

/**
 * Mutation hook for reviewing (approving or rejecting) a Project Template.
 * Automatically invalidates the pending project templates query cache.
 */
export function useReviewProjectTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, isApproved, rejectionReason }) => {
      return await reviewProjectTemplate(templateId, {
        isApproved,
        rejectionReason: isApproved ? null : rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProjectTemplates'] });
    },
  });
}