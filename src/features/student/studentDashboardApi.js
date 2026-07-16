import apiClient from '../../api/apiClient';

/**
 * Fetches the comprehensive academic profile for the authenticated student.
 * Maps to GetStudentProfileController -> GET api/students/profile
 * Note: No ID segment needed; backend reads claims directly from the Bearer token.
 * @returns {Promise<Object>}
 */
export const getStudentProfile = async () => {
  const data = await apiClient.get('/students/profile');
  return data;
};

/**
 * Fetches running project snapshot workspaces matching the target actor identity.
 * Maps to GetProjectsByActorController -> GET api/project-instances/actor/{actorId}
 * @param {string} actorId - The unique GUID tracking identifier.
 * @returns {Promise<Array>}
 */
export const getStudentProjects = async (actorId) => {
  const data = await apiClient.get(`/project-instances/actor/${actorId}`, {
    params: {
      role: 'Student' // Passes down string filter query parameter expected by [FromQuery]
    }
  });
  return data;
};

/**
 * Updates the academic profile parameters for the authenticated student.
 * Maps to UpdateStudentController -> PUT api/students
 * Note: No ID segment needed; backend maps identity constraints directly via user claims token.
 * @param {Object} profileData - The updated profile payload (firstName, lastName, bio, major, etc.)
 * @returns {Promise<Object>}
 */
export const updateStudentProfile = async (profileData) => {
  const data = await apiClient.put('/students', profileData);
  return data;
};