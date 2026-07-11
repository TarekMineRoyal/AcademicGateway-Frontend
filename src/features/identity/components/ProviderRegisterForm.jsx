import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

function ProviderRegisterForm() {
  const navigate = useNavigate();

  // Core fields matching RegisterProviderCommand.cs properties
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

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
      companyName,
      companyDescription,
      // Pass null if the string is empty to respect the nullable string? configuration
      websiteUrl: websiteUrl.trim() || null, 
    };

    try {
      // Dispatches directly to your CQRS Provider Post handler route
      await apiClient.post('/providers/register', commandPayload);
      
      // On successful aggregate baseline initialization, drop back to login
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during researcher profile registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <h2>Researcher & Sponsor Registration</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Register your organization or lab unit to propose and sponsor real-world academic projects.
      </p>

      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Lab/Company Details */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Institution / Company Name</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Quantum Computing Lab A" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Operational Focus & Lab Description</label>
          <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder="Describe your operational background, capability statements, and core industry focus areas..." required rows={4} style={{ width: '100%', padding: '0.5rem', resize: 'vertical', fontFamily: 'inherit' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Portal Website URL (Optional)</label>
          <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com/lab" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

        {/* Security Access Credentials */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Primary Institutional Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.75rem', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isSubmitting ? 'Submitting Corporate Profile...' : 'Register Corporate Provider'}
        </button>
      </form>
    </div>
  );
}

export default ProviderRegisterForm;