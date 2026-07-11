import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dynamic Parameter Route: 
          The ':role' segment acts as a wildcard parameter that our RegisterPage component 
          will intercept and read (e.g., 'student', 'professor', 'provider').
        */}
        <Route path="/register/:role" element={<RegisterPage />} />

        {/* Fallback Route: Catch any broken links and redirect back home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;