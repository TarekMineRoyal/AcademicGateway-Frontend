import { useState } from 'react';
import { useProviderProfileData } from './useProviderProfileData';

/**
 * Composite hook that manages provider profile state, inputs, and submit lifecycle.
 */
export function useProviderProfileForm() {
  const { profile, isLoading, updateProfileMutation } = useProviderProfileData();

  // Local Form States
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [prevProfile, setPrevProfile] = useState(null);

  // Synchronize local form state when server profile arrives/updates
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setCompanyName(profile.companyName || '');
    setCompanyDescription(profile.companyDescription || '');
    setWebsiteUrl(profile.websiteUrl || '');
  }

  const handleCancel = () => {
    if (profile) {
      setCompanyName(profile.companyName || '');
      setCompanyDescription(profile.companyDescription || '');
      setWebsiteUrl(profile.websiteUrl || '');
    }
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const payload = {
      companyName: companyName.trim(),
      companyDescription: companyDescription.trim() || null,
      websiteUrl: websiteUrl.trim() || null,
    };

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return {
    // Server & Mutation States
    profile,
    isLoading,
    updateProfileMutation,

    // Form Field States & Setters
    companyName,
    setCompanyName,
    companyDescription,
    setCompanyDescription,
    websiteUrl,
    setWebsiteUrl,
    isEditing,
    setIsEditing,

    // Actions
    handleCancel,
    handleSubmit,
  };
}