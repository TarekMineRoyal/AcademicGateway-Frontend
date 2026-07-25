import { UserRole } from '@/config/roles';

/**
 * Declarative list of system navigation items with required role access.
 */
export const NAV_ITEMS = [
  // Student Navigation
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: [UserRole.STUDENT, UserRole.REVIEWER] },
  { label: 'Project Marketplace', path: '/dashboard/marketplace', icon: 'BookOpen', roles: [UserRole.STUDENT] },
  { label: 'Search Users', path: '#', icon: 'Search', roles: [UserRole.STUDENT] },
  { label: 'Messages', path: '#', icon: 'Mail', roles: [UserRole.STUDENT] },
  { label: 'Notifications', path: '#', icon: 'Bell', roles: [UserRole.STUDENT] },

  // Professor Navigation
  { label: 'Supervision Board', path: '/dashboard/supervision-requests', icon: 'Award', roles: [UserRole.PROFESSOR] },
  { label: 'Supervision Console', path: '/dashboard/active-projects', icon: 'Folder', roles: [UserRole.PROFESSOR] },
  { label: 'Capacity Management', path: '/dashboard/capacity', icon: 'Zap', roles: [UserRole.PROFESSOR] },

  // Provider Navigation
  { label: 'Propose Template', path: '/dashboard/propose-template', icon: 'PlusCircle', roles: [UserRole.PROVIDER] },
  { label: 'Proposal Inventory', path: '/dashboard/my-templates', icon: 'Folder', roles: [UserRole.PROVIDER] },
  { label: 'Experimental Labs', path: '/dashboard/lab-groups', icon: 'Building', roles: [UserRole.PROVIDER] },

  // Administrator Navigation
  { label: 'Verify Blueprints', path: '/dashboard/approve-templates', icon: 'CheckCircle', roles: [UserRole.ADMINISTRATOR] },
  { label: 'Vet Sponsors', path: '/dashboard/verify-providers', icon: 'Building', roles: [UserRole.ADMINISTRATOR] },
  { label: 'User Directory', path: '/dashboard/users', icon: 'User', roles: [UserRole.ADMINISTRATOR] },
];

/**
 * Filters system navigation links for a given user role.
 * Includes case-insensitive matching to support role tokens regardless of string casing.
 * 
 * @param {string} userRole - The role of the authenticated user.
 * @returns {Array} Array of allowed navigation item objects.
 */
export function getNavigationForRole(userRole) {
  if (!userRole) return [];
  const normalizedUserRole = String(userRole).toLowerCase();

  return NAV_ITEMS.filter((item) =>
    item.roles.some((role) => String(role).toLowerCase() === normalizedUserRole)
  );
}