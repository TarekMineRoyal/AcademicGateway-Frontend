import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Helper function to decode standard JWT payloads without heavy third-party libraries
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          token,
          id: decoded.id || decoded.sub,
          role: decoded.role, // Pure flat resolution
          email: decoded.email
        });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = parseJwt(token);
    
    if (decoded) {
      setUser({
        token,
        id: decoded.id || decoded.sub,
        role: decoded.role, // Pure flat resolution
        email: decoded.email
      });
      return decoded.role; // Return role to component so it can handle immediate redirects
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

export const useAuth = () => useContext(AuthContext);