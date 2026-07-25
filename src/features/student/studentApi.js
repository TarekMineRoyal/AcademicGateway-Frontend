import apiClient from '@/shared/api/apiClient';

/**
 * Fetches the comprehensive academic profile for the authenticated student.
 * Maps to GetStudentProfile -> GET api/students/profile
 * Note: No ID segment needed; backend reads claims directly from the Bearer token.
 * 
 * @returns {Promise<{
 *   id?: string,
 *   firstName?: string,
 *   lastName?: string,
 *   aboutMe?: string | null,
 *   [key: string]: any
 * }>} The student profile object including optional aboutMe bio.
 */
export const getStudentProfile = async () => {
  const data = await apiClient.get('/students/profile');
  return data;
};

/**
 * Updates the academic profile parameters for the authenticated student.
 * Maps to UpdateStudent -> PUT api/students
 * Note: No ID segment needed; backend maps identity constraints directly via user claims token.
 * 
 * @param {Object} profileData - The updated profile payload
 * @param {string|null} [profileData.aboutMe] - Optional biography/summary text (max 2000 characters).
 * @returns {Promise<Object>}
 */
export const updateStudentProfile = async (profileData) => {
  const data = await apiClient.put('/students', profileData);
  return data;
};