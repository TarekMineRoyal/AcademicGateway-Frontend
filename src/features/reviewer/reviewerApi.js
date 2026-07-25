import apiClient from '../../shared/api/apiClient';

/**
 * @typedef {Object} ReviewDecisionPayload
 * @property {boolean} isApproved - Indicates whether the item was approved or rejected
 * @property {string|null} rejectionReason - Mandated feedback string if rejected, or null if approved
 */

// ==========================================
// Project Templates API
// ==========================================

/**
 * Fetches pending project templates awaiting reviewer decision using pagination.
 * GET /api/project-templates/pending
 * 
 * @param {Object} [params] - Query parameters
 * @param {number} [params.pageNumber=1] - Requested page index (1-based)
 * @param {number} [params.pageSize=10] - Number of records per page
 * @returns {Promise<import('../../api/apiClient').PaginatedResult<Object>>}
 */
export const getPendingProjectTemplates = async (params = {}) => {
  const data = await apiClient.get('/project-templates/pending', {
    params,
  });
  return data;
};

/**
 * Fetches full template details (milestones, tasks, dependencies, and required skills).
 * GET /api/project-templates/{projectTemplateId}
 * 
 * @param {string} projectTemplateId - Project template GUID
 * @returns {Promise<Object>}
 */
export const getProjectTemplateById = async (projectTemplateId) => {
  const data = await apiClient.get(`/project-templates/${projectTemplateId}`);
  return data;
};

/**
 * Submits approval or rejection decision for a project template.
 * POST /api/project-templates/{templateId}/review
 * 
 * @param {string} templateId - Project template GUID
 * @param {ReviewDecisionPayload} payload - Review decision body
 * @returns {Promise<Object>}
 */
export const reviewProjectTemplate = async (templateId, payload) => {
  const data = await apiClient.post(`/project-templates/${templateId}/review`, payload);
  return data;
};