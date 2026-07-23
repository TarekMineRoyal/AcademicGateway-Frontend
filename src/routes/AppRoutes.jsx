import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ReviewerDashboardPage from '../pages/ReviewerDashboardPage';
import ProjectTemplateDetailsPage from '../pages/ProjectTemplateDetailsPage';
import ProjectWorkspacePage from '../pages/ProjectWorkspacePage';
import ProtectedRoute from './ProtectedRoute';
import WorkspaceLayout from '../shared/components/WorkspaceLayout';
import { StudentProfile, ProjectMarketplace } from '../features/student';
import { UserRole } from '../shared/constants/enums';
import { PlaceholderView, RoleDashboardIndex } from './RouteWrappers';

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
            element: <ProjectTemplateDetailsPage />
          },

          /* Reviewer Specific Sub-routes */
          {
            path: "reviewer",
            element: <ReviewerDashboardPage />
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
            element: <ProjectWorkspacePage />
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