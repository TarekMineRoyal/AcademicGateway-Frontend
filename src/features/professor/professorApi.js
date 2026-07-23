import apiClient from '../../shared/api/apiClient';

/**
 * Executes a case-insensitive directory search across authenticated faculty accounts with pagination.
 * Maps to backend: GET /api/professors
 * 
 * @param {Object|string} [params=''] - Query parameters object OR legacy searchTerm string
 * @param {string} [params.searchTerm] - Query text filtering across names, emails, and usernames
 * @param {number} [params.pageNumber=1] - Requested page number
 * @param {number} [params.pageSize=10] - Number of records per page
 * @returns {Promise<import('../../shared/api/apiClient').PaginatedResult<Object>>}
 */
export const searchProfessors = async (params = '') => {
  let queryParams = {};

  if (typeof params === 'string') {
    queryParams = { searchTerm: params };
  } else if (typeof params === 'object' && params !== null) {
    queryParams = params;
  }

  const data = await apiClient.get('/professors', {
    params: queryParams,
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