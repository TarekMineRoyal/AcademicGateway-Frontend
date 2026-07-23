import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import WorkspaceLayout from '../shared/components/WorkspaceLayout';
import { StudentDashboard, ProjectMarketplace, StudentProfile } from '../features/student';
import { ProjectTemplateDetails } from '../features/project-templates';
import { ReviewerDashboard } from '../features/reviewer';
import { useUserSkills } from '../features/skills';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../shared/constants/enums';
import { ProjectWorkspace } from '../features/project-instances';

// Temporary lightweight placeholder views to keep the compilation path clean
const PlaceholderView = ({ title }) => (
  <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ color: '#718096', fontSize: '0.9rem' }}>This workspace channel is currently being prepared for platform synchronization.</p>
  </div>
);

/**
 * Intermediary Route Wrapper to enforce true Inversion of Control (IoC).
 * Consumes normalized session identity state and hooks data cleanly down the pipe.
 */
const ProjectTemplateDetailsRouteWrapper = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const isStudent = user?.role === UserRole.STUDENT;
  
  // Call our refactored, role-agnostic query engine
  const { data: userSkills = [], isLoading } = useUserSkills(userId);
  
  return (
    <ProjectTemplateDetails 
      userSkills={userSkills}
      isStudent={isStudent}
      skillsLoading={isLoading}
    />
  );
};

/**
 * Smart Role-Based Index Switcher
 * Resolves the primary dashboard view dynamically for the authenticated user's role.
 */
const RoleDashboardIndex = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  switch (userRole) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
    case UserRole.REVIEWER:
      return <ReviewerDashboard />;
    case UserRole.PROFESSOR:
      return <PlaceholderView title="Faculty Supervision Console" />;
    case UserRole.PROVIDER:
      return <PlaceholderView title="Sponsor Blueprint Proposal Inventory" />;
    case UserRole.ADMINISTRATOR:
      return <PlaceholderView title="Global Project Verification Board" />;
    default:
      return <Navigate to="/" replace />;
  }
};

// Static Router Export allowing network interceptors to control routing outside standard React hooks
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register/:role",
    element: <RegisterPage />
  },

  /* Consolidated Dashboard Security Boundary */
  {
    element: (
      <ProtectedRoute 
        allowedRoles={[
          UserRole.STUDENT, 
          UserRole.PROFESSOR, 
          UserRole.PROVIDER, 
          UserRole.ADMINISTRATOR, 
          UserRole.REVIEWER
        ]} 
      />
    ), 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
          /* Dynamic Index Route: Renders role-specific dashboard */
          {
            index: true,
            element: <RoleDashboardIndex />
          },
          {
            path: "profile",
            element: <StudentProfile />
          },

          /* Student Specific Sub-routes */
          {
            path: "marketplace",
            element: <ProjectMarketplace />
          },
          {
            path: "marketplace/:templateId",
            element: <ProjectTemplateDetailsRouteWrapper />
          },

          /* Reviewer Specific Sub-routes */
          {
            path: "reviewer",
            element: <ReviewerDashboard />
          },

          /* Professor Specific Sub-routes */
          {
            path: "supervision-requests",
            element: <PlaceholderView title="Incoming Supervision Vetting Board" />
          },
          {
            path: "active-projects",
            element: <PlaceholderView title="Faculty Mentorship Supervision Console" />
          },
          {
            path: "capacity",
            element: <PlaceholderView title="Threshold Allocation & Capacity Management" />
          },

          /* Provider Specific Sub-routes */
          {
            path: "propose-template",
            element: <PlaceholderView title="R&D Capability Template Proposer Form" />
          },
          {
            path: "my-templates",
            element: <PlaceholderView title="Sponsor Blueprint Proposal Inventory" />
          },
          {
            path: "lab-groups",
            element: <PlaceholderView title="Active Co-Managed Experimental Lab Channels" />
          },

          /* Administrator Specific Sub-routes */
          {
            path: "approve-templates",
            element: <PlaceholderView title="Global Project Verification Board" />
          },
          {
            path: "verify-providers",
            element: <PlaceholderView title="External Institutional Sponsor Vetting Board" />
          },
          {
            path: "users",
            element: <PlaceholderView title="Global User Core Account Directory" />
          }
        ]
      },
      {
        element: <WorkspaceLayout />,
        children: [
          {
            path: "/workspace/projects/:projectInstanceId",
            element: <ProjectWorkspace />
          }
        ]
      }
    ]
  },

  /* Global Catch-all Redirection Safeguard */
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);