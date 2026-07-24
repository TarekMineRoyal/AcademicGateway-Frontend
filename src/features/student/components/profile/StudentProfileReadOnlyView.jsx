import PropTypes from 'prop-types';
import { Edit3, Sparkles } from 'lucide-react';
import ProfileTagGroup from './ProfileTagGroup';

/**
 * Presentational component for the Read-Only summary view of a student profile.
 */
function StudentProfileReadOnlyView({
  fullName,
  graduationYear,
  aboutMe,
  selectedMajors = [],
  selectedSpecialties = [],
  selectedSkills = [],
  recommendedSkills = [],
  selectedSkillIds = [],
  isRecsSkillsLoading = false,
  onEditClick,
}) {
  return (
    <div className="space-y-6">
      {/* Header Action Row Layout Split */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight">
            {fullName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Class of {graduationYear}
          </p>
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-btn hover:bg-slate-50 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit3 size={15} />
          Edit Academic Profile
        </button>
      </div>

      {/* Non-Clickable Metadata Tags Presentation Block Tree */}
      <div className="space-y-6">
        {/* About Me / Biography Display */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            About Me / Biography
          </h3>
          {aboutMe ? (
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
              {aboutMe}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
              No biography provided yet.
            </p>
          )}
        </div>

        {/* Academic Majors */}
        <ProfileTagGroup
          title="Academic Majors"
          items={selectedMajors}
          emptyText="No academic majors configured."
          badgeClassName="bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/10"
        />

        {/* Sub-Track Focus Areas */}
        <ProfileTagGroup
          title="Sub-Track Focus Areas"
          items={selectedSpecialties}
          emptyText="No sub-track focus specialties selected."
          badgeClassName="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-100"
        />

        {/* Technical Core Competencies */}
        <ProfileTagGroup
          title="Technical Core Competencies"
          items={selectedSkills}
          emptyText="No technical core competencies declared."
          badgeClassName="bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/10"
        />

        {/* AI Recommended Skill Growth Block */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-indigo-600" />
            Recommended Skills for Growth
          </div>
          {isRecsSkillsLoading ? (
            <div className="text-xs text-slate-400 animate-pulse font-medium">
              Calculating adjacent skill growth recommendations...
            </div>
          ) : recommendedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.map((sk) => {
                const isAlreadyAdded = selectedSkillIds.includes(sk.id);
                return (
                  <span
                    key={sk.id}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                      isAlreadyAdded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50/70 text-indigo-800 border-indigo-200/80'
                    }`}
                  >
                    {sk.name}
                    {isAlreadyAdded && (
                      <span className="text-[10px] font-extrabold uppercase">
                        (Added)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Your skill profile is up to date!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

StudentProfileReadOnlyView.propTypes = {
  fullName: PropTypes.string.isRequired,
  graduationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aboutMe: PropTypes.string,
  selectedMajors: PropTypes.array,
  selectedSpecialties: PropTypes.array,
  selectedSkills: PropTypes.array,
  recommendedSkills: PropTypes.array,
  selectedSkillIds: PropTypes.array,
  isRecsSkillsLoading: PropTypes.bool,
  onEditClick: PropTypes.func.isRequired,
};

export default StudentProfileReadOnlyView;