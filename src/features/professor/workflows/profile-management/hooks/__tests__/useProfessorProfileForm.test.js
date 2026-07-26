import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfessorProfileForm } from '../useProfessorProfileForm';
import { useProfessorProfileData } from '../useProfessorProfileData';

vi.mock('../useProfessorProfileData', () => ({
  useProfessorProfileData: vi.fn(),
}));

describe('useProfessorProfileForm', () => {
  const mockMutate = vi.fn();
  const mockProfileData = {
    profile: null,
    isLoading: false,
    updateProfileMutation: {
      mutate: mockMutate,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfessorProfileData).mockReturnValue(mockProfileData);
  });

  it('should initialize with default states when profile is null', () => {
    const { result } = renderHook(() => useProfessorProfileForm());

    expect(result.current.fullName).toBe('');
    expect(result.current.department).toBe('');
    expect(result.current.rank).toBe('');
    expect(result.current.maxSupervisionCapacity).toBe(5);
    expect(result.current.researchInterests).toEqual([]);
    expect(result.current.aboutMe).toBe('');
    expect(result.current.isEditing).toBe(false);
  });

  it('should synchronize form state when profile data becomes available', () => {
    const mockProfile = {
      fullName: 'Dr. Jane Smith',
      department: 'Computer Science',
      rank: 'Associate Professor',
      maxSupervisionCapacity: 10,
      researchInterests: ['AI', 'Robotics'],
      aboutMe: 'Passionate about research.',
    };

    vi.mocked(useProfessorProfileData).mockReturnValue({
      ...mockProfileData,
      profile: mockProfile,
    });

    const { result } = renderHook(() => useProfessorProfileForm());

    expect(result.current.fullName).toBe('Dr. Jane Smith');
    expect(result.current.department).toBe('Computer Science');
    expect(result.current.rank).toBe('Associate Professor');
    expect(result.current.maxSupervisionCapacity).toBe(10);
    expect(result.current.researchInterests).toEqual(['AI', 'Robotics']);
    expect(result.current.aboutMe).toBe('Passionate about research.');
  });

  it('should allow updating form fields via state setters', () => {
    const { result } = renderHook(() => useProfessorProfileForm());

    act(() => {
      result.current.setFullName('Dr. John Doe');
      result.current.setDepartment('Physics');
      result.current.setRank('Full Professor');
      result.current.setMaxSupervisionCapacity(8);
      result.current.setResearchInterests(['Quantum']);
      result.current.setAboutMe('Physics researcher.');
      result.current.setIsEditing(true);
    });

    expect(result.current.fullName).toBe('Dr. John Doe');
    expect(result.current.department).toBe('Physics');
    expect(result.current.rank).toBe('Full Professor');
    expect(result.current.maxSupervisionCapacity).toBe(8);
    expect(result.current.researchInterests).toEqual(['Quantum']);
    expect(result.current.aboutMe).toBe('Physics researcher.');
    expect(result.current.isEditing).toBe(true);
  });

  it('should reset form state and exit editing mode on handleCancel', () => {
    const mockProfile = {
      fullName: 'Dr. Jane Smith',
      department: 'Computer Science',
      rank: 'Associate Professor',
      maxSupervisionCapacity: 10,
      researchInterests: ['AI'],
      aboutMe: 'Passionate about research.',
    };

    vi.mocked(useProfessorProfileData).mockReturnValue({
      ...mockProfileData,
      profile: mockProfile,
    });

    const { result } = renderHook(() => useProfessorProfileForm());

    act(() => {
      result.current.setIsEditing(true);
      result.current.setFullName('Modified Name');
      result.current.setDepartment('Modified Department');
    });

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.fullName).toBe('Dr. Jane Smith');
    expect(result.current.department).toBe('Computer Science');
  });

  it('should format payload correctly and trigger mutation on handleSubmit', () => {
    const { result } = renderHook(() => useProfessorProfileForm());

    act(() => {
      result.current.setFullName('  Dr. Alan Turing  ');
      result.current.setDepartment('  Mathematics  ');
      result.current.setRank('  Professor  ');
      result.current.setMaxSupervisionCapacity('6');
      result.current.setResearchInterests(['  Cryptography ', '   ']);
      result.current.setAboutMe('  Theory of computation  ');
    });

    const preventDefault = vi.fn();

    act(() => {
      result.current.handleSubmit({ preventDefault });
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith(
      {
        fullName: 'Dr. Alan Turing',
        department: 'Mathematics',
        rank: 'Professor',
        maxSupervisionCapacity: 6,
        researchInterests: ['Cryptography'],
        aboutMe: 'Theory of computation',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
  });

  it('should exit edit mode on successful profile update', () => {
    const { result } = renderHook(() => useProfessorProfileForm());

    act(() => {
      result.current.setIsEditing(true);
    });

    act(() => {
      result.current.handleSubmit();
    });

    const mutationOptions = mockMutate.mock.calls[0][1];

    act(() => {
      mutationOptions.onSuccess();
    });

    expect(result.current.isEditing).toBe(false);
  });
});