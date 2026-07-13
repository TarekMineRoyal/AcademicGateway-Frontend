import apiClient from '../../api/apiClient';

/**
 * Command to instantiate a live running project workspace from a static template blueprint.
 * Maps to backend: POST /api/project-instances
 * @param {string} projectTemplateId - The blueprint GUID primary tracking key.
 * @param {string|null} [professorId] - Optional supervisor identity GUID string if requesting mentorship.
 * @returns {Promise<Object>} The newly minted runtime project workspace instance data.
 */
export const initializeProjectInstance = async (projectTemplateId, professorId = null) => {
  const payload = {
    // Aligned key to match backend DTO property 'TemplateId'
    templateId: projectTemplateId, 
    // Aligned key to match backend DTO property 'ProfessorId'
    professorId: professorId || null 
  };

  const response = await apiClient.post('/project-instances', payload);
  return response.data;
};