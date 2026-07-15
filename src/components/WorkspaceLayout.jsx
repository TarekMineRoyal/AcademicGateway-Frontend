import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search,
  Mail,
  Bell,
  Sun,
  Moon,
  LogOut, 
  User 
} from 'lucide-react';

function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role?.toLowerCase();
  
  // Local state to manage UI infrastructure for the theme toggle interface
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Chess.com-inspired Unified Navigation Matrix
  const getNavLinks = () => {
    switch (userRole) {
      case 'student':
      default:
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'Project Marketplace', path: '/dashboard/marketplace', icon: <BookOpen size={20} /> },
          { label: 'Search Users', path: '#', icon: <Search size={20} /> },
          { label: 'Messages', path: '#', icon: <Mail size={20} /> },
          { label: 'Notifications', path: '#', icon: <Bell size={20} /> },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-brand-light font-sans">
      
      {/* Locked Full-Height Left Navigation Sidebar */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 relative">
        
        {/* Top Segment: Core Branding & App Context Routing Links */}
        <div className="flex flex-col gap-6">
          
          {/* Streamlined Clean Header Branding */}
          <Link 
            to="/dashboard" 
            className="flex items-center no-underline px-2 py-1"
          >
            <span className="text-brand-dark font-bold text-lg tracking-tight">
              Academic Gateway
            </span>
          </Link>

          {/* Core Navigation Links Matrix */}
          {links.length > 0 && (
            <nav className="flex flex-col gap-1">
              {links.map((link, idx) => {
                const isPlaceholder = link.path === '#';
                
                return (
                  <NavLink
                    key={idx}
                    to={link.path}
                    end={link.path === '/dashboard'}
                    onClick={(e) => isPlaceholder && e.preventDefault()}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-btn font-medium text-sm transition-colors duration-200 ease-in-out ${
                        isActive && !isPlaceholder
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                      } ${isPlaceholder ? 'cursor-default opacity-80' : ''}`
                    }
                  >
                    <span className="shrink-0 text-slate-400 group-hover:text-slate-600">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          )}
        </div>

        {/* Bottom Segment: Integrated Theme Toggles, Identity, & Direct Sign Out */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
          
          {/* Direct Interactive Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-brand-dark transition-colors duration-200 ease-in-out cursor-pointer text-left"
          >
            <span className="shrink-0 text-slate-400">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </span>
            <span className="flex-1">{isDarkMode ? 'Dark UI' : 'Light UI'}</span>
          </button>
          
          {/* Profile Identity Context Anchor block */}
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
            <span className="text-sm font-medium text-slate-700 truncate max-w-[160px]">
              {user?.unique_name || 'Account'}
            </span>
          </NavLink>

          {/* Sleek, Permanently Visible Semantic Session Clearance Button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-600 rounded-btn transition-all duration-200 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold cursor-pointer mt-1"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Right Column: Independent Scrolling Main Application Viewport Wrapper */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-[1280px] mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default WorkspaceLayout;