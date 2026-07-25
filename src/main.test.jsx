import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted guarantees this container exists before vi.mock blocks are hoisted & executed
const captured = vi.hoisted(() => ({
  queryCacheOnError: null,
  mutationCacheOnError: null,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    QueryCache: class extends actual.QueryCache {
      constructor(options) {
        super(options);
        captured.queryCacheOnError = options?.onError;
      }
    },
    MutationCache: class extends actual.MutationCache {
      constructor(options) {
        super(options);
        captured.mutationCacheOnError = options?.onError;
      }
    },
  };
});

vi.mock('@/routes/AppRoutes', () => ({
  router: {
    navigate: vi.fn(),
  },
}));

// Prevent React DOM rendering side effects during unit test execution
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Import main.jsx to trigger module initialization and queryClient setup
import '@/main.jsx';
import { router } from '@/routes/AppRoutes';

describe('Global Auth Interceptor (main.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('QueryCache & MutationCache Registration', () => {
    it('should register the global auth failure handler on both QueryCache and MutationCache', () => {
      expect(captured.queryCacheOnError).toBeInstanceOf(Function);
      expect(captured.mutationCacheOnError).toBeInstanceOf(Function);
    });
  });

  describe('HTTP 401 Handling (Happy Path & Storage States)', () => {
    it('should remove "token" from localStorage and navigate to /login on 401 via QueryCache', () => {
      localStorage.setItem('token', 'active-user-jwt');

      captured.queryCacheOnError({ response: { status: 401 } });

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith('/login');
    });

    it('should remove "token" from localStorage and navigate to /login on 401 via MutationCache', () => {
      localStorage.setItem('token', 'active-user-jwt');

      captured.mutationCacheOnError({ response: { status: 401 } });

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith('/login');
    });

    it('should handle 401 gracefully when localStorage is already empty', () => {
      expect(localStorage.getItem('token')).toBeNull();

      expect(() => {
        captured.queryCacheOnError({ response: { status: 401 } });
      }).not.toThrow();

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Non-401 HTTP Status Passthrough (Boundary & Guard Testing)', () => {
    it.each([400, 403, 404, 500, 502, 503])(
      'should NOT purge localStorage or navigate on HTTP %i error',
      (status) => {
        localStorage.setItem('token', 'valid-user-token');

        captured.queryCacheOnError({ response: { status } });

        expect(localStorage.getItem('token')).toBe('valid-user-token');
        expect(router.navigate).not.toHaveBeenCalled();
      }
    );

    it('should NOT purge token if status is string "401" due to strict equality check', () => {
      localStorage.setItem('token', 'valid-user-token');

      captured.queryCacheOnError({ response: { status: '401' } });

      expect(localStorage.getItem('token')).toBe('valid-user-token');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Malformed & Missing Error Payloads (Defensive Edge Cases)', () => {
    it.each([
      ['undefined error', undefined],
      ['null error', null],
      ['empty object', {}],
      ['error with null response', { response: null }],
      ['error with empty response object', { response: {} }],
      ['error with non-numeric status', { response: { status: 'UNAUTHORIZED' } }],
    ])('should handle %s without throwing or redirecting', (_, errorPayload) => {
      localStorage.setItem('token', 'valid-user-token');

      expect(() => {
        captured.queryCacheOnError(errorPayload);
      }).not.toThrow();

      expect(localStorage.getItem('token')).toBe('valid-user-token');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});