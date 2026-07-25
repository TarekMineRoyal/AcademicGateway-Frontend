import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RegisterStepCredentials from '../RegisterStepCredentials';

describe('RegisterStepCredentials', () => {
  const defaultProps = {
    formValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    onFieldChange: vi.fn(),
  };

  it('renders all form fields, labels, and required attributes', () => {
    render(<RegisterStepCredentials {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /core identity credentials/i })
    ).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('you@university.edu');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeRequired();

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    expect(passwordInputs).toHaveLength(2);
    expect(passwordInputs[0]).toBeRequired();
    expect(passwordInputs[1]).toBeRequired();
  });

  it('invokes onFieldChange with key and typed value when user inputs email', async () => {
    const user = userEvent.setup();
    const onFieldChange = vi.fn();
    render(
      <RegisterStepCredentials
        {...defaultProps}
        onFieldChange={onFieldChange}
      />
    );

    const emailInput = screen.getByPlaceholderText('you@university.edu');
    await user.type(emailInput, 'a');

    expect(onFieldChange).toHaveBeenCalledWith('email', 'a');
  });

  it('invokes onFieldChange with key and typed value when user inputs password fields', async () => {
    const user = userEvent.setup();
    const onFieldChange = vi.fn();
    render(
      <RegisterStepCredentials
        {...defaultProps}
        onFieldChange={onFieldChange}
      />
    );

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await user.type(passwordInputs[0], 'P');
    expect(onFieldChange).toHaveBeenCalledWith('password', 'P');

    await user.type(passwordInputs[1], 'P');
    expect(onFieldChange).toHaveBeenCalledWith('confirmPassword', 'P');
  });

  describe('Password Alignment Validation', () => {
    it('[AC] renders "Passwords do not align." warning when password fields do not match', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: 'student@univ.edu',
          password: 'Password123!',
          confirmPassword: 'DifferentPassword123!',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(screen.getByText('Passwords do not align.')).toBeInTheDocument();
    });

    it('does NOT render mismatch warning when passwords match exactly', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: 'student@univ.edu',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(
        screen.queryByText('Passwords do not align.')
      ).not.toBeInTheDocument();
    });

    it('edge case: does NOT render warning when confirmPassword is empty', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: '',
          password: 'Password123!',
          confirmPassword: '',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(
        screen.queryByText('Passwords do not align.')
      ).not.toBeInTheDocument();
    });

    it('edge case: does NOT render warning when primary password is empty', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: '',
          password: '',
          confirmPassword: 'Password123!',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(
        screen.queryByText('Passwords do not align.')
      ).not.toBeInTheDocument();
    });

    it('edge case: triggers warning when case sensitivity differs', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: '',
          password: 'Password123',
          confirmPassword: 'password123',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(screen.getByText('Passwords do not align.')).toBeInTheDocument();
    });

    it('edge case: triggers warning when trailing/leading whitespace differs', () => {
      const props = {
        ...defaultProps,
        formValues: {
          email: '',
          password: 'Password123',
          confirmPassword: 'Password123 ',
        },
      };

      render(<RegisterStepCredentials {...props} />);

      expect(screen.getByText('Passwords do not align.')).toBeInTheDocument();
    });
  });
});