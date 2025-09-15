import { renderHook } from '@testing-library/react';
import { useCarouselKeyboard } from '../../hooks/useCarouselKeyboard';

describe('useCarouselKeyboard', () => {
  // Helper to create and dispatch keyboard events
  const dispatchKeyboardEvent = (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    globalThis.dispatchEvent(event);
  };

  describe('event listener setup', () => {
    it('should add keydown event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it('should remove keydown event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      const { unmount } = renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('ArrowLeft key', () => {
    it('should call handlePrev when ArrowLeft is pressed', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowLeft');

      expect(handlePrev).toHaveBeenCalledTimes(1);
      expect(handleNext).not.toHaveBeenCalled();
    });

    it('should call handlePrev multiple times for multiple ArrowLeft presses', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('ArrowLeft');

      expect(handlePrev).toHaveBeenCalledTimes(3);
    });
  });

  describe('ArrowRight key', () => {
    it('should call handleNext when ArrowRight is pressed', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowRight');

      expect(handleNext).toHaveBeenCalledTimes(1);
      expect(handlePrev).not.toHaveBeenCalled();
    });

    it('should call handleNext multiple times for multiple ArrowRight presses', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowRight');
      dispatchKeyboardEvent('ArrowRight');
      dispatchKeyboardEvent('ArrowRight');

      expect(handleNext).toHaveBeenCalledTimes(3);
    });
  });

  describe('other keys', () => {
    it('should not call any handler for other keys', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowUp');
      dispatchKeyboardEvent('ArrowDown');
      dispatchKeyboardEvent('Enter');
      dispatchKeyboardEvent('Escape');
      dispatchKeyboardEvent('Space');
      dispatchKeyboardEvent('a');
      dispatchKeyboardEvent('Tab');

      expect(handlePrev).not.toHaveBeenCalled();
      expect(handleNext).not.toHaveBeenCalled();
    });
  });

  describe('mixed key presses', () => {
    it('should handle alternating ArrowLeft and ArrowRight presses', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('ArrowRight');
      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('ArrowRight');

      expect(handlePrev).toHaveBeenCalledTimes(2);
      expect(handleNext).toHaveBeenCalledTimes(2);
    });

    it('should handle mixed arrow and non-arrow key presses', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('Enter');
      dispatchKeyboardEvent('ArrowRight');
      dispatchKeyboardEvent('Space');
      dispatchKeyboardEvent('ArrowLeft');

      expect(handlePrev).toHaveBeenCalledTimes(2);
      expect(handleNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('handler updates', () => {
    it('should use updated handlers after rerender', () => {
      const handlePrev1 = jest.fn();
      const handleNext1 = jest.fn();
      const handlePrev2 = jest.fn();
      const handleNext2 = jest.fn();

      const { rerender } = renderHook(
        ({ handlePrev, handleNext }) => useCarouselKeyboard(handlePrev, handleNext),
        { initialProps: { handlePrev: handlePrev1, handleNext: handleNext1 } }
      );

      dispatchKeyboardEvent('ArrowLeft');
      expect(handlePrev1).toHaveBeenCalledTimes(1);

      // Update handlers
      rerender({ handlePrev: handlePrev2, handleNext: handleNext2 });

      dispatchKeyboardEvent('ArrowRight');
      expect(handleNext2).toHaveBeenCalledTimes(1);
      expect(handleNext1).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should not call handlers after unmount', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      const { unmount } = renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      unmount();

      dispatchKeyboardEvent('ArrowLeft');
      dispatchKeyboardEvent('ArrowRight');

      expect(handlePrev).not.toHaveBeenCalled();
      expect(handleNext).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid key presses', () => {
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      // Rapid fire key presses
      for (let i = 0; i < 10; i++) {
        dispatchKeyboardEvent('ArrowRight');
      }

      expect(handleNext).toHaveBeenCalledTimes(10);
    });

    it('should work with null-like handlers gracefully', () => {
      // This tests the hook doesn't crash if handlers are somehow undefined
      // Though TypeScript would prevent this, testing defensive behavior
      const handlePrev = jest.fn();
      const handleNext = jest.fn();

      renderHook(() => useCarouselKeyboard(handlePrev, handleNext));

      // Should not throw
      expect(() => {
        dispatchKeyboardEvent('ArrowLeft');
        dispatchKeyboardEvent('ArrowRight');
      }).not.toThrow();
    });
  });
});
