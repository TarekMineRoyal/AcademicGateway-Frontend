import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import GuestRoute from '../GuestRoute';
import { useAuth } from '@/context/AuthContextCore';

// Mock Auth Context Hook
vi.mock('@/context/AuthContextCore', () => ({
  useAuth: vi.fn(),
}));

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location-pathname">{location.pathname}</span>;
}

describe('GuestRoute Guard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State (Guard 1)', () => {
    it('renders loading indicator while global auth state is parsing token', () => {
      useAuth.mockReturnValue({ user: null, loading: true });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <GuestRoute>
            <div>Login Page</div>
          </GuestRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Verifying authorization credentials...')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated Redirects (Guard 2)', () => {
    it('redirects authenticated user to /dashboard by default', () => {
      useAuth.mockReturnValue({
        user: { id: 'auth_1', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/dashboard" element={<LocationDisplay />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <div>Login Component</div>
                </GuestRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/dashboard');
      expect(screen.queryByText('Login Component')).not.toBeInTheDocument();
    });

    it('redirects authenticated user to location.state.from.pathname if available', () => {
      useAuth.mockReturnValue({
        user: { id: 'auth_2', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/login',
              state: { from: { pathname: '/dashboard/marketplace' } },
            },
          ]}
        >
          <Routes>
            <Route path="/dashboard/marketplace" element={<LocationDisplay />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <div>Login Component</div>
                </GuestRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/dashboard/marketplace');
    });

    it('respects custom redirectTo parameter when provided', () => {
      useAuth.mockReturnValue({
        user: { id: 'auth_3', role: 'Student' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/custom-landing" element={<LocationDisplay />} />
            <Route
              path="/register"
              element={
                <GuestRoute redirectTo="/custom-landing">
                  <div>Register Component</div>
                </GuestRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/custom-landing');
    });
  });

  describe('Unauthenticated Allowed Flow', () => {
    it('renders direct children when user is unauthenticated (user = null)', () => {
      useAuth.mockReturnValue({ user: null, loading: false });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <GuestRoute>
            <div data-testid="login-form">Login Form UI</div>
          </GuestRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('renders nested Outlet routes when children prop is omitted', () => {
      useAuth.mockReturnValue({ user: null, loading: false });

      render(
        <MemoryRouter initialEntries={['/guest/register']}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/guest/register" element={<div data-testid="register-outlet">Registration Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('register-outlet')).toBeInTheDocument();
    });
  });
});