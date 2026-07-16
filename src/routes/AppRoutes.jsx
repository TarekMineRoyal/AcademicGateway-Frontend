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
 * This layer consumes the contextual user session state and injects it 
 * downstream as pure, deterministic props into the presentation view.
 */
const ProjectTemplateDetailsRouteWrapper = () => {
  const { userSkills, isStudent, loading } = useUserSkills();
  
  return (
    <ProjectTemplateDetails 
      userSkills={userSkills}
      isStudent={isStudent}
      skillsLoading={loading}
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

  /* Authenticated Workspace Matrix Route Tree */
  {
    // Auth Guard Level 1 Layout Route
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/dashboard",
        // Shared Workspace Presentation Layout Route
        element: <WorkspaceLayout />,
        children: [
          /* Default Base Dashboard Workspace Entry Node */
          {
            index: true,
            element: <StudentDashboard />
          },
          /* Shared & Actor Specific Sub-Channel Routes */
          {
            path: "profile",
            element: <StudentProfile />
          },
          {
            path: "marketplace",
            element: <ProjectMarketplace />
          },
          /* Updated to use the IoC Route Wrapper Component */
          {
            path: "marketplace/:templateId",
            element: <ProjectTemplateDetailsRouteWrapper />
          },
          /* Professor Sub-Channel Routes */
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
          /* Provider / Industry Sponsor Sub-Channel Routes */
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
          /* Platform Administrator Management Sub-Channel Routes */
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

  /* Secured under standard authentication and persistent Sidebar/Header Layout */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <WorkspaceLayout />,
        children: [
          /* Phase 3 Target Integration Route */
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