import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRegisterFormState } from '../useRegisterFormState';

describe('useRegisterFormState', () => {
  const mockStrategyValid = {
    validate: vi.fn().mockReturnValue(true),
  };

  const mockStrategyInvalid = {
    validate: vi.fn().mockReturnValue(false),
  };

  describe('Initial State', () => {
    it('should initialize with default form state and progress', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      expect(result.current.step).toBe(1);
      expect(result.current.acceptedTerms).toBe(false);
      expect(result.current.progressPercent).toBe('w-1/3');
      expect(result.current.formValues.email).toBe('');
      expect(result.current.formValues.maxSupervisionCapacity).toBe(3);
    });
  });

  describe('Step 1 Validation (isStep1Valid)', () => {
    it('should fail validation for invalid email formats', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      const invalidEmails = [
        'plainaddress',
        '@no-local.com',
        'user@',
        'user@domain',
        'user@ domain.com',
        'user@domain.',
      ];

      invalidEmails.forEach((email) => {
        act(() => {
          result.current.handleFieldChange('email', email);
          result.current.handleFieldChange('password', 'secret123');
          result.current.handleFieldChange('confirmPassword', 'secret123');
        });
        expect(result.current.isStep1Valid()).toBe(false);
      });
    });

    it('should fail if password length is less than 6 characters', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleFieldChange('email', 'valid@example.com');
        result.current.handleFieldChange('password', '12345');
        result.current.handleFieldChange('confirmPassword', '12345');
      });

      expect(result.current.isStep1Valid()).toBe(false);
    });

    it('should pass if password is exactly 6 characters and matches confirmation', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleFieldChange('email', 'valid@example.com');
        result.current.handleFieldChange('password', '123456');
        result.current.handleFieldChange('confirmPassword', '123456');
      });

      expect(result.current.isStep1Valid()).toBe(true);
    });

    it('should fail if password and confirmPassword do not match', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleFieldChange('email', 'valid@example.com');
        result.current.handleFieldChange('password', 'secret123');
        result.current.handleFieldChange('confirmPassword', 'secret456');
      });

      expect(result.current.isStep1Valid()).toBe(false);
    });
  });

  describe('Step 2 & Step 3 Validation', () => {
    it('should delegate step 2 validation to the active strategy', () => {
      const { result: validResult } = renderHook(() => useRegisterFormState(mockStrategyValid));
      expect(validResult.current.isStep2Valid()).toBe(true);

      const { result: invalidResult } = renderHook(() => useRegisterFormState(mockStrategyInvalid));
      expect(invalidResult.current.isStep2Valid()).toBe(false);
    });

    it('should return false for step 2 if activeStrategy is missing', () => {
      const { result } = renderHook(() => useRegisterFormState(null));
      expect(result.current.isStep2Valid()).toBe(false);
    });

    it('should evaluate step 3 validity based on terms acceptance state', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      expect(result.current.isStep3Valid()).toBe(false);

      act(() => {
        result.current.setAcceptedTerms(true);
      });

      expect(result.current.isStep3Valid()).toBe(true);
    });
  });

  describe('Step Navigation & Progress Updates', () => {
    it('should block handleNextStep if step 1 validation fails', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(1);
      expect(result.current.progressPercent).toBe('w-1/3');
    });

    it('should advance from step 1 to step 2 when step 1 is valid', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleFieldChange('email', 'test@example.com');
        result.current.handleFieldChange('password', 'secret123');
        result.current.handleFieldChange('confirmPassword', 'secret123');
      });

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(2);
      expect(result.current.progressPercent).toBe('w-2/3');
    });

    it('should block handleNextStep from step 2 if strategy validation fails', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyInvalid));

      act(() => {
        result.current.setStep(2);
      });

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(2);
      expect(result.current.progressPercent).toBe('w-2/3');
    });

    it('should advance from step 2 to step 3 when strategy validation passes', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.setStep(2);
      });

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(3);
      expect(result.current.progressPercent).toBe('w-full');
    });

    it('should handle handleBackStep correctly and enforce step 1 lower boundary', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.setStep(2);
      });

      act(() => {
        result.current.handleBackStep();
      });

      expect(result.current.step).toBe(1);

      act(() => {
        result.current.handleBackStep();
      });

      expect(result.current.step).toBe(1);
    });
  });

  describe('Keyboard Enforcement (handleKeyDownEnforcement)', () => {
    it('should call preventDefault and advance step on Enter when step 1 is valid', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      act(() => {
        result.current.handleFieldChange('email', 'test@example.com');
        result.current.handleFieldChange('password', 'secret123');
        result.current.handleFieldChange('confirmPassword', 'secret123');
      });

      const preventDefaultSpy = vi.fn();
      const event = { key: 'Enter', preventDefault: preventDefaultSpy };

      act(() => {
        result.current.handleKeyDownEnforcement(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(result.current.step).toBe(2);
    });

    it('should call preventDefault on Enter even when step validation fails to block default submit', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      const preventDefaultSpy = vi.fn();
      const event = { key: 'Enter', preventDefault: preventDefaultSpy };

      act(() => {
        result.current.handleKeyDownEnforcement(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(result.current.step).toBe(1);
    });

    it('should NOT call preventDefault for non-Enter key presses', () => {
      const { result } = renderHook(() => useRegisterFormState(mockStrategyValid));

      const preventDefaultSpy = vi.fn();
      const event = { key: 'Tab', preventDefault: preventDefaultSpy };

      act(() => {
        result.current.handleKeyDownEnforcement(event);
      });

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});