import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProjectTemplateById } from '../projectTemplatesApi';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Code, 
  Building2, 
  GitMerge, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

function ProjectTemplateDetails() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchTemplateData() {
      try {
        setLoading(true);
        setError('');
        const data = await getProjectTemplateById(templateId);
        setTemplate(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to sync detailed project aggregate specifications from database.');
      } finally {
        setLoading(false);
      }
    }
    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId]);

  // Backend ProjectTemplateStatus Enum Interpreters
  const getStatusBadgeConfig = (statusInt) => {
    switch (statusInt) {
      case 1: return { text: 'Draft', bg: '#edf2f7', color: '#4a5568' };
      case 2: return { text: 'Pending Review', bg: '#fef3c7', color: '#d97706' };
      case 3: return { text: 'Changes Requested', bg: '#fff5f5', color: '#e53e3e' };
      case 4: return { text: 'Pending Acceptance', bg: '#e0f2fe', color: '#0369a1' };
      case 5: return { text: 'Publicly Approved', bg: '#f0fff4', color: '#38a169' };
      case 6: return { text: 'Rejected', bg: '#fff5f5', color: '#c53030' };
      case 7: return { text: 'Archived', bg: '#f7fafc', color: '#a0aec0' };
      default: return { text: 'Unknown Identity', bg: '#edf2f7', color: '#4a5568' };
    }
  };

  // Backend DeliverableType Enum Interpreters
  const getDeliverableTypeText = (typeInt) => {
    switch (typeInt) {
      case 0: return 'None (Informational Checkout)';
      case 1: return 'Web Link URL (GitHub / Deployment)';
      case 2: return 'File Upload (PDF / Document Matrix)';
      case 3: return 'Plain Text Summary Entry';
      default: return 'Standard Review Submission';
    }
  };

  // Backend DependencyType Enum Interpreters
  const getDependencyTypeText = (typeInt) => {
    switch (typeInt) {
      case 1: return 'Finish-to-Start (Prerequisite must conclude before this node starts)';
      case 2: return 'Start-to-Start (Prerequisite must initialize before this node starts)';
      default: return 'Sequential Connection';
    }
  };

  const handleStudentPipelineInitialization = async () => {
    setActionLoading(true);
    try {
      // Mock alert placeholder for Option B milestone logic to be hooked in later
      alert(`Initializing application pipeline matching Template Blueprint Sequence: ${template?.title || template?.Title}`);
    } catch (err) {
      alert('Failed to register initialization sequence.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#4a5568', textAlign: 'center', padding: '4rem' }}>De-serializing comprehensive blueprint records...</div>;
  }

  if (error || !template) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #fed7d7', textAlign: 'center' }}>
        <AlertCircle size={40} style={{ color: '#e53e3e', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#c53030', marginBottom: '0.5rem' }}>Blueprint Synchronization Error</h3>
        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>{error || 'The requested template could not be mapped to an active dataset entity.'}</p>
        <button onClick={() => navigate('/dashboard/marketplace')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#edf2f7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Return to Marketplace
        </button>
      </div>
    );
  }

  // Handle cross-casing accessors from raw API response bodies smoothly
  const title = template.title || template.Title;
  const description = template.description || template.Description;
  const statusInt = template.status !== undefined ? template.status : template.Status;
  const providerId = template.providerId || template.ProviderId;
  const companyName = template.providerCompanyName || template.ProviderCompanyName || 'Enterprise Sponsor Partner';
  const requiredSkills = template.requiredSkills || template.RequiredSkills || template.skills || template.Skills || [];
  const milestones = template.milestones || template.Milestones || [];
  const dependencies = template.dependencies || template.Dependencies || [];

  const statusBadge = getStatusBadgeConfig(statusInt);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Upper Navigation Anchor */}
      <button 
        onClick={() => navigate('/dashboard/marketplace')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', color: '#4a5568', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Project Marketplace
      </button>

      {/* Main Core Briefing Sheet */}
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Building2 size={14} />
              {companyName}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1a202c', lineHeight: '1.2' }}>{title}</h1>
          </div>
          <span style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', backgroundColor: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.color}22` }}>
            Status: {statusBadge.text}
          </span>
        </div>

        <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
          {description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Provider Identification Identifier</span>
            <code style={{ fontSize: '0.85rem', backgroundColor: '#f7fafc', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#4a5568' }}>{providerId}</code>
          </div>
          {requiredSkills.length > 0 && (
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Target Capabilities & Prerequisites</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {requiredSkills.map((sk, idx) => (
                  <span key={sk.skillId || sk.Id || idx} style={{ fontSize: '0.75rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                    {sk.name || sk.Name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Milestone Dependencies Graph Map Section */}
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitMerge size={20} style={{ color: '#3182ce' }} />
          Project Architecture & Evaluation Graph Plan
        </h2>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Analyze the sequential execution constraints mapping checkpoints below. Arrow branches represent strict prerequisite dependencies enforced by the pipeline engine.
        </p>

        {milestones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '6px', color: '#718096' }}>
            No programmatic evaluation checkpoints are attached to this layout template.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {milestones.map((milestone, idx) => {
              const mId = milestone.id || milestone.Id;
              const mTitle = milestone.title || milestone.Title;
              const mDesc = milestone.description || milestone.Description;
              const effort = milestone.expectedEffortInHours !== undefined ? milestone.expectedEffortInHours : milestone.ExpectedEffortInHours;
              const delivType = milestone.requiredDeliverableType !== undefined ? milestone.requiredDeliverableType : milestone.RequiredDeliverableType;

              // Extract edge inputs (What milestones must finish before THIS milestone can initiate?)
              const structuralPrerequisites = dependencies.filter(dep => (dep.successorId || dep.SuccessorId) === mId);

              return (
                <div key={mId || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc', display: 'flex', gap: '1.25rem', padding: '1.25rem', position: 'relative' }}>
                  
                  {/* Sequence Visual Indicator Ring */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#3182ce', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                      {idx + 1}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div style={{ width: '2px', flex: 1, backgroundColor: '#cbd5e0', marginTop: '0.5rem', marginBottom: '-1.75rem', zIndex: 1 }} />
                    )}
                  </div>

                  {/* Node Metrics Payload Column */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#2d3748' }}>{mTitle}</h4>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#4a5568' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#edf2f7', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          <Clock size={12} /> {effort} Hours Effort
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          <FileText size={12} /> {getDeliverableTypeText(delivType)}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: '1.4', marginBottom: '0.5rem' }}>{mDesc}</p>

                    {/* Edge Dependency Connective Badges Display */}
                    {structuralPrerequisites.length > 0 && (
                      <div style={{ marginTop: '0.75rem', backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid #edf2f7' }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Enforced Network Prerequisites:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {structuralPrerequisites.map((dep, edgeIdx) => {
                            const predId = dep.predecessorId || dep.PredecessorId;
                            const depType = dep.type !== undefined ? dep.type : dep.Type;
                            
                            // Find target sibling index in current loaded snapshot list to read readable string context
                            const siblingIdx = milestones.findIndex(m => (m.id || m.Id) === predId);
                            const siblingTitle = siblingIdx !== -1 ? `Milestone ${siblingIdx + 1}: "${milestones[siblingIdx].title || milestones[siblingIdx].Title}"` : 'Predecessor Node ID Node';

                            return (
                              <div key={edgeIdx} style={{ fontSize: '0.75rem', color: '#2b6cb0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Activity size={12} style={{ color: '#4299e1' }} />
                                <span><strong>{siblingTitle}</strong> — {getDependencyTypeText(depType)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Polymorphic Interface Action Control Panel Row based on user roles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f7fafc', padding: '1.25rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {userRole === 'student' && statusInt === 5 && (
          <button
            onClick={handleStudentPipelineInitialization}
            disabled={actionLoading}
            style={{ padding: '0.65rem 1.5rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'background-color 0.2s', opacity: actionLoading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if(!actionLoading) e.currentTarget.style.backgroundColor = '#2b6cb0'; }}
            onMouseLeave={(e) => { if(!actionLoading) e.currentTarget.style.backgroundColor = '#3182ce'; }}
          >
            {actionLoading ? 'Initializing Pipeline...' : 'Initialize Selection Pipeline'}
          </button>
        )}
        
        {userRole === 'provider' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Edit Blueprint text
            </button>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Manage Edge Milestones
            </button>
          </div>
        )}

        {userRole === 'admin' && statusInt === 2 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Issue Rejection Gate
            </button>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Authorize and Approve Template
            </button>
          </div>
        )}

        <button 
          onClick={() => navigate('/dashboard/marketplace')}
          style={{ padding: '0.65rem 1.25rem', backgroundColor: '#fff', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          Cancel and Return
        </button>
      </div>
    </div>
  );
}

export default ProjectTemplateDetails;