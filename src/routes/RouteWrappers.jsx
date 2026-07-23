import { Navigate } from 'react-router-dom';
import StudentDashboardPage from '../pages/StudentDashboardPage';
import ReviewerDashboardPage from '../pages/ReviewerDashboardPage';
import { useAuth } from '../context/AuthContextCore';
import { UserRole } from '../shared/constants/enums';

// Temporary lightweight placeholder views to keep the compilation path clean
export const PlaceholderView = ({ title }) => (
  <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ color: '#718096', fontSize: '0.9rem' }}>This workspace channel is currently being prepared for platform synchronization.</p>
  </div>
);

/**
 * Smart Role-Based Index Switcher
 * Resolves the primary dashboard view dynamically for the authenticated user's role.
 * Employs case-insensitive role token evaluation for bulletproof RBAC resolution.
 */
export const RoleDashboardIndex = () => {
  const { user } = useAuth();
  const normalizedRole = String(user?.role || '').toLowerCase();

  switch (normalizedRole) {
    case UserRole.STUDENT.toLowerCase():
      return <StudentDashboardPage />;
    case UserRole.REVIEWER.toLowerCase():
      return <ReviewerDashboardPage />;
    case UserRole.PROFESSOR.toLowerCase():
      return <PlaceholderView title="Faculty Supervision Console" />;
    case UserRole.PROVIDER.toLowerCase():
      return <PlaceholderView title="Sponsor Blueprint Proposal Inventory" />;
    case UserRole.ADMINISTRATOR.toLowerCase():
      return <PlaceholderView title="Global Project Verification Board" />;
    default:
      return <Navigate to="/" replace />;
  }
};