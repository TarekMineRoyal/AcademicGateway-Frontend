import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StudentProfilePage from '../pages/StudentProfilePage';
import ProjectMarketplacePage from '../pages/ProjectMarketplacePage';
import ReviewerDashboardPage from '../pages/ReviewerDashboardPage';
import AdministratorDashboardPage from '../pages/AdministratorDashboardPage';
import ProviderDashboardPage from '../pages/ProviderDashboardPage';
import ProfessorDashboardPage from '../pages/ProfessorDashboardPage';
import TechSupportDashboardPage from '../pages/TechSupportDashboardPage';
import ProjectTemplateDetailsPage from '../pages/ProjectTemplateDetailsPage';
import ProjectWorkspacePage from '../pages/ProjectWorkspacePage';
import ProtectedRoute from './ProtectedRoute';
import WorkspaceLayout from '../shared/components/WorkspaceLayout';
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
          UserRole.REVIEWER,
          UserRole.TECH_SUPPORT
        ]} 
      />
    ), 
    children: [
      {
        path: "/dashboard",
        element: <WorkspaceLayout />,
        children: [
          /* Dynamic Index Route: Renders role-specific dashboard for any authenticated user */
          {
            index: true,
            element: <RoleDashboardIndex />
          },

          /* Student Specific Sub-routes */
          {
            path: "profile",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentProfilePage />
              </ProtectedRoute>
            )
          },
          {
            path: "marketplace",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <ProjectMarketplacePage />
              </ProtectedRoute>
            )
          },
          {
            path: "marketplace/:templateId",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <ProjectTemplateDetailsPage />
              </ProtectedRoute>
            )
          },

          /* Reviewer Specific Sub-routes */
          {
            path: "reviewer",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.REVIEWER, UserRole.ADMINISTRATOR]}>
                <ReviewerDashboardPage />
              </ProtectedRoute>
            )
          },

          /* Professor Specific Sub-routes */
          {
            path: "professor",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                <ProfessorDashboardPage />
              </ProtectedRoute>
            )
          },
          {
            path: "supervision-requests",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                <PlaceholderView title="Incoming Supervision Vetting Board" />
              </ProtectedRoute>
            )
          },
          {
            path: "active-projects",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                <PlaceholderView title="Faculty Mentorship Supervision Console" />
              </ProtectedRoute>
            )
          },
          {
            path: "capacity",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                <PlaceholderView title="Threshold Allocation & Capacity Management" />
              </ProtectedRoute>
            )
          },

          /* Provider Specific Sub-routes */
          {
            path: "provider",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                <ProviderDashboardPage />
              </ProtectedRoute>
            )
          },
          {
            path: "propose-template",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                <PlaceholderView title="R&D Capability Template Proposer Form" />
              </ProtectedRoute>
            )
          },
          {
            path: "my-templates",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                <PlaceholderView title="Sponsor Blueprint Proposal Inventory" />
              </ProtectedRoute>
            )
          },
          {
            path: "lab-groups",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                <PlaceholderView title="Active Co-Managed Experimental Lab Channels" />
              </ProtectedRoute>
            )
          },

          /* Administrator Specific Sub-routes */
          {
            path: "administrator",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                <AdministratorDashboardPage />
              </ProtectedRoute>
            )
          },
          {
            path: "approve-templates",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                <PlaceholderView title="Global Project Verification Board" />
              </ProtectedRoute>
            )
          },
          {
            path: "verify-providers",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                <PlaceholderView title="External Institutional Sponsor Vetting Board" />
              </ProtectedRoute>
            )
          },
          {
            path: "users",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                <PlaceholderView title="Global User Core Account Directory" />
              </ProtectedRoute>
            )
          },

          /* Tech Support Specific Sub-routes */
          {
            path: "tech-support",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.TECH_SUPPORT]}>
                <TechSupportDashboardPage />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        element: <WorkspaceLayout />,
        children: [
          {
            path: "/workspace/projects/:projectInstanceId",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.PROFESSOR]}>
                <ProjectWorkspacePage />
              </ProtectedRoute>
            )
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