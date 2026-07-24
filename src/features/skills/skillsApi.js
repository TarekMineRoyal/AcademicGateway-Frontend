import apiClient from '../../shared/api/apiClient';

/**
 * Fetches all active technical capability and professional competency records.
 * Maps directly to GetSkillsQuery on the backend.
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getSkills = async () => {
  // Matches your backend skills feature slice query layout
  const data = await apiClient.get('/skills');
  return data;
};

/**
 * Fetches skills associated with a specific user account.
 * @param {string} userId - The explicit tracking GUID for the authenticated user context.
 * @returns {Promise<any>}
 */
export const getUserSkills = async (userId) => {
  const data = await apiClient.get(`/skills/user/${userId}`);
  return data;
};