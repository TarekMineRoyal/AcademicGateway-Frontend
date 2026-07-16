import { useQuery } from '@tanstack/react-query';
import { getStudentProfile, getStudentProjects } from '../studentDashboardApi';

/**
 * Custom repository hook managing student metrics, allocations, and registry profiles.
 * Eliminates local component state data-fetching boilerplate.
 * 
 * @param {string} studentId - The unique GUID tracking identifier for the authenticated user.
 */
export function useStudentDashboard(studentId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studentDashboard', studentId],
    queryFn: async () => {
      // Execute pipeline requests concurrently following the established application logic
      const [profile, projects] = await Promise.all([
        getStudentProfile(studentId),
        getStudentProjects(studentId),
      ]);
      
      return {
        profile,
        projects: projects || [],
      };
    },
    // Prevent execution blocks if the identity parameter context is unresolved
    enabled: !!studentId,
  });

  return {
    dashboardData: data,
    isLoading: isLoading && !!studentId,
    error,
    refetch,
  };
}