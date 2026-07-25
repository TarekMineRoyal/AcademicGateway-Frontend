import apiClient from '@/shared/api/apiClient';

/**
 * @typedef {Object} SkillDto
 * @property {string} id - Unique skill identifier GUID.
 * @property {string} name - Name of the skill.
 */

/**
 * @typedef {Object} RecommendedSkillDto
 * @property {string} id - Unique skill identifier GUID.
 * @property {string} name - Name of the recommended skill.
 */

/**
 * Fetches all active technical capability and professional competency records.
 * @returns {Promise<SkillDto[]>}
 */
export const getSkills = async () => {
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

/**
 * Fetches skill growth recommendations adjacent to the student's profile context.
 * @param {number} [limit=10] - Optional max count of skill recommendations to return (default: 10).
 * @returns {Promise<RecommendedSkillDto[]>}
 */
export const getRecommendedSkills = async (limit = 10) => {
  const data = await apiClient.get('/v1/skills/recommendations', {
    params: { limit },
  });
  return data;
};