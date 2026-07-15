import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search,
  Mail,
  Bell,
  Settings,
  Sun,
  LogOut, 
  User 
} from 'lucide-react';

function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role?.toLowerCase();
  
  // Interactive state modifier for the Settings popover/menu block
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Upgraded Chess.com-inspired Unified Navigation Matrix
  const getNavLinks = () => {
    // Current focus is optimization of the student view and future feature roadmap
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

        {/* Bottom Segment: Settings Popover Controller & User Profile Identity Dock */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 relative">
          
          {/* Interactive Floating Settings Popover/Menu */}
          {isSettingsOpen && (
            <div className="absolute bottom-[110px] left-2 right-2 bg-white border border-slate-200 shadow-xl rounded-card p-1.5 flex flex-col gap-0.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button 
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-btn transition-colors text-left cursor-pointer"
              >
                <Sun size={14} className="text-slate-400" />
                <span>Light/Dark UI</span>
              </button>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-btn transition-colors text-left cursor-pointer"
              >
                <LogOut size={14} className="text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Interactive Settings Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-btn font-medium text-sm transition-colors duration-200 ease-in-out cursor-pointer text-left ${
              isSettingsOpen 
                ? 'bg-slate-100 text-brand-dark' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <Settings size={20} className="text-slate-400" />
            <span className="flex-1">Settings</span>
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
              {user?.unique_name || user?.email || 'Account'}
            </span>
          </NavLink>
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