import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getStudentProfile } from '../../student/studentDashboardApi';

/**
 * Custom hook to safely handle multi-tenancy role gating, 
 * asynchronous server-state hydration, and data passing 
 * for the authenticated student's core competencies.
 */
export const useUserSkills = () => {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isStudent = user?.role?.toLowerCase() === 'student';

  useEffect(() => {
    // Phase 1 Multi-Tenancy Boundary Guard: 
    // Short-circuit network request completely if user is a Professor or Provider
    if (!isStudent) {
      setUserSkills([]);
      setLoading(false);
      return;
    }

    async function hydrateSkills() {
      try {
        setLoading(true);
        setError('');
        
        // Fetch the full student profile stream
        const profileData = await getStudentProfile();

        // Phase 2 Clean Contract Pass:
        // No more loop-casting or manual trimming arrays.
        // We strictly trust the incoming model contract structure.
        setUserSkills(profileData?.skills || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to hydrate user capability profile from server.');
      } finally {
        setLoading(false);
      }
    }

    hydrateSkills();
  }, [user, isStudent]);

  return {
    userSkills,
    isStudent,
    loading,
    error
  };
};