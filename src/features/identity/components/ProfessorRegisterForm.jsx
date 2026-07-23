
const MAX_ABOUT_ME_LENGTH = 2000;

function ProfessorRegisterForm({ formValues, onFieldChange }) {
  const aboutMeText = formValues.aboutMe || '';
  const isOverLimit = aboutMeText.length > MAX_ABOUT_ME_LENGTH;

  const handleAboutMeChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_ABOUT_ME_LENGTH) {
      onFieldChange('aboutMe', val);
    }
  };

  const handleSkipAboutMe = () => {
    onFieldChange('aboutMe', '');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Structural Subsection Header */}
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Faculty Mentor Profile</h2>
        <p className="text-xs text-slate-400">
          Provision your institutional identity credentials to oversee student capstone projects.
        </p>
      </div>

      {/* Full Name Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Full Name & Academic Title *
        </label>
        <input
          type="text"
          value={formValues.fullName || ''}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          placeholder="e.g., Dr. Sarah Jenkins"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>

      {/* Institutional Department Input Block */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Faculty / Institutional Branch Name *
        </label>
        <input
          type="text"
          value={formValues.academicDepartment || ''}
          onChange={(e) => onFieldChange('academicDepartment', e.target.value)}
          placeholder="e.g., Department of Computer Science"
          className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
          required
        />
      </div>

      {/* Grid Configuration for Rank and Allocation Limits */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Academic Rank Title *
          </label>
          <input
            type="text"
            value={formValues.rank || ''}
            onChange={(e) => onFieldChange('rank', e.target.value)}
            placeholder="e.g., Associate Professor"
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Max Capacity *
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formValues.maxSupervisionCapacity || ''}
            onChange={(e) => onFieldChange('maxSupervisionCapacity', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-btn focus:outline-none focus:border-primary text-sm bg-slate-50/50 font-semibold text-slate-800"
            required
          />
        </div>
      </div>

      {/* About Me / Biography Section */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              About Me / Biography <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            {/* Info Icon with CSS Tooltip */}
            <div className="relative group flex items-center">
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center text-[10px] font-bold cursor-help">
                i
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-20 text-center pointer-events-none">
                This bio helps our AI Matchmaking Engine suggest suitable student projects and advisor matchings tailored to your research focus.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>

          {/* Optional Skip / Clear Action */}
          {aboutMeText && (
            <button
              type="button"
              onClick={handleSkipAboutMe}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Skip / Clear
            </button>
          )}
        </div>

        <textarea
          rows={4}
          value={aboutMeText}
          onChange={handleAboutMeChange}
          placeholder="Tell us about your research background, lab capabilities, publication topics, or advising philosophy..."
          className={`w-full px-3 py-2 border rounded-btn focus:outline-none text-sm bg-slate-50/50 transition-colors ${
            isOverLimit ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-primary'
          }`}
        />

        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] text-slate-400 italic">
            You can also edit this anytime from your profile settings.
          </span>
          <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {aboutMeText.length} / {MAX_ABOUT_ME_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfessorRegisterForm;