/**
 * Presentational component for the Academic Profile section of the Student Registration Form.
 * Handles full name, graduation year, academic majors, and dependent specialties.
 */
function StudentAcademicSection({
  formValues = {},
  onFieldChange,
  onCollectionToggle,
  filteredMajors = [],
  majorSearch = '',
  setMajorSearch,
  availableSpecialties = [],
  filteredSpecialties = [],
  specialtySearch = '',
  setSpecialtySearch
}) {
  return (
    <div className="space-y-4">
      {/* Profile Details Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Full Display Name *
          </label>
          <input
            type="text"
            value={formValues.fullName || ''}
            onChange={(e) => onFieldChange('fullName', e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Graduation Target Year
          </label>
          <input
            type="number"
            value={formValues.graduationYear || ''}
            onChange={(e) => onFieldChange('graduationYear', e.target.value)}
            placeholder="e.g. 2027"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Academic Majors Selection Layout */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Select Your Academic Majors
        </label>

        {/* Search filter input for academic majors */}
        <input
          type="text"
          value={majorSearch}
          onChange={(e) => setMajorSearch(e.target.value)}
          placeholder="Type to filter academic majors..."
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-white mb-2"
        />

        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1.5 border border-slate-100 rounded-btn bg-slate-50/50">
          {filteredMajors.map((major) => {
            const isSelected = (formValues.majorIds || []).includes(major.id);
            return (
              <button
                type="button"
                key={major.id}
                onClick={() => onCollectionToggle('majorIds', major.id)}
                className={`text-xs font-semibold px-3 py-2 rounded-btn border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {major.name}
              </button>
            );
          })}
          {filteredMajors.length === 0 && (
            <div className="w-full text-center text-slate-400 py-3 text-xs italic">
              No matching academic majors found.
            </div>
          )}
        </div>
      </div>

      {/* Dependent Sub-Track Specialties Block */}
      {(formValues.majorIds || []).length > 0 && availableSpecialties.length > 0 && (
        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-card space-y-2 animate-slideDown">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
            Select Your Sub-Track Focus Areas
          </label>

          {/* Search filter input for sub-track focus areas */}
          <input
            type="text"
            value={specialtySearch}
            onChange={(e) => setSpecialtySearch(e.target.value)}
            placeholder="Type to filter sub-track focus areas..."
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-white mb-2"
          />

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1.5 border border-slate-100 rounded-btn bg-white">
            {filteredSpecialties.map((specialty) => {
              const isSelected = (formValues.specialtyIds || []).includes(specialty.id);
              return (
                <button
                  type="button"
                  key={specialty.id}
                  onClick={() => onCollectionToggle('specialtyIds', specialty.id)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-btn border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {specialty.name}
                </button>
              );
            })}
            {filteredSpecialties.length === 0 && (
              <div className="w-full text-center text-slate-400 py-3 text-xs italic">
                No matching focus areas found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAcademicSection;