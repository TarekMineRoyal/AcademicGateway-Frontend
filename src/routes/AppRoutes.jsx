import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import WorkspaceLayout from '../components/WorkspaceLayout';
import StudentDashboard from '../features/student/components/StudentDashboard';
import ProjectMarketplace from '../features/student/components/ProjectMarketplace';
import StudentProfile from '../features/student/components/StudentProfile';
// Updated import path: Points to the centralized role-agnostic feature domain for Step 2
import ProjectTemplateDetails from '../features/project-templates/components/ProjectTemplateDetails';

// Temporary lightweight placeholder views to keep the compilation path clean
const PlaceholderView = ({ title }) => (
  <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ color: '#718096', fontSize: '0.9rem' }}>This workspace channel is currently being prepared for platform synchronization.</p>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Guest Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:role" element={<RegisterPage />} />

        {/* Authenticated Workspace Matrix Route Tree
          Wrapped entirely inside our ProtectedRoute token claim guard framework.
        */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Base Dashboard Workspace Entry Node */}
          <Route index element={
            /* A simple dynamic structural router switch. 
              If a professor logs in, this node will eventually resolve to ProfessorDashboard.
              For now, we route directly to our StudentDashboard component.
            */
            <StudentDashboard />
          } />

          {/* Shared & Actor Specific Sub-Channel Routes */}
          <Route path="profile" element={<StudentProfile />} />
          <Route path="marketplace" element={<ProjectMarketplace />} />
          {/* Dynamic Route Node: Configured to load the centralized details panel */}
          <Route path="marketplace/:templateId" element={<ProjectTemplateDetails />} />
          
          <Route path="applications" element={<PlaceholderView title="Submitted Application Tracker Pipeline" />} />
          <Route path="milestones" element={<PlaceholderView title="Academic Evaluation Milestones Tracker" />} />

          {/* Professor Sub-Channel Routes */}
          <Route path="supervision-requests" element={<PlaceholderView title="Incoming Supervision Vetting Board" />} />
          <Route path="active-projects" element={<PlaceholderView title="Faculty Mentorship Supervision Console" />} />
          <Route path="capacity" element={<PlaceholderView title="Threshold Allocation & Capacity Management" />} />

          {/* Provider / Industry Sponsor Sub-Channel Routes */}
          <Route path="propose-template" element={<PlaceholderView title="R&D Capability Template Proposer Form" />} />
          <Route path="my-templates" element={<PlaceholderView title="Sponsor Blueprint Proposal Inventory" />} />
          <Route path="lab-groups" element={<PlaceholderView title="Active Co-Managed Experimental Lab Channels" />} />

          {/* Platform Administrator Management Sub-Channel Routes */}
          <Route path="approve-templates" element={<PlaceholderView title="Global Project Verification Board" />} />
          <Route path="verify-providers" element={<PlaceholderView title="External Institutional Sponsor Vetting Board" />} />
          <Route path="users" element={<PlaceholderView title="Global User Core Account Directory" />} />
        </Route>

        {/* Global Catch-all Redirection Safeguard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;