import { useEffect } from 'react';

/**
 * Custom hook that listens for window keydown events and fires a callback 
 * when specified target key(s) are pressed.
 *
 * @param {string|string[]} targetKey - Key name (e.g., 'Escape') or array of key names to match.
 * @param {Function} handler - Callback function executed when matching key is pressed.
 */
export const useKeyDown = (targetKey, handler) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMatch = Array.isArray(targetKey)
        ? targetKey.includes(event.key)
        : event.key === targetKey;

      if (isMatch) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, handler]);
};

export default useKeyDown;