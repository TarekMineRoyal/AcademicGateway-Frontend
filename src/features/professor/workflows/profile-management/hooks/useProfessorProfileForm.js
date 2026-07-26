import { useState } from 'react';
import { useProfessorProfileData } from './useProfessorProfileData';

/**
 * Composite hook that manages professor profile state, inputs, and submit lifecycle.
 */
export function useProfessorProfileForm() {
  const { profile, isLoading, updateProfileMutation } = useProfessorProfileData();

  // Local Form States
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [rank, setRank] = useState('');
  const [maxSupervisionCapacity, setMaxSupervisionCapacity] = useState(5);
  const [researchInterests, setResearchInterests] = useState([]);
  const [aboutMe, setAboutMe] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [prevProfile, setPrevProfile] = useState(null);

  // Synchronize local form state when server profile arrives/updates
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setFullName(profile.fullName || '');
    setDepartment(profile.department || '');
    setRank(profile.rank || '');
    setMaxSupervisionCapacity(profile.maxSupervisionCapacity ?? 5);
    setResearchInterests(profile.researchInterests || []);
    setAboutMe(profile.aboutMe || '');
  }

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setDepartment(profile.department || '');
      setRank(profile.rank || '');
      setMaxSupervisionCapacity(profile.maxSupervisionCapacity ?? 5);
      setResearchInterests(profile.researchInterests || []);
      setAboutMe(profile.aboutMe || '');
    }
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const payload = {
      fullName: fullName.trim(),
      department: department.trim() || null,
      rank: rank.trim() || null,
      maxSupervisionCapacity: Number(maxSupervisionCapacity) || 0,
      researchInterests: researchInterests.map((interest) => interest.trim()).filter(Boolean),
      aboutMe: aboutMe.trim() || null,
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
    fullName,
    setFullName,
    department,
    setDepartment,
    rank,
    setRank,
    maxSupervisionCapacity,
    setMaxSupervisionCapacity,
    researchInterests,
    setResearchInterests,
    aboutMe,
    setAboutMe,
    isEditing,
    setIsEditing,

    // Actions
    handleCancel,
    handleSubmit,
  };
}