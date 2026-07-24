import { useEffect } from 'react';

/**
 * Custom hook to manage browser IntersectionObserver lifecycle.
 * Useful for infinite scroll triggers and visibility monitoring.
 * 
 * @param {Object} params
 * @param {React.RefObject} params.targetRef - React ref attached to the target DOM element
 * @param {Function} params.onIntersect - Callback triggered when target element becomes visible
 * @param {boolean} [params.enabled=true] - Enable or disable active observation
 * @param {Element|null} [params.root=null] - Observer root element
 * @param {string} [params.rootMargin='0px'] - Observer root margin
 * @param {number|number[]} [params.threshold=1.0] - Observer threshold
 */
export function useIntersectionObserver({
  targetRef,
  onIntersect,
  enabled = true,
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
}) {
  useEffect(() => {
    if (!enabled) return;

    const observerElement = targetRef?.current;
    if (!observerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && onIntersect) {
          onIntersect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(observerElement);

    return () => {
      if (observerElement) {
        observer.unobserve(observerElement);
      }
    };
  }, [targetRef, onIntersect, enabled, root, rootMargin, threshold]);
}