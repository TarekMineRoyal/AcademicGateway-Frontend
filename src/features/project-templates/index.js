/**
 * src/features/project-templates/index.js
 * Public API Barrel Export for project-templates feature module.
 */

// Shared Components
export { default as TemplateHeader } from "./shared/components/TemplateHeader";

// Workflow: Details
export { default as ProjectTemplateDetails } from "./workflows/details/components/ProjectTemplateDetails";
export { default as SkillMatchPrerequisites } from "./workflows/details/components/SkillMatchPrerequisites";
export { useProjectTemplateDetails } from "./workflows/details/hooks/useProjectTemplateDetails";

// Workflow: Initiation
export { useProjectInitiation } from "./workflows/initiation/hooks/useProjectInitiation";

// Workflow: Marketplace
export { default as ProjectMarketplace } from "./workflows/marketplace/components/ProjectMarketplace";
export { default as MarketplaceFilterPanel } from "./workflows/marketplace/components/MarketplaceFilterPanel";
export { default as ProjectCard } from "./workflows/marketplace/components/ProjectCard";
export { useMarketplaceFilters } from "./workflows/marketplace/hooks/useMarketplaceFilters";
export { useProjectMarketplace } from "./workflows/marketplace/hooks/useProjectMarketplace";

// Workflow: Template Review
export { default as ProjectTemplatesQueue } from "./workflows/template-review/components/ProjectTemplatesQueue";
export { default as TemplateAcademicAlignment } from "./workflows/template-review/components/TemplateAcademicAlignment";
export { default as TemplateDetailModal } from "./workflows/template-review/components/TemplateDetailModal";
export { default as TemplateSkillsList } from "./workflows/template-review/components/TemplateSkillsList";
export { usePendingTemplates } from "./workflows/template-review/hooks/usePendingTemplates";

// API Services
export {
  getApprovedTemplates,
  getPendingProjectTemplates,
  getProjectTemplateById,
  createProjectTemplate,
  reviewProjectTemplate,
} from "./projectTemplatesApi";