import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useParams } from 'react-router-dom';
import { UserRole } from '@/config/roles';
import { registrationStrategies } from '../../strategies/registrationStrategies';
import { useRegisterWizard } from '../useRegisterWizard';
import { useRegisterMutation } from '../useRegisterMutation';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('../useRegisterMutation', () => ({
  useRegisterMutation: vi.fn(),
}));

describe('useRegisterWizard', () => {
  const mockMutationReturn = {
    error: null,
    isSubmitting: false,
    handleFinalSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useRegisterMutation.mockReturnValue(mockMutationReturn);
  });

  describe('Role Normalization & Alias Resolution', () => {
    it('should normalize researcher alias to provider and resolve UserRole.PROVIDER strategy', () => {
      useParams.mockReturnValue({ role: 'researcher' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBe('provider');
      expect(result.current.details).toEqual(
        registrationStrategies[UserRole.PROVIDER].displayContext
      );
    });

    it('should handle case-insensitive role parameters correctly', () => {
      useParams.mockReturnValue({ role: 'ReSeArChEr' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBe('provider');
      expect(result.current.details).toEqual(
        registrationStrategies[UserRole.PROVIDER].displayContext
      );
    });

    it('should resolve student route parameter to UserRole.STUDENT strategy', () => {
      useParams.mockReturnValue({ role: 'STUDENT' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBe('student');
      expect(result.current.details).toEqual(
        registrationStrategies[UserRole.STUDENT].displayContext
      );
    });

    it('should resolve professor route parameter to UserRole.PROFESSOR strategy', () => {
      useParams.mockReturnValue({ role: 'professor' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBe('professor');
      expect(result.current.details).toEqual(
        registrationStrategies[UserRole.PROFESSOR].displayContext
      );
    });

    it('should fallback cleanly with empty details when route param is invalid or unrecognized', () => {
      useParams.mockReturnValue({ role: 'administrator' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBe('administrator');
      expect(result.current.details).toEqual({ title: '', subtitle: '' });
    });

    it('should handle missing or undefined route role parameter gracefully', () => {
      useParams.mockReturnValue({});

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.userRoleLabel).toBeUndefined();
      expect(result.current.details).toEqual({ title: '', subtitle: '' });
    });
  });

  describe('Facade Composition & State Exposure', () => {
    it('should pass activeStrategy and form state dependencies into useRegisterMutation', () => {
      useParams.mockReturnValue({ role: 'student' });

      renderHook(() => useRegisterWizard());

      expect(useRegisterMutation).toHaveBeenCalledTimes(1);
      const [passedStrategy, passedFormValues, passedIsStep3Valid] =
        useRegisterMutation.mock.calls[0];

      expect(passedStrategy).toBe(registrationStrategies[UserRole.STUDENT]);
      expect(passedFormValues).toBeDefined();
      expect(typeof passedIsStep3Valid).toBe('function');
    });

    it('should expose composed form state, mutation state, and action handlers', () => {
      useParams.mockReturnValue({ role: 'student' });

      const { result } = renderHook(() => useRegisterWizard());

      expect(result.current.step).toBe(1);
      expect(result.current.error).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
      expect(typeof result.current.handleFieldChange).toBe('function');
      expect(typeof result.current.handleNextStep).toBe('function');
      expect(typeof result.current.handleBackStep).toBe('function');
      expect(typeof result.current.handleKeyDownEnforcement).toBe('function');
      expect(result.current.handleFinalSubmit).toBe(mockMutationReturn.handleFinalSubmit);
    });
  });
});