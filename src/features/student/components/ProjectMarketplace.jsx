import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectMarketplace } from '../hooks/useProjectMarketplace';
import { useRecommendedProjects } from '../../recommendations/hooks/useRecommendedProjects';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';
import { Search, Building2, Code, ArrowUpRight, Inbox, SlidersHorizontal, GraduationCap, Sparkles } from 'lucide-react';
import SearchableCombobox from '../../../shared/components/SearchableCombobox';

export default function ProjectMarketplace() {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  // 1. Local UI State reserved strictly for non-persisted interactive parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showUnverified, setShowUnverified] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Reset specialty focus if the parent major selection is cleared
  useEffect(() => {
    if (!selectedMajor) {
      setSelectedSpecialty(null);
    }
  }, [selectedMajor]);

  // 2. Declarative Lookup Data Fetching
  const { data: majorsCatalog = [] } = useQuery({
    queryKey: ['majorsWithSpecialties'],
    queryFn: getMajorsWithSpecialties,
  });

  const { data: skillsCatalog = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  // 3. AI Vector Recommendation Engine Integration
  const { 
    recommendedProjects = [], 
    isLoading: isRecsLoading 
  } = useRecommendedProjects(6);

  // 4. Primary Server-State Consumption Layer with Unified Filters & Infinite Scroll Channels
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    error 
  } = useProjectMarketplace({
    search: searchQuery,
    majorId: selectedMajor?.id,
    specialtyId: selectedSpecialty?.id,
    skillIds: selectedSkills.map(s => s.id),
    showUnverified
  });

  // Native intersection observer binding for endless scrolling automation
  useEffect(() => {
    const observerElement = loadMoreRef.current;
    if (!observerElement || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerElement);
    return () => {
      if (observerElement) observer.unobserve(observerElement);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Dynamic dropdown dependency generation
  const availableSpecialties = selectedMajor
    ? majorsCatalog.find(m => m.id === selectedMajor.id)?.specialties || []
    : [];

  // Visual status evaluations
  const hasActiveFilters = selectedMajor || selectedSpecialty || selectedSkills.length > 0 || showUnverified;
  
  // Unpack items array from each paginated result object in pages
  const displayedTemplates = data?.pages.flatMap((page) => page?.items || []) || [];

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
      <div className="mb-10">
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

        {isRecsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-slate-100 rounded-card animate-pulse" />
            ))}
          </div>
        ) : recommendedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedProjects.map((project, index) => (
              <div 
                key={project.id}
                className="flex flex-col justify-between p-6 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 border border-indigo-200/80 rounded-card shadow-sm hover:border-indigo-400 hover:shadow-md transition-all duration-200 relative overflow-hidden"
              >
                {/* Top Rank Badge */}
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                  #{index + 1} Match
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Building2 size={14} className="text-indigo-500" />
                    {project.providerCompanyName}
                  </div>

                  <h3 className="text-base font-bold text-brand-dark mb-2 line-clamp-1 pr-14">
                    {project.title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-slate-600 mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Academic Alignment Tags */}
                  {(project.majorName || project.specialtyName) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <GraduationCap size={12} /> Academic Alignment
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.majorName && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2 py-0.5 rounded">
                            {project.majorName}
                          </span>
                        )}
                        {project.specialtyName && (
                          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 font-semibold px-2 py-0.5 rounded">
                            {project.specialtyName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills / Capabilities */}
                  {project.skills && project.skills.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Code size={12} /> Target Capabilities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.map((sk) => (
                          <span 
                            key={sk.id} 
                            className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/dashboard/marketplace/${project.id}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                  >
                    View Project Blueprint
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-card text-xs text-slate-500 text-center font-medium">
            No personalized AI matches available right now. Update your profile bio and specialties to receive tailored recommendations!
          </div>
        )}
      </div>

      {/* Filter Control Station */}
      <div className="space-y-4 mb-8 bg-white p-5 rounded-card border border-slate-200/60 shadow-sm">
        {/* Top Row: Primary Keyword Input + Filter Toggle Trigger */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by tech stack, project title, or corporate sponsor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm text-brand-dark placeholder-slate-400 bg-transparent outline-none rounded-lg"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-btn border transition-all duration-200 cursor-pointer ${
              showFiltersPanel || hasActiveFilters
                ? 'bg-primary/5 text-primary border-primary/30'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Bottom Row: Adaptive Flex Registry Filters */}
        {showFiltersPanel && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 pt-3 border-t border-slate-100">
            <SearchableCombobox
              placeholder="Search & Select Major"
              options={majorsCatalog}
              selected={selectedMajor}
              onChange={setSelectedMajor}
              isMulti={false}
            />

            {selectedMajor && (
              <SearchableCombobox
                placeholder="Search & Select Specialty"
                options={availableSpecialties}
                selected={selectedSpecialty}
                onChange={setSelectedSpecialty}
                isMulti={false}
              />
            )}

            <SearchableCombobox
              placeholder="Filter Required Skills"
              options={skillsCatalog}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              isMulti={true}
            />

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showUnverified}
                onChange={(e) => setShowUnverified(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              Show Unverified Providers' Projects
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-btn font-semibold mb-8 text-sm">
          {error.message || 'Could not retrieve active placement listings from the global catalog.'}
        </div>
      )}

      {/* Core Grid Matrix Rendering */}
      {displayedTemplates.length === 0 ? (
        <div className="text-center py-16 px-8 border-2 border-dashed border-slate-200 rounded-card bg-white text-slate-400">
          <Inbox size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-semibold text-slate-600">No approved project blueprints match your active query framework.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedTemplates.map((project) => {
            const isVerifiedProvider = project.isProviderVerified !== false;

            return (
              <div 
                key={project.id} 
                className={`flex flex-col justify-between p-6 rounded-card shadow-sm transition-all duration-200 ${
                  isVerifiedProvider
                    ? 'bg-white border border-slate-200 hover:border-primary hover:shadow-md'
                    : 'bg-slate-50/50 border border-dashed border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <Building2 size={14} className="text-slate-400" />
                      {project.providerCompanyName}
                    </div>
                    
                    {!isVerifiedProvider && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                        Unverified Provider
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-brand-dark mb-2 line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-slate-600 mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Academic Alignment Tags */}
                  {(project.majorName || project.specialtyName) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <GraduationCap size={12} /> Academic Alignment
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.majorName && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2 py-0.5 rounded">
                            {project.majorName}
                          </span>
                        )}
                        {project.specialtyName && (
                          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 font-semibold px-2 py-0.5 rounded">
                            {project.specialtyName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills / Capabilities */}
                  {project.skills && project.skills.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Code size={12} /> Target Capabilities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.map((sk) => (
                          <span 
                            key={sk.id} 
                            className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/dashboard/marketplace/${project.id}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                  >
                    View Project Blueprint
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Trigger Indicator Anchor Element */}
      <div ref={loadMoreRef} className="py-8 text-center text-sm text-slate-400 w-full flex items-center justify-center mt-6">
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