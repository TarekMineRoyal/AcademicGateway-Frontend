import apiClient from '../../shared/api/apiClient';

/**
 * Fetches provider dashboard overview data.
 * GET /api/provider/dashboard
 * 
 * @returns {Promise<Object>}
 */
export const getProviderDashboardData = async () => {
  const data = await apiClient.get('/provider/dashboard');
  return data;
};