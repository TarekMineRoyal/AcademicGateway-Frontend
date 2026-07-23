import { useRef, useEffect } from 'react';

/**
 * Custom hook to abstract DOM scrollIntoView side-effects based on reactive dependencies.
 *
 * @param {Array} deps - Dependency array that triggers the scroll effect when values change.
 * @param {boolean} [enabled=true] - Guard condition to determine if scrolling should execute.
 * @param {ScrollIntoViewOptions} [options={ behavior: 'smooth' }] - Scroll configuration options.
 * @returns {React.RefObject} Ref object to attach to the target DOM element.
 */
export function useScrollToView(deps = [], enabled = true, options = { behavior: 'smooth' }) {
  const targetRef = useRef(null);

  useEffect(() => {
    if (enabled && targetRef.current) {
      targetRef.current.scrollIntoView(options);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return targetRef;
}