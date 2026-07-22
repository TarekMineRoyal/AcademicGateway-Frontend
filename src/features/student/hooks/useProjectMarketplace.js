import { useInfiniteQuery } from '@tanstack/react-query';
import { getApprovedTemplates } from '../../project-templates/projectTemplatesApi';

/**
 * Custom repository hook managing marketplace project synchronization and caching.
 * Binds active filter states directly to the TanStack Query cache key ring to eliminate race conditions.
 * Refactored to leverage a genuine server-driven infinite query architecture with PaginatedResult<T>.
 * 
 * @param {Object} filters - Core query parameters (e.g., tech stack, majorId) passed to the server pipeline.
 */
export function useProjectMarketplace(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['projectMarketplace', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await getApprovedTemplates({
        ...filters,
        pageNumber: pageParam,
        pageSize: 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Leverages backend metadata flags to determine next page
      return lastPage?.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
    // Retains existing records in the viewport layer while background re-validation occurs
    placeholderData: (previousData) => previousData,
  });
}