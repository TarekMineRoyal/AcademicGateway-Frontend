import { useQuery } from '@tanstack/react-query';
import { getProviderApplicationById } from '../reviewerApi';

/**
 * Custom query hook for fetching comprehensive details for a single provider application.
 * 
 * @param {string|null} applicationId - Unique application GUID
 */
export function useApplicationDetails(applicationId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['providerApplicationDetails', applicationId],
    queryFn: () => getProviderApplicationById(applicationId),
    enabled: !!applicationId,
  });

  return {
    application: data,
    isLoading: isLoading && !!applicationId,
    error,
    refetch,
  };
}