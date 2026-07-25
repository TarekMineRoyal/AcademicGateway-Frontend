import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../AuthContextCore';

const createMockJwt = (payload) => {
  const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
  const base64Payload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${base64Payload}.signature`;
};

// Test consumer component to trigger and inspect AuthContext state
function TestConsumer({ onAuth }) {
  const auth = useAuth();
  onAuth(auth);
  return (
    <div>
      <span data-testid="user-id">{auth?.user?.id || 'NO_USER'}</span>
      <span data-testid="user-role">{auth?.user?.role || 'NO_ROLE'}</span>
      <button onClick={() => auth.login(createMockJwt({ id: 'login_user', role: 'Student' }))}>
        Trigger Login
      </button>
      <button onClick={() => auth.logout()}>Trigger Logout</button>
    </div>
  );
}

describe('AuthProvider Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Initial App Boot & Token Hydration', () => {
    it('hydrates user state on boot if valid token exists in localStorage', () => {
      const validToken = createMockJwt({ id: 'boot_user_1', role: 'Student' });
      localStorage.setItem('token', validToken);

      let capturedAuth;
      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id')).toHaveTextContent('boot_user_1');
      expect(screen.getByTestId('user-role')).toHaveTextContent('Student');
      expect(capturedAuth.user.token).toBe(validToken);
    });

    it('purges corrupted token from localStorage and resets user state to null on boot', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      localStorage.setItem('token', 'corrupted_invalid_jwt_token');

      let capturedAuth;
      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      expect(removeItemSpy).toHaveBeenCalledWith('token');
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByTestId('user-id')).toHaveTextContent('NO_USER');
      expect(capturedAuth.user).toBeNull();
    });

    it('initializes user as null when localStorage is empty', () => {
      let capturedAuth;
      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id')).toHaveTextContent('NO_USER');
      expect(capturedAuth.user).toBeNull();
    });
  });

  describe('login() Workflow', () => {
    it('stores token in localStorage, updates user state, and returns user role', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      let capturedAuth;

      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      const token = createMockJwt({ id: 'login_123', role: 'Professor' });

      let returnedRole;
      act(() => {
        returnedRole = capturedAuth.login(token);
      });

      expect(setItemSpy).toHaveBeenCalledWith('token', token);
      expect(localStorage.getItem('token')).toBe(token);
      expect(returnedRole).toBe('Professor');
      expect(screen.getByTestId('user-id')).toHaveTextContent('login_123');
      expect(screen.getByTestId('user-role')).toHaveTextContent('Professor');
    });

    it('returns null and does not update user state when attempting to login with invalid token', () => {
      let capturedAuth;

      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      let returnedRole;
      act(() => {
        returnedRole = capturedAuth.login('invalid_token');
      });

      expect(returnedRole).toBeNull();
      expect(screen.getByTestId('user-id')).toHaveTextContent('NO_USER');
    });
  });

  describe('logout() Workflow', () => {
    it('clears localStorage, resets user state to null, and executes navigate callback', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      const validToken = createMockJwt({ id: 'user_to_logout', role: 'Student' });
      localStorage.setItem('token', validToken);

      const navigateCallback = vi.fn();
      let capturedAuth;

      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      act(() => {
        capturedAuth.logout(navigateCallback);
      });

      expect(removeItemSpy).toHaveBeenCalledWith('token');
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByTestId('user-id')).toHaveTextContent('NO_USER');
      expect(navigateCallback).toHaveBeenCalledTimes(1);
    });

    it('falls back to window.location.href assignment when navigateCallback is omitted', () => {
      const validToken = createMockJwt({ id: 'user_fallback_logout', role: 'Student' });
      localStorage.setItem('token', validToken);

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      let capturedAuth;
      render(
        <AuthProvider>
          <TestConsumer onAuth={(auth) => (capturedAuth = auth)} />
        </AuthProvider>
      );

      act(() => {
        capturedAuth.logout();
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(window.location.href).toBe('/login');

      // Restore location
      window.location = originalLocation;
    });
  });
});