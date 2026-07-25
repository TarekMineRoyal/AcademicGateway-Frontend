import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import { UserRole } from '@/config/roles';

export const router = createBrowserRouter([
  /* -------------------------------------------------------------------------- */
  /* Public Unauthenticated Routes                                             */
  /* -------------------------------------------------------------------------- */
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register/:role',
    element: <RegisterPage />
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
        element: (
          <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
            <div className="bg-white p-8 rounded-card shadow-md text-center max-w-md">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Authenticated Workspace</h2>
              <p className="text-slate-500 text-sm">
                Dashboard modules are currently scheduled for migration. Authentication & registration flows are 100% active!
              </p>
            </div>
          </div>
        )
      }
      /* Future feature routes (marketplace, profile, supervision, etc.) will be plugged back in here as they are migrated */
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