import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import WorkspaceLayout from '../WorkspaceLayout';
import { useAuth } from '@/context/AuthContextCore';
import { UserRole } from '@/config/roles';

vi.mock('@/context/AuthContextCore', () => ({
  useAuth: vi.fn(),
}));

// Helper component to spy on active URL location changes
function LocationWatcher({ onLocationChange }) {
  const location = useLocation();
  onLocationChange(location.pathname);
  return null;
}

describe('WorkspaceLayout Component', () => {
  const mockLogout = vi.fn();

  const renderWithRouter = (initialRoute = '/dashboard', locationSpy = () => {}) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <LocationWatcher onLocationChange={locationSpy} />
        <Routes>
          <Route path="/" element={<WorkspaceLayout />}>
            <Route path="dashboard" element={<div>Dashboard Content</div>} />
            <Route path="dashboard/marketplace" element={<div>Marketplace Content</div>} />
            <Route path="login" element={<div>Login Page</div>} />
            <Route path="*" element={<div>Catch All Fallback</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Role-Based Sidebar Navigation Rendering', () => {
    it('renders correct navigation links for STUDENT role', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: UserRole.STUDENT },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Project Marketplace')).toBeInTheDocument();
      expect(screen.getByText('Search Users')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();

      expect(screen.queryByText('Supervision Board')).not.toBeInTheDocument();
      expect(screen.queryByText('Propose Template')).not.toBeInTheDocument();
    });

    it('renders correct navigation links for PROFESSOR role', () => {
      useAuth.mockReturnValue({
        user: { name: 'Prof. Xavier', role: UserRole.PROFESSOR },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Supervision Board')).toBeInTheDocument();
      expect(screen.getByText('Supervision Console')).toBeInTheDocument();
      expect(screen.getByText('Capacity Management')).toBeInTheDocument();

      expect(screen.queryByText('Project Marketplace')).not.toBeInTheDocument();
      expect(screen.queryByText('Propose Template')).not.toBeInTheDocument();
    });

    it('renders correct navigation links for PROVIDER role', () => {
      useAuth.mockReturnValue({
        user: { name: 'Acme Corp', role: UserRole.PROVIDER },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Propose Template')).toBeInTheDocument();
      expect(screen.getByText('Proposal Inventory')).toBeInTheDocument();
      expect(screen.getByText('Experimental Labs')).toBeInTheDocument();

      expect(screen.queryByText('Supervision Board')).not.toBeInTheDocument();
    });

    it('renders correct navigation links for ADMINISTRATOR role', () => {
      useAuth.mockReturnValue({
        user: { name: 'Admin User', role: UserRole.ADMINISTRATOR },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Verify Blueprints')).toBeInTheDocument();
      expect(screen.getByText('Vet Sponsors')).toBeInTheDocument();
      expect(screen.getByText('User Directory')).toBeInTheDocument();
    });

    it('handles lowercase role strings gracefully due to case-insensitive matching', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: 'student' },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Project Marketplace')).toBeInTheDocument();
    });

    it('renders empty navigation container when user role is unknown or unmapped', () => {
      useAuth.mockReturnValue({
        user: { name: 'Guest Support', role: UserRole.TECH_SUPPORT },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Project Marketplace')).not.toBeInTheDocument();
    });

    it('renders empty navigation container when user object is null/undefined', () => {
      useAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.queryByRole('nav')).not.toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });

  describe('2. User Identity Display & Fallbacks', () => {
    it('displays the user name in the sidebar profile section when available', () => {
      useAuth.mockReturnValue({
        user: { name: 'Dr. Alan Grant', role: UserRole.PROFESSOR },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Dr. Alan Grant')).toBeInTheDocument();
    });

    it('falls back to "Account" when user.name is null, empty string, or missing', () => {
      useAuth.mockReturnValue({
        user: { role: UserRole.STUDENT },
        logout: mockLogout,
      });

      renderWithRouter();

      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });

  describe('3. Placeholder Navigation Link Guarding (path === "#")', () => {
    it('prevents default event execution and cancels route changes when clicking a placeholder link', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: UserRole.STUDENT },
        logout: mockLogout,
      });

      let currentPath = '/dashboard';
      renderWithRouter('/dashboard', (path) => {
        currentPath = path;
      });

      const placeholderLink = screen.getByText('Search Users').closest('a');

      // Create synthetic click event to verify e.preventDefault() trigger
      const clickEvent = createEvent.click(placeholderLink);
      fireEvent(placeholderLink, clickEvent);

      // Verify explicit e.preventDefault() was called by WorkspaceLayout
      expect(clickEvent.defaultPrevented).toBe(true);
      // Verify router location remained at /dashboard
      expect(currentPath).toBe('/dashboard');
    });

    it('allows standard route navigation for non-placeholder links', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: UserRole.STUDENT },
        logout: mockLogout,
      });

      let currentPath = '/dashboard';
      renderWithRouter('/dashboard', (path) => {
        currentPath = path;
      });

      const validLink = screen.getByText('Project Marketplace').closest('a');
      fireEvent.click(validLink);

      // Location should successfully update to /dashboard/marketplace
      expect(currentPath).toBe('/dashboard/marketplace');
    });
  });

  describe('4. Sign Out Workflow & Routing', () => {
    it('invokes context logout() and redirects to /login on Sign Out button click', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: UserRole.STUDENT },
        logout: mockLogout,
      });

      let currentPath = '/dashboard';
      renderWithRouter('/dashboard', (path) => {
        currentPath = path;
      });

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(currentPath).toBe('/login');
    });
  });

  describe('5. Child Route Rendering (Outlet)', () => {
    it('renders the nested child route content inside the main viewport', () => {
      useAuth.mockReturnValue({
        user: { name: 'Jane Doe', role: UserRole.STUDENT },
        logout: mockLogout,
      });

      renderWithRouter('/dashboard');

      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });
});