import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

function ProfessorRegisterForm() {
  const navigate = useNavigate();

  // Core fields matching RegisterProfessorCommand.cs properties
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [academicDepartment, setAcademicDepartment] = useState('');
  const [rank, setRank] = useState('');
  const [maxSupervisionCapacity, setMaxSupervisionCapacity] = useState(3); // Default baseline fallback

  // Operational UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Formulates the structured payload matching the backend command exactly
    const commandPayload = {
      email,
      username,
      password,
      fullName,
      academicDepartment,
      rank,
      maxSupervisionCapacity: parseInt(maxSupervisionCapacity, 10),
    };

    try {
      // Dispatches directly to your CQRS Professor Post handler route
      await apiClient.post('/professors/register', commandPayload);
      
      // On successful identity mapping, bounce back to unified login
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during faculty registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <h2>Faculty Mentor Registration</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Provision your institutional identity credentials to oversee student capstone projects.
      </p>

      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Profile Details */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Full Legal Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Corporate / Academic Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        {/* Security Credentials */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

        {/* Institutional Assignments */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Academic Department</label>
          <input type="text" value={academicDepartment} onChange={(e) => setAcademicDepartment(e.target.value)} placeholder="e.g., Computer Science" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Academic Rank Title</label>
            <input type="text" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="e.g., Associate Professor" required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Max Capacity</label>
            <input type="number" min="1" max="20" value={maxSupervisionCapacity} onChange={(e) => setMaxSupervisionCapacity(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.75rem', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isSubmitting ? 'Provisions Faculty Identity...' : 'Register Faculty Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfessorRegisterForm;