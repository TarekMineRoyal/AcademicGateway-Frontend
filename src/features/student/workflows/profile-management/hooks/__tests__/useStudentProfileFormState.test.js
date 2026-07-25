// __tests__/useStudentProfileFormState.test.js

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStudentProfileFormState } from '../useStudentProfileFormState';

describe('useStudentProfileFormState', () => {
  const mockMajorsData = [
    {
      id: 'major-1',
      name: 'Computer Science',
      specialties: [
        { id: 'spec-1', name: 'Software Engineering' },
        { id: 'spec-2', name: 'AI & Machine Learning' },
      ],
    },
    {
      id: 'major-2',
      name: 'Electrical Engineering',
      specialties: [{ id: 'spec-3', name: 'Robotics' }],
    },
  ];

  const mockSkillsData = [
    { id: 'skill-1', name: 'JavaScript' },
    { id: 'skill-2', name: 'React' },
    { id: 'skill-3', name: 'Node.js' },
  ];

  const mockProfile = {
    fullName: 'Jane Doe',
    graduationYear: 2026,
    aboutMe: 'Passionate developer',
    majors: [{ id: 'major-1', name: 'Computer Science' }],
    specialties: [{ id: 'spec-1', name: 'Software Engineering' }],
    skills: [
      { id: 'skill-1', name: 'JavaScript' },
      { id: 'skill-2', name: 'React' },
    ],
  };

  let mockUpdateMutation;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateMutation = {
      mutate: vi.fn(),
    };
  });

  describe('Initial State & Server Profile Sync', () => {
    it('should initialize with empty default values when profile is undefined or null', () => {
      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: null,
          majorsData: [],
          skillsData: [],
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.fullName).toBe('');
      expect(result.current.graduationYear).toBe('');
      expect(result.current.aboutMe).toBe('');
      expect(result.current.selectedMajorIds).toEqual([]);
      expect(result.current.selectedSpecialtyIds).toEqual([]);
      expect(result.current.selectedSkillIds).toEqual([]);
      expect(result.current.isEditing).toBe(false);
    });

    it('should populate state when profile prop is provided', () => {
      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: mockProfile,
          majorsData: mockMajorsData,
          skillsData: mockSkillsData,
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.fullName).toBe('Jane Doe');
      expect(result.current.graduationYear).toBe(2026);
      expect(result.current.aboutMe).toBe('Passionate developer');
      expect(result.current.selectedMajorIds).toEqual(['major-1']);
      expect(result.current.selectedSpecialtyIds).toEqual(['spec-1']);
      expect(result.current.selectedSkillIds).toEqual(['skill-1', 'skill-2']);
    });

    it('should handle profile objects with missing/null sub-properties gracefully', () => {
      const incompleteProfile = {
        fullName: null,
        graduationYear: null,
        aboutMe: undefined,
        majors: null,
        specialties: undefined,
        skills: null,
      };

      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: incompleteProfile,
          majorsData: mockMajorsData,
          skillsData: mockSkillsData,
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.fullName).toBe('');
      expect(result.current.graduationYear).toBe('');
      expect(result.current.aboutMe).toBe('');
      expect(result.current.selectedMajorIds).toEqual([]);
      expect(result.current.selectedSpecialtyIds).toEqual([]);
      expect(result.current.selectedSkillIds).toEqual([]);
    });

    it('should re-sync form state when profile prop updates during render', () => {
      const { result, rerender } = renderHook(
        ({ profile }) =>
          useStudentProfileFormState({
            profile,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          }),
        { initialProps: { profile: null } }
      );

      expect(result.current.fullName).toBe('');

      // Rerender with updated server profile
      rerender({ profile: mockProfile });

      expect(result.current.fullName).toBe('Jane Doe');
      expect(result.current.selectedMajorIds).toEqual(['major-1']);
    });
  });

  describe('Computed Data & Derived Entities', () => {
    it('should compute availableSpecialties based on selectedMajorIds', () => {
      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: mockProfile,
          majorsData: mockMajorsData,
          skillsData: mockSkillsData,
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.availableSpecialties).toEqual([
        { id: 'spec-1', name: 'Software Engineering' },
        { id: 'spec-2', name: 'AI & Machine Learning' },
      ]);
    });

    it('should resolve selectedMajors, selectedSpecialties, and selectedSkills objects from IDs', () => {
      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: mockProfile,
          majorsData: mockMajorsData,
          skillsData: mockSkillsData,
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.selectedMajors).toEqual([mockMajorsData[0]]);
      expect(result.current.selectedSpecialties).toEqual([mockMajorsData[0].specialties[0]]);
      expect(result.current.selectedSkills).toEqual([mockSkillsData[0], mockSkillsData[1]]);
    });

    it('should return empty derived arrays when lookup datasets are empty or undefined', () => {
      const { result } = renderHook(() =>
        useStudentProfileFormState({
          profile: mockProfile,
          majorsData: [],
          skillsData: [],
          updateProfileMutation: mockUpdateMutation,
        })
      );

      expect(result.current.availableSpecialties).toEqual([]);
      expect(result.current.selectedMajors).toEqual([]);
      expect(result.current.selectedSpecialties).toEqual([]);
      expect(result.current.selectedSkills).toEqual([]);
    });
  });

  describe('Action Handlers', () => {
    describe('handleMajorsChange', () => {
      it('should update selectedMajorIds and filter out invalid selectedSpecialtyIds', () => {
        // Stable profile object to prevent infinite re-render loop in renderHook
        const profileWithMultipleSpecs = {
          ...mockProfile,
          specialties: [
            { id: 'spec-1', name: 'Software Engineering' },
            { id: 'spec-3', name: 'Robotics' },
          ],
        };

        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: profileWithMultipleSpecs,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        // Initially both spec-1 and spec-3 are selected
        expect(result.current.selectedSpecialtyIds).toEqual(['spec-1', 'spec-3']);

        // Deselect major-1 (owns spec-1), select major-2 (owns spec-3)
        act(() => {
          result.current.handleMajorsChange([mockMajorsData[1]]);
        });

        expect(result.current.selectedMajorIds).toEqual(['major-2']);
        // spec-1 is pruned because it belongs to major-1
        expect(result.current.selectedSpecialtyIds).toEqual(['spec-3']);
      });

      it('should handle major objects that have missing or null specialties array', () => {
        const majorsWithoutSpecs = [{ id: 'major-3', name: 'Math', specialties: null }];

        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: mockProfile,
            majorsData: majorsWithoutSpecs,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        act(() => {
          result.current.handleMajorsChange([majorsWithoutSpecs[0]]);
        });

        expect(result.current.selectedMajorIds).toEqual(['major-3']);
        expect(result.current.selectedSpecialtyIds).toEqual([]);
      });
    });

    describe('handleCancel', () => {
      it('should reset form fields back to profile data and exit edit mode', () => {
        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: mockProfile,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        // Mutate form fields locally
        act(() => {
          result.current.setIsEditing(true);
          result.current.setFullName('Changed Name');
          result.current.setGraduationYear('2030');
          result.current.setAboutMe('Changed about text');
        });

        expect(result.current.fullName).toBe('Changed Name');
        expect(result.current.isEditing).toBe(true);

        // Execute cancel
        act(() => {
          result.current.handleCancel();
        });

        expect(result.current.fullName).toBe('Jane Doe');
        expect(result.current.graduationYear).toBe(2026);
        expect(result.current.aboutMe).toBe('Passionate developer');
        expect(result.current.isEditing).toBe(false);
      });

      it('should exit edit mode without modifying fields if cancel is called when profile is null', () => {
        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: null,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        act(() => {
          result.current.setFullName('Temporary Name');
          result.current.setIsEditing(true);
        });

        act(() => {
          result.current.handleCancel();
        });

        // if (profile) evaluates to false, so local inputs remain, but isEditing is set to false
        expect(result.current.fullName).toBe('Temporary Name');
        expect(result.current.isEditing).toBe(false);
      });
    });

    describe('handleSubmit', () => {
      it('should format payload, call mutate, and disable edit mode on success', () => {
        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: mockProfile,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        act(() => {
          result.current.setIsEditing(true);
          result.current.setFullName('  John Smith  ');
          result.current.setGraduationYear('2028');
          result.current.setAboutMe('  New bio statement  ');
        });

        const preventDefaultMock = vi.fn();

        act(() => {
          result.current.handleSubmit({ preventDefault: preventDefaultMock });
        });

        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(mockUpdateMutation.mutate).toHaveBeenCalledTimes(1);

        const [payload, options] = mockUpdateMutation.mutate.mock.calls[0];

        expect(payload).toEqual({
          fullName: 'John Smith',
          graduationYear: 2028,
          aboutMe: 'New bio statement',
          majorIds: ['major-1'],
          specialtyIds: ['spec-1'],
          skillIds: ['skill-1', 'skill-2'],
        });

        // Trigger onSuccess callback passed to mutate
        act(() => {
          options.onSuccess();
        });

        expect(result.current.isEditing).toBe(false);
      });

      it('should convert empty graduationYear and aboutMe strings to null in payload', () => {
        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: mockProfile,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: mockUpdateMutation,
          })
        );

        act(() => {
          result.current.setGraduationYear('');
          result.current.setAboutMe('   ');
        });

        act(() => {
          result.current.handleSubmit();
        });

        const [payload] = mockUpdateMutation.mutate.mock.calls[0];

        expect(payload.graduationYear).toBeNull();
        expect(payload.aboutMe).toBeNull();
      });

      it('should handle undefined event object and missing updateProfileMutation gracefully', () => {
        const { result } = renderHook(() =>
          useStudentProfileFormState({
            profile: mockProfile,
            majorsData: mockMajorsData,
            skillsData: mockSkillsData,
            updateProfileMutation: undefined,
          })
        );

        expect(() => {
          act(() => {
            result.current.handleSubmit(undefined);
          });
        }).not.toThrow();
      });
    });
  });
});