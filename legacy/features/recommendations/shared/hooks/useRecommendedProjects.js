import { useQuery } from '@tanstack/react-query';
import { getRecommendedProjects } from '../../recommendationsApi.js';

/**
 * Custom hook managing AI-matched project recommendations for the authenticated student.
 * Preserves backend vector search rank ordering directly.
 * 
 * @param {number} [limit=10] - Maximum number of project recommendations to return.
 * @param {boolean} [enabled=true] - Optional flag to control query execution timing.
 */
export function useRecommendedProjects(limit = 10, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendedProjects', limit],
    queryFn: () => getRecommendedProjects(limit),
    enabled: Boolean(enabled),
  });

  return {
    recommendedProjects: data || [],
    isLoading,
    error,
    refetch,
  };
}