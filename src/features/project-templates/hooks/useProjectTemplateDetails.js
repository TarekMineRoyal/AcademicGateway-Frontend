import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../shared/api/apiClient';
import { searchProfessors } from '../../professor';

/**
 * Custom hook for fetching template details and searching faculty advisors.
 * 
 * @param {string} templateId - Target template GUID
 * @param {string} professorSearchQuery - Directory search filter query
 * @param {number} [searchPage=1] - Requested page index for directory search
 */
export function useProjectTemplateDetails(templateId, professorSearchQuery, searchPage = 1) {
  // Query 1: Base Template Data Fetch
  const templateQuery = useQuery({
    queryKey: ['projectTemplate', templateId],
    queryFn: () => apiClient.get(`/project-templates/${templateId}`),
    enabled: !!templateId,
  });

  // Query 2: Decoupled Professor Directory Search Layer
  // Integrated with central searchProfessors service and pagination params
  const directorySearchQuery = useQuery({
    queryKey: ['professorDirectorySearch', professorSearchQuery, searchPage],
    queryFn: () => searchProfessors({ 
      searchTerm: professorSearchQuery, 
      pageNumber: searchPage, 
      pageSize: 5 
    }),
    enabled: typeof professorSearchQuery === 'string' && professorSearchQuery.length >= 2,
  });

  return {
    template: templateQuery.data,
    // Unpacks items safely to guarantee directoryResults is always a map-able array
    directoryResults: directorySearchQuery.data?.items || [],
    directoryPagination: directorySearchQuery.data ? {
      pageNumber: directorySearchQuery.data.pageNumber,
      totalPages: directorySearchQuery.data.totalPages,
      hasPreviousPage: directorySearchQuery.data.hasPreviousPage,
      hasNextPage: directorySearchQuery.data.hasNextPage,
      totalCount: directorySearchQuery.data.totalCount,
    } : null,
    isLoading: templateQuery.isLoading,
    isSearching: directorySearchQuery.isFetching,
    error: templateQuery.error || directorySearchQuery.error,
  };
}