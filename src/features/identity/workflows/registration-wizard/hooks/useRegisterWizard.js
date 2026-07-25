import { useParams } from 'react-router-dom';
import { UserRole } from '@/config/roles';
import { registrationStrategies } from '../strategies/registrationStrategies';
import { useRegisterFormState } from './useRegisterFormState';
import { useRegisterMutation } from './useRegisterMutation';

/**
 * Custom facade hook for orchestrating the multi-step registration wizard.
 * Composes decoupled form state management and network mutation handling.
 */
export function useRegisterWizard() {
  const { role } = useParams();

  // Normalize parameters and roles immediately
  const activeRole = role?.toLowerCase();
  const userRoleLabel = activeRole === 'researcher' ? 'provider' : activeRole;

  // Resolve the proper global network contract enum key based on the parameterized route
  const strategyLookupKey =
    userRoleLabel === 'student'
      ? UserRole.STUDENT
      : userRoleLabel === 'professor'
      ? UserRole.PROFESSOR
      : userRoleLabel === 'provider'
      ? UserRole.PROVIDER
      : null;

  // Resolve the active role profile configuration block dynamically from the factory map
  const activeStrategy = registrationStrategies[strategyLookupKey];

  // Compose decoupled hooks
  const formState = useRegisterFormState(activeStrategy);
  const mutationState = useRegisterMutation(
    activeStrategy,
    formState.formValues,
    formState.isStep3Valid
  );

  // Resolve dynamic presentational metrics securely via the isolated strategy object blocks
  const details = activeStrategy?.displayContext || { title: '', subtitle: '' };

  return {
    step: formState.step,
    formValues: formState.formValues,
    acceptedTerms: formState.acceptedTerms,
    setAcceptedTerms: formState.setAcceptedTerms,
    error: mutationState.error,
    isSubmitting: mutationState.isSubmitting,
    userRoleLabel,
    details,
    progressPercent: formState.progressPercent,
    handleFieldChange: formState.handleFieldChange,
    isStep1Valid: formState.isStep1Valid,
    isStep2Valid: formState.isStep2Valid,
    isStep3Valid: formState.isStep3Valid,
    handleNextStep: formState.handleNextStep,
    handleBackStep: formState.handleBackStep,
    handleKeyDownEnforcement: formState.handleKeyDownEnforcement,
    handleFinalSubmit: mutationState.handleFinalSubmit
  };
}