import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import WorkspaceLayout from '../components/WorkspaceLayout';
import StudentDashboard from '../features/student/components/StudentDashboard';
import ProjectMarketplace from '../features/student/components/ProjectMarketplace';
import StudentProfile from '../features/student/components/StudentProfile';
import ProjectTemplateDetails from '../features/project-templates/components/ProjectTemplateDetails';
import { useUserSkills } from '../features/skills/hooks/useUserSkills';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/enums';

// Import the high-fidelity Phase 3 Project Workspace component
import ProjectWorkspace from '../features/project-instances/components/ProjectWorkspace';

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

  /* Shared / Shared Profile Routes Gate */
  {
    element: <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.PROFESSOR, UserRole.PROVIDER, UserRole.ADMINISTRATOR]} />, 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
          {
            path: "profile",
            element: <StudentProfile />
          }
        ]
      }
    ]
  },

  /* Student-Only Security Boundary */
  {
    element: <ProtectedRoute allowedRoles={[UserRole.STUDENT]} />, 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
          {
            index: true,
            element: <StudentDashboard />
          },
          {
            path: "marketplace",
            element: <ProjectMarketplace />
          },
          {
            path: "marketplace/:templateId",
            element: <ProjectTemplateDetailsRouteWrapper />
          }
        ]
      }
    ]
  },

  /* Institutional Faculty & Auditing Boundary */
  {
    element: <ProtectedRoute allowedRoles={[UserRole.PROFESSOR, UserRole.REVIEWER]} />, 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
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

  /* Provider / Industry Sponsor Boundary */
  {
    element: <ProtectedRoute allowedRoles={[UserRole.PROVIDER]} />, 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
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
          }
        ]
      }
    ]
  },

  /* Platform Administrator Management Boundary */
  {
    element: <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]} />, 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
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
      }
    ]
  },

  /* Global Catch-all Redirection Safeguard */
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);