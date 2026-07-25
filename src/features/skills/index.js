// src/features/skills/index.js

// API Functions
export { 
  getSkills, 
  getUserSkills, 
  getRecommendedSkills 
} from './skillsApi';

// Hooks
export { useUserSkills } from './hooks/useUserSkills';
export { useRecommendedSkills } from './hooks/useRecommendedSkills';

// Components
export { default as RecommendedSkillsGroup } from './components/RecommendedSkillsGroup';
export { default as SkillPickerSection } from './components/SkillPickerSection';