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

  const data = await apiClient.post('/project-instances', payload);
  return data;
};

/**
 * Command to bypass a stalled supervisor invitation and force-start the project in Solo Mode.
 * Maps to backend: POST /api/project-instances/{projectInstanceId}/transition-to-solo
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @returns {Promise<Object>} The updated project workspace instance data.
 */
export const transitionToSolo = async (projectInstanceId) => {
  const data = await apiClient.post(`/project-instances/${projectInstanceId}/transition-to-solo`);
  return data;
};

/**
 * Retrieves the running project workspace summaries for a user (needed to populate dashboard cards).
 * Maps to backend: GET /api/project-instances/actor/{actorId}?role=Student
 * @param {string} actorId - GUID of the student/user actor.
 * @param {string} [role="Student"] - Role filter, defaulted to "Student".
 * @returns {Promise<Object>} List of running project workspace summaries.
 */
export const getActorProjects = async (actorId, role = 'Student') => {
  const data = await apiClient.get(`/project-instances/actor/${actorId}`, {
    params: { role }
  });
  return data;
};

/**
 * Fetches metadata and snapshot skills for the active workspace.
 * Maps to backend: GET /api/project-instances/{projectInstanceId}
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @returns {Promise<Object>} Project instance metadata and skill snapshots.
 */
export const getProjectDetails = async (projectInstanceId) => {
  const data = await apiClient.get(`/project-instances/${projectInstanceId}`);
  return data;
};

/**
 * Returns the hierarchical milestone checklist, execution matrix, and dependencies.
 * Maps to backend: GET /api/project-instances/{projectInstanceId}/milestones
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @returns {Promise<Object>} The milestone hierarchy and checklist mapping.
 */
export const getProjectMilestones = async (projectInstanceId) => {
  const data = await apiClient.get(`/project-instances/${projectInstanceId}/milestones`);
  return data;
};

/**
 * Fetches comment threads for a targeted milestone.
 * Maps to backend: GET /api/project-instances/{projectInstanceId}/milestones/{milestoneId}/comments
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @param {string} milestoneId - GUID of the target milestone.
 * @returns {Promise<Object>} Thread history of comments.
 */
export const getMilestoneComments = async (projectInstanceId, milestoneId) => {
  const data = await apiClient.get(`/project-instances/${projectInstanceId}/milestones/${milestoneId}/comments`);
  return data;
};

/**
 * Posts a new discussion comment to a milestone's feed.
 * Maps to backend: POST /api/project-instances/{projectInstanceId}/milestones/{milestoneId}/comments
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @param {string} milestoneId - GUID of the target milestone.
 * @param {string} content - Text comment body payload.
 * @returns {Promise<Object>} The newly created comment record data.
 */
export const postMilestoneComment = async (projectInstanceId, milestoneId, content) => {
  const payload = { content };
  const data = await apiClient.post(`/project-instances/${projectInstanceId}/milestones/${milestoneId}/comments`, payload);
  return data;
};

/**
 * Submits a student's repository link or work against a specific task node.
 * Maps to backend: POST /api/project-instances/{projectInstanceId}/milestones/{milestoneId}/tasks/{taskId}/submissions
 * @param {string} projectInstanceId - The live tracking database ID of the runtime instance.
 * @param {string} milestoneId - GUID of the parent milestone.
 * @param {string} taskId - GUID of the target task.
 * @param {Object|string} submissionPayload - Repository URL string or flat payload object.
 * @returns {Promise<Object>} The updated submission state context.
 */
export const submitTaskDeliverable = async (projectInstanceId, milestoneId, taskId, submissionPayload) => {
  // Defensive check: If it's already an object containing 'submissionPayload', use it.
  // Otherwise, wrap the raw string into the expected { submissionPayload: "string" } shape.
  const payload = (submissionPayload && typeof submissionPayload === 'object' && 'submissionPayload' in submissionPayload)
    ? submissionPayload
    : { submissionPayload };

  const data = await apiClient.post(`/project-instances/${projectInstanceId}/milestones/${milestoneId}/tasks/${taskId}/submissions`, payload);
  return data;
};