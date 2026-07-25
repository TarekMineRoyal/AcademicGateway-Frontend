import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextCore';

/**
 * Route guard component to restrict access to unauthenticated users only (e.g., /login, /register).
 * Redirects authenticated users to the workspace dashboard.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Optional child elements to render when unauthenticated.
 * @param {string} [props.redirectTo] - Fallback route if user is authenticated (defaults to '/dashboard').
 */
export default function GuestRoute({ children, redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Guard 1: Prevent route evaluation flashes while global auth context is parsing token
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '500' }}>
          Verifying authorization credentials...
        </div>
      </div>
    );
  }

  // Guard 2: If a valid identity session token exists, redirect authenticated user
  if (user) {
    const destination = location.state?.from?.pathname || redirectTo;
    return <Navigate to={destination} replace />;
  }

  // Render direct children if provided, otherwise render nested routes via Outlet
  return children ? children : <Outlet />;
}