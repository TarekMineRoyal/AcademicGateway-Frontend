import { Search, SlidersHorizontal } from 'lucide-react';
import SearchableCombobox from '../../../../../shared/components/SearchableCombobox';

/**
 * Filter Control Station UI component for managing search inputs,
 * major/specialty dropdowns, skills filters, and verification toggles.
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Current search input string
 * @param {Function} props.setSearchQuery - Setter for search input
 * @param {boolean} props.showFiltersPanel - Whether the expandible filter panel is open
 * @param {Function} props.setShowFiltersPanel - Setter for filter panel visibility
 * @param {boolean} props.hasActiveFilters - Flag indicating whether any filter parameter is active
 * @param {Array} props.majorsCatalog - Full list of available majors
 * @param {Object|null} props.selectedMajor - Currently selected major
 * @param {Function} props.handleMajorChange - Major selection change handler
 * @param {Array} props.availableSpecialties - List of specialties derived from selected major
 * @param {Object|null} props.selectedSpecialty - Currently selected specialty
 * @param {Function} props.setSelectedSpecialty - Setter for specialty selection
 * @param {Array} props.skillsCatalog - Full list of available skills
 * @param {Array} props.selectedSkills - Currently selected skill objects
 * @param {Function} props.setSelectedSkills - Setter for skill selections
 * @param {boolean} props.showUnverified - Checkbox toggle state for unverified providers
 * @param {Function} props.setShowUnverified - Setter for unverified provider toggle
 */
export function MarketplaceFilterPanel({
  searchQuery,
  setSearchQuery,
  showFiltersPanel,
  setShowFiltersPanel,
  hasActiveFilters,
  majorsCatalog = [],
  selectedMajor,
  handleMajorChange,
  availableSpecialties = [],
  selectedSpecialty,
  setSelectedSpecialty,
  skillsCatalog = [],
  selectedSkills = [],
  setSelectedSkills,
  showUnverified,
  setShowUnverified,
}) {
  return (
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
            onChange={handleMajorChange}
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
  );
}