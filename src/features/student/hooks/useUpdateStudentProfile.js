import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentProfile } from '../studentDashboardApi';

/**
 * Custom mutation hook to handle updating the student academic profile.
 * Automatically invalidates the student dashboard query to sync changes globally.
 * 
 * @param {string} studentId - The unique tracking GUID for the authenticated student user.
 */
export function useUpdateStudentProfile(studentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      return await updateStudentProfile(profileData);
    },
    onSuccess: () => {
      // 1. Invalidate the student dashboard cache to hydrate metrics/profiles instantly
      queryClient.invalidateQueries({ queryKey: ['studentDashboard', studentId] });
      
      // 2. Add this line to invalidate the user skills cache so the template view refetches fresh data
      queryClient.invalidateQueries({ queryKey: ['userSkills', studentId] });
    },
  });
}