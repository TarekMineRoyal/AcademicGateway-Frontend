import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  StudentRegisterForm, 
  ProfessorRegisterForm, 
  ProviderRegisterForm, 
  useRegisterWizard 
} from '../features/identity';

function RegisterPage() {
  const { role } = useParams();
  
  // Bind presentational shell to decoupled layout hook engine
  const wizard = useRegisterWizard();

  // Safeguard: Immediate bounce home if an invalid route parameter is provided
  const activeRole = role?.toLowerCase();
  if (activeRole !== 'student' && activeRole !== 'professor' && activeRole !== 'provider' && activeRole !== 'researcher') {
    return <Navigate to="/" replace />;
  }

  // Zero-Defensive Contract Destructuring directly from the wizard engine hook
  const {
    step,
    formValues,
    acceptedTerms,
    setAcceptedTerms,
    error,
    isSubmitting,
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
  } = wizard;

  return (
    <div onKeyDown={handleKeyDownEnforcement} className="min-h-screen bg-brand-light py-12 px-4 flex flex-col justify-center items-center font-sans antialiased">
      {/* Platform Level Branding Header */}
      <div className="max-w-lg w-full text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Academic Gateway</h1>
        <p className="text-sm text-slate-500">{details.subtitle}</p>
      </div>

      {/* Main Dynamic Wizard Shell Card Framework */}
      <div className="bg-white p-8 rounded-card shadow-xl border border-slate-100 max-w-lg w-full transition-all duration-300 flex flex-col">
        
        {/* Global Header & Progress Block */}
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

        {/* STEP 1: Core Credentials */}
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

        {/* STEP 2: Role-Specific Conditional Branching Sub-Modules */}
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

        {/* STEP 3: Global Payload Review & Submission */}
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
                    <span className="text-slate-700 font-medium">{formValues.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Target Graduation Year</span>
                    <span className="text-slate-700 font-medium">{formValues.graduationYear}</span>
                  </div>
                </>
              )}

              {userRoleLabel === 'professor' && (
                <>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Identity</span>
                    <span className="text-slate-700 font-medium">{formValues.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Assignment Department</span>
                    <span className="text-slate-700 font-medium">{formValues.academicDepartment}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Rank Title</span>
                    <span className="text-slate-700 font-medium">{formValues.rank}</span>
                  </div>
                </>
              )}

              {userRoleLabel === 'provider' && (
                <>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Institution / Corporate Title</span>
                    <span className="text-slate-700 font-medium">{formValues.companyName}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Portal Verification Website URL</span>
                    <span className="text-slate-700 font-medium break-all">{formValues.websiteUrl}</span>
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

        {/* Step Footer Navigation Group */}
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