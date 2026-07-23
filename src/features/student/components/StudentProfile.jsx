import { useState } from 'react';
import { Edit3, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContextCore';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useUpdateStudentProfile } from '../hooks/useUpdateStudentProfile';
import { useRecommendedSkills } from '../../recommendations';
import { getMajorsWithSpecialties } from '../../curriculum';
import { getSkills } from '../../skills';

// Extracted Presentational Sub-Components
import StudentPersonalInfoForm from './profile/StudentPersonalInfoForm';
import StudentAcademicInfoForm from './profile/StudentAcademicInfoForm';
import StudentSkillsSection from './profile/StudentSkillsSection';

function StudentProfile() {
  const { user } = useAuth();
  const studentId = user.id;

  // 1. Declarative Server-State Hydration Layer
  const { dashboardData, isLoading: dashboardLoading } = useStudentDashboard(studentId);
  
  const { data: majorsData = [], isLoading: majorsLoading } = useQuery({
    queryKey: ['majorsWithSpecialties'],
    queryFn: getMajorsWithSpecialties,
  });

  const { data: skillsData = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  // AI Vector Recommendation Engine Integration for Skill Growth
  const { 
    recommendedSkills = [], 
    isLoading: isRecsSkillsLoading 
  } = useRecommendedSkills(10);

  // 2. Centralized Form Submission State Machine
  const updateProfileMutation = useUpdateStudentProfile(studentId);

  // 3. Isolated Local UI Interactive State Blocks
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [prevProfile, setPrevProfile] = useState(null);

  const profile = dashboardData?.profile;

  // Synchronize local state during render whenever server cache updates
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setFullName(profile.fullName || '');
    setGraduationYear(profile.graduationYear || '');
    setAboutMe(profile.aboutMe || '');
    setSelectedMajorIds(profile.majors?.map(m => m.id) || []);
    setSelectedSpecialtyIds(profile.specialties?.map(s => s.id) || []);
    setSelectedSkillIds(profile.skills?.map(sk => sk.id) || []);
  }

  // Compute allowed child tracks dynamically according to active parent nodes exclusively
  const availableSpecialties = majorsData
    .filter(major => selectedMajorIds.includes(major.id))
    .flatMap(major => major.specialties);

  // Custom handler to sync parent selections and scrub orphans dynamically
  const handleMajorsChange = (selectedObjects) => {
    const nextMajorIds = selectedObjects.map(o => o.id);
    setSelectedMajorIds(nextMajorIds);

    const dynamicSpecialties = majorsData
      .filter(major => nextMajorIds.includes(major.id))
      .flatMap(major => major.specialties);
    const dynamicSpecialtyIds = dynamicSpecialties.map(s => s.id);

    setSelectedSpecialtyIds(prev => prev.filter(id => dynamicSpecialtyIds.includes(id)));
  };

  // Restores component fields cleanly back to the active query cache record parameters
  const handleCancel = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setGraduationYear(profile.graduationYear || '');
      setAboutMe(profile.aboutMe || '');
      setSelectedMajorIds(profile.majors?.map(m => m.id) || []);
      setSelectedSpecialtyIds(profile.specialties?.map(s => s.id) || []);
      setSelectedSkillIds(profile.skills?.map(sk => sk.id) || []);
    }
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const commandPayload = {
      fullName: fullName.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      aboutMe: aboutMe.trim() || null,
      majorIds: selectedMajorIds,
      specialtyIds: selectedSpecialtyIds,
      skillIds: selectedSkillIds,
    };

    updateProfileMutation.mutate(commandPayload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (dashboardLoading || majorsLoading || skillsLoading) {
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

      {/* ==================================================== */}
      {/* PHASE 1: PREMIUM READ-ONLY SUMMARY (DEFAULT LAYER)  */}
      {/* ==================================================== */}
      {!isEditing ? (
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
              onClick={() => setIsEditing(true)}
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

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Academic Majors
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMajorIds.length === 0 ? (
                  <span className="text-sm text-slate-400 italic">No academic majors configured.</span>
                ) : (
                  majorsData
                    .filter(major => selectedMajorIds.includes(major.id))
                    .map(major => (
                      <span key={major.id} className="bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/10">
                        {major.name}
                      </span>
                    ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Sub-Track Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSpecialtyIds.length === 0 ? (
                  <span className="text-sm text-slate-400 italic">No sub-track focus specialties selected.</span>
                ) : (
                  availableSpecialties
                    .filter(specialty => selectedSpecialtyIds.includes(specialty.id))
                    .map(specialty => (
                      <span key={specialty.id} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-100">
                        {specialty.name}
                      </span>
                    ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Technical Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkillIds.length === 0 ? (
                  <span className="text-sm text-slate-400 italic">No technical core competencies declared.</span>
                ) : (
                  skillsData
                    .filter(skill => selectedSkillIds.includes(skill.id))
                    .map(skill => (
                      <span key={skill.id} className="bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/10">
                        {skill.name}
                      </span>
                    ))
                )}
              </div>
            </div>

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
                        {isAlreadyAdded && <span className="text-[10px] font-extrabold uppercase">(Added)</span>}
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
      ) : (
        // ====================================================
        // PHASE 2: ACTIVE WORKSPACE PANEL SEARCHABLE EDIT VIEW
        // ====================================================
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-xl font-bold text-brand-dark">Update Academic Workspace</h2>
            <p className="text-slate-500 text-xs mt-0.5">Modify profile attributes and multi-select filters using searchable lookups.</p>
          </div>

          {/* Sub-Component 1: Personal Info & Bio */}
          <StudentPersonalInfoForm
            fullName={fullName}
            setFullName={setFullName}
            graduationYear={graduationYear}
            setGraduationYear={setGraduationYear}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
          />

          {/* Sub-Component 2: Academic Majors & Specialties */}
          <StudentAcademicInfoForm
            majorsData={majorsData}
            selectedMajorIds={selectedMajorIds}
            handleMajorsChange={handleMajorsChange}
            availableSpecialties={availableSpecialties}
            selectedSpecialtyIds={selectedSpecialtyIds}
            setSelectedSpecialtyIds={setSelectedSpecialtyIds}
          />

          {/* Sub-Component 3: Technical Skills & AI Suggestions */}
          <StudentSkillsSection
            skillsData={skillsData}
            selectedSkillIds={selectedSkillIds}
            setSelectedSkillIds={setSelectedSkillIds}
            recommendedSkills={recommendedSkills}
          />

          {/* Form Command Action Segments Footer Bar */}
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