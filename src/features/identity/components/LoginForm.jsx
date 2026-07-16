import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { loginUser } from '../identityApi';
import { useAuth } from '../../../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // URL parameter tracking to display post-registration success feedback alerts
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);
      
      // Pass the token to AuthContext to save the session and update global state
      login(data.token);

      // All authenticated roles now route directly into our unified dashboard shell frame.
      // The ProtectedRoute and WorkspaceLayout components handle personalization automatically.
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-card shadow-xl border border-slate-100">
      {/* Header Branding */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-brand-dark">
          Academic<span className="text-primary">Gateway</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to access your R&D workspace</p>
      </div>

      {/* Success Notification Banner */}
      {justRegistered && !error && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3 rounded-btn text-sm mb-4 text-center font-medium animate-fadeIn">
          Account configured successfully! Please sign in using your credentials.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-btn text-sm mb-4 text-center font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-1.5">
            Email Address
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@university.edu"
            required 
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-btn text-brand-dark placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-1.5">
            Password
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-btn text-brand-dark placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover text-white rounded-btn transition-colors duration-200 py-2.5 px-4 font-semibold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 text-center space-y-2">
        <div>
          <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
            Forgot Password?
          </a>
        </div>
        <div className="text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;