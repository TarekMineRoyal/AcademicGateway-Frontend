import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard component to secure endpoints based on session validity and JWT claims.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected workspace layout or page to render.
 * @param {string[]} props.allowedRoles - Collection of roles authorized to pass this route guard.
 */
function ProtectedRoute({ children, allowedRoles }) {
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

  // If all validation criteria pass successfully, render the target authenticated workspace node
  return children;
}

export default ProtectedRoute;