import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMajorsWithSpecialties } from '@/features/curriculum';
import { getSkills } from '@/features/skills';
import { useStudentRegisterLookups } from '../useStudentRegisterLookups';

vi.mock('@/features/curriculum', () => ({
  getMajorsWithSpecialties: vi.fn(),
}));

vi.mock('@/features/skills', () => ({
  getSkills: vi.fn(),
}));

describe('useStudentRegisterLookups', () => {
  const mockMajors = [
    {
      id: 1,
      name: 'Computer Science',
      specialties: [
        { id: 101, name: 'Artificial Intelligence' },
        { id: 102, name: 'Cybersecurity' },
      ],
    },
    {
      id: 2,
      name: 'Electrical Engineering',
      specialties: [
        { id: 201, name: 'Robotics' },
        { id: 202, name: 'Signal Processing' },
      ],
    },
    {
      id: 3,
      name: 'Pure Mathematics',
      // Explicitly missing specialties property to test defensive handling
    },
  ];

  const mockSkills = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'React Native' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getMajorsWithSpecialties.mockResolvedValue(mockMajors);
    getSkills.mockResolvedValue(mockSkills);
  });

  describe('Data Fetching & Lifecycle', () => {
    it('should fetch majors and skills lookups on mount and update loading state', async () => {
      const { result } = renderHook(() => useStudentRegisterLookups());

      expect(result.current.loadingLookups).toBe(true);

      await waitFor(() => {
        expect(result.current.loadingLookups).toBe(false);
      });

      expect(result.current.majorsData).toEqual(mockMajors);
      expect(result.current.skillsData).toEqual(mockSkills);
      expect(result.current.error).toBe('');
    });

    it('should set an error message if any lookup API request fails', async () => {
      getMajorsWithSpecialties.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useStudentRegisterLookups());

      await waitFor(() => {
        expect(result.current.loadingLookups).toBe(false);
      });

      expect(result.current.error).toBe(
        'Failed to load curriculum configuration or technical competency lookups.'
      );
    });
  });

  describe('Cascading Specialties Logic', () => {
    it('should only return specialties belonging to selected majorIds', async () => {
      const formValues = { majorIds: [1] };
      const { result } = renderHook(() => useStudentRegisterLookups(formValues));

      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      expect(result.current.availableSpecialties).toEqual([
        { id: 101, name: 'Artificial Intelligence' },
        { id: 102, name: 'Cybersecurity' },
      ]);
    });

    it('should combine specialties across multiple selected majorIds', async () => {
      const formValues = { majorIds: [1, 2] };
      const { result } = renderHook(() => useStudentRegisterLookups(formValues));

      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      expect(result.current.availableSpecialties).toHaveLength(4);
      expect(result.current.availableSpecialties.map((s) => s.id)).toEqual([
        101, 102, 201, 202,
      ]);
    });

    it('should handle undefined formValues, null majorIds, or empty selection gracefully', async () => {
      const { result: emptyHook } = renderHook(() => useStudentRegisterLookups());
      await waitFor(() => expect(emptyHook.current.loadingLookups).toBe(false));
      expect(emptyHook.current.availableSpecialties).toEqual([]);

      const { result: nullHook } = renderHook(() =>
        useStudentRegisterLookups({ majorIds: null })
      );
      await waitFor(() => expect(nullHook.current.loadingLookups).toBe(false));
      expect(nullHook.current.availableSpecialties).toEqual([]);
    });

    it('should handle majors without specialties array without crashing', async () => {
      const formValues = { majorIds: [3] }; // Major 3 has no specialties property
      const { result } = renderHook(() => useStudentRegisterLookups(formValues));

      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      expect(result.current.availableSpecialties).toEqual([]);
    });
  });

  describe('Case-Insensitive Search Filters', () => {
    it('should filter majors case-insensitively', async () => {
      const { result } = renderHook(() => useStudentRegisterLookups());
      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      act(() => {
        result.current.setMajorSearch('COMPUTER');
      });

      expect(result.current.filteredMajors).toEqual([mockMajors[0]]);
    });

    it('should filter cascading specialties case-insensitively', async () => {
      const formValues = { majorIds: [1, 2] };
      const { result } = renderHook(() => useStudentRegisterLookups(formValues));
      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      act(() => {
        result.current.setSpecialtySearch('cyber');
      });

      expect(result.current.filteredSpecialties).toEqual([
        { id: 102, name: 'Cybersecurity' },
      ]);
    });

    it('should filter skills case-insensitively', async () => {
      const { result } = renderHook(() => useStudentRegisterLookups());
      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      act(() => {
        result.current.setSkillSearch('pYtHoN');
      });

      expect(result.current.filteredSkills).toEqual([mockSkills[1]]);
    });
  });

  describe('Selected Skills Helper', () => {
    it('should filter selected skill objects based on skillIds', async () => {
      const formValues = { skillIds: [1, 3] };
      const { result } = renderHook(() => useStudentRegisterLookups(formValues));
      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      expect(result.current.selectedSkills).toEqual([mockSkills[0], mockSkills[2]]);
    });

    it('should return an empty array if skillIds is missing or empty', async () => {
      const { result } = renderHook(() => useStudentRegisterLookups({}));
      await waitFor(() => expect(result.current.loadingLookups).toBe(false));

      expect(result.current.selectedSkills).toEqual([]);
    });
  });
});