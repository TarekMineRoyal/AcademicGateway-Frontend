import { UserRole } from '../constants/enums';

export const navigationConfig = {
  [UserRole.STUDENT]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Project Marketplace', path: '/dashboard/marketplace', icon: 'BookOpen' },
    { label: 'Search Users', path: '#', icon: 'Search' },
    { label: 'Messages', path: '#', icon: 'Mail' },
    { label: 'Notifications', path: '#', icon: 'Bell' },
  ],
  [UserRole.PROFESSOR]: [
    { label: 'Supervision Board', path: '/dashboard/supervision-requests', icon: 'Award' },
    { label: 'Supervision Console', path: '/dashboard/active-projects', icon: 'Folder' },
    { label: 'Capacity Management', path: '/dashboard/capacity', icon: 'Zap' },
  ],
  [UserRole.PROVIDER]: [
    { label: 'Propose Template', path: '/dashboard/propose-template', icon: 'PlusCircle' },
    { label: 'Proposal Inventory', path: '/dashboard/my-templates', icon: 'Folder' },
    { label: 'Experimental Labs', path: '/dashboard/lab-groups', icon: 'Building' },
  ],
  [UserRole.ADMINISTRATOR]: [
    { label: 'Verify Blueprints', path: '/dashboard/approve-templates', icon: 'CheckCircle' },
    { label: 'Vet Sponsors', path: '/dashboard/verify-providers', icon: 'Building' },
    { label: 'User Directory', path: '/dashboard/users', icon: 'User' },
  ],
  [UserRole.REVIEWER]: [],
  [UserRole.TECH_SUPPORT]: [],
};