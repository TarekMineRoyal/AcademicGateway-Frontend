import { useStudentRegisterLookups } from '../hooks/useStudentRegisterLookups';
import StudentAcademicSection from './StudentAcademicSection';
import StudentSkillsSection from './StudentSkillsSection';
import StudentBioSection from './StudentBioSection';

/**
 * Layout orchestrator component for the Student Registration Form.
 * Composes domain sub-sections and delegates lookup management to useStudentRegisterLookups.
 */
function StudentRegisterForm({ formValues, onFieldChange }) {
  const {
    majorsData,
    loadingLookups,
    error,
    skillSearch,
    setSkillSearch,
    availableSpecialties,
    filteredSkills,
    selectedSkills
  } = useStudentRegisterLookups(formValues);

  // Universal toggle mapping handler updating collection states in parent
  const handleCollectionToggle = (field, id) => {
    const currentCollection = formValues[field] || [];
    if (currentCollection.includes(id)) {
      onFieldChange(
        field,
        currentCollection.filter((item) => item !== id)
      );
    } else {
      onFieldChange(field, [...currentCollection, id]);
    }
  };

  if (loadingLookups) {
    return (
      <div className="text-sm font-medium text-slate-500 animate-pulse py-4 text-center">
        Loading account initialization parameters...
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Student Academic Profile</h2>
        <p className="text-xs text-slate-400">
          Configure your academic specialization details, skill endorsements, and personal background.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 rounded text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Academic Profile Section */}
      <StudentAcademicSection
        formValues={formValues}
        onFieldChange={onFieldChange}
        onCollectionToggle={handleCollectionToggle}
        majorsData={majorsData}
        availableSpecialties={availableSpecialties}
      />

      {/* Core Skills & Competencies Section */}
      <StudentSkillsSection
        formValues={formValues}
        selectedSkills={selectedSkills}
        filteredSkills={filteredSkills}
        skillSearch={skillSearch}
        setSkillSearch={setSkillSearch}
        onCollectionToggle={handleCollectionToggle}
      />

      {/* Biography Section */}
      <StudentBioSection
        formValues={formValues}
        onFieldChange={onFieldChange}
      />
    </div>
  );
}

export default StudentRegisterForm;