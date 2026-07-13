import React, { useState, useEffect } from 'react';
import { getStudentProfile, updateStudentProfile } from '../studentDashboardApi';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';

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

  // 4. Interface Workflow States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
          setFullName(profileRes.fullName || profileRes.FullName || '');
          setGraduationYear(profileRes.graduationYear || profileRes.GraduationYear || '');
          
          const majors = profileRes.majors || profileRes.Majors || [];
          setSelectedMajorIds(majors.map(m => m.id || m.Id));
          
          const specialties = profileRes.specialties || profileRes.Specialties || [];
          setSelectedSpecialtyIds(specialties.map(s => s.id || s.Id));
          
          const skills = profileRes.skills || profileRes.Skills || [];
          setSelectedSkillIds(skills.map(sk => sk.id || sk.Id));
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to populate core student profile identity structures.' });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndLookups();
  }, []);

  // Multi-select tracking checklist utility for ID collection states
  const handleIdCollectionToggle = (id, currentCollection, setCollection) => {
    if (currentCollection.includes(id)) {
      setCollection(currentCollection.filter(item => item !== id));
    } else {
      setCollection([...currentCollection, id]);
    }
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
      setMessage({ type: 'success', text: 'Academic profile sync successfully completed!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to persist command tracking updates.' });
    } finally {
      setSaving(false);
    }
  };

  // Filter child sub-tracks to keep options limited to selected parent majors
  const availableSpecialties = majorsData
    .filter(major => selectedMajorIds.includes(major.id))
    .flatMap(major => major.specialties || []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#4a5568' }}>Assembling database records...</div>;
  }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>Manage Student Profile</h2>

      {message.text && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '6px', 
          fontSize: '0.9rem',
          fontWeight: '500',
          backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff5f5', 
          color: message.type === 'success' ? '#22543d' : '#c53030',
          border: message.type === 'success' ? '1px solid #c6f6d5' : '1px solid #fed7d7'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Row 1: Demographics */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.9rem' }}>Full Legal Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.9rem' }}>Graduation Year</label>
            <input 
              type="number" 
              value={graduationYear} 
              onChange={(e) => setGraduationYear(e.target.value)} 
              placeholder="e.g. 2027"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
            />
          </div>
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: '#edf2f7' }} />

        {/* Section 2: Majors Selector Checkboxes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#2d3748' }}>
            Academic Majors
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {majorsData.map((major) => (
              <label 
                key={major.id} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid #cbd5e0', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem',
                  backgroundColor: selectedMajorIds.includes(major.id) ? '#ebf8ff' : '#fff',
                  borderColor: selectedMajorIds.includes(major.id) ? '#3182ce' : '#cbd5e0'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedMajorIds.includes(major.id)} 
                  onChange={() => handleIdCollectionToggle(major.id, selectedMajorIds, setSelectedMajorIds)} 
                  style={{ marginRight: '0.5rem' }} 
                />
                {major.name}
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Specialty Track Checkboxes (Dependent layout branch) */}
        {selectedMajorIds.length > 0 && availableSpecialties.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#2d3748' }}>
              Sub-Track Focus Areas
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSpecialties.map((specialty) => (
                <label 
                  key={specialty.id} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    border: '1px solid #cbd5e0', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '0.9rem',
                    backgroundColor: selectedSpecialtyIds.includes(specialty.id) ? '#f0fff4' : '#fff',
                    borderColor: selectedSpecialtyIds.includes(specialty.id) ? '#38a169' : '#cbd5e0'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedSpecialtyIds.includes(specialty.id)} 
                    onChange={() => handleIdCollectionToggle(specialty.id, selectedSpecialtyIds, setSelectedSpecialtyIds)} 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  {specialty.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <hr style={{ margin: '1.5rem 0', borderColor: '#edf2f7' }} />

        {/* Section 4: Verified Technical Capabilities Checkboxes */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#2d3748' }}>
            Technical Core Competencies
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {skillsData.map((skill) => (
              <label 
                key={skill.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  border: '1px solid #edf2f7', 
                  borderRadius: '4px',
                  backgroundColor: selectedSkillIds.includes(skill.id) ? '#f7fafc' : 'transparent',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedSkillIds.includes(skill.id)} 
                  onChange={() => handleIdCollectionToggle(skill.id, selectedSkillIds, setSelectedSkillIds)} 
                  style={{ marginRight: '0.6rem' }} 
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        {/* Form Action Segment */}
        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: '#3182ce', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '700', 
            fontSize: '1rem',
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'Syncing with Registry...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}

export default StudentProfile;