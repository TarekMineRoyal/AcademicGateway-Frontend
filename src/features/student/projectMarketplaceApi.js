import apiClient from '../../api/apiClient';

/**
 * Fetches all approved, publicly discoverable project blueprints.
 * Mapped to GetApprovedTemplatesQuery on the backend.
 * @param {string} [skillId] - Optional GUID filter to restrict results by a specific prerequisite.
 * @returns {Promise<Array>}
 */
export const getApprovedTemplates = async (skillId = null) => {
  const config = {};
  if (skillId) {
    config.params = { skillId };
  }
  
  // Evaluates to: GET /api/project-templates/approved
  const response = await apiClient.get('/project-templates/approved', config);
  return response.data;
};