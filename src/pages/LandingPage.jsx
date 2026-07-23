import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Award, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContextCore';
import OnboardingCard from '../features/identity/components/OnboardingCard';

const ONBOARDING_CARDS = [
  {
    id: 'student',
    title: 'Students',
    description:
      'Launch your career. Discover, apply for, and claim high-impact graduation projects sourced directly from real research initiatives.',
    buttonText: 'Find a Capstone',
    buttonBgColor: 'bg-primary hover:bg-primary-hover',
    icon: GraduationCap,
    iconBgColor: 'bg-blue-50 text-blue-600',
    path: '/register/student',
  },
  {
    id: 'professor',
    title: 'Professors',
    description:
      'Provide academic oversight. Manage mentorship assignments, evaluate research milestones, and guide student success.',
    buttonText: 'Manage Mentorships',
    buttonBgColor: 'bg-emerald-600 hover:bg-emerald-700',
    icon: Award,
    iconBgColor: 'bg-emerald-50 text-emerald-600',
    path: '/register/professor',
  },
  {
    id: 'provider',
    title: 'Researchers',
    description:
      "Sponsor innovation. Propose project templates mapped to your lab's active requirements and collaborate with academic teams.",
    buttonText: 'Sponsor Projects',
    buttonBgColor: 'bg-amber-600 hover:bg-amber-700',
    icon: Briefcase,
    iconBgColor: 'bg-amber-50 text-amber-600',
    path: '/register/provider',
  },
];

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
          {ONBOARDING_CARDS.map((card) => (
            <OnboardingCard
              key={card.id}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              buttonBgColor={card.buttonBgColor}
              onButtonClick={() => handleNavigation(card.path)}
            />
          ))}
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