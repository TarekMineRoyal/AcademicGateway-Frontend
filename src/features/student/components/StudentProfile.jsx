import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useUpdateStudentProfile } from '../hooks/useUpdateStudentProfile';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';
import SearchableCombobox from '../../../components/SearchableCombobox';

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

  // 2. Centralized Form Submission State Machine
  const updateProfileMutation = useUpdateStudentProfile(studentId);

  // 3. Isolated Local UI Interactive State Blocks
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const profile = dashboardData?.profile;

  // Track and synchronize local presentation state whenever the server cache updates
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setGraduationYear(profile.graduationYear);
      setSelectedMajorIds(profile.majors.map(m => m.id));
      setSelectedSpecialtyIds(profile.specialties.map(s => s.id));
      setSelectedSkillIds(profile.skills.map(sk => sk.id));
    }
  }, [profile]);

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
      setFullName(profile.fullName);
      setGraduationYear(profile.graduationYear);
      setSelectedMajorIds(profile.majors.map(m => m.id));
      setSelectedSpecialtyIds(profile.specialties.map(s => s.id));
      setSelectedSkillIds(profile.skills.map(sk => sk.id));
    }
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const commandPayload = {
      fullName: fullName.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
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

          {/* Combobox Matrix Section 2: Majors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Academic Majors
            </label>
            <SearchableCombobox
              placeholder="Type to search and append majors..."
              options={majorsData}
              selected={majorsData.filter(m => selectedMajorIds.includes(m.id))}
              onChange={handleMajorsChange}
              isMulti={true}
            />
          </div>

          {/* Combobox Matrix Section 3: Specialties */}
          {selectedMajorIds.length > 0 && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Sub-Track Focus Areas
              </label>
              <SearchableCombobox
                placeholder="Type to search focus areas..."
                options={availableSpecialties}
                selected={availableSpecialties.filter(s => selectedSpecialtyIds.includes(s.id))}
                onChange={(items) => setSelectedSpecialtyIds(items.map(i => i.id))}
                isMulti={true}
              />
            </div>
          )}

          {/* Combobox Matrix Section 4: Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Technical Core Competencies
            </label>
            <SearchableCombobox
              placeholder="Type to search system core competencies..."
              options={skillsData}
              selected={skillsData.filter(sk => selectedSkillIds.includes(sk.id))}
              onChange={(items) => setSelectedSkillIds(items.map(i => i.id))}
              isMulti={true}
            />
          </div>

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