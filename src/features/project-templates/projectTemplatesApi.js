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

/**
 * Fetches the comprehensive aggregate structure for a single project template.
 * Maps to GetProjectTemplateController -> GET /api/project-templates/{projectTemplateId}
 * Note: Returns nested milestones, dependencies, and required capability definitions.
 * @param {string} projectTemplateId - The unique template identity GUID string.
 * @returns {Promise<Object>}
 */
export const getProjectTemplateById = async (projectTemplateId) => {
  // Evaluates to: GET /api/project-templates/{projectTemplateId}
  const response = await apiClient.get(`/project-templates/${projectTemplateId}`);
  return response.data;
};