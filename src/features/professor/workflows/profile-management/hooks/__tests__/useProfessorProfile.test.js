import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfessorProfile } from '../useProfessorProfile';
import { getProfessorById } from '../../../../professorApi';

vi.mock('../../../../professorApi', () => ({
  getProfessorById: vi.fn(),
}));

describe('useProfessorProfile', () => {
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

  it('should fetch and return professor data when given a valid ID and enabled is true', async () => {
    const mockProfessor = { id: 'prof-456', fullName: 'Dr. Grace Hopper' };
    vi.mocked(getProfessorById).mockResolvedValueOnce(mockProfessor);

    const { result } = renderHook(() => useProfessorProfile('prof-456'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getProfessorById).toHaveBeenCalledWith('prof-456');
    expect(result.current.professor).toEqual(mockProfessor);
    expect(result.current.error).toBeNull();
  });

  it('should NOT run query and should return isLoading=false when professorId is empty string', () => {
    const { result } = renderHook(() => useProfessorProfile(''), {
      wrapper: createWrapper(),
    });

    expect(getProfessorById).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.professor).toBeNull();
  });

  it('should NOT run query and should return isLoading=false when professorId is null or undefined', () => {
    const { result: nullResult } = renderHook(() => useProfessorProfile(null), {
      wrapper: createWrapper(),
    });

    expect(getProfessorById).not.toHaveBeenCalled();
    expect(nullResult.current.isLoading).toBe(false);
    expect(nullResult.current.professor).toBeNull();

    const { result: undefinedResult } = renderHook(() => useProfessorProfile(undefined), {
      wrapper: createWrapper(),
    });

    expect(getProfessorById).not.toHaveBeenCalled();
    expect(undefinedResult.current.isLoading).toBe(false);
    expect(undefinedResult.current.professor).toBeNull();
  });

  it('should NOT run query when enabled parameter is explicitly false, even with a valid ID', () => {
    const { result } = renderHook(() => useProfessorProfile('prof-456', false), {
      wrapper: createWrapper(),
    });

    expect(getProfessorById).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.professor).toBeNull();
  });

  it('should return null for professor when API resolves with null or undefined body', async () => {
    vi.mocked(getProfessorById).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useProfessorProfile('prof-456'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.professor).toBeNull();
  });

  it('should handle API errors gracefully and expose error state', async () => {
    const mockError = new Error('Professor not found');
    vi.mocked(getProfessorById).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProfessorProfile('invalid-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.professor).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('should refetch data when professorId changes dynamically', async () => {
    const prof1 = { id: 'prof-1', fullName: 'Dr. First' };
    const prof2 = { id: 'prof-2', fullName: 'Dr. Second' };

    vi.mocked(getProfessorById)
      .mockResolvedValueOnce(prof1)
      .mockResolvedValueOnce(prof2);

    const { result, rerender } = renderHook(
      ({ id }) => useProfessorProfile(id),
      {
        wrapper: createWrapper(),
        initialProps: { id: 'prof-1' },
      }
    );

    await waitFor(() => {
      expect(result.current.professor).toEqual(prof1);
    });

    rerender({ id: 'prof-2' });

    await waitFor(() => {
      expect(result.current.professor).toEqual(prof2);
    });

    expect(getProfessorById).toHaveBeenCalledTimes(2);
    expect(getProfessorById).toHaveBeenNthCalledWith(1, 'prof-1');
    expect(getProfessorById).toHaveBeenNthCalledWith(2, 'prof-2');
  });

  it('should execute manual refetch when requested', async () => {
    const mockProf = { id: 'prof-123', fullName: 'Dr. John' };
    vi.mocked(getProfessorById).mockResolvedValue(mockProf);

    const { result } = renderHook(() => useProfessorProfile('prof-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(getProfessorById).toHaveBeenCalledTimes(2);
  });
});