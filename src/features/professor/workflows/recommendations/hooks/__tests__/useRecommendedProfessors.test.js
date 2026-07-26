import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecommendedProfessors } from '../useRecommendedProfessors';
import { getRecommendedProfessors } from '../../../../professorApi';

vi.mock('../../../../professorApi', () => ({
  getRecommendedProfessors: vi.fn(),
}));

describe('useRecommendedProfessors', () => {
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

  // --- HAPPY PATH ---
  it('should fetch and return recommended professors when given a valid template ID', async () => {
    const mockProfessors = [
      { id: 'prof-1', fullName: 'Dr. Alan Turing', matchScore: 0.95 },
      { id: 'prof-2', fullName: 'Dr. Grace Hopper', matchScore: 0.88 },
    ];
    vi.mocked(getRecommendedProfessors).mockResolvedValueOnce(mockProfessors);

    const { result } = renderHook(() => useRecommendedProfessors('template-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getRecommendedProfessors).toHaveBeenCalledWith('template-123', 10);
    expect(result.current.recommendedProfessors).toEqual(mockProfessors);
    expect(result.current.error).toBeNull();
  });

  it('should pass custom limit parameter to API call', async () => {
    vi.mocked(getRecommendedProfessors).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useRecommendedProfessors('template-123', 5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getRecommendedProfessors).toHaveBeenCalledWith('template-123', 5);
  });

  // --- EDGE CASES: MISSING ID / DISABLED QUERY ---
  it('should NOT run query and should return isLoading=false when projectTemplateId is empty string, null, or undefined', () => {
    const { result: emptyResult } = renderHook(() => useRecommendedProfessors(''), {
      wrapper: createWrapper(),
    });

    expect(getRecommendedProfessors).not.toHaveBeenCalled();
    expect(emptyResult.current.isLoading).toBe(false);
    expect(emptyResult.current.recommendedProfessors).toEqual([]);

    const { result: nullResult } = renderHook(() => useRecommendedProfessors(null), {
      wrapper: createWrapper(),
    });

    expect(getRecommendedProfessors).not.toHaveBeenCalled();
    expect(nullResult.current.isLoading).toBe(false);
    expect(nullResult.current.recommendedProfessors).toEqual([]);
  });

  it('should NOT run query when enabled parameter is explicitly false', () => {
    const { result } = renderHook(() => useRecommendedProfessors('template-123', 10, false), {
      wrapper: createWrapper(),
    });

    expect(getRecommendedProfessors).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.recommendedProfessors).toEqual([]);
  });

  // --- EDGE CASES: API RESPONSES & ERRORS ---
  it('should return empty array fallback when API resolves with null or undefined', async () => {
    vi.mocked(getRecommendedProfessors).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useRecommendedProfessors('template-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recommendedProfessors).toEqual([]);
  });

  it('should handle API errors gracefully and expose error state', async () => {
    const mockError = new Error('Failed to load recommendations');
    vi.mocked(getRecommendedProfessors).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRecommendedProfessors('template-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recommendedProfessors).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  // --- MANUAL REFETCH ---
  it('should execute manual refetch when requested', async () => {
    vi.mocked(getRecommendedProfessors).mockResolvedValue([]);

    const { result } = renderHook(() => useRecommendedProfessors('template-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(getRecommendedProfessors).toHaveBeenCalledTimes(2);
  });
});