// src/features/identity/index.js

// API Functions
export {
  loginUser,
  registerStudent,
  registerProfessor,
  registerProvider
} from './identityApi';

// Registration Strategies
export { registrationStrategies } from './strategies/registrationStrategies';

// Custom Hooks
export { useRegisterWizard } from './hooks/useRegisterWizard';

// Presentational & Form Components
export { default as LoginForm } from './components/LoginForm';
export { default as ProfessorRegisterForm } from './components/ProfessorRegisterForm';
export { default as ProviderRegisterForm } from './components/ProviderRegisterForm';
export { default as StudentRegisterForm } from './components/StudentRegisterForm';