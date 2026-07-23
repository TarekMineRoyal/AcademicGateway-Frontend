import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';

/**
 * Global authentication interceptor outside the React tree.
 * Catches unauthenticated server errors, purges stale client tokens, 
 * and declares route navigation without DOM-jarring window refreshes.
 */
const handleGlobalAuthFailure = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    router.navigate('/login');
  }
};

// State-management foundation client with unified query and form action error catches
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalAuthFailure, // Intercepts query fetches globally
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalAuthFailure, // Intercepts form action submissions globally
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes of global cache freshness
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);