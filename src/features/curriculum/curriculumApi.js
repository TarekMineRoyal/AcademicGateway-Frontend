import apiClient from '@/shared/api/apiClient';

/**
 * Fetches all active academic majors along with their nested sub-specialties.
 * Maps directly to GetMajorsWithSpecialtiesQuery on the backend.
 * @returns {Promise<Array<{id: string, name: string, specialties: Array<{id: string, name: string}>}>>}
 */
export const getMajorsWithSpecialties = async () => {
  // Matches your backend feature location slice route layout
  // Adjust endpoint suffix if your minimal API / controller binding maps differently
  const data = await apiClient.get('/curriculum/majors-with-specialties');
  return data;
};