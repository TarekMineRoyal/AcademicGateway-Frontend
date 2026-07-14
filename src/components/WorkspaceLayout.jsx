import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Users, 
  Sliders, 
  PlusCircle, 
  CheckSquare, 
  ShieldAlert, 
  LogOut, 
  User 
} from 'lucide-react';

function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role?.toLowerCase();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Dynamic Top Navigation Configuration (Optimized to prevent splitting student attention)
  const getNavLinks = () => {
    switch (userRole) {
      case 'student':
        // Student routing relies on clear in-view action triggers, leaving top bar completely clean
        return [];
      case 'professor':
        return [
          { label: 'Console Home', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
          { label: 'Supervision Requests', path: '/dashboard/supervision-requests', icon: <Users size={16} /> },
          { label: 'Active Projects', path: '/dashboard/active-projects', icon: <BookOpen size={16} /> },
          { label: 'Capacity Management', path: '/dashboard/capacity', icon: <Sliders size={16} /> },
        ];
      case 'provider':
      case 'researcher':
        return [
          { label: 'Lab Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
          { label: 'Propose Template', path: '/dashboard/propose-template', icon: <PlusCircle size={16} /> },
          { label: 'Sponsored Layouts', path: '/dashboard/my-templates', icon: <ClipboardList size={16} /> },
          { label: 'Active Lab Groups', path: '/dashboard/lab-groups', icon: <Users size={16} /> },
        ];
      case 'admin':
        return [
          { label: 'Admin Panel', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
          { label: 'Template Approvals', path: '/dashboard/approve-templates', icon: <CheckSquare size={16} /> },
          { label: 'Provider Verification', path: '/dashboard/verify-providers', icon: <ShieldAlert size={16} /> },
          { label: 'User Management', path: '/dashboard/users', icon: <Users size={16} /> },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Unified Top Navigation & Identity Navbar */}
      <header style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 1000 }}>
        
        {/* Left Segment: Core Platform Branding & Context Role Identifier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link 
            to="/dashboard" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a202c', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.05em' }}
          >
            Gateway 
            <span style={{ color: '#3182ce', fontSize: '0.75rem', textTransform: 'uppercase', backgroundColor: '#ebf8ff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.05em' }}>
              {userRole}
            </span>
          </Link>

          {/* Horizontal Middleware Navigation Layout for Admin/Faculty Roles */}
          {links.length > 0 && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: '#4a5568', textDecoration: 'none', borderRadius: '6px', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#edf2f7'; e.currentTarget.style.color = '#1a202c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4a5568'; }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Segment: Session Actions & User Profile Context Matrix */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          {/* Identity Context Anchor */}
          <Link 
            to="/dashboard/profile"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a5568', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3182ce'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#4a5568'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>
              <User size={16} />
            </div>
            <span>{user?.unique_name || user?.email || 'Authenticated Account'}</span>
          </Link>

          {/* Minimalist, Integrated Session Clearance Trigger */}
          <button
            onClick={handleLogoutClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.75rem', backgroundColor: 'transparent', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; e.currentTarget.style.borderColor = '#e53e3e'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#fed7d7'; }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Structural Window Container Node with Responsive Grid Thresholds */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default WorkspaceLayout;