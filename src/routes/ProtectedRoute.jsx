import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextCore';

/**
 * Route guard component to secure endpoints based on session validity and JWT claims.
 * Supports both nested route layout rendering (<Outlet />) and direct component wrapping (children).
 *
 * @param {Object} props
 * @param {string[]} [props.allowedRoles] - Collection of roles authorized to pass this route guard.
 * @param {React.ReactNode} [props.children] - Optional child elements to render when authorized.
 */
export default function ProtectedRoute({ allowedRoles, children }) {
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

  // Guard 2: If no valid identity session token exists, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guard 3: Validate role authorization against allowedRoles array
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role || '').toLowerCase();
    const isAuthorized = allowedRoles.some(
      (role) => String(role).toLowerCase() === userRole
    );

    // If authenticated user attempts to access an unauthorized route, redirect immediately to /dashboard
    if (!isAuthorized) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render direct children if provided, otherwise render nested routes via Outlet
  return children ? children : <Outlet />;
}