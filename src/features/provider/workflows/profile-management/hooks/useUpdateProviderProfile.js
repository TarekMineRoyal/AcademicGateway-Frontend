import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProviderProfile } from '../../../providerApi';

/**
 * Custom mutation hook to handle updating the provider profile.
 * Automatically invalidates provider query cache on success.
 * 
 * @param {string} providerId - The unique ID for the provider.
 */
export function useUpdateProviderProfile(providerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => updateProviderProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerProfile', providerId] });
    },
  });
}