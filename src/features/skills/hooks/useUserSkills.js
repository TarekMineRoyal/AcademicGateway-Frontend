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
        const rawSkills = profileData?.skills || [];

        // Phase 2 Clean Contract Pass:
        // No more guessing games. We maps strictly to the backend's locked lowercase shape.
        const cleanSkills = rawSkills.map((sk) => ({
          id: String(sk?.id || '').trim(),
          name: String(sk?.name || '').trim()
        }));

        setUserSkills(cleanSkills);
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