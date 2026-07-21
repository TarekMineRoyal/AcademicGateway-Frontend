import { useQuery } from '@tanstack/react-query';
import { getRecommendedProfessors } from '../recommendationsApi';

/**
 * Custom hook managing faculty advisor suggestions for a specific project template blueprint.
 * Preserves backend vector search rank ordering directly.
 * 
 * @param {string} [projectTemplateId=''] - Unique GUID identifier of the project template blueprint.
 * @param {number} [limit=10] - Maximum number of professor suggestions to return.
 * @param {boolean} [enabled=true] - Optional flag to control query execution timing.
 */
export function useRecommendedProfessors(projectTemplateId = '', limit = 10, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendedProfessors', projectTemplateId, limit],
    queryFn: () => getRecommendedProfessors(projectTemplateId, limit),
    enabled: Boolean(enabled && projectTemplateId),
  });

  return {
    recommendedProfessors: data || [],
    isLoading: isLoading && Boolean(projectTemplateId),
    error,
    refetch,
  };
}