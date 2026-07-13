import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getStudentProfile, getStudentProjects } from '../studentDashboardApi';
import { PlusCircle, Folder, Clock, CheckCircle, AlertTriangle, BookOpen, Award, Shield } from 'lucide-react';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Core Data States
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  
  // UX Operation States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchDashboardData();
  }, [user]);

  // Helper mapping to visually interpret ProjectInstanceStatus enum flags
  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 1: // ProjectInstanceStatus.AwaitingSupervision
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.85rem', fontWeight: '600' }}>
            <Clock size={14} /> Awaiting Supervision Approval
          </span>
        );
      case 2: // ProjectInstanceStatus.Active
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.85rem', fontWeight: '600' }}>
            <CheckCircle size={14} /> Live Active Project
          </span>
        );
      case 3: // ProjectInstanceStatus.Concluded
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem', fontWeight: '600' }}>
            <Award size={14} /> Concluded Workspace
          </span>
        );
      default: // ProjectInstanceStatus.Canceled
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '0.85rem', fontWeight: '600' }}>
            <AlertTriangle size={14} /> Aborted / Canceled
          </span>
        );
    }
  };

  if (loading) {
    return <div style={{ color: '#4a5568', textAlign: 'center', padding: '3rem' }}>Re-indexing student workspaces...</div>;
  }

  if (error) {
    return <div style={{ color: '#e53e3e', fontWeight: 'bold', padding: '2rem', backgroundColor: '#fff5f5', borderRadius: '8px' }}>{error}</div>;
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c' }}>
          Welcome back, {studentFullName}
        </h1>
        <p style={{ color: '#718096', fontSize: '0.95rem' }}>
          Overview and track your live graduation engineering workspaces and pending mentor claims.
        </p>
      </div>

      {/* Two Column Layout Mesh Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: ACTIVE WORKSPACES & PIPELINES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section A: Live Running Capstone Tracks */}
          <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Folder style={{ color: '#3182ce' }} size={20} /> Active Research Projects ({activeWorkspaces.length})
            </h2>
            
            {activeWorkspaces.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', padding: '1rem 0' }}>No active experimental project channels are assigned to your identity profile at this moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeWorkspaces.map(project => {
                  const projectId = project.id || project.Id;
                  const projectTitle = project.title || project.Title;
                  const projectStatus = project.status !== undefined ? project.status : project.Status;
                  const projectDescription = project.description || project.Description;
                  const projectEndDate = project.endDate || project.EndDate;

                  return (
                    <div key={projectId} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c' }}>{projectTitle}</h3>
                        {getStatusBadge(projectStatus)}
                      </div>
                      <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.4' }}>{projectDescription}</p>
                      <div style={{ fontSize: '0.8rem', color: '#718096', display: 'flex', gap: '1.5rem' }}>
                        <span><strong>Channel ID:</strong> {projectId}</span>
                        {projectEndDate && <span><strong>Administrative Deadline:</strong> {new Date(projectEndDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section B: Vetting Pipeline Channels */}
          <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock style={{ color: '#dd6b20' }} size={20} /> Application Pipeline ({pipelineApplications.length})
            </h2>

            {pipelineApplications.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', padding: '1rem 0' }}>Your pipeline registry is empty. Ready to launch a brand new initiative?</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pipelineApplications.map(app => {
                  const appId = app.id || app.Id;
                  const appTitle = app.title || app.Title;
                  const appStatus = app.status !== undefined ? app.status : app.Status;
                  const appCreatedAt = app.createdAt || app.CreatedAt;

                  return (
                    <div key={appId} style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '6px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>{appTitle}</h3>
                        {getStatusBadge(appStatus)}
                      </div>
                      <p style={{ color: '#718096', fontSize: '0.85rem' }}>Initialized on {new Date(appCreatedAt).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section C: Historical / Archive Logs */}
          {historicWorkspaces.length > 0 && (
            <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', opacity: 0.85 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#718096', marginBottom: '1rem' }}>Archived Context Entries</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historicWorkspaces.map(hist => {
                  const histId = hist.id || hist.Id;
                  const histTitle = hist.title || hist.Title;
                  const histStatus = hist.status !== undefined ? hist.status : hist.Status;
                  const histOverallGrade = hist.overallGrade !== undefined ? hist.overallGrade : hist.OverallGrade;

                  return (
                    <div key={histId} style={{ border: '1px solid #edf2f7', borderRadius: '6px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4a5568' }}>{histTitle}</span>
                        {histOverallGrade !== null && histOverallGrade !== undefined && <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#2f855a' }}><strong>Grade:</strong> {histOverallGrade}%</span>}
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
          <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', backgroundColor: '#ebf8ff', color: '#2b6cb0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.75rem', fontWeight: 'bold' }}>
              {studentFullName.charAt(0)}
            </div>
            
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.25rem' }}>{studentFullName}</h2>
            <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Graduation Target: {graduationYear}
            </p>

            {/* Strategic High Accent Global Operation Trigger Button */}
            <button
              onClick={() => navigate('/dashboard/marketplace')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(49,130,206,0.2)', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2b6cb0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3182ce'}
            >
              <PlusCircle size={18} />
              Start New Project App
            </button>
          </section>

          {/* Academic Records Metric Lists Widget */}
          <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BookOpen size={16} /> Enrolled Curriculums
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {majorsList.map(m => (
                <span key={m.id || m.Id} style={{ fontSize: '0.8rem', backgroundColor: '#edf2f7', color: '#2d3748', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '500' }}>{m.name || m.Name}</span>
              ))}
              {specialtiesList.map(s => (
                <span key={s.id || s.Id} style={{ fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: '#4a5568', padding: '0.25rem 0.5rem', borderRadius: '4px', fontStyle: 'italic' }}>{s.name || s.Name}</span>
              ))}
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Shield size={16} /> Verified Competencies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skillsList.map(sk => (
                <span key={sk.id || sk.Id} style={{ fontSize: '0.75rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>{sk.name || sk.Name}</span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;