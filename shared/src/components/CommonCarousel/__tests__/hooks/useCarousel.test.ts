import { renderHook, act } from '@testing-library/react';
import { useCarousel } from '../../hooks/useCarousel';

describe('useCarousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('initialization', () => {
    it('should initialize with activeIndex as 0', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      expect(result.current.activeIndex).toBe(0);
    });

    it('should return all navigation functions', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      expect(typeof result.current.handlePrev).toBe('function');
      expect(typeof result.current.handleNext).toBe('function');
      expect(typeof result.current.goToSlide).toBe('function');
    });
  });

  describe('navigation with handleNext', () => {
    it('should increment activeIndex when handleNext is called', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should wrap to 0 when handleNext is called at the last slide', () => {
      const { result } = renderHook(() =>
        useCarousel(3, false, 3000)
      );

      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        result.current.handleNext();
      });
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('navigation with handlePrev', () => {
    it('should decrement activeIndex when handlePrev is called', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        result.current.goToSlide(3);
      });

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.activeIndex).toBe(2);
    });

    it('should wrap to last slide when handlePrev is called at index 0', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      expect(result.current.activeIndex).toBe(0);

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.activeIndex).toBe(4);
    });
  });

  describe('navigation with goToSlide', () => {
    it('should set activeIndex to the specified value', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        result.current.goToSlide(3);
      });

      expect(result.current.activeIndex).toBe(3);
    });

    it('should handle going to first and last slides', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        result.current.goToSlide(4);
      });
      expect(result.current.activeIndex).toBe(4);

      act(() => {
        result.current.goToSlide(0);
      });
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('autoPlay functionality', () => {
    it('should auto-advance when autoPlay is true', () => {
      const { result } = renderHook(() =>
        useCarousel(5, true, 3000)
      );

      expect(result.current.activeIndex).toBe(0);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should continue auto-advancing at each interval', () => {
      const { result } = renderHook(() =>
        useCarousel(5, true, 2000)
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.activeIndex).toBe(1);

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.activeIndex).toBe(3);
    });

    it('should not auto-advance when autoPlay is false', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it('should wrap around when auto-advancing past the last slide', () => {
      const { result } = renderHook(() =>
        useCarousel(3, true, 1000)
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current.activeIndex).toBe(0); // Wrapped around
    });
  });

  describe('keyboard navigation', () => {
    const dispatchKeyboardEvent = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      globalThis.dispatchEvent(event);
    };

    it('should navigate to previous slide on ArrowLeft', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        dispatchKeyboardEvent('ArrowLeft');
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should navigate to next slide on ArrowRight', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        dispatchKeyboardEvent('ArrowRight');
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should ignore other keys', () => {
      const { result } = renderHook(() =>
        useCarousel(5, false, 3000)
      );

      act(() => {
        dispatchKeyboardEvent('ArrowUp');
        dispatchKeyboardEvent('ArrowDown');
        dispatchKeyboardEvent('Enter');
      });

      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('combined functionality', () => {
    const dispatchKeyboardEvent = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      globalThis.dispatchEvent(event);
    };

    it('should work with autoPlay and manual navigation', () => {
      const { result } = renderHook(() =>
        useCarousel(5, true, 3000)
      );

      // Auto advance
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current.activeIndex).toBe(1);

      // Manual navigation
      act(() => {
        result.current.goToSlide(4);
      });
      expect(result.current.activeIndex).toBe(4);

      // Auto advance continues from new position
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current.activeIndex).toBe(0); // Wrapped
    });

    it('should work with autoPlay and keyboard navigation', () => {
      const { result } = renderHook(() =>
        useCarousel(5, true, 3000)
      );

      // Auto advance
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current.activeIndex).toBe(1);

      // Keyboard navigation
      act(() => {
        dispatchKeyboardEvent('ArrowRight');
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        dispatchKeyboardEvent('ArrowLeft');
      });
      expect(result.current.activeIndex).toBe(1);
    });

    it('should work with all navigation methods together', () => {
      const { result } = renderHook(() =>
        useCarousel(5, true, 2000)
      );

      // Start at 0
      expect(result.current.activeIndex).toBe(0);

      // Auto advance to 1
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.activeIndex).toBe(1);

      // Keyboard to 2
      act(() => {
        dispatchKeyboardEvent('ArrowRight');
      });
      expect(result.current.activeIndex).toBe(2);

      // goToSlide to 4
      act(() => {
        result.current.goToSlide(4);
      });
      expect(result.current.activeIndex).toBe(4);

      // handlePrev to 3
      act(() => {
        result.current.handlePrev();
      });
      expect(result.current.activeIndex).toBe(3);

      // handleNext to 4
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.activeIndex).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('should handle single item carousel', () => {
      const { result } = renderHook(() =>
        useCarousel(1, false, 3000)
      );

      act(() => {
        result.current.handleNext();
      });
      expect(result.current.activeIndex).toBe(0);

      act(() => {
        result.current.handlePrev();
      });
      expect(result.current.activeIndex).toBe(0);
    });

    it('should handle empty carousel (0 items)', () => {
      const { result } = renderHook(() =>
        useCarousel(0, false, 3000)
      );

      expect(result.current.activeIndex).toBe(0);

      // Should not throw errors
      act(() => {
        result.current.handleNext();
        result.current.handlePrev();
      });
    });
  });

  describe('cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() =>
        useCarousel(5, true, 3000)
      );

      const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval');
      const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
