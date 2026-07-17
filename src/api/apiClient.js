import axios from 'axios';

// Helper: Deeply converts any incoming object keys from PascalCase/snake_case into strict camelCase
const camelCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelCaseKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
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
      localStorage.removeItem('token');
      
      // Safeguard: Do not force a hard page reload if the user is already attempting to authenticate
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error); // Bounces straight to TanStack's onError cache handler
  }
);

export default apiClient;