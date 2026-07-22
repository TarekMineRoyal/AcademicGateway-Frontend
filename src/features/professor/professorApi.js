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

/**
 * Fetches the currently authenticated professor's profile.
 * Maps to backend: GET /api/professors/profile
 * @returns {Promise<Object>} Professor profile object containing aboutMe and other details.
 */
export const getProfessorProfile = async () => {
  const data = await apiClient.get('/professors/profile');
  return data;
};

/**
 * Updates the currently authenticated professor's profile.
 * Maps to backend: PUT /api/professors/profile
 * @param {Object} profileData - Update payload containing updated fields (e.g. { aboutMe, ... }).
 * @returns {Promise<Object>} Updated professor profile.
 */
export const updateProfessorProfile = async (profileData) => {
  const data = await apiClient.put('/professors/profile', profileData);
  return data;
};

/**
 * Fetches the public profile of a specific professor by ID.
 * Maps to backend: GET /api/v1/professors/{id}
 * @param {string} professorId - Unique GUID identifier of the target professor.
 * @returns {Promise<Object>} Professor public profile details.
 */
export const getProfessorById = async (professorId) => {
  const data = await apiClient.get(`/v1/professors/${professorId}`);
  return data;
};