import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import RegisterWizard from '../RegisterWizard';
import { useRegisterWizard } from '../../hooks/useRegisterWizard';

vi.mock('../../hooks/useRegisterWizard', () => ({
  useRegisterWizard: vi.fn(),
}));

describe('RegisterWizard', () => {
  const mockHandleNextStep = vi.fn();
  const mockHandleBackStep = vi.fn();
  const mockHandleFinalSubmit = vi.fn();
  const mockSetAcceptedTerms = vi.fn();
  const mockHandleFieldChange = vi.fn();
  const mockHandleKeyDownEnforcement = vi.fn();

  const defaultMockWizard = {
    step: 1,
    formValues: {
      email: 'student@university.edu',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      fullName: 'Alex Rivera',
      graduationYear: '2027',
      majorIds: [],
      specialtyIds: [],
      skillIds: [],
      aboutMe: '',
    },
    acceptedTerms: false,
    setAcceptedTerms: mockSetAcceptedTerms,
    error: '',
    isSubmitting: false,
    userRoleLabel: 'student',
    details: {
      title: 'Student Portal Enrolment',
      subtitle: 'Join as an applicant to browse and claim capstone project opportunities.',
    },
    progressPercent: 'w-1/3',
    handleFieldChange: mockHandleFieldChange,
    isStep1Valid: () => true,
    isStep2Valid: () => true,
    isStep3Valid: () => false,
    handleNextStep: mockHandleNextStep,
    handleBackStep: mockHandleBackStep,
    handleKeyDownEnforcement: mockHandleKeyDownEnforcement,
    handleFinalSubmit: mockHandleFinalSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useRegisterWizard.mockReturnValue(defaultMockWizard);
  });

  const renderWizardAtRoute = (roleParam = 'student') => {
    return render(
      <MemoryRouter initialEntries={[`/register/${roleParam}`]}>
        <Routes>
          <Route path="/" element={<div>Home Landing Page</div>} />
          <Route path="/register/:role" element={<RegisterWizard />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('[AC] Role Routing & Redirect Boundaries', () => {
    it('[AC] redirects navigating to /register/invalid-role back to / landing route', () => {
      renderWizardAtRoute('invalid-role');

      expect(screen.getByText('Home Landing Page')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /academic gateway/i })
      ).not.toBeInTheDocument();
    });

    it('renders wizard shell correctly for valid role route parameters', () => {
      renderWizardAtRoute('student');

      expect(
        screen.getByRole('heading', { name: /academic gateway/i })
      ).toBeInTheDocument();
      expect(screen.getByText('Student Portal Enrolment')).toBeInTheDocument();
    });
  });

  describe('[AC] Top-Level Error Banner', () => {
    it('[AC] renders error banner when error string is present in state', () => {
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        error: 'System timeout while processing registration payload.',
      });

      renderWizardAtRoute('student');

      const errorBox = screen.getByText(
        'System timeout while processing registration payload.'
      );
      expect(errorBox).toBeInTheDocument();
      expect(errorBox).toHaveClass('bg-red-50 border-red-500');
    });

    it('does NOT render error banner when error string is empty', () => {
      renderWizardAtRoute('student');

      expect(
        screen.queryByText(/system timeout/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('[AC] Step Navigation & Button States', () => {
    it('[AC] enables "Continue to Profile" button on Step 1 when valid and triggers handleNextStep on click', async () => {
      const user = userEvent.setup();
      renderWizardAtRoute('student');

      const continueBtn = screen.getByRole('button', {
        name: /continue to profile/i,
      });
      expect(continueBtn).toBeEnabled();

      await user.click(continueBtn);
      expect(mockHandleNextStep).toHaveBeenCalledTimes(1);
    });

    it('disables "Continue to Profile" button on Step 1 when isStep1Valid is false', () => {
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        isStep1Valid: () => false,
      });

      renderWizardAtRoute('student');

      const continueBtn = screen.getByRole('button', {
        name: /continue to profile/i,
      });
      expect(continueBtn).toBeDisabled();
    });

    it('[AC] enables "Next Step" button on Step 2 when valid and triggers handleNextStep on click', async () => {
      const user = userEvent.setup();
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 2,
        progressPercent: 'w-2/3',
      });

      renderWizardAtRoute('student');

      const nextBtn = screen.getByRole('button', { name: /next step/i });
      expect(nextBtn).toBeEnabled();

      await user.click(nextBtn);
      expect(mockHandleNextStep).toHaveBeenCalledTimes(1);
    });

    it('disables "Next Step" button on Step 2 when isStep2Valid is false', () => {
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 2,
        isStep2Valid: () => false,
      });

      renderWizardAtRoute('student');

      const nextBtn = screen.getByRole('button', { name: /next step/i });
      expect(nextBtn).toBeDisabled();
    });

    it('invokes handleBackStep when clicking "Back" button on step 2 or 3', async () => {
      const user = userEvent.setup();
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 2,
      });

      renderWizardAtRoute('student');

      const backBtn = screen.getByRole('button', { name: /back/i });
      await user.click(backBtn);

      expect(mockHandleBackStep).toHaveBeenCalledTimes(1);
    });
  });

  describe('[AC] Step 3 Terms Verification & Submission', () => {
    it('[AC] disables "Create My Account" button on Step 3 until terms checkbox is valid', () => {
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 3,
        acceptedTerms: false,
        isStep3Valid: () => false,
      });

      renderWizardAtRoute('student');

      const submitBtn = screen.getByRole('button', {
        name: /create my account/i,
      });
      expect(submitBtn).toBeDisabled();
    });

    it('[AC] enables "Create My Account" button when acceptedTerms/isStep3Valid is true and invokes handleFinalSubmit on click', async () => {
      const user = userEvent.setup();
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 3,
        acceptedTerms: true,
        isStep3Valid: () => true,
      });

      renderWizardAtRoute('student');

      const submitBtn = screen.getByRole('button', {
        name: /create my account/i,
      });
      expect(submitBtn).toBeEnabled();

      await user.click(submitBtn);
      expect(mockHandleFinalSubmit).toHaveBeenCalledTimes(1);
    });

    it('displays loading text "Creating Profile..." and disables submission controls while isSubmitting is true', () => {
      useRegisterWizard.mockReturnValue({
        ...defaultMockWizard,
        step: 3,
        acceptedTerms: true,
        isSubmitting: true,
        isStep3Valid: () => true,
      });

      renderWizardAtRoute('student');

      const submitBtn = screen.getByRole('button', {
        name: /creating profile\.\.\./i,
      });
      expect(submitBtn).toBeDisabled();

      const backBtn = screen.getByRole('button', { name: /back/i });
      expect(backBtn).toBeDisabled();
    });
  });
});