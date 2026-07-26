// Global & Workflow Components
export { ProfessorProfileModal } from './workflows/profile-management/components/ProfessorProfileModal';
export { ProfessorProfile } from './workflows/profile-management/ProfessorProfile';
export { AdvisorCard } from './workflows/recommendations/components/AdvisorCard';

// Global & Workflow Hooks
export { useProfessorProfile } from './workflows/profile-management/hooks/useProfessorProfile';
export { useProfessorProfileForm } from './workflows/profile-management/hooks/useProfessorProfileForm';
export { useProfessorProfileData } from './workflows/profile-management/hooks/useProfessorProfileData';
export { useRecommendedProfessors } from './workflows/recommendations/hooks/useRecommendedProfessors';

// Domain Utilities & Helpers
export { isProfessorFull } from './utils/capacityUtils';

// API Services
export {
  searchProfessors,
  getProfessorProfile,
  updateProfessorProfile,
  getProfessorById,
  getProfessorDashboardData,
  getRecommendedProfessors,
} from './professorApi';