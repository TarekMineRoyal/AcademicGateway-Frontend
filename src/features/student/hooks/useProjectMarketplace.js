import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

/**
 * Custom repository hook managing marketplace project synchronization and caching.
 * Binds active filter states directly to the TanStack Query cache key ring to eliminate race conditions.
 * 
 * @param {Object} filters - Core query parameters (e.g., { search: searchTerm }) passed to the server pipeline.
 */
export function useProjectMarketplace(filters = {}) {
  return useQuery({
    queryKey: ['projectMarketplace', filters],
    queryFn: async () => {
      // The global response interceptor in apiClient automatically unwraps response.data
      // Path corrected and verified via staging Swagger contract audit
      return await apiClient.get('/project-templates/approved', { params: filters });
    },
    // Retains existing records in the viewport layer while background re-validation occurs
    placeholderData: (previousData) => previousData,
  });
}