import apiClient from '../../shared/api/apiClient';

/**
 * Fetches administrator dashboard overview data.
 * GET /api/administrator/dashboard
 * 
 * @returns {Promise<Object>}
 */
export const getAdministratorDashboardData = async () => {
  const data = await apiClient.get('/administrator/dashboard');
  return data;
};