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

  // Dynamic Navigation Config Map based on backend aggregate identity matrices
  const getSidebarLinks = () => {
    switch (userRole) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Browse Marketplace', path: '/dashboard/marketplace', icon: <BookOpen size={18} /> },
          { label: 'My Applications', path: '/dashboard/applications', icon: <ClipboardList size={18} /> },
          { label: 'Project Milestones', path: '/dashboard/milestones', icon: <CheckSquare size={18} /> },
        ];
      case 'professor':
        return [
          { label: 'Console Home', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Supervision Requests', path: '/dashboard/supervision-requests', icon: <Users size={18} /> },
          { label: 'Active Projects', path: '/dashboard/active-projects', icon: <BookOpen size={18} /> },
          { label: 'Capacity Management', path: '/dashboard/capacity', icon: <Sliders size={18} /> },
        ];
      case 'provider':
      case 'researcher':
        return [
          { label: 'Lab Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Propose Template', path: '/dashboard/propose-template', icon: <PlusCircle size={18} /> },
          { label: 'Sponsored Layouts', path: '/dashboard/my-templates', icon: <ClipboardList size={18} /> },
          { label: 'Active Lab Groups', path: '/dashboard/lab-groups', icon: <Users size={18} /> },
        ];
      case 'admin':
        return [
          { label: 'Admin Panel', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Template Approvals', path: '/dashboard/approve-templates', icon: <CheckSquare size={18} /> },
          { label: 'Provider Verification', path: '/dashboard/verify-providers', icon: <ShieldAlert size={18} /> },
          { label: 'User Management', path: '/dashboard/users', icon: <Users size={18} /> },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Structural Sidebar Navigation Panel */}
      <aside style={{ width: '260px', backgroundColor: '#1a202c', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2d3748', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.05em' }}>
          Gateway <span style={{ color: '#4299e1', fontSize: '0.85rem', textTransform: 'uppercase', verticalAlign: 'middle' }}>{userRole}</span>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#cbd5e0', textDecoration: 'none', borderRadius: '6px', fontWeight: '500', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d3748'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#cbd5e0'; }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer Session Action Segment */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #2d3748' }}>
          <button
            onClick={handleLogoutClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
          >
            <LogOut size={18} />
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* Main Structural Right Window Split Frame */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Synchronized Top Identity Context Bar */}
        <header style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2rem' }}>
          {/* Clickable Identity Context Core Element linking to profile route */}
          <Link 
            to="/dashboard/profile"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              color: '#4a5568', 
              fontWeight: '500', 
              fontSize: '0.95rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3182ce'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#4a5568'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>
              <User size={16} />
            </div>
            <span>{user?.unique_name || user?.email || 'Authenticated Account'}</span>
          </Link>
        </header>

        {/* Scalable Container Window for Nested Child Routes */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default WorkspaceLayout;