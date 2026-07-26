import apiClient from '@/shared/api/apiClient';

/**
 * @typedef {Object} ProviderProfile
 * @property {string} id
 * @property {string} companyName
 * @property {string|null} companyDescription
 * @property {string|null} websiteUrl
 * @property {boolean} isVerified
 */

/**
 * Fetches the provider profile for the authenticated provider.
 * Maps to GET /api/providers/profile
 * 
 * @returns {Promise<ProviderProfile>}
 */
export const getProviderProfile = async () => {
  const data = await apiClient.get('/providers/profile');
  return data;
};

/**
 * Updates profile details for the authenticated provider.
 * Maps to PUT /api/providers
 * 
 * @param {Object} payload - Updated provider details
 * @param {string} payload.companyName
 * @param {string} [payload.companyDescription]
 * @param {string} [payload.websiteUrl]
 * @returns {Promise<ProviderProfile>}
 */
export const updateProviderProfile = async (payload) => {
  const data = await apiClient.put('/providers', payload);
  return data;
};