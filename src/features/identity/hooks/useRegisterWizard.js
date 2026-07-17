import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerStudent, registerProfessor, registerProvider } from '../identityApi';

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

  const isStep2Valid = () => {
    if (userRoleLabel === 'student') {
      return formValues.fullName.trim().length > 0;
    }
    if (userRoleLabel === 'professor') {
      return (
        formValues.fullName.trim().length > 0 &&
        formValues.academicDepartment.trim().length > 0 &&
        formValues.rank.trim().length > 0
      );
    }
    if (userRoleLabel === 'provider') {
      return (
        formValues.companyName.trim().length > 0 &&
        formValues.companyDescription.trim().length > 0
      );
    }
    return false;
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
      if (userRoleLabel === 'student') {
        const payload = {
          email: formValues.email,
          username: formValues.email,
          password: formValues.password,
          fullName: formValues.fullName,
          graduationYear: formValues.graduationYear ? parseInt(formValues.graduationYear, 10) : null,
          majorIds: formValues.majorIds,
          specialtyIds: formValues.specialtyIds,
          skillIds: formValues.skillIds
        };
        return await registerStudent(payload);
      }
      
      if (userRoleLabel === 'professor') {
        const payload = {
          email: formValues.email,
          username: formValues.email,
          password: formValues.password,
          fullName: formValues.fullName,
          academicDepartment: formValues.academicDepartment,
          rank: formValues.rank,
          maxSupervisionCapacity: parseInt(formValues.maxSupervisionCapacity, 10) || 3
        };
        return await registerProfessor(payload);
      }
      
      if (userRoleLabel === 'provider') {
        const payload = {
          email: formValues.email,
          username: formValues.email,
          password: formValues.password,
          companyName: formValues.companyName,
          companyDescription: formValues.companyDescription,
          websiteUrl: formValues.websiteUrl.trim() || null
        };
        return await registerProvider(payload);
      }

      throw new Error('Invalid multi-tenant registry domain context mapped.');
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

  // Dynamic presentational tracking vectors mapped strictly to state properties
  const getPageContextDetails = () => {
    if (userRoleLabel === 'student') {
      return { title: 'Student Portal Enrolment', subtitle: 'Join as an applicant to browse and claim capstone project opportunities.' };
    }
    if (userRoleLabel === 'professor') {
      return { title: 'Faculty Portal Onboarding', subtitle: 'Register your academic profile to supervise, track, and grade milestone projects.' };
    }
    return { title: 'Research Partner Onboarding', subtitle: 'Register your lab unit or corporate structure to sponsor and propose project templates.' };
  };

  const details = getPageContextDetails();
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