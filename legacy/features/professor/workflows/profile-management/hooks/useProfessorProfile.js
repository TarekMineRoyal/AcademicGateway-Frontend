import { useQuery } from '@tanstack/react-query';
import { getProfessorById } from '../../../professorApi';

/**
 * Hook to fetch and cache a professor's public profile details on demand.
 * 
 * @param {string} [professorId=''] - Unique GUID identifier of the target professor.
 * @param {boolean} [enabled=true] - Optional flag to control query execution timing.
 */
export function useProfessorProfile(professorId = '', enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['professorProfile', professorId],
    queryFn: () => getProfessorById(professorId),
    enabled: Boolean(enabled && professorId),
  });

  return {
    professor: data || null,
    isLoading: isLoading && Boolean(professorId),
    error,
    refetch,
  };
}