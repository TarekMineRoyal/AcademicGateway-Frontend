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

/**
 * Normalizes identity claims directly at the token decryption boundary
 * so presentational views never have to guess property variations.
 */
export function handleTokenHydration(token) {
  const decoded = parseJwt(token);
  if (!decoded) return null;

  return {
    token,
    id: decoded.id || decoded.sub,
    name: decoded.fullName || decoded.unique_name,
    role: decoded.role,
    email: decoded.email,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const normalizedUser = handleTokenHydration(token);
      if (normalizedUser) {
        setUser(normalizedUser);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

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

export const useAuth = () => useContext(AuthContext);