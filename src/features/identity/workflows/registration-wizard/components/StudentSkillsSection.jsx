/**
 * Presentational component for the Core Skills & Competencies section of the Student Registration Form.
 */
function StudentSkillsSection({
  formValues = {},
  selectedSkills = [],
  filteredSkills = [],
  skillSearch = '',
  setSkillSearch,
  onCollectionToggle
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
        Core Skills & Competencies
      </label>

      {/* Render Selected Skills as modern Tailwind Text Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedSkills.map((skill) => (
          <span
            key={skill.id}
            onClick={() => onCollectionToggle('skillIds', skill.id)}
            className="inline-flex items-center bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-500 hover:line-through transition-all duration-150"
            title="Click to remove skill"
          >
            {skill.name}
            <span className="ml-1 text-[10px] font-black opacity-80">×</span>
          </span>
        ))}
        {selectedSkills.length === 0 && (
          <span className="text-xs text-slate-400 italic">
            No verified competencies selected yet.
          </span>
        )}
      </div>

      {/* Text Input to filter down or toggle skill options */}
      <input
        type="text"
        value={skillSearch}
        onChange={(e) => setSkillSearch(e.target.value)}
        placeholder="Type to filter core technology or platform skill tags..."
        className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-white mb-2"
      />

      <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/50 border border-slate-100 rounded-btn text-xs">
        {filteredSkills.map((skill) => {
          const isSelected = (formValues.skillIds || []).includes(skill.id);
          return (
            <label
              key={skill.id}
              className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/5 font-semibold text-primary' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onCollectionToggle('skillIds', skill.id)}
                className="h-3.5 w-3.5 text-primary focus:ring-primary border-slate-300 rounded"
              />
              <span className="truncate">{skill.name}</span>
            </label>
          );
        })}
        {filteredSkills.length === 0 && (
          <div className="col-span-2 text-center text-slate-400 py-3 italic">
            No matching skills found.
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentSkillsSection;