import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { useProjectMarketplace } from "@/features/project-templates";
import { ProjectCard } from './ProjectCard';
import { MarketplaceFilterPanel } from './MarketplaceFilterPanel';
import { RecommendedProjectsSection } from '../../../../student/components/RecommendedProjectsSection';

/**
 * Orchestrator component for the Project Marketplace page.
 * Purely coordinates view state via useProjectMarketplace and composes sub-components.
 */
export default function ProjectMarketplace() {
  const navigate = useNavigate();

  const {
    // Filter State & Actions
    searchQuery,
    setSearchQuery,
    showFiltersPanel,
    setShowFiltersPanel,
    hasActiveFilters,
    majorsCatalog,
    selectedMajor,
    handleMajorChange,
    availableSpecialties,
    selectedSpecialty,
    setSelectedSpecialty,
    skillsCatalog,
    selectedSkills,
    setSelectedSkills,
    showUnverified,
    setShowUnverified,

    // AI Recommendations
    recommendedProjects,
    isRecsLoading,

    // Marketplace Catalog Items & State
    displayedTemplates,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,

    // Infinite Scroll
    loadMoreRef,
  } = useProjectMarketplace();

  const handleSelectProject = (projectId) => {
    navigate(`/dashboard/marketplace/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="text-slate-600 text-center py-16 font-semibold animate-pulse tracking-wide">
        Cataloging live industry templates and connecting academic registry data streams...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Context Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">
            Ecosystem Project Marketplace
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover and apply to verified capstone blueprints sponsored directly by authenticated enterprise partners.
          </p>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <RecommendedProjectsSection
        recommendedProjects={recommendedProjects}
        isLoading={isRecsLoading}
        onSelectProject={handleSelectProject}
      />

      {/* Filter Control Station */}
      <MarketplaceFilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFiltersPanel={showFiltersPanel}
        setShowFiltersPanel={setShowFiltersPanel}
        hasActiveFilters={hasActiveFilters}
        majorsCatalog={majorsCatalog}
        selectedMajor={selectedMajor}
        handleMajorChange={handleMajorChange}
        availableSpecialties={availableSpecialties}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        skillsCatalog={skillsCatalog}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        showUnverified={showUnverified}
        setShowUnverified={setShowUnverified}
      />

      {/* Error Message Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-btn font-semibold mb-8 text-sm">
          {error.message || 'Could not retrieve active placement listings from the global catalog.'}
        </div>
      )}

      {/* Core Grid Matrix Rendering */}
      {displayedTemplates.length === 0 ? (
        <div className="text-center py-16 px-8 border-2 border-dashed border-slate-200 rounded-card bg-white text-slate-400">
          <Inbox size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-semibold text-slate-600">
            No approved project blueprints match your active query framework.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedTemplates.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger Indicator Anchor Element */}
      <div
        ref={loadMoreRef}
        className="py-8 text-center text-sm text-slate-400 w-full flex items-center justify-center mt-6"
      >
        {isFetchingNextPage ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : hasNextPage ? (
          'Scroll down to fetch more templates'
        ) : displayedTemplates.length > 0 ? (
          'All available blueprints successfully indexed.'
        ) : null}
      </div>
    </div>
  );
}