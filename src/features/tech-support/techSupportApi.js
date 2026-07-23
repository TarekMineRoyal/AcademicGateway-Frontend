import apiClient from '../../shared/api/apiClient';

/**
 * Fetches tech support dashboard overview data.
 * GET /api/tech-support/dashboard
 * 
 * @returns {Promise<Object>}
 */
export const getTechSupportDashboardData = async () => {
  const data = await apiClient.get('/tech-support/dashboard');
  return data;
};