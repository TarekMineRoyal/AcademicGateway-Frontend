import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('initializes with toast as null', () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toast).toBeNull();
    });
  });

  describe('showToast & Payload Normalization', () => {
    it('coerces string payload into a standardized info toast object', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Profile updated successfully');
      });

      expect(result.current.toast).toEqual({
        type: 'info',
        text: 'Profile updated successfully',
      });
    });

    it('handles empty string payload by coercing to info toast with empty text', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('');
      });

      expect(result.current.toast).toEqual({
        type: 'info',
        text: '',
      });
    });

    it('accepts custom toast object payloads without modifying structure', () => {
      const { result } = renderHook(() => useToast());

      const customToast = {
        type: 'error',
        text: 'Failed to delete record',
        duration: 5000,
        actionLabel: 'Retry',
      };

      act(() => {
        result.current.showToast(customToast);
      });

      expect(result.current.toast).toEqual(customToast);
    });

    it('handles null or undefined passed explicitly to showToast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast(null);
      });

      expect(result.current.toast).toBeNull();
    });
  });

  describe('Auto-Dismiss Timing & Timer Reset', () => {
    it('automatically dismisses toast after default delay (4000ms)', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Auto dismiss test');
      });

      expect(result.current.toast).not.toBeNull();

      // Advance time right before threshold
      act(() => {
        vi.advanceTimersByTime(3999);
      });
      expect(result.current.toast).not.toBeNull();

      // Advance past threshold
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.toast).toBeNull();
    });

    it('respects custom autoDismissDelay parameter', () => {
      const { result } = renderHook(() => useToast(1500));

      act(() => {
        result.current.showToast('Custom delay test');
      });

      act(() => {
        vi.advanceTimersByTime(1499);
      });
      expect(result.current.toast).not.toBeNull();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.toast).toBeNull();
    });

    it('resets auto-dismiss timer when a new toast is triggered before previous timer expires', () => {
      const { result } = renderHook(() => useToast(4000));

      act(() => {
        result.current.showToast('First Toast');
      });

      // Advance 2500ms
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(result.current.toast).toEqual({ type: 'info', text: 'First Toast' });

      // Trigger new toast prior to expiration
      act(() => {
        result.current.showToast('Second Toast');
      });
      expect(result.current.toast).toEqual({ type: 'info', text: 'Second Toast' });

      // Advance another 2500ms (total 5000ms from start, but 2500ms from second call)
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      // Second toast must still be active due to timer reset
      expect(result.current.toast).toEqual({ type: 'info', text: 'Second Toast' });

      // Advance remaining 1500ms
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(result.current.toast).toBeNull();
    });
  });

  describe('Manual Dismiss & Direct State Control', () => {
    it('resets toast state immediately when hideToast is called', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Manual hide test');
      });

      expect(result.current.toast).not.toBeNull();

      act(() => {
        result.current.hideToast();
      });

      expect(result.current.toast).toBeNull();
    });

    it('allows direct state mutation using setToast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.setToast({ type: 'warning', text: 'Direct set' });
      });

      expect(result.current.toast).toEqual({ type: 'warning', text: 'Direct set' });
    });
  });

  describe('Unmount Cleanup', () => {
    it('clears active timer on component unmount without causing memory leaks or state update errors', () => {
      const { result, unmount } = renderHook(() => useToast(4000));

      act(() => {
        result.current.showToast('Unmount test');
      });

      unmount();

      expect(() => {
        act(() => {
          vi.advanceTimersByTime(4000);
        });
      }).not.toThrow();
    });
  });
});