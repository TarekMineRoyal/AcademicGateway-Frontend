import { useQuery } from '@tanstack/react-query';
import { getUserSkills } from '../skillsApi';

/**
 * Custom hook managing multi-tenancy core competency records.
 * Completely role-agnostic implementation: queries off data context regardless of user role.
 * 
 * @param {string} userId - The explicit tracking GUID for the authenticated user context.
 */
export function useUserSkills(userId) {
  return useQuery({
    queryKey: ['userSkills', userId],
    queryFn: () => getUserSkills(userId),
    enabled: !!userId, // Safely gates execution until identifier state is accessible
  });
}