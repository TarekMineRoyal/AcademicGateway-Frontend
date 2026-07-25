import { Sparkles } from 'lucide-react';
import ProjectCard from "@/features/project-templates/workflows/marketplace/components/ProjectCard";

/**
 * Component isolating the AI-Matched Recommendations section.
 * Renders loading skeletons, recommended project cards, or fallback UI when no matches exist.
 * 
 * @param {Object} props
 * @param {Array} props.recommendedProjects - List of recommended project blueprint objects
 * @param {boolean} props.isLoading - Loading state for recommendations query
 * @param {Function} props.onSelectProject - Navigation/selection callback when viewing a project
 */
export function RecommendedProjectsSection({
  recommendedProjects = [],
  isLoading = false,
  onSelectProject,
}) {
  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
          <Sparkles size={18} />
        </div>
        <h2 className="text-lg font-extrabold text-brand-dark tracking-tight">
          AI-Matched Recommendations
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
          Vector Ranked
        </span>
      </div>

      {/* Body Content: Skeleton / Grid / Empty Fallback */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-slate-100 rounded-card animate-pulse" />
          ))}
        </div>
      ) : recommendedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              isRecommended={true}
              matchRank={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-card text-xs text-slate-500 text-center font-medium">
          No personalized AI matches available right now. Update your profile bio and specialties to receive tailored recommendations!
        </div>
      )}
    </div>
  );
}