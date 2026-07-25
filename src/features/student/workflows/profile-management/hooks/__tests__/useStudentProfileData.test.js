import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStudentProfileData } from '../useStudentProfileData';
import { useAuth } from '@/context/AuthContextCore';
import { getMajorsWithSpecialties } from '@/features/curriculum';
import { getSkills, useRecommendedSkills } from '@/features/skills';
import { getStudentProfile } from '../../../../studentApi';
import { useUpdateStudentProfile } from '../useUpdateStudentProfile';

// Mock module dependencies with paths relative to __tests__/
vi.mock('@/context/AuthContextCore', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/curriculum', () => ({
  getMajorsWithSpecialties: vi.fn(),
}));

vi.mock('@/features/skills', () => ({
  getSkills: vi.fn(),
  useRecommendedSkills: vi.fn(),
}));

vi.mock('../../../../studentApi', () => ({
  getStudentProfile: vi.fn(),
}));

vi.mock('../useUpdateStudentProfile', () => ({
  useUpdateStudentProfile: vi.fn(),
}));

describe('useStudentProfileData', () => {
  let queryClient;

  // React Query Wrapper helper using React.createElement (no JSX in .js files)
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const Wrapper = ({ children }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    Wrapper.displayName = 'QueryClientTestWrapper';
    return Wrapper;
  };

  const mockProfile = { id: 'student-123', fullName: 'Jane Doe' };
  const mockMajors = [{ id: 'm1', name: 'Computer Science' }];
  const mockSkills = [{ id: 's1', name: 'React' }];
  const mockRecommendedSkills = [{ id: 's2', name: 'TypeScript' }];
  const mockMutation = { mutate: vi.fn(), isLoading: false };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock behavior
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'student-123' } });
    vi.mocked(getStudentProfile).mockResolvedValue(mockProfile);
    vi.mocked(getMajorsWithSpecialties).mockResolvedValue(mockMajors);
    vi.mocked(getSkills).mockResolvedValue(mockSkills);
    vi.mocked(useRecommendedSkills).mockReturnValue({
      recommendedSkills: mockRecommendedSkills,
      isLoading: false,
    });
    vi.mocked(useUpdateStudentProfile).mockReturnValue(mockMutation);
  });

  describe('Auth Context & Student ID Handling', () => {
    it('should derive studentId from authenticated user and pass it to useUpdateStudentProfile', async () => {
      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.studentId).toBe('student-123');
      expect(useUpdateStudentProfile).toHaveBeenCalledWith('student-123');
    });

    it('should disable student profile query when user is null or undefined', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: null });

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.studentId).toBeUndefined();
      expect(getStudentProfile).not.toHaveBeenCalled();
      expect(useUpdateStudentProfile).toHaveBeenCalledWith(undefined);
    });

    it('should disable student profile query when user.id is missing or empty string', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: { name: 'No ID User' } });

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.studentId).toBeUndefined();
      expect(getStudentProfile).not.toHaveBeenCalled();
    });
  });

  describe('Data Resolution & Fallbacks', () => {
    it('should resolve and aggregate profile, majors, skills, and recommendedSkills', async () => {
      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.majorsData).toEqual(mockMajors);
      expect(result.current.skillsData).toEqual(mockSkills);
      expect(result.current.recommendedSkills).toEqual(mockRecommendedSkills);
      expect(result.current.updateProfileMutation).toBe(mockMutation);
      expect(useRecommendedSkills).toHaveBeenCalledWith(10);
    });

    it('should return empty arrays as default fallbacks when queries return undefined', async () => {
      vi.mocked(getMajorsWithSpecialties).mockResolvedValue(undefined);
      vi.mocked(getSkills).mockResolvedValue(undefined);
      vi.mocked(useRecommendedSkills).mockReturnValue({
        recommendedSkills: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.majorsData).toEqual([]);
      expect(result.current.skillsData).toEqual([]);
      expect(result.current.recommendedSkills).toEqual([]);
    });
  });

  describe('Combined Loading Logic', () => {
    it('should set isLoading to true while profile query is pending', async () => {
      vi.mocked(getStudentProfile).mockImplementation(
        () => new Promise(() => {}) // Never resolving promise
      );

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to true while majors query is pending', async () => {
      vi.mocked(getMajorsWithSpecialties).mockImplementation(
        () => new Promise(() => {}) // Never resolving promise
      );

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to true while skills query is pending', async () => {
      vi.mocked(getSkills).mockImplementation(
        () => new Promise(() => {}) // Never resolving promise
      );

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should expose isRecsSkillsLoading independently without altering primary isLoading', async () => {
      vi.mocked(useRecommendedSkills).mockReturnValue({
        recommendedSkills: [],
        isLoading: true,
      });

      const { result } = renderHook(() => useStudentProfileData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isRecsSkillsLoading).toBe(true);
    });
  });
});