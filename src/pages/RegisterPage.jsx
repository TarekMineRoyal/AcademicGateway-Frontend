import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import StudentRegisterForm from '../features/identity/components/StudentRegisterForm';
import ProfessorRegisterForm from '../features/identity/components/ProfessorRegisterForm';
import ProviderRegisterForm from '../features/identity/components/ProviderRegisterForm';
import { registerStudent, registerProfessor, registerProvider } from '../features/identity/identityApi';

function RegisterPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  // Safeguard: Immediate bounce home if an invalid route parameter is provided
  const activeRole = role?.toLowerCase();
  if (activeRole !== 'student' && activeRole !== 'professor' && activeRole !== 'provider' && activeRole !== 'researcher') {
    return <Navigate to="/" replace />;
  }

  // Normalized role title string for UI presentation
  const userRoleLabel = activeRole === 'researcher' ? 'provider' : activeRole;

  // 1. Hoisted State: Unified state object tracking all registration dimensions across all steps
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    // Step 1: Core Credentials
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2 Shared & Role-Specific Contexts
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Universal state updater passed down to sub-forms
  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // 2. Validation & Enforcement Layers
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

  // Handles navigation flow and prevents empty mandatory bypasses via keyboard
  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) setStep(2);
    else if (step === 2 && isStep2Valid()) setStep(3);
  };

  const handleBackStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Prevent generic form actions bypassing step constraints on manual Enter hits
  const handleKeyDownEnforcement = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 1 && isStep1Valid()) handleNextStep();
      else if (step === 2 && isStep2Valid()) handleNextStep();
    }
  };

  // 3. Final Payload Assembly & API Dispatch Slice
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!isStep3Valid()) return;

    setError('');
    setIsSubmitting(true);

    try {
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
        await registerStudent(payload);
      } else if (userRoleLabel === 'professor') {
        const payload = {
          email: formValues.email,
          username: formValues.email,
          password: formValues.password,
          fullName: formValues.fullName,
          academicDepartment: formValues.academicDepartment,
          rank: formValues.rank,
          maxSupervisionCapacity: parseInt(formValues.maxSupervisionCapacity, 10) || 3
        };
        await registerProfessor(payload);
      } else if (userRoleLabel === 'provider') {
        const payload = {
          email: formValues.email,
          username: formValues.email,
          password: formValues.password,
          companyName: formValues.companyName,
          companyDescription: formValues.companyDescription,
          websiteUrl: formValues.websiteUrl.trim() || null
        };
        await registerProvider(payload);
      }

      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during account registration configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get dynamic descriptions for global view text context
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

  // Progress Bar calculation vector
  const progressPercent = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full';

  return (
    <div onKeyDown={handleKeyDownEnforcement} className="min-h-screen bg-brand-light py-12 px-4 flex flex-col justify-center items-center font-sans antialiased">
      {/* Platform Level Branding Header */}
      <div className="max-w-lg w-full text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Academic Gateway</h1>
        <p className="text-sm text-slate-500">{details.subtitle}</p>
      </div>

      {/* Main Dynamic Wizard Shell Card Framework */}
      <div className="bg-white p-8 rounded-card shadow-xl border border-slate-100 max-w-lg w-full transition-all duration-300 flex flex-col">
        
        {/* 🎚️ Global Header & Progress Block */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-primary">{details.title}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step} of 3</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-primary transition-all duration-300 ${progressPercent}`} />
          </div>
          {step === 1 && (
            <div className="text-center mt-3">
              <Link to="/" className="text-xs font-medium text-slate-400 hover:text-primary transition-colors duration-200">
                Not a [{userRoleLabel}]? Click here to change your account type
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm font-semibold mb-4">
            {error}
          </div>
        )}

        {/* 🔒 STEP 1: Core Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Core Identity Credentials</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Institutional Email Address</label>
              <input
                type="email"
                value={formValues.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Security Password</label>
              <input
                type="password"
                value={formValues.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Confirm Security Password</label>
              <input
                type="password"
                value={formValues.confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
                required
              />
              {formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not align.</p>
              )}
            </div>
          </div>
        )}

        {/* ⚙️ STEP 2: Role-Specific Conditional Branching Sub-Modules */}
        {step === 2 && (
          <div className="space-y-1">
            {userRoleLabel === 'student' && (
              <StudentRegisterForm formValues={formValues} onFieldChange={handleFieldChange} />
            )}
            {userRoleLabel === 'professor' && (
              <ProfessorRegisterForm formValues={formValues} onFieldChange={handleFieldChange} />
            )}
            {userRoleLabel === 'provider' && (
              <ProviderRegisterForm formValues={formValues} onFieldChange={handleFieldChange} />
            )}
          </div>
        )}

        {/* 👁️ STEP 3: Global Payload Review & Submission */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Review Account Details</h3>
            
            {/* Structured Read-Only Context Grid */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-card space-y-3 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Credential Email</span>
                <span className="text-slate-700 font-medium">{formValues.email}</span>
              </div>

              {userRoleLabel === 'student' && (
                <>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                    <span className="text-slate-700 font-medium">{formValues.fullName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Target Graduation Year</span>
                    <span className="text-slate-700 font-medium">{formValues.graduationYear || 'Not Specified'}</span>
                  </div>
                </>
              )}

              {userRoleLabel === 'professor' && (
                <>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Identity</span>
                    <span className="text-slate-700 font-medium">{formValues.fullName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Assignment Department</span>
                    <span className="text-slate-700 font-medium">{formValues.academicDepartment || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Rank Title</span>
                    <span className="text-slate-700 font-medium">{formValues.rank || 'N/A'}</span>
                  </div>
                </>
              )}

              {userRoleLabel === 'provider' && (
                <>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Institution / Corporate Title</span>
                    <span className="text-slate-700 font-medium">{formValues.companyName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Portal Verification Website URL</span>
                    <span className="text-slate-700 font-medium break-all">{formValues.websiteUrl || 'None Provided'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Mandatory Action Agreement Control */}
            <label className="flex items-start space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded transition duration-150 ease-in-out"
                required
              />
              <span className="text-xs text-slate-600 leading-tight group-hover:text-slate-800 transition-colors">
                I accept the mandatory system Terms of Service, platform usage frameworks, and institutional Data Management Agreements.
              </span>
            </label>
          </form>
        )}

        {/* 🔀 Step Footer Navigation Group */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isStep1Valid()}
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-btn py-2.5 px-4 font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Continue to Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBackStep}
                disabled={isSubmitting}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-btn py-2.5 px-4 font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50"
              >
                Back
              </button>
              
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStep2Valid()}
                  className="w-2/3 bg-primary hover:bg-primary-hover text-white rounded-btn py-2.5 px-4 font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!isStep3Valid() || isSubmitting}
                  className="w-2/3 bg-primary hover:bg-primary-hover text-white rounded-btn py-2.5 px-4 font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Create My Account'}
                </button>
              )}
            </>
          )}
        </div>

      </div>

      {/* Footer Utility Link Node */}
      <div className="max-w-lg w-full text-center mt-6 text-xs text-slate-400 font-medium">
        Already have an established credential profile?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;