import axios from 'axios';

/**
 * Standard Paginated Response Wrapper from Backend
 * @template T
 * @typedef {Object} PaginatedResult
 * @property {T[]} items - List of items for the current page
 * @property {number} pageNumber - Current page index (1-based)
 * @property {number} pageSize - Number of items per page
 * @property {number} totalPages - Total number of available pages
 * @property {number} totalCount - Total count of records across all pages
 * @property {boolean} hasPreviousPage - Flag indicating if a previous page exists
 * @property {boolean} hasNextPage - Flag indicating if a next page exists
 */

// Helper: Deeply converts any incoming object keys from PascalCase/snake_case into strict camelCase
// Helper: Deeply converts any incoming object keys from PascalCase/snake_case into strict camelCase
const camelCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelCaseKeys(v));
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      // Robustly handles both PascalCase and snake_case transformations safely
      const camelKey = key
        .replace(/_([a-z0-9])/gi, (_, char) => char.toUpperCase())
        .replace(/^[A-Z]/, (char) => char.toLowerCase());
        
      result[camelKey] = camelCaseKeys(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Inbound Gateway Global Unwrapping & Key Normalization Engine
apiClient.interceptors.response.use(
  (response) => {
    // Standardize backend data structures immediately at the gateway border
    return camelCaseKeys(response.data);
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // CLEAR THIS BLOCK: Raw window reloads removed to protect the SPA routing ecosystem.
      // Handled cleanly by TanStack Query's queryCache/mutationCache inside main.jsx.
    }
    return Promise.reject(error); // Bounces straight to TanStack's onError cache handler
  }
);

export default apiClient;