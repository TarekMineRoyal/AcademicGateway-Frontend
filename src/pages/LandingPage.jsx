import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Award, LogIn } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1a202c', letterSpacing: '-0.05em' }}>
          Academic<span style={{ color: '#3182ce' }}>Gateway</span>
        </div>
        <button 
          onClick={() => handleNavigation('/login')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #cbd5e0', borderRadius: '6px', backgroundColor: '#fff', color: '#4a5568', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <LogIn size={18} />
          Sign In
        </button>
      </header>

      {/* Hero Core Segment */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a202c', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            The R&D Capstone Marketplace
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#718096', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Connecting lab researchers with ambitious students and expert faculty mentors to build real-world graduation projects.
          </p>
        </div>

        {/* Intent-Driven Onboarding Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
          
          {/* Path A: Students */}
          <div style={{ backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#ebf8ff', color: '#2b6cb0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <GraduationCap size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.75rem' }}>Students</h2>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
              Launch your career. Discover, apply for, and claim high-impact graduation projects sourced directly from real research initiatives.
            </p>
            <button 
              onClick={() => handleNavigation('/register/student')}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Find a Capstone
            </button>
          </div>

          {/* Path B: Faculty Mentors */}
          <div style={{ backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#f0fff4', color: '#2f855a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Award size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.75rem' }}>Professors</h2>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
              Provide academic oversight. Manage mentorship assignments, evaluate research milestones, and guide student success.
            </p>
            <button 
              onClick={() => handleNavigation('/register/professor')}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Manage Mentorships
            </button>
          </div>

          {/* Path C: Researchers / Providers */}
          <div style={{ backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#fffaf0', color: '#dd6b20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Briefcase size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.75rem' }}>Researchers</h2>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
              Sponsor innovation. Propose project templates mapped to your lab's active requirements and collaborate with academic teams.
            </p>
            <button 
              onClick={() => handleNavigation('/register/provider')}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Sponsor Projects
            </button>
          </div>

        </div>
      </main>

      {/* Footer Utility */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#a0aec0', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Academic Gateway. Clean Architecture Integrated Workspace.
      </footer>
    </div>
  );
}

export default LandingPage;