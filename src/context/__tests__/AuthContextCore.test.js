import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { handleTokenHydration, useAuth } from '../AuthContextCore';

// Utility helper to create base64-encoded JWT strings for tests
const createMockJwt = (payload) => {
  const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // {"alg":"HS256","typ":"JWT"}
  const base64Payload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const signature = 'mock_signature';
  return `${header}.${base64Payload}.${signature}`;
};

describe('AuthContextCore', () => {
  describe('handleTokenHydration', () => {
    it('correctly maps standard claims (id, fullName, role, email)', () => {
      const payload = {
        id: 'user_123',
        fullName: 'Jane Doe',
        role: 'Student',
        email: 'jane@example.com',
      };
      const token = createMockJwt(payload);

      const result = handleTokenHydration(token);

      expect(result).toEqual({
        token,
        id: 'user_123',
        name: 'Jane Doe',
        role: 'Student',
        email: 'jane@example.com',
      });
    });

    it('falls back to "sub" when "id" claim is missing', () => {
      const payload = {
        sub: 'sub_456',
        fullName: 'Bob Smith',
        role: 'Professor',
      };
      const token = createMockJwt(payload);

      const result = handleTokenHydration(token);

      expect(result.id).toBe('sub_456');
    });

    it('falls back to "unique_name" when "fullName" claim is missing', () => {
      const payload = {
        id: 'user_789',
        unique_name: 'unique_user_name',
        role: 'Administrator',
      };
      const token = createMockJwt(payload);

      const result = handleTokenHydration(token);

      expect(result.name).toBe('unique_user_name');
    });

    it('prefers primary claims ("id" and "fullName") over fallback claims when both are present', () => {
      const payload = {
        id: 'primary_id',
        sub: 'fallback_sub',
        fullName: 'Primary Name',
        unique_name: 'fallback_name',
      };
      const token = createMockJwt(payload);

      const result = handleTokenHydration(token);

      expect(result.id).toBe('primary_id');
      expect(result.name).toBe('Primary Name');
    });

    it('decodes UTF-8 special characters in claims correctly without corruption', () => {
      const payload = {
        id: 'user_utf8',
        fullName: 'José María Gómez',
        role: 'Student',
      };
      // Manually encode UTF-8 bytes to simulate JWT encoding
      const jsonStr = JSON.stringify(payload);
      const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode('0x' + p1)
      );
      const base64Payload = btoa(utf8Bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const token = `header.${base64Payload}.sig`;

      const result = handleTokenHydration(token);

      expect(result.name).toBe('José María Gómez');
    });

    describe('Malformed & Invalid Token Parsing (Resilience Testing)', () => {
      it('returns null safely for plain strings with missing JWT dots/parts', () => {
        expect(handleTokenHydration('invalid_plain_string_token')).toBeNull();
      });

      it('returns null safely for corrupted base64 payloads', () => {
        expect(handleTokenHydration('header.invalid_base64_payload!.signature')).toBeNull();
      });

      it('returns null safely when decoded base64 is not a valid JSON string', () => {
        const notJsonBase64 = btoa('This is not JSON');
        const token = `header.${notJsonBase64}.signature`;

        expect(handleTokenHydration(token)).toBeNull();
      });

      it('returns null safely for non-string token inputs (null, undefined, numbers, objects)', () => {
        expect(handleTokenHydration(null)).toBeNull();
        expect(handleTokenHydration(undefined)).toBeNull();
        expect(handleTokenHydration(12345)).toBeNull();
        expect(handleTokenHydration({})).toBeNull();
        expect(handleTokenHydration('')).toBeNull();
      });
    });
  });

  describe('useAuth Hook', () => {
    it('returns null context value when rendered outside of AuthProvider', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current).toBeNull();
    });
  });
});