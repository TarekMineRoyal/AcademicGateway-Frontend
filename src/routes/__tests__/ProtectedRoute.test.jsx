import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '@/context/AuthContextCore';

// Mock Auth Context Hook
vi.mock('@/context/AuthContextCore', () => ({
  useAuth: vi.fn(),
}));

// Helper component to capture and display current route location for assertions
function LocationDisplay() {
  const location = useLocation();
  return (
    <div>
      <span data-testid="location-pathname">{location.pathname}</span>
      <span data-testid="location-state">{JSON.stringify(location.state)}</span>
    </div>
  );
}

describe('ProtectedRoute Guard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State (Guard 1)', () => {
    it('renders loading indicator screen while global auth context is loading', () => {
      useAuth.mockReturnValue({ user: null, loading: true });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Verifying authorization credentials...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated Redirection (Guard 2)', () => {
    it('redirects unauthenticated user (user = null) to /login and saves target in location.state.from', () => {
      useAuth.mockReturnValue({ user: null, loading: false });

      render(
        <MemoryRouter initialEntries={[{ pathname: '/protected/resource', search: '?id=10' }]}>
          <Routes>
            <Route path="/login" element={<LocationDisplay />} />
            <Route
              path="/protected/resource"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/login');
      expect(screen.getByTestId('location-state')).toHaveTextContent('/protected/resource');
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Role Authorization (Guard 3)', () => {
    it('redirects user to /dashboard when user role does not match allowedRoles', () => {
      useAuth.mockReturnValue({
        user: { id: 'u1', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/admin/settings']}>
          <Routes>
            <Route path="/dashboard" element={<LocationDisplay />} />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <div>Admin Settings Panel</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/dashboard');
      expect(screen.queryByText('Admin Settings Panel')).not.toBeInTheDocument();
    });

    it('performs case-insensitive role comparisons matching roles regardless of casing', () => {
      useAuth.mockReturnValue({
        user: { id: 'u2', role: 'student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/student/courses']}>
          <Routes>
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <div>Student Courses Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Student Courses Content')).toBeInTheDocument();
    });

    it('grants access to authenticated users when allowedRoles is empty or undefined', () => {
      useAuth.mockReturnValue({
        user: { id: 'u3', role: 'Reviewer' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/common/dashboard']}>
          <Routes>
            <Route
              path="/common/dashboard"
              element={
                <ProtectedRoute>
                  <div>Shared Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Shared Dashboard Content')).toBeInTheDocument();
    });
  });

  describe('Children vs Outlet Rendering', () => {
    it('renders direct children props when provided', () => {
      useAuth.mockReturnValue({
        user: { id: 'u4', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div data-testid="direct-children">Direct Child Node</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('direct-children')).toBeInTheDocument();
    });

    it('renders nested Outlet routes when children prop is omitted', () => {
      useAuth.mockReturnValue({
        user: { id: 'u5', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/nested/page']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/nested/page" element={<div data-testid="outlet-child">Nested Outlet Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('outlet-child')).toBeInTheDocument();
    });
  });
});