// __tests__/useStudentProfileForm.test.js

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStudentProfileForm } from '../useStudentProfileForm';
import { useStudentProfileData } from '../useStudentProfileData';
import { useStudentProfileFormState } from '../useStudentProfileFormState';

// Mock both child hooks relative to __tests__/ directory
vi.mock('../useStudentProfileData', () => ({
  useStudentProfileData: vi.fn(),
}));

vi.mock('../useStudentProfileFormState', () => ({
  useStudentProfileFormState: vi.fn(),
}));

describe('useStudentProfileForm', () => {
  const mockDataReturn = {
    profile: { id: 'student-1', fullName: 'Jane Doe' },
    majorsData: [{ id: 'm1', name: 'Computer Science' }],
    skillsData: [{ id: 's1', name: 'React' }],
    recommendedSkills: [{ id: 's2', name: 'Node.js' }],
    isLoading: false,
    isRecsSkillsLoading: false,
    updateProfileMutation: { mutate: vi.fn() },
  };

  const mockFormStateReturn = {
    fullName: 'Jane Doe',
    setFullName: vi.fn(),
    graduationYear: 2026,
    setGraduationYear: vi.fn(),
    aboutMe: 'Software developer',
    setAboutMe: vi.fn(),
    isEditing: false,
    setIsEditing: vi.fn(),
    selectedMajorIds: ['m1'],
    selectedSpecialtyIds: ['sp1'],
    setSelectedSpecialtyIds: vi.fn(),
    selectedSkillIds: ['s1'],
    setSelectedSkillIds: vi.fn(),
    selectedMajors: [{ id: 'm1', name: 'Computer Science' }],
    selectedSpecialties: [{ id: 'sp1', name: 'Web Dev' }],
    selectedSkills: [{ id: 's1', name: 'React' }],
    availableSpecialties: [{ id: 'sp1', name: 'Web Dev' }],
    handleMajorsChange: vi.fn(),
    handleCancel: vi.fn(),
    handleSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStudentProfileData).mockReturnValue(mockDataReturn);
    vi.mocked(useStudentProfileFormState).mockReturnValue(mockFormStateReturn);
  });

  describe('Orchestration & Data Flow', () => {
    it('should pass server state and mutation from useStudentProfileData to useStudentProfileFormState', () => {
      renderHook(() => useStudentProfileForm());

      expect(useStudentProfileData).toHaveBeenCalledTimes(1);
      expect(useStudentProfileFormState).toHaveBeenCalledTimes(1);

      expect(useStudentProfileFormState).toHaveBeenCalledWith({
        profile: mockDataReturn.profile,
        majorsData: mockDataReturn.majorsData,
        skillsData: mockDataReturn.skillsData,
        updateProfileMutation: mockDataReturn.updateProfileMutation,
      });
    });

    it('should expose complete unified contract combining data and form state', () => {
      const { result } = renderHook(() => useStudentProfileForm());

      // Loading States & Mutation
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isRecsSkillsLoading).toBe(false);
      expect(result.current.updateProfileMutation).toBe(mockDataReturn.updateProfileMutation);

      // Form Field States & Setters
      expect(result.current.fullName).toBe('Jane Doe');
      expect(result.current.setFullName).toBe(mockFormStateReturn.setFullName);
      expect(result.current.graduationYear).toBe(2026);
      expect(result.current.setGraduationYear).toBe(mockFormStateReturn.setGraduationYear);
      expect(result.current.aboutMe).toBe('Software developer');
      expect(result.current.setAboutMe).toBe(mockFormStateReturn.setAboutMe);
      expect(result.current.isEditing).toBe(false);
      expect(result.current.setIsEditing).toBe(mockFormStateReturn.setIsEditing);

      // Raw Datasets
      expect(result.current.majorsData).toBe(mockDataReturn.majorsData);
      expect(result.current.skillsData).toBe(mockDataReturn.skillsData);
      expect(result.current.recommendedSkills).toBe(mockDataReturn.recommendedSkills);

      // Selection State IDs & Setters
      expect(result.current.selectedMajorIds).toBe(mockFormStateReturn.selectedMajorIds);
      expect(result.current.selectedSpecialtyIds).toBe(mockFormStateReturn.selectedSpecialtyIds);
      expect(result.current.setSelectedSpecialtyIds).toBe(mockFormStateReturn.setSelectedSpecialtyIds);
      expect(result.current.selectedSkillIds).toBe(mockFormStateReturn.selectedSkillIds);
      expect(result.current.setSelectedSkillIds).toBe(mockFormStateReturn.setSelectedSkillIds);

      // Pre-Resolved Entity Lists
      expect(result.current.selectedMajors).toBe(mockFormStateReturn.selectedMajors);
      expect(result.current.selectedSpecialties).toBe(mockFormStateReturn.selectedSpecialties);
      expect(result.current.selectedSkills).toBe(mockFormStateReturn.selectedSkills);
      expect(result.current.availableSpecialties).toBe(mockFormStateReturn.availableSpecialties);

      // Handlers
      expect(result.current.handleMajorsChange).toBe(mockFormStateReturn.handleMajorsChange);
      expect(result.current.handleCancel).toBe(mockFormStateReturn.handleCancel);
      expect(result.current.handleSubmit).toBe(mockFormStateReturn.handleSubmit);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined/null properties from useStudentProfileData gracefully', () => {
      const emptyDataReturn = {
        profile: undefined,
        majorsData: undefined,
        skillsData: undefined,
        recommendedSkills: undefined,
        isLoading: true,
        isRecsSkillsLoading: true,
        updateProfileMutation: undefined,
      };

      vi.mocked(useStudentProfileData).mockReturnValue(emptyDataReturn);

      const { result } = renderHook(() => useStudentProfileForm());

      expect(useStudentProfileFormState).toHaveBeenCalledWith({
        profile: undefined,
        majorsData: undefined,
        skillsData: undefined,
        updateProfileMutation: undefined,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isRecsSkillsLoading).toBe(true);
      expect(result.current.recommendedSkills).toBeUndefined();
    });
  });
});