// Components
export { ProfessorProfileModal } from './components/ProfessorProfileModal';
export { default as ProfessorDashboard, ProfessorDashboard as ProfessorDashboardNamed } from './components/ProfessorDashboard';

// Hooks
export { useProfessorProfile } from './hooks/useProfessorProfile';
export { useProfessorDashboard } from './hooks/useProfessorDashboard';

// API Services
export {
  searchProfessors,
  getProfessorProfile,
  updateProfessorProfile,
  getProfessorById,
  getProfessorDashboardData,
} from './professorApi';