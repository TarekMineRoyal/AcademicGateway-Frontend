/**
 * src/features/project-templates/index.js
 * Public API Barrel Export for project-templates feature module.
 */

// Components
export { default as ProjectTemplateDetails } from './components/ProjectTemplateDetails';

// Hooks
export { useProjectTemplateDetails } from './hooks/useProjectTemplateDetails';
export { useProjectInitiation } from './hooks/useProjectInitiation';

// API Services
export {
  getApprovedTemplates,
  getPendingProjectTemplates,
  getProjectTemplateById,
  createProjectTemplate,
} from './projectTemplatesApi';