import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

export function useProjectTemplateDetails(templateId, professorSearchQuery) {
  // Query 1: Base Template Data Fetch
  const templateQuery = useQuery({
    queryKey: ['projectTemplate', templateId],
    queryFn: () => apiClient.get(`/project-templates/${templateId}`),
    enabled: !!templateId,
  });

  // Query 2: Decoupled Professor Directory Search Layer
  // Aligned with verified API contract parameters using 'searchTerm'
  const directorySearchQuery = useQuery({
    queryKey: ['professorDirectorySearch', professorSearchQuery],
    queryFn: () => apiClient.get('/professors', { params: { searchTerm: professorSearchQuery } }),
    enabled: typeof professorSearchQuery === 'string' && professorSearchQuery.length >= 2,
  });

  return {
    template: templateQuery.data,
    directoryResults: directorySearchQuery.data || [],
    isLoading: templateQuery.isLoading,
    isSearching: directorySearchQuery.isFetching,
    error: templateQuery.error || directorySearchQuery.error,
  };
}