import StudentPersonalInfoForm from './profile/StudentPersonalInfoForm';
import StudentAcademicInfoForm from './profile/StudentAcademicInfoForm';
import StudentSkillsSection from './profile/StudentSkillsSection';
import StudentProfileReadOnlyView from './profile/StudentProfileReadOnlyView';
import { useStudentProfileForm } from '../hooks/useStudentProfileForm';

function StudentProfile() {
  const {
    isLoading,
    updateProfileMutation,
    fullName,
    setFullName,
    graduationYear,
    setGraduationYear,
    aboutMe,
    setAboutMe,
    isEditing,
    setIsEditing,
    majorsData,
    skillsData,
    recommendedSkills,
    selectedMajorIds,
    selectedSpecialtyIds,
    setSelectedSpecialtyIds,
    selectedSkillIds,
    setSelectedSkillIds,
    selectedMajors,
    selectedSpecialties,
    selectedSkills,
    availableSpecialties,
    isRecsSkillsLoading,
    handleMajorsChange,
    handleCancel,
    handleSubmit,
  } = useStudentProfileForm();

  if (isLoading) {
    return (
      <div className="text-slate-600 text-center py-16 font-semibold animate-pulse tracking-wide">
        Assembling database records...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-card border border-slate-200/60 shadow-sm">
      {/* Dynamic Mutation Status Action Feedback Banners */}
      {updateProfileMutation.isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm font-medium mb-6">
          Academic profile sync successfully completed!
        </div>
      )}

      {updateProfileMutation.isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm font-medium mb-6">
          Submission failed: {updateProfileMutation.error.message}
        </div>
      )}

      {!isEditing ? (
        <StudentProfileReadOnlyView
          fullName={fullName}
          graduationYear={graduationYear}
          aboutMe={aboutMe}
          selectedMajors={selectedMajors}
          selectedSpecialties={selectedSpecialties}
          selectedSkills={selectedSkills}
          recommendedSkills={recommendedSkills}
          selectedSkillIds={selectedSkillIds}
          isRecsSkillsLoading={isRecsSkillsLoading}
          onEditClick={() => setIsEditing(true)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-xl font-bold text-brand-dark">Update Academic Workspace</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Modify profile attributes and multi-select filters using searchable lookups.
            </p>
          </div>

          <StudentPersonalInfoForm
            fullName={fullName}
            setFullName={setFullName}
            graduationYear={graduationYear}
            setGraduationYear={setGraduationYear}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
          />

          <StudentAcademicInfoForm
            majorsData={majorsData}
            selectedMajorIds={selectedMajorIds}
            handleMajorsChange={handleMajorsChange}
            availableSpecialties={availableSpecialties}
            selectedSpecialtyIds={selectedSpecialtyIds}
            setSelectedSpecialtyIds={setSelectedSpecialtyIds}
          />

          <StudentSkillsSection
            skillsData={skillsData}
            selectedSkillIds={selectedSkillIds}
            setSelectedSkillIds={setSelectedSkillIds}
            recommendedSkills={recommendedSkills}
          />

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-btn px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-primary hover:bg-primary-hover text-white rounded-btn px-5 py-2 text-sm font-semibold shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-70"
            >
              {updateProfileMutation.isPending ? 'Syncing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudentProfile;