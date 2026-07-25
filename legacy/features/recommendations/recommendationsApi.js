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
 * @typedef {Object} RecommendedProfessorDto
 * @property {string} id - Unique professor identifier GUID.
 * @property {string} fullName - Full name of the professor.
 * @property {string} email - University email address of the professor.
 * @property {string} department - Academic department.
 * @property {string} aboutMe - Bio and research overview.
 * @property {string[]} researchInterests - Array of primary research topics.
 * @property {number} currentProjectCount - Active supervisee count.
 * @property {number} maxSupervisionCapacity - Maximum permitted supervisee slots.
 * @property {boolean} isAcceptingProjects - Flag indicating whether slots are available.
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

/**
 * Fetches matching faculty advisor suggestions for a specific project template blueprint.
 * Maps to GET /api/v1/recommendations/professors
 * 
 * @param {string} [projectTemplateId=''] - Unique GUID identifier of the project template blueprint.
 * @param {number} [limit=10] - Optional max count of professor suggestions to return (default: 10).
 * @returns {Promise<RecommendedProfessorDto[]>} Array of pre-ranked faculty advisor suggestions.
 */
export const getRecommendedProfessors = async (projectTemplateId = '', limit = 10) => {
  const data = await apiClient.get('/v1/professors/suggestions', {
    params: { projectTemplateId, limit },
  });
  return data;
};