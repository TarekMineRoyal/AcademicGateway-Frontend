import apiClient from '../../shared/api/apiClient';

/**
 * @typedef {Object} RecommendedProjectDto
 * @property {string} id - Unique project template identifier GUID.
 * @property {string} providerId - Unique provider identifier GUID.
 * @property {string} providerCompanyName - Display name of the provider company.
 * @property {string} title - Project title.
 * @property {string} description - Detailed project description.
 * @property {string} majorId - Target major UUID.
 * @property {string|null} specialtyId - Target specialty UUID or null.
 * @property {string} majorName - Display name for target major.
 * @property {string|null} specialtyName - Display name for target specialty or null.
 * @property {SkillDto[]} skills - List of associated skills.
 */

/**
 * Fetches AI-matched project template recommendations for the authenticated student.
 * Maps to GET /api/v1/recommendations/projects
 * 
 * @param {number} [limit=10] - Optional max count of recommendations to return (default: 10).
 * @returns {Promise<RecommendedProjectDto[]>} Array of pre-ranked project template recommendations.
 */
export const getRecommendedProjects = async (limit = 10) => {
  const data = await apiClient.get('/v1/project-templates/recommendations', {
    params: { limit },
  });
  return data;
};