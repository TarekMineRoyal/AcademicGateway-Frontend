import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserRole } from '../../../constants/enums';
import { registrationStrategies } from '../strategies/registrationStrategies';

/**
 * Custom logic orchestrator hook for the registration multi-step wizard.
 * Handles state tracking, field validation rules, multi-tenant role branching,
 * and compiles backend JSON payloads safely away from presentational concerns.
 */
export function useRegisterWizard() {
  const { role } = useParams();
  const navigate = useNavigate();

  // Normalize parameters and roles immediately
  const activeRole = role?.toLowerCase();
  const userRoleLabel = activeRole === 'researcher' ? 'provider' : activeRole;

  // Resolve the proper global network contract enum key based on the parameterized route
  const strategyLookupKey = 
    userRoleLabel === 'student' ? UserRole.STUDENT :
    userRoleLabel === 'professor' ? UserRole.PROFESSOR :
    userRoleLabel === 'provider' ? UserRole.PROVIDER : null;

  // Resolve the active role profile configuration block dynamically from the factory map
  const activeStrategy = registrationStrategies[strategyLookupKey];

  // 1. Isolated Logic Layer State Modules
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    graduationYear: '',
    majorIds: [],
    specialtyIds: [],
    skillIds: [],
    academicDepartment: '',
    rank: '',
    maxSupervisionCapacity: 3,
    facultyVerificationId: '',
    researchSpecialization: '',
    companyName: '',
    companyDescription: '',
    websiteUrl: '',
    industrySector: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  // Clean field mutation dispatch callback
  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // 2. Comprehensive Multi-Tenant Validation Schemas
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStep1Valid = () => {
    return (
      isEmailValid(formValues.email) &&
      formValues.password.length >= 6 &&
      formValues.password === formValues.confirmPassword
    );
  };

  // Delegate the validation workload directly to the active strategy profile layout
  const isStep2Valid = () => {
    return activeStrategy ? activeStrategy.validate(formValues) : false;
  };

  const isStep3Valid = () => acceptedTerms;

  // Wizard Navigation Control Pipelines
  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) setStep(2);
    else if (step === 2 && isStep2Valid()) setStep(3);
  };

  const handleBackStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Prevent keyboard form submission bypass parameters on basic elements
  const handleKeyDownEnforcement = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 1 && isStep1Valid()) handleNextStep();
      else if (step === 2 && isStep2Valid()) handleNextStep();
    }
  };

  // 3. Encapsulated DTO Compilation Matrix via Unified Mutation Pipeline
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
      setError(err.response?.data?.message || 'An error occurred during account registration configuration.');
    }
  });

  const handleFinalSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isStep3Valid() || registerMutation.isPending) return;
    setError('');
    registerMutation.mutate();
  };

  // Resolve dynamic presentational metrics securely via the isolated strategy object blocks
  const details = activeStrategy?.displayContext || { title: '', subtitle: '' };
  const progressPercent = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full';

  return {
    step,
    formValues,
    acceptedTerms,
    setAcceptedTerms,
    error,
    isSubmitting: registerMutation.isPending,
    userRoleLabel,
    details,
    progressPercent,
    handleFieldChange,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    handleNextStep,
    handleBackStep,
    handleKeyDownEnforcement,
    handleFinalSubmit
  };
}