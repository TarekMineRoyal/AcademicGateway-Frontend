import { useQuery } from '@tanstack/react-query';
import { getPendingProjectTemplates } from '../../../../reviewer/reviewerApi';

/**
 * Custom query hook for fetching paginated pending project templates.
 * 
 * @param {number} [pageNumber=1] - Requested page number (1-based)
 * @param {number} [pageSize=10] - Number of items per page
 */
export function usePendingTemplates(pageNumber = 1, pageSize = 10) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pendingProjectTemplates', pageNumber, pageSize],
    queryFn: () => getPendingProjectTemplates({ pageNumber, pageSize }),
  });

  return {
    templates: data?.items || [],
    paginatedResult: data,
    isLoading,
    error,
    refetch,
  };
}