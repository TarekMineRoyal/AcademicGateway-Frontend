import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('returns the initial value immediately on initial render without delay', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      expect(result.current).toBe('initial');
    });

    it('handles falsy primitive initial values correctly (0, false, empty string, null, undefined, NaN)', () => {
      expect(renderHook(() => useDebounce(0, 300)).result.current).toBe(0);
      expect(renderHook(() => useDebounce(false, 300)).result.current).toBe(false);
      expect(renderHook(() => useDebounce('', 300)).result.current).toBe('');
      expect(renderHook(() => useDebounce(null, 300)).result.current).toBeNull();
      expect(renderHook(() => useDebounce(undefined, 300)).result.current).toBeUndefined();
      expect(renderHook(() => useDebounce(NaN, 300)).result.current).toBeNaN();
    });
  });

  describe('Debounce Timing & Delayed Updates', () => {
    it('delays value update until the specified delay threshold passes', () => {
      const { result, rerender } = renderHook(
        ({ val, delay }) => useDebounce(val, delay),
        { initialProps: { val: 'start', delay: 300 } }
      );

      rerender({ val: 'updated', delay: 300 });

      // Before delay threshold, value remains initial
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('start');

      // Exact threshold reached
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('updated');
    });

    it('uses default delay of 300ms when delay parameter is omitted', () => {
      const { result, rerender } = renderHook(
        ({ val }) => useDebounce(val),
        { initialProps: { val: 'default-test' } }
      );

      rerender({ val: 'default-changed' });

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('default-test');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('default-changed');
    });

    it('handles 0ms delay correctly via timer queue tick', () => {
      const { result, rerender } = renderHook(
        ({ val, delay }) => useDebounce(val, delay),
        { initialProps: { val: 'immediate', delay: 0 } }
      );

      rerender({ val: 'zero-delay-changed', delay: 0 });

      expect(result.current).toBe('immediate');

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe('zero-delay-changed');
    });
  });

  describe('Rapid Consecutive Updates (Reset Logic)', () => {
    it('resets timer on rapid consecutive updates and only emits the last value', () => {
      const { result, rerender } = renderHook(
        ({ val }) => useDebounce(val, 500),
        { initialProps: { val: 'a' } }
      );

      // Rapid typing simulation: 'a' -> 'ab' -> 'abc' -> 'searched'
      rerender({ val: 'ab' });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('a');

      rerender({ val: 'abc' });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('a');

      rerender({ val: 'searched' });
      act(() => {
        vi.advanceTimersByTime(499);
      });
      // 890ms total elapsed, but only 499ms since last rerender
      expect(result.current).toBe('a');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      // 500ms since last rerender: final value emitted
      expect(result.current).toBe('searched');
    });
  });

  describe('Dynamic Delay Alteration', () => {
    it('resets timer with new delay duration when delay prop changes dynamically', () => {
      const { result, rerender } = renderHook(
        ({ val, delay }) => useDebounce(val, delay),
        { initialProps: { val: 'initial', delay: 1000 } }
      );

      rerender({ val: 'changed', delay: 1000 });

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current).toBe('initial');

      // Change delay mid-flight to 200ms
      rerender({ val: 'changed', delay: 200 });

      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('changed');
    });
  });

  describe('Complex Reference Types', () => {
    it('handles nested objects and array value updates safely', () => {
      const initialObj = { search: 'term', filters: [1, 2] };
      const updatedObj = { search: 'term', filters: [1, 2, 3] };

      const { result, rerender } = renderHook(
        ({ val }) => useDebounce(val, 300),
        { initialProps: { val: initialObj } }
      );

      expect(result.current).toBe(initialObj);

      rerender({ val: updatedObj });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe(updatedObj);
    });
  });

  describe('Unmount Cleanup', () => {
    it('clears active timeout on unmount to prevent state updates on unmounted components', () => {
      const { result, rerender, unmount } = renderHook(
        ({ val }) => useDebounce(val, 500),
        { initialProps: { val: 'first' } }
      );

      rerender({ val: 'unmounted-test' });

      unmount();

      expect(() => {
        act(() => {
          vi.advanceTimersByTime(500);
        });
      }).not.toThrow();

      // Ensure state was not updated after unmount
      expect(result.current).toBe('first');
    });
  });
});