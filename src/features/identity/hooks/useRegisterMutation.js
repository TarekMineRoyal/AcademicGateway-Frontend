import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook for managing registration network mutations, error states,
 * and post-submission navigation.
 *
 * @param {Object} activeStrategy - Active registration strategy profile.
 * @param {Object} formValues - Current form values to compile into a DTO.
 * @param {Function} isStep3Valid - Validation function for the final step.
 */
export function useRegisterMutation(activeStrategy, formValues, isStep3Valid) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!activeStrategy) {
        throw new Error('Invalid multi-tenant registry domain context mapped.');
      }

      // Delegate DTO compilation and submission routing directly to the strategy profile
      const compiledPayloadDto = activeStrategy.compileDto(formValues);
      return await activeStrategy.submitAction(compiledPayloadDto);
    },
    onSuccess: () => {
      navigate('/login?registered=true');
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
          'An error occurred during account registration configuration.'
      );
    }
  });

  const handleFinalSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isStep3Valid() || registerMutation.isPending) return;
    setError('');
    registerMutation.mutate();
  };

  return {
    error,
    setError,
    isSubmitting: registerMutation.isPending,
    handleFinalSubmit,
    registerMutation
  };
}