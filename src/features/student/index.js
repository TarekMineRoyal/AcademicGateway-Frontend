// ============================================================================
// COMPONENTS
// ============================================================================
export { default as StudentDashboard } from './components/StudentDashboard';
export { default as StudentProfile } from './components/StudentProfile';

// ============================================================================
// HOOKS
// ============================================================================
export { useStudentDashboard } from './hooks/useStudentDashboard';
export { useUpdateStudentProfile } from './hooks/useUpdateStudentProfile';

// ============================================================================
// API FUNCTIONS
// ============================================================================
export {
  getStudentProfile,
  getStudentProjects,
  updateStudentProfile,
} from './studentDashboardApi';