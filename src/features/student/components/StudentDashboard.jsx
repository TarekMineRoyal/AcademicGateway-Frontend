import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getStudentProfile, getStudentProjects } from '../studentDashboardApi';
// Imported the pre-built backend transition handler endpoint
import { transitionToSolo } from '../../project-instances/projectInstancesApi'; 
import { PlusCircle, Folder, Clock, CheckCircle, AlertTriangle, BookOpen, Award, Shield, User, Building, Zap } from 'lucide-react';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Core Data States
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  
  // UX Operation States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Action Lifecycle States for Transition Workflow
  const [soloModalProject, setSoloModalProject] = useState(null);
  const [soloSubmitting, setSoloSubmitting] = useState(false);

  // Extracted dashboard refresh logic into an independent sync handler
  async function fetchDashboardData() {
    if (!user || (!user.id && !user.sub)) return;
    
    try {
      setLoading(true);
      const targetId = user.id || user.sub;
      const [profileData, projectData] = await Promise.all([
        getStudentProfile(targetId),
        getStudentProjects(targetId)
      ]);
      console.log("RAW PROFILE FROM BACKEND:", profileData);
      console.log("RAW PROJECTS FROM BACKEND:", projectData);
      setProfile(profileData);
      setProjects(projectData);
    } catch (err) {
      setError('Failed to sync workspace details with the academic registry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Action Handler to commit project transition to backend registry state flags
  const handleStartSolo = async () => {
    if (!soloModalProject) return;
    try {
      setSoloSubmitting(true);
      const projectId = soloModalProject.id || soloModalProject.Id;
      
      // Hit backend to instantly change status to 2
      await transitionToSolo(projectId);
      
      // Close modal and cleanly re-sync workspace dashboard components
      setSoloModalProject(null);
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to transition project channel to solo tracking mode. Please try again.');
    } finally {
      setSoloSubmitting(false);
    }
  };

  // Helper mapping to visually interpret ProjectInstanceStatus enum flags
  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 1: // ProjectInstanceStatus.AwaitingSupervision
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.8rem', fontWeight: '600' }}>
            <Clock size={14} /> Awaiting Supervision
          </span>
        );
      case 2: // ProjectInstanceStatus.Active
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.8rem', fontWeight: '600' }}>
            <CheckCircle size={14} /> Active
          </span>
        );
      case 3: // ProjectInstanceStatus.Concluded
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.8rem', fontWeight: '600' }}>
            <Award size={14} /> Concluded
          </span>
        );
      default: // ProjectInstanceStatus.Canceled
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.8rem', fontWeight: '600' }}>
            <AlertTriangle size={14} /> Canceled
          </span>
        );
    }
  };

  if (loading) {
    return <div style={{ color: '#4a5568', textAlign: 'center', padding: '6rem', fontWeight: '500' }}>Re-indexing student workspaces...</div>;
  }

  if (error) {
    return <div style={{ color: '#e53e3e', fontWeight: '600', padding: '1.5rem', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px' }}>{error}</div>;
  }

  // Segregates projects using both backend status capitalization definitions defensively
  const activeWorkspaces = projects.filter(p => p.status === 2 || p.Status === 2); 
  const pipelineApplications = projects.filter(p => p.status === 1 || p.Status === 1);
  const historicWorkspaces = projects.filter(p => p.status === 3 || p.status === 4 || p.Status === 3 || p.Status === 4);

  // Normalize core profile properties to resolve backend casing variance seamlessly
  const studentFullName = profile?.fullName || profile?.FullName || user?.unique_name || 'Academic Scholar';
  const graduationYear = profile?.graduationYear || profile?.GraduationYear || 'Unspecified';
  const majorsList = profile?.majors || profile?.Majors || [];
  const specialtiesList = profile?.specialties || profile?.Specialties || [];
  const skillsList = profile?.skills || profile?.Skills || [];

  return (
    <div>
      {/* Dashboard Top Header Block */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          Welcome back, {studentFullName}
        </h1>
        <p style={{ color: '#718096', fontSize: '0.95rem', fontWeight: '500' }}>
          Overview and track your live graduation engineering workspaces and pending mentor claims.
        </p>
      </div>

      {/* Two Column Balanced Layout Mesh Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 2fr)) 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: ACTIVE WORKSPACES & PIPELINES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section A: Live Running Capstone Tracks */}
          <section style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Folder style={{ color: '#3182ce' }} size={18} /> Active Research Projects
              <span style={{ fontSize: '0.8rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>{activeWorkspaces.length}</span>
            </h2>
            
            {activeWorkspaces.length === 0 ? (
              <div style={{ padding: '2rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#a0aec0', fontSize: '0.9rem', fontWeight: '500' }}>
                No active experimental project channels are assigned to your identity profile at this moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activeWorkspaces.map(project => {
                  const projectId = project.id || project.Id;
                  const projectTitle = project.title || project.Title;
                  const projectStatus = project.status !== undefined ? project.status : project.Status;
                  const projectDescription = project.description || project.Description;
                  const projectEndDate = project.endDate || project.EndDate;

                  // Redesign telemetry properties
                  const currentMilestoneTitle = project.currentMilestoneTitle || project.CurrentMilestoneTitle || 'Initialization Stage';
                  const currentMilestoneProgress = project.currentMilestoneProgress !== undefined ? project.currentMilestoneProgress : (project.CurrentMilestoneProgress || 0);
                  const totalProjectProgress = project.totalProjectProgress !== undefined ? project.totalProjectProgress : (project.TotalProjectProgress || 0);
                  const isSoloMode = project.isSoloMode !== undefined ? project.isSoloMode : project.IsSoloMode;
                  const professorId = project.professorId || project.ProfessorId;
                  const professorName = project.professorName || project.ProfessorName;
                  const providerId = project.providerId || project.ProviderId;
                  const providerCompanyName = project.providerCompanyName || project.ProviderCompanyName;

                  return (
                    <div 
                      key={projectId} 
                      onClick={() => navigate(`/workspace/projects/${projectId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/workspace/projects/${projectId}`);
                        }
                      }}
                      tabIndex={0}
                      style={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        padding: '1.25rem', 
                        backgroundColor: '#ffffff', 
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        outline: 'none' // Removes default browser outline when selected via Tab
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3182ce';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', lineHeight: '1.3' }}>{projectTitle}</h3>
                        {getStatusBadge(projectStatus)}
                      </div>
                      
                      <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>{projectDescription}</p>

                      {/* Associated Stakeholder References Anchor Elements */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#4a5568', borderTop: '1px solid #edf2f7', paddingTop: '0.75rem' }}>
                        {providerCompanyName && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Building size={14} style={{ color: '#718096' }} />
                            <strong style={{ color: '#718096' }}>Sponsor:</strong>{' '}
                            <span 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents launching parent workspace
                                if (providerId) navigate(`/providers/${providerId}`);
                              }}
                              style={{ color: '#3182ce', cursor: 'pointer', fontWeight: '600', transition: 'color 0.15s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#2b6cb0'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#3182ce'}
                            >
                              {providerCompanyName}
                            </span>
                          </span>
                        )}
                        
                        {!isSoloMode && professorName ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={14} style={{ color: '#718096' }} />
                            <strong style={{ color: '#718096' }}>Advisor:</strong>{' '}
                            <span 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents launching parent workspace
                                if (professorId) navigate(`/professors/${professorId}`);
                              }}
                              style={{ color: '#3182ce', cursor: 'pointer', fontWeight: '600', transition: 'color 0.15s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#2b6cb0'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#3182ce'}
                            >
                              {professorName}
                            </span>
                          </span>
                        ) : isSoloMode ? (
                          <span style={{ color: '#718096', fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
                            <User size={14} /> Solo Project Track
                          </span>
                        ) : null}
                      </div>

                      {/* Double Progress Bar Telemetry Section */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        {/* Milestone Telemetry */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: '500' }}><strong style={{ color: '#1a202c' }}>Milestone Node:</strong> {currentMilestoneTitle}</span>
                            <span style={{ fontWeight: '700', color: '#3182ce' }}>{currentMilestoneProgress}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${currentMilestoneProgress}%`, height: '100%', backgroundColor: '#3182ce', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                          </div>
                        </div>

                        {/* Totality Project Timeline Telemetry */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: '600', color: '#2d3748' }}>Overall Pipeline Completion</span>
                            <span style={{ fontWeight: '700', color: '#16a34a' }}>{totalProjectProgress}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${totalProjectProgress}%`, height: '100%', backgroundColor: '#16a34a', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                          </div>
                        </div>
                      </div>

                      {projectEndDate && (
                        <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                          Administrative Deadline: {new Date(projectEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section B: Vetting Pipeline Channels */}
          <section style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock style={{ color: '#d97706' }} size={18} /> Application Pipeline
              <span style={{ fontSize: '0.8rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>{pipelineApplications.length}</span>
            </h2>

            {pipelineApplications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#a0aec0', fontSize: '0.9rem', fontWeight: '500' }}>
                Your pipeline registry is empty. Ready to launch a brand new initiative?
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {pipelineApplications.map(app => {
                  const appId = app.id || app.Id;
                  const appTitle = app.title || app.Title;
                  const appStatus = app.status !== undefined ? app.status : app.Status;
                  const appCreatedAt = app.createdAt || app.CreatedAt;
                  
                  const providerCompanyName = app.providerCompanyName || app.ProviderCompanyName || 'Unspecified Provider';
                  const requestedProfessorName = app.requestedProfessorName || app.RequestedProfessorName || 'Pending Assignment';

                  return (
                    <div key={appId} style={{ backgroundColor: '#fffaf0', border: '1px solid #fef3c7', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a202c', lineHeight: '1.3' }}>{appTitle}</h3>
                        </div>
                        
                        {/* Vetting Metadata Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#4a5568', marginBottom: '1rem' }}>
                          <span><strong style={{ color: '#718096' }}>Sponsor Unit:</strong> {providerCompanyName}</span>
                          <span><strong style={{ color: '#718096' }}>Supervisor:</strong> {requestedProfessorName}</span>
                        </div>
                      </div>

                      {/* Augmented card footer layout to include a visible clear action element row */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px dashed #fde68a', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '0.8rem', fontWeight: '500' }}>
                            Opened {new Date(appCreatedAt).toLocaleDateString()}
                          </span>
                          {getStatusBadge(appStatus)}
                        </div>
                        
                        {/* Interactive Action Button to Bypass Waiting Trajectory */}
                        <button
                          onClick={() => setSoloModalProject(app)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem 0.75rem', backgroundColor: '#ffffff', color: '#b45309', border: '1px solid #fde68a', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <Zap size={13} />
                          Start Solo Instead
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section C: Historical / Archive Logs */}
          {historicWorkspaces.length > 0 && (
            <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', opacity: 0.85 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#718096', marginBottom: '1rem' }}>Archived History Records</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historicWorkspaces.map(hist => {
                  const histId = hist.id || hist.Id;
                  const histTitle = hist.title || hist.Title;
                  const histStatus = hist.status !== undefined ? hist.status : hist.Status;
                  const histOverallGrade = hist.overallGrade !== undefined ? hist.overallGrade : hist.OverallGrade;

                  return (
                    <div key={histId} style={{ border: '1px solid #edf2f7', borderRadius: '8px', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                      <div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>{histTitle}</span>
                        {histOverallGrade !== null && histOverallGrade !== undefined && (
                          <span style={{ marginLeft: '1rem', fontSize: '0.85rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
                            Grade: {histOverallGrade}%
                          </span>
                        )}
                      </div>
                      {getStatusBadge(histStatus)}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: TECHNICAL IDENTITY SNAPSHOT & GLOBAL OPERATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Identity Snapshot Card Widget */}
          <section style={{ backgroundColor: '#fff', padding: '1.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#ebf8ff', color: '#2b6cb0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.5rem', fontWeight: '800', border: '2px solid #bbf7d0' }}>
              {studentFullName.charAt(0)}
            </div>
            
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{studentFullName}</h2>
            <p style={{ color: '#718096', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Graduation Target: {graduationYear}
            </p>

            {/* Strategic High Accent Core Operation Trigger Button */}
            <button
              onClick={() => navigate('/dashboard/marketplace')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(49, 130, 206, 0.15)', transition: 'all 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
            >
              <PlusCircle size={16} />
              Start New Project App
            </button>
          </section>

          {/* Academic Records Metric Lists Widget */}
          <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} /> Enrolled Curriculums
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.75rem' }}>
              {majorsList.map(m => (
                <span key={m.id || m.Id} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '600', border: '1px solid #e2e8f0' }}>{m.name || m.Name}</span>
              ))}
              {specialtiesList.map(s => (
                <span key={s.id || s.Id} style={{ fontSize: '0.75rem', backgroundColor: '#f8fafc', color: '#475569', padding: '0.25rem 0.6rem', borderRadius: '6px', fontStyle: 'italic', fontWeight: '500', border: '1px solid #e2e8f0' }}>{s.name || s.Name}</span>
              ))}
            </div>

            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} /> Verified Competencies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skillsList.map(sk => (
                <span key={sk.id || sk.Id} style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '600', border: '1px solid #dbeafe' }}>{sk.name || sk.Name}</span>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Confirmation Overlay Explaining the Multi-Agent Routing Process */}
      {soloModalProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 32, 44, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.75rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a202c', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} style={{ color: '#d97706' }} /> Start Project Solo
            </h3>
            
            <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
              You are launching <strong>{soloModalProject.title || soloModalProject.Title}</strong> independently. This initializes your workspace channel <strong>immediately</strong> (Status: Active).
              <br /><br />
              <span style={{ display: 'block', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '6px', color: '#b45309', fontSize: '0.85rem', fontWeight: '500' }}>
                <strong>Important Process Node:</strong> The advisor invitation issued to <strong>{soloModalProject.requestedProfessorName || soloModalProject.RequestedProfessorName}</strong> remains active in the registry. They can claim it and join your running workspace seamlessly at any later milestone point.
              </span>
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                disabled={soloSubmitting}
                onClick={() => setSoloModalProject(null)}
                style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff', color: '#4a5568', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                Cancel
              </button>
              <button 
                disabled={soloSubmitting}
                onClick={handleStartSolo}
                style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', backgroundColor: '#3182ce', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 4px 6px -1px rgba(49, 130, 206, 0.15)', transition: 'all 0.15s' }}
                onMouseEnter={(e) => !soloSubmitting && (e.currentTarget.style.backgroundColor = '#2b6cb0')}
                onMouseLeave={(e) => !soloSubmitting && (e.currentTarget.style.backgroundColor = '#3182ce')}
              >
                {soloSubmitting ? 'Activating Workspace...' : 'Confirm & Start Solo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;