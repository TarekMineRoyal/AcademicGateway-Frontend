import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentProfile } from '../../../studentApi';

/**
 * Custom mutation hook to handle updating the student academic profile.
 * Automatically invalidates student query caches to sync profile changes globally.
 * 
 * @param {string} studentId - The unique tracking GUID for the authenticated student user.
 */
export function useUpdateStudentProfile(studentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => updateStudentProfile(profileData),
    onSuccess: () => {
      // Invalidate caches to trigger instant UI re-hydration
      queryClient.invalidateQueries({ queryKey: ['studentProfile', studentId] });
      queryClient.invalidateQueries({ queryKey: ['userSkills', studentId] });
    },
  });
}