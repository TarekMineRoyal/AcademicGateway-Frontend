import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage toast notification state and automatic timer cleanup.
 *
 * @param {number} [autoDismissDelay=4000] - Time in milliseconds before auto-dismissing.
 * @returns {Object} Toast state object and action handlers.
 */
export function useToast(autoDismissDelay = 4000) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [toast, autoDismissDelay]);

  const showToast = useCallback((data) => {
    if (typeof data === 'string') {
      setToast({ type: 'info', text: data });
    } else {
      setToast(data);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    setToast,
    showToast,
    hideToast,
  };
}