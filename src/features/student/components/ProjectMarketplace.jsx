import React, { useEffect, useState } from 'react';
import { getApprovedTemplates } from '../projectMarketplaceApi';
import { Search, Building2, Code, ArrowUpRight, Inbox, RefreshCw } from 'lucide-react';

function ProjectMarketplace() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getApprovedTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Could not retrieve active placement listings from the global catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  // Safe accessor mapping ensuring property support across any serialization setup
  const filteredTemplates = templates.filter(template => {
    const title = (template.title || template.Title || '').toLowerCase();
    const description = (template.description || template.Description || '').toLowerCase();
    const company = (template.providerCompanyName || template.ProviderCompanyName || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return title.includes(query) || description.includes(query) || company.includes(query);
  });

  if (loading) {
    return <div style={{ color: '#4a5568', textAlign: 'center', padding: '4rem' }}>Cataloging live industry templates...</div>;
  }

  return (
    <div>
      {/* Header Context Frame */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c' }}>Ecosystem Project Marketplace</h1>
          <p style={{ color: '#718096', fontSize: '0.95rem' }}>
            Discover and apply to verified capstone blueprints sponsored directly by authenticated enterprise partners.
          </p>
        </div>
        <button 
          onClick={fetchMarketplace}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#4a5568' }}
        >
          <RefreshCw size={14} /> Refresh Catalog
        </button>
      </div>

      {/* Dynamic Filter Search Dock */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} size={18} />
        <input
          type="text"
          placeholder="Search by tech stack, project title, or corporate sponsor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.7rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #cbd5e0', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)', outline: 'none' }}
        />
      </div>

      {error && (
        <div style={{ color: '#e53e3e', padding: '1rem', backgroundColor: '#fff5f5', borderRadius: '6px', marginBottom: '2rem', fontWeight: '500' }}>
          {error}
        </div>
      )}

      {/* Grid Canvas Matrix */}
      {filteredTemplates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '8px', color: '#a0aec0', backgroundColor: '#fff' }}>
          <Inbox size={40} style={{ marginBottom: '1rem', color: '#cbd5e0' }} />
          <p style={{ fontWeight: '500' }}>No approved project blueprints match your active query framework.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {filteredTemplates.map(template => {
            const id = template.id || template.Id;
            const title = template.title || template.Title;
            const description = template.description || template.Description;
            const companyName = template.providerCompanyName || template.ProviderCompanyName;
            const skills = template.skills || template.Skills || [];

            return (
              <div 
                key={id} 
                style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', transition: 'transform 0.15s, box-shadow 0.15s' }}
              >
                <div>
                  {/* Corporate Anchor Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4a5568', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: '0.5rem' }}>
                    <Building2 size={14} style={{ color: '#718096' }} />
                    {companyName}
                  </div>

                  {/* Blueprint Title */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                    {title}
                  </h3>

                  {/* Summary Scope */}
                  <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {description}
                  </p>
                </div>

                <div>
                  {/* Prerequisite Competency Badges */}
                  {skills.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <Code size={12} /> Target Capabilities
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {skills.map(sk => (
                          <span key={sk.id || sk.Id} style={{ fontSize: '0.75rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                            {sk.name || sk.Name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dispatch Command Trigger */}
                  <button
                    onClick={() => alert(`Initiating allocation pipeline query mapping for Blueprint Node ID:\n${id}`)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.6rem 1rem', backgroundColor: '#f7fafc', color: '#2b6cb0', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ebf8ff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f7fafc'; }}
                  >
                    Initialize Selection Pipeline
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectMarketplace;