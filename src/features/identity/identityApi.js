import apiClient from '../../api/apiClient';

/**
 * Sends authentication credentials to the MediatR backend handler.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string}>}
 */
export const loginUser = async (email, password) => {
  // Evaluates exactly to: VITE_API_BASE_URL + /auth/login
  const response = await apiClient.post('/auth/auth/login', { email, password });
  return response.data; 
};