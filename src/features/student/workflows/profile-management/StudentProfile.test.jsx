// __tests__/StudentProfile.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentProfile from './StudentProfile';
import { useStudentProfileForm } from './hooks/useStudentProfileForm';

// Mock hook and child components relative to __tests__/
vi.mock('./hooks/useStudentProfileForm', () => ({
  useStudentProfileForm: vi.fn(),
}));

vi.mock('./components/StudentProfileReadOnlyView', () => ({
  default: vi.fn(({ onEditClick, fullName }) => (
    <div data-testid="read-only-view">
      <span>{fullName}</span>
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  )),
}));

vi.mock('./components/StudentPersonalInfoForm', () => ({
  default: vi.fn(() => <div data-testid="personal-info-form" />),
}));

vi.mock('./components/StudentAcademicInfoForm', () => ({
  default: vi.fn(() => <div data-testid="academic-info-form" />),
}));

vi.mock('@/features/skills', () => ({
  SkillPickerSection: vi.fn(() => <div data-testid="skill-picker-section" />),
}));

describe('StudentProfile', () => {
  const mockFormHookValues = {
    isLoading: false,
    updateProfileMutation: { isSuccess: false, isError: false, isPending: false },
    fullName: 'Jane Doe',
    setFullName: vi.fn(),
    graduationYear: 2026,
    setGraduationYear: vi.fn(),
    aboutMe: 'Software developer',
    setAboutMe: vi.fn(),
    isEditing: false,
    setIsEditing: vi.fn(),
    majorsData: [{ id: 'm1', name: 'CS' }],
    skillsData: [{ id: 's1', name: 'React' }],
    recommendedSkills: [],
    selectedMajorIds: ['m1'],
    selectedSpecialtyIds: [],
    setSelectedSpecialtyIds: vi.fn(),
    selectedSkillIds: ['s1'],
    setSelectedSkillIds: vi.fn(),
    selectedMajors: [],
    selectedSpecialties: [],
    selectedSkills: [],
    availableSpecialties: [],
    isRecsSkillsLoading: false,
    handleMajorsChange: vi.fn(),
    handleCancel: vi.fn(),
    handleSubmit: vi.fn((e) => e?.preventDefault()),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStudentProfileForm).mockReturnValue(mockFormHookValues);
  });

  describe('Loading State', () => {
    it('should render assembly loading indicator when isLoading is true', () => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        isLoading: true,
      });

      render(<StudentProfile />);

      expect(screen.getByText('Assembling database records...')).toBeDefined();
      expect(screen.queryByTestId('read-only-view')).toBeNull();
    });
  });

  describe('Read-Only View Mode', () => {
    it('should render StudentProfileReadOnlyView when isEditing is false', () => {
      render(<StudentProfile />);

      expect(screen.getByTestId('read-only-view')).toBeDefined();
      expect(screen.getByText('Jane Doe')).toBeDefined();
      expect(screen.queryByTestId('personal-info-form')).toBeNull();
    });

    it('should call setIsEditing(true) when edit trigger is clicked in Read-Only view', () => {
      render(<StudentProfile />);

      fireEvent.click(screen.getByText('Edit Profile'));

      expect(mockFormHookValues.setIsEditing).toHaveBeenCalledTimes(1);
      expect(mockFormHookValues.setIsEditing).toHaveBeenCalledWith(true);
    });
  });

  describe('Edit Mode & Forms Rendering', () => {
    beforeEach(() => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        isEditing: true,
      });
    });

    it('should render form sub-components and control buttons when isEditing is true', () => {
      render(<StudentProfile />);

      expect(screen.getByText('Update Academic Workspace')).toBeDefined();
      expect(screen.getByTestId('personal-info-form')).toBeDefined();
      expect(screen.getByTestId('academic-info-form')).toBeDefined();
      expect(screen.getByTestId('skill-picker-section')).toBeDefined();

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDefined();
    });

    it('should invoke handleSubmit when form is submitted', () => {
      render(<StudentProfile />);

      const form = screen.getByRole('button', { name: 'Save Changes' }).closest('form');
      fireEvent.submit(form);

      expect(mockFormHookValues.handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should invoke handleCancel when Cancel button is clicked', () => {
      render(<StudentProfile />);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockFormHookValues.handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable submit button and show "Syncing..." when mutation isPending is true', () => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        isEditing: true,
        updateProfileMutation: { isPending: true },
      });

      render(<StudentProfile />);

      const submitButton = screen.getByRole('button', { name: 'Syncing...' });
      expect(submitButton).toBeDefined();
      expect(submitButton.disabled).toBe(true);
    });
  });

  describe('Mutation Feedback Banners', () => {
    it('should display success banner when updateProfileMutation.isSuccess is true', () => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        updateProfileMutation: { isSuccess: true },
      });

      render(<StudentProfile />);

      expect(
        screen.getByText('Academic profile sync successfully completed!')
      ).toBeDefined();
    });

    it('should display custom error banner when mutation fails with error message', () => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        updateProfileMutation: {
          isError: true,
          error: { message: 'Network connection lost' },
        },
      });

      render(<StudentProfile />);

      expect(
        screen.getByText('Submission failed: Network connection lost')
      ).toBeDefined();
    });

    it('should display fallback error message when mutation error object lacks message property', () => {
      vi.mocked(useStudentProfileForm).mockReturnValue({
        ...mockFormHookValues,
        updateProfileMutation: {
          isError: true,
          error: null,
        },
      });

      render(<StudentProfile />);

      expect(
        screen.getByText('Submission failed: Failed to update profile.')
      ).toBeDefined();
    });
  });
});