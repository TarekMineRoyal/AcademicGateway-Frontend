import { useState } from 'react';
import { AuthContext, handleTokenHydration } from './AuthContextCore.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const normalizedUser = handleTokenHydration(token);
      if (normalizedUser) return normalizedUser;
      localStorage.removeItem('token');
    }
    return null;
  });
  const [loading] = useState(false);

  const login = (token) => {
    localStorage.setItem('token', token);
    const normalizedUser = handleTokenHydration(token);
    
    if (normalizedUser) {
      setUser(normalizedUser);
      return normalizedUser.role; // Return role to component so it can handle immediate redirects
    }
    return null;
  };

  const logout = (navigateCallback) => {
    localStorage.removeItem('token');
    setUser(null);
    
    if (navigateCallback && typeof navigateCallback === 'function') {
      navigateCallback();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};