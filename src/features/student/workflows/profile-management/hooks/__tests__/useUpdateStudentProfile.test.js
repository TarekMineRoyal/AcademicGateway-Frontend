import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useUpdateStudentProfile } from '../useUpdateStudentProfile';
import { updateStudentProfile } from '../../../../studentApi';

// Mock the external API module
vi.mock('../../../../studentApi', () => ({
  updateStudentProfile: vi.fn(),
}));

describe('useUpdateStudentProfile', () => {
  let queryClient;

  // Helper wrapper component using React.createElement to avoid JSX parse errors in .js files
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Spy on invalidateQueries to verify cache invalidation logic
    vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = ({ children }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    Wrapper.displayName = 'QueryClientTestWrapper';
    return Wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe('Happy Path', () => {
    it('should call updateStudentProfile API with correct payload and succeed', async () => {
      const mockPayload = {
        fullName: 'Jane Doe',
        graduationYear: 2026,
        aboutMe: 'Software engineer in training',
        majorIds: ['major-1'],
        specialtyIds: ['spec-1'],
        skillIds: ['skill-1'],
      };

      const mockResponse = { success: true, id: 'student-123' };
      vi.mocked(updateStudentProfile).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUpdateStudentProfile('student-123'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockPayload);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(updateStudentProfile).toHaveBeenCalledTimes(1);
      expect(updateStudentProfile).toHaveBeenCalledWith(mockPayload);
    });

    it('should invalidate studentProfile and userSkills queries on successful mutation', async () => {
      const studentId = 'student-999';
      vi.mocked(updateStudentProfile).mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useUpdateStudentProfile(studentId), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ fullName: 'John Smith' });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ['studentProfile', studentId],
      });
      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ['userSkills', studentId],
      });
    });
  });

  describe('Error Handling', () => {
    it('should set isError state when updateStudentProfile API fails', async () => {
      const apiError = new Error('Network error / Server error 500');
      vi.mocked(updateStudentProfile).mockRejectedValueOnce(apiError);

      const { result } = renderHook(() => useUpdateStudentProfile('student-123'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ fullName: 'Fail Test' });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(apiError);
    });

    it('should NOT invalidate cache queries if mutation fails', async () => {
      vi.mocked(updateStudentProfile).mockRejectedValueOnce(new Error('Validation Failed'));

      const { result } = renderHook(() => useUpdateStudentProfile('student-123'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ fullName: 'Invalid' });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined studentId gracefully during cache invalidation', async () => {
      vi.mocked(updateStudentProfile).mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useUpdateStudentProfile(undefined), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ fullName: 'No ID User' });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ['studentProfile', undefined],
      });
      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ['userSkills', undefined],
      });
    });

    it('should handle null studentId gracefully during cache invalidation', async () => {
      vi.mocked(updateStudentProfile).mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useUpdateStudentProfile(null), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ fullName: 'Null ID User' });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ['studentProfile', null],
      });
      expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ['userSkills', null],
      });
    });

    it('should process undefined or null payload passed to mutate', async () => {
      vi.mocked(updateStudentProfile).mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useUpdateStudentProfile('student-123'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(undefined);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(updateStudentProfile).toHaveBeenCalledWith(undefined);
    });

    it('should trigger cache invalidations for sequential successful mutations', async () => {
      vi.mocked(updateStudentProfile).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useUpdateStudentProfile('student-123'), {
        wrapper: createWrapper(),
      });

      // First mutation
      act(() => {
        result.current.mutate({ fullName: 'First Update' });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Second mutation
      act(() => {
        result.current.mutate({ fullName: 'Second Update' });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(updateStudentProfile).toHaveBeenCalledTimes(2);
      expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(4);
    });
  });
});