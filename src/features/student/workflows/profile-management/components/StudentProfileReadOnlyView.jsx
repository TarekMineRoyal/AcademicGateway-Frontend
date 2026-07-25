import PropTypes from 'prop-types';
import ProfileTagGroup from '@/shared/components/TagGroup';
import StudentProfileHeader from './StudentProfileHeader';
import StudentBiography from './StudentBiography';
import { RecommendedSkillsGroup } from '@/features/skills';

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
      <StudentProfileHeader
        fullName={fullName}
        graduationYear={graduationYear}
        onEditClick={onEditClick}
      />

      <div className="space-y-6">
        <StudentBiography aboutMe={aboutMe} />

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
        <RecommendedSkillsGroup
          recommendedSkills={recommendedSkills}
          selectedSkillIds={selectedSkillIds}
          isLoading={isRecsSkillsLoading}
        />
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