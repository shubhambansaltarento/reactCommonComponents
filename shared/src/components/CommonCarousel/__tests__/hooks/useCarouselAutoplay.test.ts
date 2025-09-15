import { renderHook } from '@testing-library/react';
import { useCarouselAutoplay } from '../../hooks/useCarouselAutoplay';

describe('useCarouselAutoplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('when autoPlay is enabled', () => {
    it('should call handleNext after the specified interval', () => {
      const handleNext = jest.fn();
      const interval = 3000;

      renderHook(() => useCarouselAutoplay(true, interval, handleNext));

      expect(handleNext).not.toHaveBeenCalled();

      // Advance time by the interval
      jest.advanceTimersByTime(interval);

      expect(handleNext).toHaveBeenCalledTimes(1);
    });

    it('should call handleNext repeatedly at each interval', () => {
      const handleNext = jest.fn();
      const interval = 2000;

      renderHook(() => useCarouselAutoplay(true, interval, handleNext));

      // Advance through 5 intervals
      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(4);

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(5);
    });

    it('should respect custom interval values', () => {
      const handleNext = jest.fn();
      const customInterval = 5000;

      renderHook(() => useCarouselAutoplay(true, customInterval, handleNext));

      // Should not be called before the interval
      jest.advanceTimersByTime(4999);
      expect(handleNext).not.toHaveBeenCalled();

      // Should be called exactly at the interval
      jest.advanceTimersByTime(1);
      expect(handleNext).toHaveBeenCalledTimes(1);
    });

    it('should handle very short intervals', () => {
      const handleNext = jest.fn();
      const shortInterval = 100;

      renderHook(() => useCarouselAutoplay(true, shortInterval, handleNext));

      jest.advanceTimersByTime(1000);

      expect(handleNext).toHaveBeenCalledTimes(10);
    });

    it('should handle very long intervals', () => {
      const handleNext = jest.fn();
      const longInterval = 60000; // 1 minute

      renderHook(() => useCarouselAutoplay(true, longInterval, handleNext));

      jest.advanceTimersByTime(59999);
      expect(handleNext).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(handleNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('when autoPlay is disabled', () => {
    it('should not call handleNext', () => {
      const handleNext = jest.fn();
      const interval = 3000;

      renderHook(() => useCarouselAutoplay(false, interval, handleNext));

      jest.advanceTimersByTime(10000);

      expect(handleNext).not.toHaveBeenCalled();
    });

    it('should not set up an interval', () => {
      const handleNext = jest.fn();
      const setIntervalSpy = jest.spyOn(globalThis, 'setInterval');

      renderHook(() => useCarouselAutoplay(false, 3000, handleNext));

      // setInterval should not be called when autoPlay is false
      expect(setIntervalSpy).not.toHaveBeenCalled();

      setIntervalSpy.mockRestore();
    });
  });

  describe('toggling autoPlay', () => {
    it('should start autoplay when autoPlay changes to true', () => {
      const handleNext = jest.fn();
      const interval = 3000;

      const { rerender } = renderHook(
        ({ autoPlay }) => useCarouselAutoplay(autoPlay, interval, handleNext),
        { initialProps: { autoPlay: false } }
      );

      jest.advanceTimersByTime(interval);
      expect(handleNext).not.toHaveBeenCalled();

      // Enable autoplay
      rerender({ autoPlay: true });

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(1);
    });

    it('should stop autoplay when autoPlay changes to false', () => {
      const handleNext = jest.fn();
      const interval = 3000;

      const { rerender } = renderHook(
        ({ autoPlay }) => useCarouselAutoplay(autoPlay, interval, handleNext),
        { initialProps: { autoPlay: true } }
      );

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(1);

      // Disable autoplay
      rerender({ autoPlay: false });

      jest.advanceTimersByTime(interval * 5);
      expect(handleNext).toHaveBeenCalledTimes(1); // Still 1, no more calls
    });
  });

  describe('interval changes', () => {
    it('should update interval when it changes', () => {
      const handleNext = jest.fn();

      const { rerender } = renderHook(
        ({ interval }) => useCarouselAutoplay(true, interval, handleNext),
        { initialProps: { interval: 3000 } }
      );

      jest.advanceTimersByTime(3000);
      expect(handleNext).toHaveBeenCalledTimes(1);

      // Change interval to 1000ms
      rerender({ interval: 1000 });

      jest.advanceTimersByTime(1000);
      expect(handleNext).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(1000);
      expect(handleNext).toHaveBeenCalledTimes(3);
    });
  });

  describe('handleNext changes', () => {
    it('should use updated handleNext after rerender', () => {
      const handleNext1 = jest.fn();
      const handleNext2 = jest.fn();
      const interval = 3000;

      const { rerender } = renderHook(
        ({ handleNext }) => useCarouselAutoplay(true, interval, handleNext),
        { initialProps: { handleNext: handleNext1 } }
      );

      jest.advanceTimersByTime(interval);
      expect(handleNext1).toHaveBeenCalledTimes(1);

      // Update handleNext
      rerender({ handleNext: handleNext2 });

      jest.advanceTimersByTime(interval);
      expect(handleNext2).toHaveBeenCalledTimes(1);
      expect(handleNext1).toHaveBeenCalledTimes(1); // No additional calls
    });
  });

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const handleNext = jest.fn();
      const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval');

      const { unmount } = renderHook(() => useCarouselAutoplay(true, 3000, handleNext));

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });

    it('should not call handleNext after unmount', () => {
      const handleNext = jest.fn();
      const interval = 3000;

      const { unmount } = renderHook(() => useCarouselAutoplay(true, interval, handleNext));

      jest.advanceTimersByTime(interval);
      expect(handleNext).toHaveBeenCalledTimes(1);

      unmount();

      jest.advanceTimersByTime(interval * 5);
      expect(handleNext).toHaveBeenCalledTimes(1); // Still 1, no more calls
    });
  });

  describe('edge cases', () => {
    it('should handle small interval', () => {
      const handleNext = jest.fn();

      // Test with a small but non-zero interval
      renderHook(() => useCarouselAutoplay(true, 50, handleNext));

      jest.advanceTimersByTime(200);

      // With 50ms interval, it would be called about 4 times in 200ms
      expect(handleNext).toHaveBeenCalledTimes(4);
    });

    it('should work with setInterval return value', () => {
      const handleNext = jest.fn();
      const setIntervalSpy = jest.spyOn(globalThis, 'setInterval');

      renderHook(() => useCarouselAutoplay(true, 3000, handleNext));

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 3000);

      setIntervalSpy.mockRestore();
    });
  });
});
