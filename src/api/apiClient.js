import axios from 'axios';

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

// Response Interceptor: Global Unwrapping Engine & Error Catching
apiClient.interceptors.response.use(
  (response) => response.data, // Automatically cuts out the Axios wrapper globally
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