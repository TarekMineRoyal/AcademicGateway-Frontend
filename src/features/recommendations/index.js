// API Functions
export {
  getRecommendedProjects,
  getRecommendedProfessors,
  getRecommendedSkills,
} from './recommendationsApi';

// Custom Hooks
export { useRecommendedProfessors } from './hooks/useRecommendedProfessors';
export { useRecommendedProjects } from './hooks/useRecommendedProjects';
export { useRecommendedSkills } from './hooks/useRecommendedSkills';

// Components
export { AdvisorCard } from './components/AdvisorCard';