const MAX_ABOUT_ME_LENGTH = 2000;

/**
 * Presentational component for the About Me / Biography section of the Student Registration Form.
 */
function StudentBioSection({ formValues = {}, onFieldChange }) {
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
    <div className="border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-1.5">
          <label htmlFor="aboutMe" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            About Me / Biography <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          {/* Info Icon with CSS Tooltip */}
          <div className="relative group flex items-center">
            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center text-[10px] font-bold cursor-help">
              i
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-20 text-center pointer-events-none">
              This bio helps our AI Matchmaking Engine suggest projects and advisors tailored to your interests and career goals.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>

        {/* Optional Skip Action */}
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
        id="aboutMe"
        rows={4}
        value={aboutMeText}
        onChange={handleAboutMeChange}
        placeholder="Tell us a little bit about yourself, your research interests, project goals, or work style..."
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
  );
}

export default StudentBioSection;