import { useEffect } from 'react';

/**
 * Custom hook that invokes a callback when a click or touch event
 * occurs outside the referenced DOM element.
 *
 * @param {React.RefObject} ref - React ref object pointing to the target DOM element.
 * @param {Function} handler - Callback function executed on an outside click/touch event.
 */
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or its descendant elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;