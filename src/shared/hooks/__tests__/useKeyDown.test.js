import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useKeyDown } from '../useKeyDown';

describe('useKeyDown', () => {
  let handler;

  beforeEach(() => {
    handler = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const fireKeyDown = (key, eventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, ...eventInit });
    window.dispatchEvent(event);
    return event;
  };

  describe('Single Key Matching', () => {
    it('executes handler when specified single string key is pressed', () => {
      renderHook(() => useKeyDown('Escape', handler));

      const event = fireKeyDown('Escape');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('ignores keydown events for unmatched single string keys', () => {
      renderHook(() => useKeyDown('Escape', handler));

      fireKeyDown('Enter');
      fireKeyDown('Tab');
      fireKeyDown('ArrowDown');

      expect(handler).not.toHaveBeenCalled();
    });

    it('enforces exact case sensitivity matching for string keys', () => {
      renderHook(() => useKeyDown('Escape', handler));

      fireKeyDown('escape');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Array of Keys Matching', () => {
    it('executes handler when any key in the specified array is pressed', () => {
      renderHook(() => useKeyDown(['Enter', 'Space'], handler));

      fireKeyDown('Enter');
      expect(handler).toHaveBeenCalledTimes(1);

      fireKeyDown('Space');
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('ignores keydown events when pressed key is not in the array', () => {
      renderHook(() => useKeyDown(['Enter', 'Space'], handler));

      fireKeyDown('Escape');
      fireKeyDown('a');

      expect(handler).not.toHaveBeenCalled();
    });

    it('handles empty target key array without triggering handler or throwing errors', () => {
      renderHook(() => useKeyDown([], handler));

      fireKeyDown('Enter');
      fireKeyDown('Escape');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Dynamic Prop & Handler Updates', () => {
    it('updates key matching rules when targetKey prop changes dynamically', () => {
      const { rerender } = renderHook(
        ({ key }) => useKeyDown(key, handler),
        { initialProps: { key: 'Escape' } }
      );

      fireKeyDown('Escape');
      expect(handler).toHaveBeenCalledTimes(1);

      // Dynamically change target key to 'Enter'
      rerender({ key: 'Enter' });

      // 'Escape' should no longer fire handler
      fireKeyDown('Escape');
      expect(handler).toHaveBeenCalledTimes(1);

      // 'Enter' should now fire handler
      fireKeyDown('Enter');
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('uses latest handler reference when handler function changes dynamically', () => {
      const initialHandler = vi.fn();
      const updatedHandler = vi.fn();

      const { rerender } = renderHook(
        ({ callback }) => useKeyDown('Escape', callback),
        { initialProps: { callback: initialHandler } }
      );

      rerender({ callback: updatedHandler });

      fireKeyDown('Escape');

      expect(initialHandler).not.toHaveBeenCalled();
      expect(updatedHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases & Non-String Target Keys', () => {
    it('handles null or undefined targetKey safely without throwing errors', () => {
      renderHook(() => useKeyDown(null, handler));
      renderHook(() => useKeyDown(undefined, handler));

      expect(() => {
        fireKeyDown('Escape');
      }).not.toThrow();

      expect(handler).not.toHaveBeenCalled();
    });

    it('handles empty string targetKey accurately', () => {
      renderHook(() => useKeyDown('', handler));

      fireKeyDown('Escape');
      expect(handler).not.toHaveBeenCalled();

      fireKeyDown('');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('EventListener Cleanup & Unmounting', () => {
    it('removes window event listener on component unmount', () => {
      const { unmount } = renderHook(() => useKeyDown('Escape', handler));

      fireKeyDown('Escape');
      expect(handler).toHaveBeenCalledTimes(1);

      unmount();

      fireKeyDown('Escape');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});