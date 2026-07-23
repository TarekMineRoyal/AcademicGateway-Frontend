import { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import useKeyDown from '../hooks/useKeyDown';
import ComboboxBadge from './ComboboxBadge';

/**
 * SearchableCombobox Component
 * A reusable, accessible multi-select or single-select combobox dropdown 
 * built with Tailwind CSS utility tokens. Safely handles both raw arrays and PaginatedResult objects.
 */
function SearchableCombobox({ placeholder, options = [], selected, onChange, isMulti = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Safely normalize options to support both raw arrays and PaginatedResult<T> objects
  const optionList = Array.isArray(options) ? options : (options?.items || []);

  // Handle clicking outside of the dropdown container
  useOnClickOutside(containerRef, () => {
    setIsOpen(false);
    setSearchQuery('');
  });

  // Handle pressing Escape key to close dropdown menu
  useKeyDown('Escape', () => {
    if (isOpen) {
      setIsOpen(false);
      setSearchQuery('');
    }
  });

  // Filter options down dynamically according to typing input (checking name or fullName)
  const filteredOptions = optionList.filter(option => {
    const label = option.name || option.fullName || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOptionLabel = (option) => option?.name || option?.fullName || '';

  const handleSelectOption = (option) => {
    if (isMulti) {
      const currentSelected = selected || [];
      const isAlreadySelected = currentSelected.some(item => item.id === option.id);
      if (isAlreadySelected) {
        onChange(currentSelected.filter(item => item.id !== option.id));
      } else {
        onChange([...currentSelected, option]);
      }
    } else {
      if (selected?.id === option.id) {
        onChange(null);
      } else {
        onChange(option);
      }
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleDismissBadge = (e, option) => {
    e.stopPropagation();
    if (isMulti) {
      const currentSelected = selected || [];
      onChange(currentSelected.filter(item => item.id !== option.id));
    } else {
      onChange(null);
    }
  };

  const hasSelections = isMulti ? (selected && selected.length > 0) : selected !== null;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[240px]">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex flex-wrap items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-2 min-h-[44px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 cursor-pointer"
      >
        {isMulti ? (
          (selected || []).map(item => (
            <ComboboxBadge
              key={item.id}
              label={getOptionLabel(item)}
              onRemove={(e) => handleDismissBadge(e, item)}
            />
          ))
        ) : (
          selected && (
            <ComboboxBadge
              label={getOptionLabel(selected)}
              onRemove={(e) => handleDismissBadge(e, selected)}
            />
          )
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={hasSelections ? "" : placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm text-brand-dark min-w-[80px] cursor-text"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-30 mt-1 max-h-60 overflow-y-auto w-full bg-white rounded-md shadow-lg border border-slate-200/80 p-1">
          {filteredOptions.length === 0 ? (
            <div className="text-xs text-slate-400 p-2.5 text-center">No options match your query</div>
          ) : (
            filteredOptions.map(option => {
              const isChecked = isMulti 
                ? (selected || []).some(item => item.id === option.id)
                : selected?.id === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`text-sm p-2 rounded-md cursor-pointer transition-colors ${
                    isChecked 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {getOptionLabel(option)}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableCombobox;