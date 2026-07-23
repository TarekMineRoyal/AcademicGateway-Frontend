import { useState, useEffect } from 'react';
import { getMajorsWithSpecialties } from '../../curriculum';
import { getSkills } from '../../skills';

/**
 * Custom hook for fetching and managing curriculum & technical skill lookups
 * and performing client-side data transformations for the student registration form.
 *
 * @param {Object} formValues - Current registration form values.
 */
export function useStudentRegisterLookups(formValues = {}) {
  const [majorsData, setMajorsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [error, setError] = useState('');

  // Local UI state for skills searching
  const [skillSearch, setSkillSearch] = useState('');

  // Fetch lookups on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [majors, skills] = await Promise.all([
          getMajorsWithSpecialties(),
          getSkills()
        ]);
        setMajorsData(majors);
        setSkillsData(skills);
      } catch {
        setError('Failed to load curriculum configuration or technical competency lookups.');
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookupData();
  }, []);

  // Filter sub-specialties to show options belonging to checked parent majors
  const availableSpecialties = majorsData
    .filter((major) => (formValues.majorIds || []).includes(major.id))
    .flatMap((major) => major.specialties || []);

  // Filter skills based on search term
  const filteredSkills = skillsData.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Filter selected skill objects for rendering active tags
  const selectedSkills = skillsData.filter((skill) =>
    (formValues.skillIds || []).includes(skill.id)
  );

  return {
    majorsData,
    skillsData,
    loadingLookups,
    error,
    skillSearch,
    setSkillSearch,
    availableSpecialties,
    filteredSkills,
    selectedSkills
  };
}