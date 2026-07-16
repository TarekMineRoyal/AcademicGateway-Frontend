import apiClient from '../../api/apiClient';

/**
 * Executes a case-insensitive directory search across authenticated faculty accounts.
 * Maps to backend: GET /api/professors
 * @param {string} searchTerm - Query text filtering across names, emails, and usernames.
 * @returns {Promise<Array>} List of matching professor identities [{ id, fullName, email }]
 */
export const searchProfessors = async (searchTerm = '') => {
  const data = await apiClient.get('/professors', {
    params: { searchTerm }
  });
  return data;
};