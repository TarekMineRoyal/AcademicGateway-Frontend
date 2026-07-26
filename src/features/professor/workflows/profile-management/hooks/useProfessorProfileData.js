import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessorProfile, updateProfessorProfile } from '../../../professorApi';

/**
 * Custom hook that manages fetching and updating server state for the authenticated professor profile.
 */
export function useProfessorProfileData() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['authenticatedProfessorProfile'],
    queryFn: getProfessorProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfessorProfile,
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['authenticatedProfessorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['professorProfile'] });
      if (updatedProfile) {
        queryClient.setQueryData(['authenticatedProfessorProfile'], updatedProfile);
      }
    },
  });

  return {
    profile: profile || null,
    isLoading,
    error,
    updateProfileMutation,
  };
}