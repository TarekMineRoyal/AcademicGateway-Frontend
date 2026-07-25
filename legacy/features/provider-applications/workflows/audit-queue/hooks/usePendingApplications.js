import { useQuery } from '@tanstack/react-query';
import { getPendingProviderApplications } from "@/features/provider-applications/providerApplicationsApi";

/**
 * Custom query hook for fetching paginated pending provider applications.
 * 
 * @param {number} [pageNumber=1] - Requested page number (1-based)
 * @param {number} [pageSize=10] - Number of items per page
 */
export function usePendingApplications(pageNumber = 1, pageSize = 10) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pendingProviderApplications', pageNumber, pageSize],
    queryFn: () => getPendingProviderApplications({ pageNumber, pageSize }),
  });

  return {
    applications: data?.items || [],
    paginatedResult: data,
    isLoading,
    error,
    refetch,
  };
}