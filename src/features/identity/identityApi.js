import apiClient from '../../shared/api/apiClient';

/**
 * Sends authentication credentials to the MediatR backend handler.
 * Maps to backend: POST /api/auth/login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string}>}
 */
export const loginUser = async (email, password) => {
  const data = await apiClient.post('auth/login', { email, password });
  return data; 
};

/**
 * Registers a new student profile payload to the CQRS Post handler.
 * Maps to backend: POST /api/students
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerStudent = async (commandPayload) => {
  const data = await apiClient.post('students', commandPayload);
  return data;
};

/**
 * Registers a new professor profile payload to the CQRS Post handler.
 * Maps to backend: POST /api/professors
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerProfessor = async (commandPayload) => {
  const data = await apiClient.post('professors', commandPayload);
  return data;
};

/**
 * Registers a new industry provider/researcher payload to the CQRS Post handler.
 * Maps to backend: POST /api/providers
 * @param {Object} commandPayload 
 * @returns {Promise<any>}
 */
export const registerProvider = async (commandPayload) => {
  const data = await apiClient.post('providers', commandPayload);
  return data;
};