import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

/**
 * Custom hook managing multi-tenancy core competency records.
 * Completely role-agnostic implementation: queries off data context regardless of user role.
 * 
 * @param {string} userId - The explicit tracking GUID for the authenticated user context.
 */
export function useUserSkills(userId) {
  return useQuery({
    queryKey: ['userSkills', userId],
    queryFn: async () => {
      return await apiClient.get(`/skills/user/${userId}`);
    },
    enabled: !!userId, // Safely gates execution until identifier state is accessible
  });
}