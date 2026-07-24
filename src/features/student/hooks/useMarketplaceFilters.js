import { useState, useCallback } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce';

/**
 * Custom hook to manage and encapsulate local filter and search states
 * for the Project Marketplace.
 */
export function useMarketplaceFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showUnverified, setShowUnverified] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Debounce search string to optimize server query dispatching
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update major selection and automatically reset specialty when major changes/clears
  const handleMajorChange = useCallback((newMajor) => {
    setSelectedMajor(newMajor);
    if (!newMajor || newMajor.id !== selectedMajor?.id) {
      setSelectedSpecialty(null);
    }
  }, [selectedMajor]);

  // Reset all active filter parameters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedMajor(null);
    setSelectedSpecialty(null);
    setSelectedSkills([]);
    setShowUnverified(false);
  }, []);

  const hasActiveFilters = Boolean(
    selectedMajor ||
    selectedSpecialty ||
    selectedSkills.length > 0 ||
    showUnverified
  );

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    selectedMajor,
    setSelectedMajor,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedSkills,
    setSelectedSkills,
    showUnverified,
    setShowUnverified,
    showFiltersPanel,
    setShowFiltersPanel,
    handleMajorChange,
    resetFilters,
    hasActiveFilters,
  };
}