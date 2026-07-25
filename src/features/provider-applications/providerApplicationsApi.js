import apiClient from '../../shared/api/apiClient';

/**
 * @typedef {Object} ReviewDecisionPayload
 * @property {boolean} isApproved - Indicates whether the item was approved or rejected
 * @property {string|null} rejectionReason - Mandated feedback string if rejected, or null if approved
 */

// ==========================================
// Provider Applications API
// ==========================================

/**
 * Fetches pending provider applications using pagination.
 * GET /api/provider-applications/pending
 * 
 * @param {Object} [params] - Query parameters
 * @param {number} [params.pageNumber=1] - Requested page index (1-based)
 * @param {number} [params.pageSize=10] - Number of records per page
 * @returns {Promise<import('../../api/apiClient').PaginatedResult<Object>>}
 */
export const getPendingProviderApplications = async (params = {}) => {
  const data = await apiClient.get('/provider-applications/pending', {
    params,
  });
  return data;
};

/**
 * Fetches full provider application details, credentials summary, document URLs, and history.
 * GET /api/provider-applications/{id}
 * 
 * @param {string} id - Provider application GUID
 * @returns {Promise<Object>}
 */
export const getProviderApplicationById = async (id) => {
  const data = await apiClient.get(`/provider-applications/${id}`);
  return data;
};

/**
 * Submits approval or rejection decision for a provider application.
 * POST /api/provider-applications/{id}/review
 * 
 * @param {string} applicationId - Provider application GUID
 * @param {ReviewDecisionPayload} payload - Review decision body
 * @returns {Promise<Object>}
 */
export const reviewProviderApplication = async (applicationId, payload) => {
  const data = await apiClient.post(`/provider-applications/${applicationId}/review`, payload);
  return data;
};