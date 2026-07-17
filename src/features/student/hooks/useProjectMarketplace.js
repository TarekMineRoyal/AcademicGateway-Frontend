import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

/**
 * Custom repository hook managing marketplace project synchronization and caching.
 * Binds active filter states directly to the TanStack Query cache key ring to eliminate race conditions.
 * Refactored to leverage a genuine server-driven infinite query architecture.
 * 
 * @param {Object} filters - Core query parameters (e.g., tech stack, majorId) passed to the server pipeline.
 */
export function useProjectMarketplace(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['projectMarketplace', filters],
    queryFn: async ({ pageParam = 1 }) => {
      // The global response interceptor in apiClient automatically unwraps response.data
      return await apiClient.get('/project-templates/approved', {
        params: {
          ...filters,
          page: pageParam,
          pageSize: 10, // Explicit chunk size limit pooled down the wire
        },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Backend contract safety standard: if the page array returned hits the page max limit,
      // calculate the increment value to request the next bucket. Otherwise return undefined.
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    // Retains existing records in the viewport layer while background re-validation occurs
    placeholderData: (previousData) => previousData,
  });
}