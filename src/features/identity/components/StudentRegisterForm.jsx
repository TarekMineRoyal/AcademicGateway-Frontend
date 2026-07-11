import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';

function StudentRegisterForm() {
  const navigate = useNavigate();

  // 1. Core Identity & Profile Fields matching RegisterStudentCommand.cs
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  // 2. Collection Tracking Identifiers (Arrays of GUID strings)
  const [selectedMajorIds, setSelectedMajorIds] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  // 3. Lookup Data States (Populated by backend Queries)
  const [majorsData, setMajorsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  
  // 4. UI Operational States
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch data on mount matching GetMajorsWithSpecialtiesQuery and GetSkills
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [majors, skills] = await Promise.all([
          getMajorsWithSpecialties(),
          getSkills()
        ]);
        setMajorsData(majors);
        setSkillsData(skills);
      } catch (err) {
        setError('Failed to load curriculum configuration or technical competency lookups.');
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookupData();
  }, []);

  // Multi-select tracking utility for collections
  const handleIdCollectionToggle = (id, currentCollection, setCollection) => {
    if (currentCollection.includes(id)) {
      setCollection(currentCollection.filter(item => item !== id));
    } else {
      setCollection([...currentCollection, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Build the structural payload matching RegisterStudentCommand properties
    const commandPayload = {
      email,
      username,
      password,
      fullName,
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
      majorIds: selectedMajorIds,
      specialtyIds: selectedSpecialtyIds,
      skillIds: selectedSkillIds,
    };

    try {
      // Dispatches directly to your CQRS Post handler routing address
      await apiClient.post('/students/register', commandPayload);
      
      // On success, redirect to the login screen so they can authenticate
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during student registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out sub-specialties to only show options belonging to checked parent majors
  const availableSpecialties = majorsData
    .filter(major => selectedMajorIds.includes(major.id))
    .flatMap(major => major.specialties);

  if (loadingLookups) return <div>Loading account initialization parameters...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <h2>Student Account Enrolment</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Baseline Profile Identity Credentials */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Full Display Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Graduation Target Year (Optional)</label>
            <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="e.g. 2027" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Institutional Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Requested Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Security Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

        {/* Academic Majors Segment (MajorDto data) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Your Academic Majors</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {majorsData.map((major) => (
              <label key={major.id} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: selectedMajorIds.includes(major.id) ? '#e6f7ff' : '#fff' }}>
                <input type="checkbox" checked={selectedMajorIds.includes(major.id)} onChange={() => handleIdCollectionToggle(major.id, selectedMajorIds, setSelectedMajorIds)} style={{ marginRight: '0.5rem' }} />
                {major.name}
              </label>
            ))}
          </div>
        </div>

        {/* Dependent Fine-Grained Sub-Track Specialties Segment */}
        {selectedMajorIds.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Your Sub-Track Focus Areas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSpecialties.map((specialty) => (
                <label key={specialty.id} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: selectedSpecialtyIds.includes(specialty.id) ? '#f6ffed' : '#fff' }}>
                  <input type="checkbox" checked={selectedSpecialtyIds.includes(specialty.id)} onChange={() => handleIdCollectionToggle(specialty.id, selectedSpecialtyIds, setSelectedSpecialtyIds)} style={{ marginRight: '0.5rem' }} />
                  {specialty.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

        {/* Technical Capability Assets Checklist Segment (SkillDto data) */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Claim Verified Core Technical Competencies</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {skillsData.map((skill) => (
              <label key={skill.id} style={{ display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
                <input type="checkbox" checked={selectedSkillIds.includes(skill.id)} onChange={() => handleIdCollectionToggle(skill.id, selectedSkillIds, setSelectedSkillIds)} style={{ marginRight: '0.5rem' }} />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.75rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isSubmitting ? 'Provisions Baseline Credentials...' : 'Submit Student Registration'}
        </button>
      </form>
    </div>
  );
}

export default StudentRegisterForm;