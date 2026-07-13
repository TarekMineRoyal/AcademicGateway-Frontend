import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProjectTemplateById } from '../projectTemplatesApi';
import { initializeProjectInstance } from '../../project-instances/projectInstancesApi';
import { searchProfessors } from '../../professor/professorApi';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Building2, 
  GitMerge, 
  Activity, 
  AlertCircle,
  Search,
  User,
  Check,
  X,
  UserCheck,
  Zap
} from 'lucide-react';

function ProjectTemplateDetails() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Workflow Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiationMode, setInitiationMode] = useState(null); // 'solo' | 'supervised' | null
  const [professorSearchQuery, setProfessorSearchQuery] = useState('');
  const [professorResults, setProfessorResults] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [searchingProfessors, setSearchingProfessors] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

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

  // Real-time Professor Directory lookup handler
  useEffect(() => {
    if (initiationMode !== 'supervised') return;
    
    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearchingProfessors(true);
        setModalError('');
        const results = await searchProfessors(professorSearchQuery);
        setProfessorResults(results);
      } catch (err) {
        setModalError('Failed to fetch matching faculty listings from directory.');
      } finally {
        setSearchingProfessors(false);
      }
    }, 300); // 300ms built-in debounce slider to ease network hammering

    return () => clearTimeout(delayDebounceFn);
  }, [professorSearchQuery, initiationMode]);

  const handleOpenInitiationModal = () => {
    setIsModalOpen(true);
    setInitiationMode(null);
    setProfessorSearchQuery('');
    setProfessorResults([]);
    setSelectedProfessor(null);
    setModalError('');
  };

  const handleCloseInitiationModal = () => {
    if (submitLoading) return;
    setIsModalOpen(false);
  };

  const handleFinalizePipelineInstantiation = async () => {
    if (initiationMode === 'supervised' && !selectedProfessor) {
      setModalError('Please explicitly select a target supervisor to deploy the request.');
      return;
    }

    try {
      setSubmitLoading(true);
      setModalError('');
      
      // Dispatch the runtime initialization command to the new domain workspace engine
      await initializeProjectInstance(
        templateId, 
        initiationMode === 'supervised' ? selectedProfessor.id : null
      );

      setIsModalOpen(false);
      // Clean cross-domain redirection bringing them home to manifest the new entry instantly
      navigate('/dashboard');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to dispatch allocation request commands to server.');
    } finally {
      setSubmitLoading(false);
    }
  };

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
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

      {/* Interface Action Control Panel Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f7fafc', padding: '1.25rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {userRole === 'student' && statusInt === 5 && (
          <button
            onClick={handleOpenInitiationModal}
            style={{ padding: '0.65rem 1.5rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2b6cb0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3182ce'; }}
          >
            Initialize Selection Pipeline
          </button>
        )}
        
        {userRole === 'provider' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Edit Blueprint Text
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

      {/* ================= WORKFLOW INITIALIZATION GATE OVERLAY MODAL ================= */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 32, 44, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '540px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7fafc' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>Project Initialization Matrix</h3>
              <button onClick={handleCloseInitiationModal} disabled={submitLoading} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0aec0', padding: '0.25rem' }} onMouseEnter={(e) => e.currentTarget.style.color = '#4a5568'} onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Canvas */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(80vh - 100px)' }}>
              {modalError && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: '#c53030', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{modalError}</span>
                </div>
              )}

              {/* STEP 1: Route Selection Fork */}
              {initiationMode === null && (
                <div>
                  <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Select how you want to deploy this capstone aggregate model workspace track. You can modify mentorship settings post-launch.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Option A: Go Solo */}
                    <button 
                      onClick={() => setInitiationMode('solo')}
                      style={{ width: '100%', padding: '1.25rem', border: '2px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'border-color 0.15s, background-color 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3182ce'; e.currentTarget.style.backgroundColor = '#f7fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                      <div style={{ padding: '0.5rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', borderRadius: '6px' }}>
                        <Zap size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.15rem' }}>Deploy in Solo Execution Mode</h4>
                        <p style={{ color: '#718096', fontSize: '0.8rem', lineHeight: '1.4' }}>Instantiates the runtime workspace track immediately. You hold the ability to invite a faculty advisor later.</p>
                      </div>
                    </button>

                    {/* Option B: Seek Supervision */}
                    <button 
                      onClick={() => setInitiationMode('supervised')}
                      style={{ width: '100%', padding: '1.25rem', border: '2px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'border-color 0.15s, background-color 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3182ce'; e.currentTarget.style.backgroundColor = '#f7fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                      <div style={{ padding: '0.5rem', backgroundColor: '#f0fff4', color: '#38a169', borderRadius: '6px' }}>
                        <UserCheck size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.15rem' }}>Request Faculty Academic Supervision</h4>
                        <p style={{ color: '#718096', fontSize: '0.8rem', lineHeight: '1.4' }}>Search our verified faculty registry to route an invitation. Track status will remain pending until approved.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Supervised Faculty Directory Search Deck */}
              {initiationMode === 'supervised' && (
                <div>
                  <button onClick={() => { setInitiationMode(null); setSelectedProfessor(null); }} style={{ background: 'transparent', border: 'none', color: '#2b6cb0', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', padding: 0 }}>
                    ← Back to selection options
                  </button>
                  
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Search Advisor Directory
                  </label>
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                    <input 
                      type="text" 
                      placeholder="Type name, campus handle, or academic email..."
                      value={professorSearchQuery}
                      onChange={(e) => setProfessorSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 1rem 0.55rem 2.2rem', fontSize: '0.9rem', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none' }}
                    />
                  </div>

                  {/* Directory Results Matrix */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto', backgroundColor: '#fafbfc' }}>
                    {searchingProfessors ? (
                      <div style={{ padding: '1rem', fontSize: '0.8rem', color: '#718096', textAlign: 'center' }}>Querying corporate faculty clusters...</div>
                    ) : professorResults.length === 0 ? (
                      <div style={{ padding: '1rem', fontSize: '0.8rem', color: '#a0aec0', textAlign: 'center' }}>
                        {professorSearchQuery ? 'No matching faculty identities found.' : 'Type to query directory grid...'}
                      </div>
                    ) : (
                      professorResults.map(prof => {
                        const isChosen = selectedProfessor?.id === prof.id;
                        return (
                          <div 
                            key={prof.id}
                            onClick={() => setSelectedProfessor(prof)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', borderBottom: '1px solid #edf2f7', cursor: 'pointer', backgroundColor: isChosen ? '#ebf8ff' : 'transparent', transition: 'background-color 0.1s' }}
                            onMouseEnter={(e) => { if(!isChosen) e.currentTarget.style.backgroundColor = '#f7fafc'; }}
                            onMouseLeave={(e) => { if(!isChosen) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <User size={14} style={{ color: isChosen ? '#2b6cb0' : '#718096' }} />
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2d3748' }}>{prof.fullName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{prof.email}</div>
                              </div>
                            </div>
                            {isChosen && <Check size={16} style={{ color: '#2b6cb0' }} />}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {selectedProfessor && (
                    <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={14} style={{ color: '#38a169' }} />
                      <span style={{ fontSize: '0.8rem', color: '#276749' }}>
                        Selected: <strong>{selectedProfessor.fullName}</strong> will receive the request.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Solo Trigger Summary Checkout Confirmation */}
              {initiationMode === 'solo' && (
                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                  <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    You are initializing <strong>{title}</strong> in standalone mode. 
                  </p>
                  <p style={{ color: '#718096', fontSize: '0.8rem' }}>
                    Your pipeline record tracks as an active instance immediately upon checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer Bar */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #edf2f7', backgroundColor: '#f7fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                onClick={handleCloseInitiationModal} 
                disabled={submitLoading}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: submitLoading ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              
              {initiationMode !== null && (
                <button 
                  onClick={handleFinalizePipelineInstantiation}
                  disabled={submitLoading || (initiationMode === 'supervised' && !selectedProfessor)}
                  style={{ padding: '0.5rem 1.25rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: (submitLoading || (initiationMode === 'supervised' && !selectedProfessor)) ? 'not-allowed' : 'pointer', opacity: (submitLoading || (initiationMode === 'supervised' && !selectedProfessor)) ? 0.6 : 1 }}
                >
                  {submitLoading ? 'Deploying Track...' : 'Confirm and Initialize'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTemplateDetails;