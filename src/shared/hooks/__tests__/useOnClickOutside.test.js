import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useOnClickOutside } from '../useOnClickOutside';

describe('useOnClickOutside', () => {
  let handler;
  let targetElement;
  let childElement;
  let outsideElement;

  beforeEach(() => {
    handler = vi.fn();

    // Set up DOM hierarchy:
    // <div id="outside"></div>
    // <div id="target"><button id="child"></button></div>
    targetElement = document.createElement('div');
    targetElement.setAttribute('id', 'target');

    childElement = document.createElement('button');
    childElement.setAttribute('id', 'child');
    targetElement.appendChild(childElement);

    outsideElement = document.createElement('div');
    outsideElement.setAttribute('id', 'outside');

    document.body.appendChild(targetElement);
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  const fireMouseEvent = (type, element) => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  };

  const fireTouchEvent = (type, element) => {
    const event = new TouchEvent(type, { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  };

  describe('Outside Event Triggers', () => {
    it('executes handler when mousedown occurs on an outside DOM element', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      const event = fireMouseEvent('mousedown', outsideElement);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('executes handler when touchstart occurs on an outside DOM element', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      const event = fireTouchEvent('touchstart', outsideElement);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('executes handler when clicking directly on document body outside target element', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', document.body);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Inside Event Isolation', () => {
    it('ignores mousedown events directly on the target element', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', targetElement);

      expect(handler).not.toHaveBeenCalled();
    });

    it('ignores touchstart events directly on the target element', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      fireTouchEvent('touchstart', targetElement);

      expect(handler).not.toHaveBeenCalled();
    });

    it('ignores clicks on nested child elements inside the target container', () => {
      const ref = { current: targetElement };
      renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', childElement);
      fireTouchEvent('touchstart', childElement);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases & Null/Unattached Refs', () => {
    it('does not trigger handler when ref.current is null', () => {
      const ref = { current: null };
      renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', outsideElement);
      fireTouchEvent('touchstart', outsideElement);

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not trigger handler when ref.current is undefined', () => {
      const ref = { current: undefined };
      renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', outsideElement);

      expect(handler).not.toHaveBeenCalled();
    });

    it('handles ref changing from null to a valid DOM node dynamically', () => {
      const ref = { current: null };
      const { rerender } = renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', outsideElement);
      expect(handler).not.toHaveBeenCalled();

      // Attach ref
      ref.current = targetElement;
      rerender();

      fireMouseEvent('mousedown', outsideElement);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dynamic Handler Updates', () => {
    it('uses updated handler callback reference when re-rendered', () => {
      const initialHandler = vi.fn();
      const newHandler = vi.fn();

      const ref = { current: targetElement };
      const { rerender } = renderHook(
        ({ cb }) => useOnClickOutside(ref, cb),
        { initialProps: { cb: initialHandler } }
      );

      rerender({ cb: newHandler });

      fireMouseEvent('mousedown', outsideElement);

      expect(initialHandler).not.toHaveBeenCalled();
      expect(newHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Unmount Cleanup', () => {
    it('removes mousedown and touchstart event listeners from document on unmount', () => {
      const ref = { current: targetElement };
      const { unmount } = renderHook(() => useOnClickOutside(ref, handler));

      fireMouseEvent('mousedown', outsideElement);
      expect(handler).toHaveBeenCalledTimes(1);

      unmount();

      fireMouseEvent('mousedown', outsideElement);
      fireTouchEvent('touchstart', outsideElement);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});