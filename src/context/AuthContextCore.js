import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

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
  } catch {
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

export const useAuth = () => useContext(AuthContext);