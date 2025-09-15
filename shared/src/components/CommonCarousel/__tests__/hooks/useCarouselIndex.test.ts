import { renderHook, act } from '@testing-library/react';
import { useCarouselIndex } from '../../hooks/useCarouselIndex';

describe('useCarouselIndex', () => {
  describe('initialization', () => {
    it('should initialize with activeIndex as 0', () => {
      const { result } = renderHook(() => useCarouselIndex(5));
      expect(result.current.activeIndex).toBe(0);
    });

    it('should return handlePrev, handleNext, and goToSlide functions', () => {
      const { result } = renderHook(() => useCarouselIndex(5));
      expect(typeof result.current.handlePrev).toBe('function');
      expect(typeof result.current.handleNext).toBe('function');
      expect(typeof result.current.goToSlide).toBe('function');
    });
  });

  describe('handleNext', () => {
    it('should increment activeIndex when not at the last slide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should wrap to 0 when at the last slide', () => {
      const { result } = renderHook(() => useCarouselIndex(3));

      // Go to index 2 (last slide)
      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);

      // Next should wrap to 0
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.activeIndex).toBe(0);
    });

    it('should handle single item carousel', () => {
      const { result } = renderHook(() => useCarouselIndex(1));

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it('should cycle through all slides correctly', () => {
      const { result } = renderHook(() => useCarouselIndex(3));

      act(() => {
        result.current.handleNext(); // 0 -> 1
      });
      expect(result.current.activeIndex).toBe(1);

      act(() => {
        result.current.handleNext(); // 1 -> 2
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        result.current.handleNext(); // 2 -> 0
      });
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('handlePrev', () => {
    it('should decrement activeIndex when not at the first slide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      // Go to index 2
      act(() => {
        result.current.goToSlide(2);
      });

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should wrap to last slide when at the first slide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      expect(result.current.activeIndex).toBe(0);

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.activeIndex).toBe(4);
    });

    it('should handle single item carousel', () => {
      const { result } = renderHook(() => useCarouselIndex(1));

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it('should cycle through all slides correctly in reverse', () => {
      const { result } = renderHook(() => useCarouselIndex(3));

      act(() => {
        result.current.handlePrev(); // 0 -> 2
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        result.current.handlePrev(); // 2 -> 1
      });
      expect(result.current.activeIndex).toBe(1);

      act(() => {
        result.current.handlePrev(); // 1 -> 0
      });
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('goToSlide', () => {
    it('should set activeIndex to the specified index', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(3);
      });

      expect(result.current.activeIndex).toBe(3);
    });

    it('should go to the first slide (index 0)', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(4);
      });
      expect(result.current.activeIndex).toBe(4);

      act(() => {
        result.current.goToSlide(0);
      });
      expect(result.current.activeIndex).toBe(0);
    });

    it('should go to the last slide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(4);
      });

      expect(result.current.activeIndex).toBe(4);
    });

    it('should handle going to the same slide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);

      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);
    });
  });

  describe('totalItems changes', () => {
    it('should handle changes in totalItems', () => {
      const { result, rerender } = renderHook(
        ({ totalItems }) => useCarouselIndex(totalItems),
        { initialProps: { totalItems: 5 } }
      );

      act(() => {
        result.current.goToSlide(4);
      });
      expect(result.current.activeIndex).toBe(4);

      // Rerender with new totalItems
      rerender({ totalItems: 3 });

      // The activeIndex remains the same since useCarouselIndex doesn't reset on totalItems change
      // but wrapping should work with new total when navigating
      expect(result.current.activeIndex).toBe(4);
      
      // Now if we go to a valid index and then navigate, wrapping should use new total
      act(() => {
        result.current.goToSlide(2);
      });
      expect(result.current.activeIndex).toBe(2);
      
      act(() => {
        result.current.handleNext();
      });
      // 2 + 1 = 3, 3 % 3 = 0
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle totalItems of 0', () => {
      const { result } = renderHook(() => useCarouselIndex(0));
      
      expect(result.current.activeIndex).toBe(0);
      
      // These should not throw errors
      act(() => {
        result.current.handleNext();
      });
      
      act(() => {
        result.current.handlePrev();
      });
    });

    it('should handle negative index in goToSlide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(-1);
      });

      // Should set to -1 (no validation in hook)
      expect(result.current.activeIndex).toBe(-1);
    });

    it('should handle index larger than totalItems in goToSlide', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      act(() => {
        result.current.goToSlide(10);
      });

      // Should set to 10 (no validation in hook)
      expect(result.current.activeIndex).toBe(10);
    });
  });

  describe('combined operations', () => {
    it('should work correctly with mixed operations', () => {
      const { result } = renderHook(() => useCarouselIndex(5));

      // Start at 0
      expect(result.current.activeIndex).toBe(0);

      // Go to 3
      act(() => {
        result.current.goToSlide(3);
      });
      expect(result.current.activeIndex).toBe(3);

      // Next to 4
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.activeIndex).toBe(4);

      // Prev to 3
      act(() => {
        result.current.handlePrev();
      });
      expect(result.current.activeIndex).toBe(3);

      // Go to 0
      act(() => {
        result.current.goToSlide(0);
      });
      expect(result.current.activeIndex).toBe(0);

      // Prev to wrap to 4
      act(() => {
        result.current.handlePrev();
      });
      expect(result.current.activeIndex).toBe(4);
    });
  });
});
