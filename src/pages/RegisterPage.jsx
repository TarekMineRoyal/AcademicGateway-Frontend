import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import StudentRegisterForm from '../features/identity/components/StudentRegisterForm';
import ProfessorRegisterForm from '../features/identity/components/ProfessorRegisterForm';
import ProviderRegisterForm from '../features/identity/components/ProviderRegisterForm';

function RegisterPage() {
  // Pulls the dynamic segment from the URL (e.g., /register/:role)
  const { role } = useParams();

  // Helper function to render the exact domain-driven form matching the URL
  const renderForm = () => {
    switch (role?.toLowerCase()) {
      case 'student':
        return <StudentRegisterForm />;
      case 'professor':
        return <ProfessorRegisterForm />;
      case 'provider':
      case 'researcher':
        return <ProviderRegisterForm />;
      default:
        // Safeguard: If someone types an invalid role, bounce them home
        return <Navigate to="/" replace />;
    }
  };

  // Dynamic heading decorations based on user intent context
  const getPageContextDetails = () => {
    switch (role?.toLowerCase()) {
      case 'student':
        return { title: 'Student Portal Enrolment', subtitle: 'Join as an applicant to browse and claim capstone project opportunities.' };
      case 'professor':
        return { title: 'Faculty Portal Onboarding', subtitle: 'Register your academic profile to supervise, track, and grade milestone projects.' };
      default:
        return { title: 'Research Partner Onboarding', subtitle: 'Register your lab unit or corporate structure to sponsor and propose project templates.' };
    }
  };

  const details = getPageContextDetails();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#1a202c', marginBottom: '0.5rem' }}>Academic Gateway</h1>
        <p style={{ color: '#718096', fontSize: '1rem' }}>{details.subtitle}</p>
      </div>

      {/* Renders the matching feature slice component dynamically */}
      {renderForm()}

      <div style={{ maxWidth: '600px', margin: '1.5rem auto 0 auto', textAlign: 'center', fontSize: '0.9rem' }}>
        <span style={{ color: '#4a5568' }}>Already have an established credential profile? </span>
        <Link to="/login" style={{ color: '#3182ce', fontWeight: 'bold', textDecoration: 'none' }}>
          Sign In here
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;