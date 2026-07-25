import { useRef, useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMarketplaceFilters } from './useMarketplaceFilters';
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useRecommendedProjects } from "@/features/recommendations";
import { getMajorsWithSpecialties } from "@/features/curriculum";
import { getSkills } from "@/features/skills";
import { getApprovedTemplates } from "@/features/project-templates";

/**
 * Custom hook encapsulating server queries, catalog data lookups,
 * filter state management, and infinite scroll observation for the marketplace.
 */
export function useProjectMarketplace() {
  // 1. Filter State Management
  const filterState = useMarketplaceFilters();

  // 2. Catalog Lookup Queries
  const { data: majorsCatalog = [] } = useQuery({
    queryKey: ['majorsWithSpecialties'],
    queryFn: getMajorsWithSpecialties,
  });

  const { data: skillsCatalog = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  // 3. AI Recommendation Query
  const { 
    recommendedProjects = [], 
    isLoading: isRecsLoading 
  } = useRecommendedProjects(6);

  // 4. Query Parameter Memoization for Marketplace Fetching
  const queryFilters = useMemo(
    () => ({
      search: filterState.debouncedSearchQuery,
      majorId: filterState.selectedMajor?.id,
      specialtyId: filterState.selectedSpecialty?.id,
      skillIds: filterState.selectedSkills.map((s) => s.id),
      showUnverified: filterState.showUnverified,
    }),
    [
      filterState.debouncedSearchQuery,
      filterState.selectedMajor?.id,
      filterState.selectedSpecialty?.id,
      filterState.selectedSkills,
      filterState.showUnverified,
    ]
  );

  // 5. Paginated Marketplace Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['projectMarketplace', queryFilters],
    queryFn: async ({ pageParam = 1 }) => {
      return await getApprovedTemplates({
        ...queryFilters,
        pageNumber: pageParam,
        pageSize: 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
    placeholderData: (previousData) => previousData,
  });

  // 6. Infinite Scroll Intersection Observer Binding
  const loadMoreRef = useRef(null);

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: Boolean(hasNextPage && !isFetchingNextPage),
    observerOptions: { threshold: 1.0 },
  });

  // 7. Computed Data Transformations
  const displayedTemplates = useMemo(
    () => data?.pages.flatMap((page) => page?.items || []) || [],
    [data]
  );

  const availableSpecialties = useMemo(() => {
    if (!filterState.selectedMajor) return [];
    return (
      majorsCatalog.find((m) => m.id === filterState.selectedMajor.id)
        ?.specialties || []
    );
  }, [filterState.selectedMajor, majorsCatalog]);

  return {
    // Filter State & Setters
    ...filterState,

    // Catalogs & Dynamic Options
    majorsCatalog,
    skillsCatalog,
    availableSpecialties,

    // AI Recommendations
    recommendedProjects,
    isRecsLoading,

    // Marketplace Catalog Items & State
    displayedTemplates,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,

    // Infinite Scroll Ref Anchor
    loadMoreRef,
  };
}