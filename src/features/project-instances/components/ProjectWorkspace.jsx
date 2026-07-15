import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails } from '../projectInstancesApi';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Building, 
  User, 
  Award, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export default function ProjectWorkspace() {
  const { projectInstanceId } = useParams();
  const navigate = useNavigate();
  
  // Core Local State Matrices
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic state to support clean responsive inline grid rendering without requiring Tailwind CSS compiler
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1024;

  // Retrieve Core Data Lifecycle
  useEffect(() => {
    if (!projectInstanceId) return;
    
    setLoading(true);
    setError(null);

    getProjectDetails(projectInstanceId)
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        console.error("Workspace synchronization failed:", err);
        setError(err.message || "Failed to load project details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectInstanceId]);

  // Clean status-badge configuration mapper (aligned with StudentDashboard enum interpreting)
  const getStatusConfig = (statusValue) => {
    switch (statusValue) {
      case 1: // ProjectInstanceStatus.AwaitingSupervision
        return { 
          text: 'Awaiting Supervision', 
          bg: '#fffbeb', 
          color: '#b45309', 
          border: '1px solid #fde68a', 
          icon: <Clock size={14} /> 
        };
      case 2: // ProjectInstanceStatus.Active
        return { 
          text: 'Active Workspace', 
          bg: '#f0fdf4', 
          color: '#166534', 
          border: '1px solid #bbf7d0', 
          icon: <CheckCircle size={14} /> 
        };
      case 3: // ProjectInstanceStatus.Concluded
        return { 
          text: 'Concluded', 
          bg: '#f0f9ff', 
          color: '#0369a1', 
          border: '1px solid #bae6fd', 
          icon: <Award size={14} /> 
        };
      default: // ProjectInstanceStatus.Canceled / Default
        return { 
          text: 'Canceled', 
          bg: '#f9fafb', 
          color: '#4b5563', 
          border: '1px solid #e5e7eb', 
          icon: <ShieldAlert size={14} /> 
        };
    }
  };

  // Human-readable date-string conversion helper
  const formatDateString = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Loading indicator template matched with registry loader guidelines
  if (loading) {
    return (
      <div style={{ color: '#4a5568', textAlign: 'center', padding: '8rem 2rem', fontWeight: '500', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e2e8f0', borderTopColor: '#3182ce', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <div>Decrypting academic sandbox environment parameters...</div>
      </div>
    );
  }

  // Error boundary template
  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <ShieldAlert size={48} style={{ color: '#e53e3e', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#c53030', marginBottom: '0.5rem' }}>Workspace Handshake Interrupted</h3>
        <p style={{ color: '#718096', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{error}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '0.6rem 1.25rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <ShieldAlert size={48} style={{ color: '#718096', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>Workspace Registry Empty</h3>
        <p style={{ color: '#718096', fontSize: '0.95rem', marginBottom: '1.5rem' }}>The requested live workspace instance could not be located in academic registers.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '0.6rem 1.25rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Defensive casing-resilient data-binding mapping
  const projectTitle = project.titleSnapshot || project.TitleSnapshot || project.title || project.Title || 'Dynamic Project Stream';
  const projectDesc = project.descriptionSnapshot || project.DescriptionSnapshot || project.description || project.Description || 'Academic development workspace initialized.';
  const rawStatus = project.status !== undefined ? project.status : (project.Status !== undefined ? project.Status : 1);
  const statusBadge = getStatusConfig(rawStatus);

  const supervisor = project.supervisorName || project.SupervisorName || project.professorName || project.ProfessorName || null;
  const providerName = project.providerCompanyName || project.ProviderCompanyName || project.providerName || project.ProviderName || null;
  const providerId = project.providerId || project.ProviderId || null;
  const skillsArray = project.snapshotSkills || project.SnapshotSkills || project.requiredSkills || project.RequiredSkills || [];
  
  const createdDate = project.createdAt || project.CreatedAt || null;
  const targetEndDate = project.endDate || project.EndDate || null;
  const isSoloMode = project.isSoloMode !== undefined ? project.isSoloMode : (!supervisor);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header Navigation Breadcrumb */}
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', color: '#4a5568', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#3182ce'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#4a5568'}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* 2. Workspace Meta Summary Card */}
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: '2rem' }}>
        
        {/* Row 1: Title & Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1a202c', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {projectTitle}
            </h1>
            <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              {projectDesc}
            </p>
          </div>
          
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: statusBadge.bg, color: statusBadge.color, border: statusBadge.border, fontSize: '0.8rem', fontWeight: '700' }}>
            {statusBadge.icon} {statusBadge.text}
          </span>
        </div>

        {/* Row 2: Stakeholder & Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          
          {/* Faculty Supervisor Node */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Academic Advisor
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#2d3748', fontWeight: '600' }}>
              <User size={15} style={{ color: '#718096' }} />
              {!isSoloMode && supervisor ? supervisor : 'Solo Project Mode'}
            </span>
          </div>

          {/* Industry Sponsor Node */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Sponsor Unit
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#2d3748', fontWeight: '600' }}>
              <Building size={15} style={{ color: '#718096' }} />
              {providerName ? `${providerName}` : 'Independent Core Blueprint'}
              {providerId && (
                <code style={{ fontSize: '0.75rem', backgroundColor: '#f7fafc', padding: '0.1rem 0.3rem', borderRadius: '4px', color: '#a0aec0', fontWeight: '400', marginLeft: '0.25rem' }}>
                  {providerId.slice(0, 8)}
                </code>
              )}
            </span>
          </div>

          {/* Timeline Range Node */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Timeline Windows
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#2d3748', fontWeight: '600' }}>
              <Calendar size={15} style={{ color: '#718096' }} />
              {formatDateString(createdDate)} &mdash; {formatDateString(targetEndDate)}
            </span>
          </div>

        </div>

        {/* Row 3: Visual Capstone Capability Pills */}
        {skillsArray.length > 0 && (
          <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Workspace Snapshot Capability Focus
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skillsArray.map((sk, idx) => (
                <span 
                  key={sk.id || sk.Id || sk.skillId || idx} 
                  style={{ fontSize: '0.75rem', backgroundColor: '#edf2f7', color: '#4a5568', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: '600', border: '1px solid #e2e8f0' }}
                >
                  {sk.name || sk.Name || 'System Skill'}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. Operational Division Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? '65% 35%' : '1fr', gap: '2rem' }}>
        
        {/* Left Column: Milestone Timeline Placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Phase 4 Milestone Timeline Component Goes Here */}
          <div style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e0', borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#ebf8ff', color: '#3182ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Layers size={24} />
            </div>
            
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>
              Milestone Timeline Grid
            </h3>
            <p style={{ color: '#718096', fontSize: '0.875rem', maxWidth: '440px', lineHeight: '1.5', margin: '0 auto 1.5rem auto' }}>
              This operational container is currently staged and synchronized with the API registry. Ready to anchor Phase 4 roadmap visualizations.
            </p>
            
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', backgroundColor: '#edf2f7', color: '#718096', padding: '0.3rem 0.75rem', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.05em' }}>
              Phase 4 Operational Hook Active
            </span>

            {/* Visual Skeleton preview items to guarantee high-fidelity layout depth */}
            <div style={{ width: '100%', maxWidth: '480px', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
              <div style={{ border: '1px dashed #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '10px', width: '40%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
                  <div style={{ height: '8px', width: '85%', backgroundColor: '#edf2f7', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ border: '1px dashed #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '10px', width: '55%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
                  <div style={{ height: '8px', width: '70%', backgroundColor: '#edf2f7', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Comments / Detail Drawer Placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Phase 5 Milestone Details / Chat Feed Goes Here */}
          <div style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e0', borderRadius: '12px', padding: '3.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <MessageSquare size={22} />
            </div>
            
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>
              Milestone Action Center
            </h3>
            <p style={{ color: '#718096', fontSize: '0.875rem', maxWidth: '300px', lineHeight: '1.5', margin: '0 auto 1.5rem auto' }}>
              Real-time collaboration streams and milestone grading summaries will lock in here.
            </p>

            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', backgroundColor: '#edf2f7', color: '#718096', padding: '0.3rem 0.75rem', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.05em' }}>
              Phase 5 Commentary Node Hook Active
            </span>

            {/* Visual Skeleton chat box representation to align depth representation */}
            <div style={{ width: '100%', maxWidth: '300px', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.5 }}>
              <div style={{ border: '1px dashed #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ height: '8px', width: '30%', backgroundColor: '#cbd5e0', borderRadius: '4px' }} />
                  <div style={{ height: '6px', width: '15%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                </div>
                <div style={{ height: '6px', width: '90%', backgroundColor: '#edf2f7', borderRadius: '4px' }} />
              </div>
              <div style={{ border: '1px dashed #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'right', alignSelf: 'flex-end', width: '85%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                  <div style={{ height: '8px', width: '25%', backgroundColor: '#cbd5e0', borderRadius: '4px' }} />
                  <div style={{ height: '6px', width: '20%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                </div>
                <div style={{ height: '6px', width: '95%', backgroundColor: '#edf2f7', borderRadius: '4px', alignSelf: 'flex-end' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}