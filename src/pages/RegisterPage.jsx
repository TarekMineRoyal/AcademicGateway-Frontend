import { useParams, Link, Navigate } from 'react-router-dom';
import { UserRole } from '../shared/constants/enums';
import { 
  useRegisterWizard, 
  registrationStrategies,
  RegisterStepCredentials,
  RegisterStepReview
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

  // Resolve strategy objects for dynamic form rendering and review display
  const strategyKey = 
    userRoleLabel === 'student' ? UserRole.STUDENT :
    userRoleLabel === 'professor' ? UserRole.PROFESSOR :
    userRoleLabel === 'provider' ? UserRole.PROVIDER : null;

  const activeStrategy = registrationStrategies[strategyKey];
  const FormComponent = activeStrategy?.FormComponent;
  const reviewItems = activeStrategy?.getReviewItems ? activeStrategy.getReviewItems(formValues) : [];

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

        {/* STEP 1: Core Credentials Sub-Module */}
        {step === 1 && (
          <RegisterStepCredentials 
            formValues={formValues} 
            onFieldChange={handleFieldChange} 
          />
        )}

        {/* STEP 2: Role-Specific Dynamic Strategy Form */}
        {step === 2 && FormComponent && (
          <div className="space-y-1">
            <FormComponent formValues={formValues} onFieldChange={handleFieldChange} />
          </div>
        )}

        {/* STEP 3: Global Payload Review & Submission */}
        {step === 3 && (
          <RegisterStepReview
            formValues={formValues}
            reviewItems={reviewItems}
            acceptedTerms={acceptedTerms}
            onAcceptedTermsChange={setAcceptedTerms}
            onSubmit={handleFinalSubmit}
          />
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