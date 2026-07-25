import { describe, expect, it, beforeEach, vi } from 'vitest';
import apiClient from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    // Reset custom adapter before each test run
    apiClient.defaults.adapter = undefined;
  });

  describe('Response Interceptor & camelCaseKeys Normalization', () => {
    const createMockAdapter = (data) => {
      return vi.fn().mockResolvedValue({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });
    };

    it('converts PascalCase keys to camelCase in response data', async () => {
      apiClient.defaults.adapter = createMockAdapter({
        FirstName: 'Jane',
        LastName: 'Doe',
        IsActiveUser: true,
      });

      const response = await apiClient.get('/test');
      expect(response).toEqual({
        firstName: 'Jane',
        lastName: 'Doe',
        isActiveUser: true,
      });
    });

    it('converts snake_case keys to camelCase in response data', async () => {
      apiClient.defaults.adapter = createMockAdapter({
        first_name: 'Jane',
        last_name: 'Doe',
        is_active_user: true,
      });

      const response = await apiClient.get('/test');
      expect(response).toEqual({
        firstName: 'Jane',
        lastName: 'Doe',
        isActiveUser: true,
      });
    });

    it('recursively converts deeply nested objects and arrays of objects', async () => {
      apiClient.defaults.adapter = createMockAdapter({
        User_Profile: {
          Home_Address: {
            Street_Name: 'Main St',
            Postal_Code: 12345,
          },
        },
        Account_Permissions: [
          { Permission_Name: 'READ_PRIVILEGES', Is_Granted: true },
          { Permission_Name: 'WRITE_PRIVILEGES', Is_Granted: false },
        ],
      });

      const response = await apiClient.get('/test');
      expect(response).toEqual({
        userProfile: {
          homeAddress: {
            streetName: 'Main St',
            postalCode: 12345,
          },
        },
        accountPermissions: [
          { permissionName: 'READ_PRIVILEGES', isGranted: true },
          { permissionName: 'WRITE_PRIVILEGES', isGranted: false },
        ],
      });
    });

    it('preserves primitive values within arrays without modifying or corrupting them', async () => {
      apiClient.defaults.adapter = createMockAdapter({
        tags_list: ['admin_user', 'beta_tester', 404, true, null, undefined],
      });

      const response = await apiClient.get('/test');
      expect(response).toEqual({
        tagsList: ['admin_user', 'beta_tester', 404, true, null, undefined],
      });
    });

    it('safely handles non-plain objects (e.g. Date instances) without stripping prototype', async () => {
      const testDate = new Date('2026-01-01T00:00:00.000Z');
      apiClient.defaults.adapter = createMockAdapter({
        Created_At: testDate,
      });

      const response = await apiClient.get('/test');
      expect(response.createdAt).toBeInstanceOf(Date);
      expect(response.createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    });

    it('passes through root primitives, null, undefined, empty objects, and empty arrays safely', async () => {
      // Null payload
      apiClient.defaults.adapter = createMockAdapter(null);
      expect(await apiClient.get('/test')).toBeNull();

      // String primitive payload
      apiClient.defaults.adapter = createMockAdapter('raw_string_response');
      expect(await apiClient.get('/test')).toBe('raw_string_response');

      // Numeric primitive payload
      apiClient.defaults.adapter = createMockAdapter(200);
      expect(await apiClient.get('/test')).toBe(200);

      // Empty object
      apiClient.defaults.adapter = createMockAdapter({});
      expect(await apiClient.get('/test')).toEqual({});

      // Empty array
      apiClient.defaults.adapter = createMockAdapter([]);
      expect(await apiClient.get('/test')).toEqual([]);
    });

    it('handles snake_case keys containing numbers correctly', async () => {
      apiClient.defaults.adapter = createMockAdapter({
        user_1_status: 'active',
        oauth2_token_type: 'Bearer',
      });

      const response = await apiClient.get('/test');
      expect(response).toEqual({
        user1Status: 'active',
        oauth2TokenType: 'Bearer',
      });
    });
  });

  describe('Request Interceptor & Authentication Header', () => {
    it('attaches Authorization Bearer token header when token exists in localStorage', async () => {
      localStorage.setItem('token', 'valid_jwt_token_abc123');

      let capturedConfig;
      apiClient.defaults.adapter = vi.fn().mockImplementation((config) => {
        capturedConfig = config;
        return Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
      });

      await apiClient.get('/protected');

      expect(capturedConfig.headers.Authorization).toBe('Bearer valid_jwt_token_abc123');
    });

    it('omits Authorization header when localStorage token is null', async () => {
      localStorage.removeItem('token');

      let capturedConfig;
      apiClient.defaults.adapter = vi.fn().mockImplementation((config) => {
        capturedConfig = config;
        return Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
      });

      await apiClient.get('/public');

      expect(capturedConfig.headers.Authorization).toBeUndefined();
    });

    it('omits Authorization header when localStorage token is an empty string', async () => {
      localStorage.setItem('token', '');

      let capturedConfig;
      apiClient.defaults.adapter = vi.fn().mockImplementation((config) => {
        capturedConfig = config;
        return Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
      });

      await apiClient.get('/public');

      expect(capturedConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe('Interceptor Error Handling', () => {
    it('rejects response error for 401 Unauthorized status cleanly', async () => {
      const errorResponse = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };

      apiClient.defaults.adapter = vi.fn().mockRejectedValue(errorResponse);

      await expect(apiClient.get('/unauthorized')).rejects.toEqual(errorResponse);
    });

    it('rejects response error for 500 server errors cleanly', async () => {
      const errorResponse = {
        response: { status: 500, data: { message: 'Internal Server Error' } },
      };

      apiClient.defaults.adapter = vi.fn().mockRejectedValue(errorResponse);

      await expect(apiClient.get('/error')).rejects.toEqual(errorResponse);
    });

    it('rejects network errors without a response object cleanly', async () => {
      const networkError = new Error('Network Error');

      apiClient.defaults.adapter = vi.fn().mockRejectedValue(networkError);

      await expect(apiClient.get('/network-error')).rejects.toThrow('Network Error');
    });
  });
});