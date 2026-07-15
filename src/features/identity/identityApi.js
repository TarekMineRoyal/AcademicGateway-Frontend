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

/**
 * Registers a new student profile payload to the CQRS Post handler.
 * Maps to backend: POST /api/students
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerStudent = async (commandPayload) => {
  const response = await apiClient.post('/students', commandPayload);
  return response.data;
};

/**
 * Registers a new professor profile payload to the CQRS Post handler.
 * Maps to backend: POST /api/professors
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerProfessor = async (commandPayload) => {
  const response = await apiClient.post('/professors', commandPayload);
  return response.data;
};

/**
 * Registers a new industry provider/researcher payload to the CQRS Post handler.
 * Maps to backend: POST /api/providers
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerProvider = async (commandPayload) => {
  const response = await apiClient.post('/providers', commandPayload);
  return response.data;
};