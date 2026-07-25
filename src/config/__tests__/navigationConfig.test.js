import { describe, expect, it } from 'vitest';
import { UserRole } from '@/config/roles';
import { getNavigationForRole, NAV_ITEMS } from '../navigationConfig';

describe('navigationConfig', () => {
  describe('getNavigationForRole - Happy Paths', () => {
    it('returns all navigation items assigned to STUDENT', () => {
      const items = getNavigationForRole(UserRole.STUDENT);

      // Verify returned list is not empty
      expect(items.length).toBeGreaterThan(0);

      // Verify every returned item explicitly includes UserRole.STUDENT in its roles
      items.forEach((item) => {
        expect(item.roles).toContain(UserRole.STUDENT);
      });
    });

    it('returns items shared across multiple roles (e.g., Dashboard for STUDENT & REVIEWER)', () => {
      const studentNav = getNavigationForRole(UserRole.STUDENT);
      const reviewerNav = getNavigationForRole(UserRole.REVIEWER);

      const studentDashboard = studentNav.find((item) => item.label === 'Dashboard');
      const reviewerDashboard = reviewerNav.find((item) => item.label === 'Dashboard');

      expect(studentDashboard).toBeDefined();
      expect(reviewerDashboard).toBeDefined();
      expect(studentDashboard).toEqual(reviewerDashboard);
    });

    it('returns correct isolated items for PROFESSOR role', () => {
      const items = getNavigationForRole(UserRole.PROFESSOR);
      const labels = items.map((item) => item.label);

      expect(labels).toEqual([
        'Supervision Board',
        'Supervision Console',
        'Capacity Management',
      ]);
    });
  });

  describe('getNavigationForRole - Case Normalization', () => {
    it('handles uppercase, lowercase, and mixed-case role strings consistently', () => {
      const upper = getNavigationForRole('STUDENT');
      const lower = getNavigationForRole('student');
      const mixed = getNavigationForRole('StUdEnT');

      expect(lower).toEqual(upper);
      expect(mixed).toEqual(upper);
      expect(lower.length).toBeGreaterThan(0);
    });
  });

  describe('getNavigationForRole - Edge Cases & Non-Happy Paths', () => {
    it('returns an empty array when given null or undefined', () => {
      expect(getNavigationForRole(null)).toEqual([]);
      expect(getNavigationForRole(undefined)).toEqual([]);
    });

    it('returns an empty array when passed an empty string', () => {
      expect(getNavigationForRole('')).toEqual([]);
    });

    it('returns an empty array for invalid or unmapped role strings', () => {
      expect(getNavigationForRole('HACKER')).toEqual([]);
      expect(getNavigationForRole('GUEST')).toEqual([]);
      expect(getNavigationForRole('UNKNOWN_ROLE')).toEqual([]);
    });

    it('safely handles non-string primitive types without throwing runtime exceptions', () => {
      expect(getNavigationForRole(12345)).toEqual([]);
      expect(getNavigationForRole(true)).toEqual([]);
      expect(getNavigationForRole(false)).toEqual([]);
    });

    it('safely handles object/array parameters without crashing', () => {
      expect(getNavigationForRole({ role: 'STUDENT' })).toEqual([]);
      expect(getNavigationForRole(['STUDENT'])).toEqual([]);
    });

    it('returns [] for untrimmed role strings unless trimmed (strict string match testing)', () => {
      // Testing exact boundary logic: " STUDENT " converts to " student " which won't match "student"
      expect(getNavigationForRole(' STUDENT ')).toEqual([]);
    });
  });

  describe('NAV_ITEMS Integrity', () => {
    it('ensures every navigation item has essential properties defined', () => {
      NAV_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('path');
        expect(item).toHaveProperty('icon');
        expect(Array.isArray(item.roles)).toBe(true);
        expect(item.roles.length).toBeGreaterThan(0);
      });
    });
  });
});