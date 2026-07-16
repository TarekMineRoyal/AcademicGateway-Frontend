import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { getStudentProfile, updateStudentProfile } from '../studentDashboardApi';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';
import SearchableCombobox from '../../../components/SearchableCombobox';

function StudentProfile() {
  // 1. Primitive Payload Form Fields (Matching PUT command properties)
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  // 2. Collection Tracking Identifiers (Arrays of backend GUID strings)
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  // 3. Lookup Configurations (Populated dynamically via parallel api resolution)
  const [majorsData, setMajorsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  // 4. Interface Workflow & Lifecycle Baseline Snapshot States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Backup snapshot storage state for frictionless rollback recovery on form cancellation
  const [initialProfileSnapshot, setInitialProfileSnapshot] = useState(null);

  // Load existing user record alongside system lookups simultaneously on component load
  useEffect(() => {
    async function fetchProfileAndLookups() {
      try {
        setLoading(true);
        const [profileRes, majorsRes, skillsRes] = await Promise.all([
          getStudentProfile(),
          getMajorsWithSpecialties(),
          getSkills()
        ]);

        // Seed system reference lookup blocks
        setMajorsData(majorsRes);
        setSkillsData(skillsRes);

        // Map initial value arrays extracting raw item GUID keys safely regardless of casing
        if (profileRes) {
          const fetchedName = profileRes.fullName || profileRes.FullName || '';
          const fetchedGradYear = profileRes.graduationYear || profileRes.GraduationYear || '';
          
          const majors = profileRes.majors || profileRes.Majors || [];
          const fetchedMajorIds = majors.map(m => m.id || m.Id);
          
          const specialties = profileRes.specialties || profileRes.Specialties || [];
          const fetchedSpecialtyIds = specialties.map(s => s.id || s.Id);
          
          const skills = profileRes.skills || profileRes.Skills || [];
          const fetchedSkillIds = skills.map(sk => sk.id || sk.Id);

          // Populate tracking workflow states
          setFullName(fetchedName);
          setGraduationYear(fetchedGradYear);
          setSelectedMajorIds(fetchedMajorIds);
          setSelectedSpecialtyIds(fetchedSpecialtyIds);
          setSelectedSkillIds(fetchedSkillIds);

          // Preserve baseline data snapshot for flawless rolling back changes
          setInitialProfileSnapshot({
            fullName: fetchedName,
            graduationYear: fetchedGradYear,
            majorIds: fetchedMajorIds,
            specialtyIds: fetchedSpecialtyIds,
            skillIds: fetchedSkillIds
          });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to populate core student profile identity structures.' });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndLookups();
  }, []);

  // Filter child sub-tracks to keep options limited to selected parent majors
  const availableSpecialties = majorsData
    .filter(major => selectedMajorIds.includes(major.id))
    .flatMap(major => major.specialties || []);

  // Custom handler to sync parent selections and scrub orphans dynamically
  const handleMajorsChange = (selectedObjects) => {
    const nextMajorIds = selectedObjects.map(o => o.id);
    setSelectedMajorIds(nextMajorIds);

    // Compute child specialties permitted under the newly adjusted major selections
    const dynamicSpecialties = majorsData
      .filter(major => nextMajorIds.includes(major.id))
      .flatMap(major => major.specialties || []);
    const dynamicSpecialtyIds = dynamicSpecialties.map(s => s.id);

    // Clear out any previously checked specialties that no longer match an active parent major selection
    setSelectedSpecialtyIds(prev => prev.filter(id => dynamicSpecialtyIds.includes(id)));
  };

  // Restores component state cleanly back to the loaded database configuration parameters
  const handleCancel = () => {
    if (initialProfileSnapshot) {
      setFullName(initialProfileSnapshot.fullName);
      setGraduationYear(initialProfileSnapshot.graduationYear);
      setSelectedMajorIds(initialProfileSnapshot.majorIds);
      setSelectedSpecialtyIds(initialProfileSnapshot.specialtyIds);
      setSelectedSkillIds(initialProfileSnapshot.skillIds);
    }
    setMessage({ type: '', text: '' });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    // Compiles the structural request payload matching the DTO constraints exactly
    const commandPayload = {
      fullName: fullName.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      majorIds: selectedMajorIds,
      specialtyIds: selectedSpecialtyIds,
      skillIds: selectedSkillIds,
    };

    try {
      await updateStudentProfile(commandPayload);
      
      // Update baseline database snapshot to lock in the saved data state values
      setInitialProfileSnapshot({
        fullName: commandPayload.fullName,
        graduationYear: commandPayload.graduationYear || '',
        majorIds: selectedMajorIds,
        specialtyIds: selectedSpecialtyIds,
        skillIds: selectedSkillIds
      });

      setMessage({ type: 'success', text: 'Academic profile sync successfully completed!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to persist command tracking updates.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-600 text-center py-16 font-semibold animate-pulse tracking-wide">
        Assembling database records...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-card border border-slate-200/60 shadow-sm">
      
      {/* Dynamic Status Action Feedback Banners */}
      {message.text && (
        <div className={
          message.type === 'success'
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm font-medium mb-6"
            : "bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm font-medium mb-6"
        }>
          {message.text}
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
                {fullName || 'Unspecified Identity'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Class of {graduationYear || 'N/A'}
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

          {/* Combobox Matrix Section 3: Specialties (Dependent Visibility Constraint) */}
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
              disabled={saving}
              className="bg-primary hover:bg-primary-hover text-white rounded-btn px-5 py-2 text-sm font-semibold shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-70"
            >
              {saving ? 'Syncing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudentProfile;