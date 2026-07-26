import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { UserRole } from '@/config/roles';
import { lazy } from 'react';

// Public pages loaded eagerly
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Protected pages loaded lazily (only evaluated when navigating to that route)
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const WorkspaceLayout = lazy(() => import('@/layouts/WorkspaceLayout'));

export const router = createBrowserRouter([
  /* -------------------------------------------------------------------------- */
  /* Public Unauthenticated Routes                                             */
  /* -------------------------------------------------------------------------- */
  {
    path: '/',
    element: <LandingPage />
  },

  /* -------------------------------------------------------------------------- */
  /* Guest-Only Routes (Redirects to /dashboard if authenticated)             */
  /* -------------------------------------------------------------------------- */
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register/:role',
        element: <RegisterPage />
      }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* Protected Workspace & Dashboard Security Boundary                          */
  /* -------------------------------------------------------------------------- */
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
        path: '/dashboard',
        element: <WorkspaceLayout />,
        children: [
          /* Student Dashboard (Default / Index Route) */
          {
            index: true,
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentDashboardPage />
              </ProtectedRoute>
            )
          },

          /* Unified Profile Route (Delegates to ProfilePage based on user role) */
          {
            path: 'profile',
            element: (
              <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.PROVIDER, UserRole.PROFESSOR]}>
                <ProfilePage />
              </ProtectedRoute>
            )
          },

          /* Future domain sub-routes (professor, admin, marketplace) will plug in here */
        ]
      }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* Global Catch-All Fallback                                                 */
  /* -------------------------------------------------------------------------- */
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);