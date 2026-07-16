import apiClient from '../../api/apiClient';

/**
 * Fetches all active technical capability and professional competency records.
 * Maps directly to GetSkillsQuery on the backend.
 * * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getSkills = async () => {
  // Matches your backend skills feature slice query layout
  const data = await apiClient.get('/skills');
  return data;
};