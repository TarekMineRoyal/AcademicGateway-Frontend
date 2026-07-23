import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard component to secure endpoints based on session validity and JWT claims.
 * Refactored to act as a native layout component via <Outlet /> per Ticket-06 architecture.
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Collection of roles authorized to pass this route guard.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Guard 1: Prevent route evaluation flashes while the global context is parsing the local storage token
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ fontSize: '1.1rem', color: '#4a5568', fontWeight: '500' }}>
          Verifying authorization credentials...
        </div>
      </div>
    );
  }

  // Guard 2: If no valid identity session token exists, bounce the browser to the unified login page
  // Preserves the user's deep-link destination location state so they can return post-authentication
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guard 3: If explicit role boundaries are provided, verify the user's claim matches
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const isAuthorized = allowedRoles.map(role => role.toLowerCase()).includes(userRole);

    // If an authenticated user attempts to access a resource outside their domain, block access
    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
  }

  // Render the nested child routes cleanly via React Router layout rendering
  return <Outlet />;
}