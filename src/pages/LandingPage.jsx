import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Award, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      
      {/* Top Navigation Bar */}
      <header className="w-full h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
        <div className="font-bold text-xl tracking-tight text-brand-dark">
          Academic<span className="text-primary">Gateway</span>
        </div>
        
        {user ? (
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-btn bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all cursor-pointer shadow-sm"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={() => handleNavigation('/login')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-btn bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all cursor-pointer shadow-sm"
          >
            <LogIn size={18} />
            Sign In
          </button>
        )}
      </header>

      {/* Hero Core Segment */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-dark mb-4">
            The R&D Capstone Marketplace
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Connecting lab researchers with ambitious students and expert faculty mentors to build real-world graduation projects.
          </p>
        </div>

        {/* Intent-Driven Onboarding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          
          {/* Path A: Students */}
          <div className="bg-white p-8 rounded-card shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Students</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
              Launch your career. Discover, apply for, and claim high-impact graduation projects sourced directly from real research initiatives.
            </p>
            <button 
              onClick={() => handleNavigation('/register/student')}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-btn transition-colors duration-200 cursor-pointer"
            >
              Find a Capstone
            </button>
          </div>

          {/* Path B: Faculty Mentors */}
          <div className="bg-white p-8 rounded-card shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Award size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Professors</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
              Provide academic oversight. Manage mentorship assignments, evaluate research milestones, and guide student success.
            </p>
            <button 
              onClick={() => handleNavigation('/register/professor')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-btn transition-colors duration-200 cursor-pointer"
            >
              Manage Mentorships
            </button>
          </div>

          {/* Path C: Researchers / Providers */}
          <div className="bg-white p-8 rounded-card shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Briefcase size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">Researchers</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
              Sponsor innovation. Propose project templates mapped to your lab's active requirements and collaborate with academic teams.
            </p>
            <button 
              onClick={() => handleNavigation('/register/provider')}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-btn transition-colors duration-200 cursor-pointer"
            >
              Sponsor Projects
            </button>
          </div>

        </div>
      </main>

      {/* Footer Utility */}
      <footer className="w-full py-6 text-center border-t border-slate-200 text-slate-400 text-xs mt-auto">
        &copy; {new Date().getFullYear()} Academic Gateway. Clean Architecture Integrated Workspace.
      </footer>
    </div>
  );
}

export default LandingPage;