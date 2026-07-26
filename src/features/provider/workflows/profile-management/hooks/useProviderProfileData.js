import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContextCore';
import { getProviderProfile, updateProviderProfile } from '../../../providerApi';

/**
 * Custom hook to manage fetching and updating provider profile server state.
 */
export function useProviderProfileData() {
  const { user } = useAuth();
  const providerId = user?.id;
  const queryClient = useQueryClient();

  // Fetch Provider Profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['providerProfile', providerId],
    queryFn: getProviderProfile,
    enabled: !!providerId,
  });

  // Update Provider Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => updateProviderProfile(payload),
    onSuccess: () => {
      // Invalidate cache to trigger instant UI re-hydration
      queryClient.invalidateQueries({ queryKey: ['providerProfile', providerId] });
    },
  });

  return {
    providerId,
    profile,
    isLoading,
    error,
    updateProfileMutation,
  };
}