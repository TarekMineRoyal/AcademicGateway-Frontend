import ProviderInfoForm from './components/ProviderInfoForm';
import ProviderProfileReadOnlyView from './components/ProviderProfileReadOnlyView';
import { useProviderProfileForm } from './hooks/useProviderProfileForm';

/**
 * Root container component for managing and viewing the provider profile.
 */
function ProviderProfile() {
  const {
    profile,
    isLoading,
    updateProfileMutation,
    companyName,
    setCompanyName,
    companyDescription,
    setCompanyDescription,
    websiteUrl,
    setWebsiteUrl,
    isEditing,
    setIsEditing,
    handleCancel,
    handleSubmit,
  } = useProviderProfileForm();

  if (isLoading) {
    return (
      <div className="text-slate-600 text-center py-16 font-semibold animate-pulse tracking-wide">
        Loading provider profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-card border border-slate-200/60 shadow-sm">
      {/* Dynamic Mutation Status Action Feedback Banners */}
      {updateProfileMutation?.isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm font-medium mb-6">
          Provider profile successfully updated!
        </div>
      )}

      {updateProfileMutation?.isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm font-medium mb-6">
          Submission failed: {updateProfileMutation.error?.message || 'Failed to update profile.'}
        </div>
      )}

      {!isEditing ? (
        <ProviderProfileReadOnlyView
          companyName={profile?.companyName || companyName}
          companyDescription={profile?.companyDescription || companyDescription}
          websiteUrl={profile?.websiteUrl || websiteUrl}
          isVerified={profile?.isVerified}
          onEditClick={() => setIsEditing(true)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-xl font-bold text-brand-dark">Update Corporate Profile</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Modify organization details, website link, and company description.
            </p>
          </div>

          <ProviderInfoForm
            companyName={companyName}
            setCompanyName={setCompanyName}
            websiteUrl={websiteUrl}
            setWebsiteUrl={setWebsiteUrl}
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
          />

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-btn px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation?.isPending || updateProfileMutation?.isLoading}
              className="bg-primary hover:bg-primary-hover text-white rounded-btn px-5 py-2 text-sm font-semibold shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-70"
            >
              {updateProfileMutation?.isPending || updateProfileMutation?.isLoading ? 'Syncing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProviderProfile;