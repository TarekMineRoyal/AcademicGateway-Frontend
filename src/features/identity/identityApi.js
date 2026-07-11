import apiClient from '../../api/apiClient';

/**
 * Sends authentication credentials to the MediatR backend handler.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string}>}
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; 
};