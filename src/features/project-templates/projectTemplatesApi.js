import apiClient from '../../api/apiClient';

/**
 * @typedef {Object} ProjectTemplateDto
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]|null} [skillIds]
 * @property {string|null} [majorId] - Academic Major UUID (Optional)
 * @property {string|null} [specialtyId] - Academic Specialty UUID (Optional)
 * @property {string|null} [majorName] - Display name for target Major (Optional)
 * @property {string|null} [specialtyName] - Display name for target Specialty (Optional)
 */

/**
 * Fetches all approved, publicly discoverable project blueprints using pagination.
 * Mapped to GetApprovedTemplatesQuery on the backend.
 * 
 * @param {Object|string} [params] - Query parameters object OR legacy skillId string
 * @param {number} [params.pageNumber=1] - Requested page number
 * @param {number} [params.pageSize=10] - Number of records per page
 * @param {string|null} [params.skillId] - Optional GUID filter to restrict results by a specific prerequisite
 * @returns {Promise<import('../../api/apiClient').PaginatedResult<ProjectTemplateDto>>}
 */
export const getApprovedTemplates = async (params = {}) => {
  let queryParams = {};

  if (typeof params === 'string') {
    queryParams = { skillId: params };
  } else if (typeof params === 'object' && params !== null) {
    queryParams = params;
  }

  // Evaluates to: GET /api/project-templates/approved?pageNumber=X&pageSize=Y&skillId=Z
  const data = await apiClient.get('/project-templates/approved', {
    params: queryParams,
  });
  return data;
};

/**
 * Fetches pending project templates awaiting approval.
 * Mapped to GetPendingProjectTemplatesQuery on the backend.
 * @returns {Promise<ProjectTemplateDto[]>}
 */
export const getPendingProjectTemplates = async () => {
  // Evaluates to: GET /api/project-templates/pending
  const data = await apiClient.get('/project-templates/pending');
  return data;
};

/**
 * Fetches the comprehensive aggregate structure for a single project template.
 * Maps to GetProjectTemplateController -> GET /api/project-templates/{projectTemplateId}
 * Note: Returns nested milestones, dependencies, required capability definitions, and academic alignment fields.
 * @param {string} projectTemplateId - The unique template identity GUID string.
 * @returns {Promise<ProjectTemplateDto>}
 */
export const getProjectTemplateById = async (projectTemplateId) => {
  // Evaluates to: GET /api/project-templates/${projectTemplateId}
  const data = await apiClient.get(`/project-templates/${projectTemplateId}`);
  return data;
};

/**
 * Submits a new project template with optional academic alignment fields.
 * Maps to POST /api/project-templates
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.description
 * @param {string[]} payload.skillIds
 * @param {string|null} [payload.majorId]
 * @param {string|null} [payload.specialtyId]
 * @returns {Promise<ProjectTemplateDto>}
 */
export const createProjectTemplate = async (payload) => {
  // Evaluates to: POST /api/project-templates
  const data = await apiClient.post('/project-templates', payload);
  return data;
};