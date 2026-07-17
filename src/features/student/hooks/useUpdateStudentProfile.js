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
      // Invalidate the student dashboard cache to hydrate updated metrics/profiles instantly
      queryClient.invalidateQueries({ queryKey: ['studentDashboard', studentId] });
    },
  });
}