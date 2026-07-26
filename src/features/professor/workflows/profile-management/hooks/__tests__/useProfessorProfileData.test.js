import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfessorProfileData } from '../useProfessorProfileData';
import { getProfessorProfile, updateProfessorProfile } from '../../../../professorApi';

vi.mock('../../../../professorApi', () => ({
  getProfessorProfile: vi.fn(),
  updateProfessorProfile: vi.fn(),
}));

describe('useProfessorProfileData', () => {
  let queryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return ({ children }) => React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return professor profile data on success', async () => {
    const mockProfile = { id: 'prof-123', fullName: 'Dr. John Doe', department: 'Computer Science' };
    vi.mocked(getProfessorProfile).mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useProfessorProfileData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error gracefully', async () => {
    const mockError = new Error('Failed to fetch profile');
    vi.mocked(getProfessorProfile).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProfessorProfileData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('should execute update mutation and invalidate/set query cache on success', async () => {
    const initialProfile = { id: 'prof-123', fullName: 'Dr. John Doe' };
    const updatedProfile = { id: 'prof-123', fullName: 'Dr. John Smith' };

    vi.mocked(getProfessorProfile).mockResolvedValue(initialProfile);
    vi.mocked(updateProfessorProfile).mockResolvedValueOnce(updatedProfile);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useProfessorProfileData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');

    await act(async () => {
      await result.current.updateProfileMutation.mutateAsync(updatedProfile);
    });

    expect(updateProfessorProfile).toHaveBeenCalledWith(updatedProfile, expect.anything());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['authenticatedProfessorProfile'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['professorProfile'] });
    expect(setQueryDataSpy).toHaveBeenCalledWith(['authenticatedProfessorProfile'], updatedProfile);
  });
});