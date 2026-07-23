import { useState } from 'react';

/**
 * Custom hook for managing client-side form state and multi-step wizard navigation.
 *
 * @param {Object} activeStrategy - Active registration strategy profile.
 */
export function useRegisterFormState(activeStrategy) {
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

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation rules
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStep1Valid = () => {
    return (
      isEmailValid(formValues.email) &&
      formValues.password.length >= 6 &&
      formValues.password === formValues.confirmPassword
    );
  };

  const isStep2Valid = () => {
    return activeStrategy ? activeStrategy.validate(formValues) : false;
  };

  const isStep3Valid = () => acceptedTerms;

  // Navigation handlers
  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) setStep(2);
    else if (step === 2 && isStep2Valid()) setStep(3);
  };

  const handleBackStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Prevent keyboard form submission bypass on basic elements
  const handleKeyDownEnforcement = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 1 && isStep1Valid()) handleNextStep();
      else if (step === 2 && isStep2Valid()) handleNextStep();
    }
  };

  const progressPercent = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full';

  return {
    step,
    setStep,
    formValues,
    setFormValues,
    acceptedTerms,
    setAcceptedTerms,
    handleFieldChange,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    handleNextStep,
    handleBackStep,
    handleKeyDownEnforcement,
    progressPercent
  };
}