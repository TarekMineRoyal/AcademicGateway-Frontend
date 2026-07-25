import PropTypes from 'prop-types';
import SearchableCombobox from '@/shared/components/SearchableCombobox';

/**
 * Form section component for configuring student academic majors and specialties.
 */
export default function StudentAcademicInfoForm({
  majorsData = [],
  selectedMajorIds = [],
  handleMajorsChange,
  availableSpecialties = [],
  selectedSpecialtyIds = [],
  setSelectedSpecialtyIds,
}) {
  return (
    <div className="space-y-6">
      {/* Combobox Matrix Section 2: Majors */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          Academic Majors
        </label>
        <SearchableCombobox
          placeholder="Type to search and append majors..."
          options={majorsData}
          selected={majorsData.filter((m) => selectedMajorIds.includes(m.id))}
          onChange={handleMajorsChange}
          isMulti={true}
        />
      </div>

      {/* Combobox Matrix Section 3: Specialties */}
      {selectedMajorIds.length > 0 && (
        <div className="animate-fadeIn">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Sub-Track Focus Areas
          </label>
          <SearchableCombobox
            placeholder="Type to search focus areas..."
            options={availableSpecialties}
            selected={availableSpecialties.filter((s) => selectedSpecialtyIds.includes(s.id))}
            onChange={(items) => setSelectedSpecialtyIds(items.map((i) => i.id))}
            isMulti={true}
          />
        </div>
      )}
    </div>
  );
}

StudentAcademicInfoForm.propTypes = {
  majorsData: PropTypes.array,
  selectedMajorIds: PropTypes.array,
  handleMajorsChange: PropTypes.func.isRequired,
  availableSpecialties: PropTypes.array,
  selectedSpecialtyIds: PropTypes.array,
  setSelectedSpecialtyIds: PropTypes.func.isRequired,
};