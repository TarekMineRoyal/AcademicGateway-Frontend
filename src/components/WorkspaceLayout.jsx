import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
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

  // Structured Left-Hand Navigation Configuration matching Design Matrix requirements
  const getNavLinks = () => {
    switch (userRole) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Project Marketplace', path: '/dashboard/marketplace', icon: <BookOpen size={18} /> },
          { label: 'My Profile', path: '/dashboard/profile', icon: <User size={18} /> },
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

  const links = getNavLinks();

  return (
    <div className="min-h-screen flex bg-brand-light font-sans">
      
      {/* Fixed-Width Left Navigation Sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-4 sticky top-0 flex flex-col justify-between shrink-0">
        
        {/* Top Segment: Core Branding & Context Routing Links */}
        <div className="flex flex-col gap-6">
          
          {/* Rebranded Context Headroom */}
          <Link 
            to="/dashboard" 
            className="flex items-center justify-between gap-2 no-underline text-brand-dark font-bold text-lg tracking-tight px-2 py-1"
          >
            <span className="truncate">Academic Gateway</span>
            <span className="bg-primary-light text-primary rounded-btn px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0">
              {userRole || 'Guest'}
            </span>
          </Link>

          {/* Dynamic Link Execution Section */}
          {links.length > 0 && (
            <nav className="flex flex-col gap-1">
              {links.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.path}
                  // Prevents the base path /dashboard from remaining active when on sub-routes
                  end={link.path === '/dashboard'}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-btn font-medium text-sm transition-colors duration-200 ease-in-out ${
                      isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                    }`
                  }
                >
                  <span className="shrink-0">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Bottom Segment: Anchor Session & Identity Control Center */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
          
          {/* Identity Context Anchor block */}
          <NavLink 
            to="/dashboard/profile"
            className={({ isActive }) => 
              `flex items-center gap-3 p-2 rounded-btn transition-colors duration-200 ease-in-out ${
                isActive 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
              }`
            }
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
              <User size={16} />
            </div>
            <span className="text-sm font-medium truncate max-w-full">
              {user?.unique_name || user?.email || 'Authenticated Account'}
            </span>
          </NavLink>

          {/* Sleek Semantic Session Clearance Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-600 rounded-btn transition-all duration-200 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Right Column: Application Main Viewport Wrapper */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default WorkspaceLayout;