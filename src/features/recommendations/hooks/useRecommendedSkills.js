import { useQuery } from '@tanstack/react-query';
import { getRecommendedSkills } from '../recommendationsApi';

/**
 * Custom hook managing AI-suggested skill growth recommendations for the authenticated student.
 * Preserves backend vector search rank ordering directly.
 * 
 * @param {number} [limit=10] - Maximum number of skill recommendations to return.
 * @param {boolean} [enabled=true] - Optional flag to control query execution timing.
 */
export function useRecommendedSkills(limit = 10, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendedSkills', limit],
    queryFn: () => getRecommendedSkills(limit),
    enabled: Boolean(enabled),
  });

  return {
    recommendedSkills: data || [],
    isLoading,
    error,
    refetch,
  };
}