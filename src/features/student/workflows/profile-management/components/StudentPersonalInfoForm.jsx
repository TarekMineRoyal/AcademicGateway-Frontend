import PropTypes from 'prop-types';

const MAX_ABOUT_ME_LENGTH = 2000;

export default function StudentPersonalInfoForm({
  fullName,
  setFullName,
  graduationYear,
  setGraduationYear,
  aboutMe = '',
  setAboutMe,
}) {
  const currentAboutMe = aboutMe || '';

  const handleAboutMeChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_ABOUT_ME_LENGTH) {
      setAboutMe(val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Demographics Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Full Legal Name
          </label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
            className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Graduation Year
          </label>
          <input 
            type="number" 
            value={graduationYear} 
            onChange={(e) => setGraduationYear(e.target.value)} 
            placeholder="e.g. 2027"
            className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* About Me / Biography Textarea Input Field */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            About Me / Biography
          </label>
          <span className={`text-xs font-medium ${currentAboutMe.length > MAX_ABOUT_ME_LENGTH ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {currentAboutMe.length} / {MAX_ABOUT_ME_LENGTH}
          </span>
        </div>
        <textarea
          rows={4}
          value={currentAboutMe}
          onChange={handleAboutMeChange}
          placeholder="Tell us a little bit about yourself, your research interests, project goals, or work style..."
          className="w-full text-sm bg-white border border-slate-300 text-brand-dark rounded-lg px-3 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        />
      </div>
    </div>
  );
}

StudentPersonalInfoForm.propTypes = {
  fullName: PropTypes.string.isRequired,
  setFullName: PropTypes.func.isRequired,
  graduationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setGraduationYear: PropTypes.func.isRequired,
  aboutMe: PropTypes.string,
  setAboutMe: PropTypes.func.isRequired,
};