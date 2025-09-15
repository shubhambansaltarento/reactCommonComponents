/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommonCarousel } from '../../CommonCarousel';
import {
  renderWithProviders,
  createMockCarouselItems,
  createMockCarouselItemsWithMedia,
  createMockCarouselItemsWithoutMedia,
  createDefaultCarouselProps,
} from '../test-utils';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('CommonCarousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('rendering', () => {
    it('should render the carousel with items', () => {
      const props = createDefaultCarouselProps();
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should render navigation arrows when showArrows is true', () => {
      const props = createDefaultCarouselProps({ showArrows: true });
      renderWithProviders(<CommonCarousel {...props} />);

      const prevButton = screen.getByTestId('ArrowBackIosIcon');
      const nextButton = screen.getByTestId('ArrowForwardIosIcon');

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should not render navigation arrows when showArrows is false', () => {
      const props = createDefaultCarouselProps({ showArrows: false });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.queryByTestId('ArrowBackIosIcon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ArrowForwardIosIcon')).not.toBeInTheDocument();
    });

    it('should render dots when showDots is true', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true });
      renderWithProviders(<CommonCarousel {...props} />);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(dots.length).toBe(3);
    });

    it('should not render dots when showDots is false', () => {
      const props = createDefaultCarouselProps({ showDots: false });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.queryByRole('button', { name: /Go to slide/i })).not.toBeInTheDocument();
    });

    it('should apply custom height', () => {
      const props = createDefaultCarouselProps({ height: 400 });
      const { container } = renderWithProviders(<CommonCarousel {...props} />);

      // The height is applied to the MuiCard-root element
      const cardElement = container.querySelector('.MuiCard-root');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveStyle({ height: '400px' });
    });

    it('should render with empty items array', () => {
      const props = createDefaultCarouselProps({ items: [] });
      renderWithProviders(<CommonCarousel {...props} />);

      // Should not crash
      expect(screen.queryByText('Slide 1 Title')).not.toBeInTheDocument();
    });

    it('should render single item carousel', () => {
      const items = createMockCarouselItems(1);
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });
  });

  describe('slide layouts', () => {
    it('should render ImageLayout for items with media', () => {
      const items = createMockCarouselItemsWithMedia(2);
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      // Should have images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render PlainLayout for items without media', () => {
      const items = createMockCarouselItemsWithoutMedia(2);
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should render mixed layouts correctly', () => {
      const items = createMockCarouselItems(4); // Mix of with/without media
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });
  });

  describe('navigation with arrows', () => {
    it('should navigate to next slide when clicking next arrow', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      // Click the parent button
      fireEvent.click(nextIcon.closest('button') as HTMLButtonElement);

      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
    });

    it('should navigate to previous slide when clicking prev arrow', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      // First go to slide 2
      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      fireEvent.click(nextIcon.closest('button') as HTMLButtonElement);
      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

      // Then go back
      const prevIcon = screen.getByTestId('ArrowBackIosIcon');
      fireEvent.click(prevIcon.closest('button') as HTMLButtonElement);
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should wrap to first slide when clicking next on last slide', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      const nextButton = nextIcon.closest('button') as HTMLButtonElement;

      // Go through all slides
      fireEvent.click(nextButton); // 1 -> 2
      fireEvent.click(nextButton); // 2 -> 3
      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();

      fireEvent.click(nextButton); // 3 -> 1
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should wrap to last slide when clicking prev on first slide', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const prevIcon = screen.getByTestId('ArrowBackIosIcon');
      fireEvent.click(prevIcon.closest('button') as HTMLButtonElement);

      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();
    });
  });

  describe('navigation with dots', () => {
    it('should navigate to specific slide when clicking dot', () => {
      const items = createMockCarouselItems(4);
      const props = createDefaultCarouselProps({ items, showDots: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });

      // Click third dot (index 2)
      fireEvent.click(dots[2]);
      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();
    });

    it('should highlight active dot with specific class', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });

      // First dot should be active - check for active class
      expect(dots[0]).toHaveClass('bg-blue-600');
      expect(dots[0]).toHaveClass('scale-125');
    });

    it('should update active dot when navigating', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      fireEvent.click(nextIcon.closest('button') as HTMLButtonElement);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });
      // Second dot should now be active
      expect(dots[1]).toHaveClass('bg-blue-600');
      expect(dots[1]).toHaveClass('scale-125');
    });
  });

  describe('dotsStyle', () => {
    it('should render dots style correctly', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true, dotsStyle: 'dots' });
      renderWithProviders(<CommonCarousel {...props} />);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(dots.length).toBe(3);
    });

    it('should render line style correctly', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true, dotsStyle: 'line' });
      renderWithProviders(<CommonCarousel {...props} />);

      const lines = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(lines.length).toBe(3);
    });
  });

  describe('autoPlay', () => {
    it('should auto-advance when autoPlay is true', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({
        items,
        autoPlay: true,
        autoPlayInterval: 3000,
      });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
    });

    it('should not auto-advance when autoPlay is false', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({
        items,
        autoPlay: false,
        autoPlayInterval: 3000,
      });
      renderWithProviders(<CommonCarousel {...props} />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should respect custom autoPlayInterval', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({
        items,
        autoPlay: true,
        autoPlayInterval: 5000,
      });
      renderWithProviders(<CommonCarousel {...props} />);

      act(() => {
        jest.advanceTimersByTime(4999);
      });
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
    });

    it('should continue cycling through slides with autoPlay', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({
        items,
        autoPlay: true,
        autoPlayInterval: 1000,
      });
      renderWithProviders(<CommonCarousel {...props} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    const dispatchKeyboardEvent = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      globalThis.dispatchEvent(event);
    };

    it('should navigate to next slide on ArrowRight', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      act(() => {
        dispatchKeyboardEvent('ArrowRight');
      });

      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
    });

    it('should navigate to previous slide on ArrowLeft', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      // First go to slide 2
      act(() => {
        dispatchKeyboardEvent('ArrowRight');
      });
      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

      // Then go back
      act(() => {
        dispatchKeyboardEvent('ArrowLeft');
      });
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });

    it('should wrap around with keyboard navigation', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      // Go backwards from first slide
      act(() => {
        dispatchKeyboardEvent('ArrowLeft');
      });
      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();
    });
  });

  describe('onReadMore callback', () => {
    it('should call onReadMore when Read More button is clicked', () => {
      const onReadMore = jest.fn();
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, onReadMore });
      renderWithProviders(<CommonCarousel {...props} />);

      const readMoreButton = screen.getByRole('button', { name: /Read more/i });
      fireEvent.click(readMoreButton);

      expect(onReadMore).toHaveBeenCalledTimes(1);
      // The callback is called with the announcementId, not the full item
      expect(onReadMore).toHaveBeenCalledWith(items[0].announcementId);
    });

    it('should call onReadMore with correct item after navigation', () => {
      const onReadMore = jest.fn();
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, onReadMore, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      // Navigate to second slide
      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      fireEvent.click(nextIcon.closest('button') as HTMLButtonElement);

      const readMoreButton = screen.getByRole('button', { name: /Read more/i });
      fireEvent.click(readMoreButton);

      expect(onReadMore).toHaveBeenCalledWith(items[1].announcementId);
    });
  });

  describe('validTo date display', () => {
    it('should display validTo date correctly', () => {
      const items = createMockCarouselItems(1);
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      // The component displays the date directly (e.g., "15 January 2026")
      expect(screen.getByText(/January 2026/i)).toBeInTheDocument();
    });
  });

  describe('criticality styling', () => {
    it('should render high criticality item differently', () => {
      const items = [
        {
          announcementId: 'high-criticality',
          title: 'High Priority',
          description: 'Important announcement',
          validTo: new Date(2026, 0, 15).toISOString(),
          criticality: 'high',
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });

    it('should render normal criticality item', () => {
      const items = [
        {
          announcementId: 'normal-criticality',
          title: 'Normal Priority',
          description: 'Regular announcement',
          validTo: new Date(2026, 0, 15).toISOString(),
          criticality: 'normal',
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Normal Priority')).toBeInTheDocument();
    });
  });

  describe('baseUrl', () => {
    it('should prepend baseUrl to media URLs', () => {
      const items = createMockCarouselItemsWithMedia(1);
      const props = createDefaultCarouselProps({ items, baseUrl: 'https://cdn.example.com' });
      renderWithProviders(<CommonCarousel {...props} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', expect.stringContaining('https://cdn.example.com'));
    });

    it('should work without baseUrl', () => {
      const items = createMockCarouselItemsWithMedia(1);
      const props = createDefaultCarouselProps({ items, baseUrl: '' });
      renderWithProviders(<CommonCarousel {...props} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });
  });

  describe('description rendering', () => {
    it('should render description text', () => {
      const items = createMockCarouselItems(1);
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText(/This is the description for slide 1/i)).toBeInTheDocument();
    });

    it('should render HTML description content', () => {
      const items = [
        {
          announcementId: 'html-item',
          title: 'HTML Title',
          description: 'Safe content with details',
          validTo: new Date(2026, 0, 15).toISOString(),
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText(/Safe content/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have navigation arrow icons when showArrows is true', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showArrows: true });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
      expect(screen.getByTestId('ArrowForwardIosIcon')).toBeInTheDocument();
    });

    it('should have accessible dot buttons', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, showDots: true });
      renderWithProviders(<CommonCarousel {...props} />);

      const dots = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(dots.length).toBe(3);
      for (let index = 0; index < dots.length; index++) {
        expect(dots[index]).toHaveAttribute('aria-label', `Go to slide ${index + 1}`);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle items with missing optional properties', () => {
      const items = [
        {
          announcementId: 'minimal-item',
          title: 'Minimal Item',
          description: 'Basic description',
          validTo: new Date(2026, 0, 15).toISOString(),
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('Minimal Item')).toBeInTheDocument();
    });

    it('should handle very long titles and descriptions', () => {
      const items = [
        {
          announcementId: 'long-content',
          title: 'A'.repeat(200),
          description: 'B'.repeat(1000),
          validTo: new Date(2026, 0, 15).toISOString(),
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      // Should not crash
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });

    it('should handle items with empty media array', () => {
      const items = [
        {
          announcementId: 'empty-media',
          title: 'No Media',
          description: 'Item with empty media array',
          validTo: new Date(2026, 0, 15).toISOString(),
          media: [],
        },
      ];
      const props = createDefaultCarouselProps({ items });
      renderWithProviders(<CommonCarousel {...props} />);

      expect(screen.getByText('No Media')).toBeInTheDocument();
    });

    it('should handle multiple media items (uses first one)', () => {
      const items = [
        {
          announcementId: 'multi-media',
          title: 'Multiple Media',
          description: 'Item with multiple media items',
          validTo: new Date(2026, 0, 15).toISOString(),
          media: [{ url: '/image1.jpg' }, { url: '/image2.jpg' }],
        },
      ];
      const props = createDefaultCarouselProps({ items, baseUrl: '' });
      renderWithProviders(<CommonCarousel {...props} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('/image1.jpg'));
    });
  });

  describe('slide transitions', () => {
    it('should display correct slide content after multiple navigations', () => {
      const items = createMockCarouselItems(5);
      const props = createDefaultCarouselProps({ items, showArrows: true, autoPlay: false });
      renderWithProviders(<CommonCarousel {...props} />);

      const nextIcon = screen.getByTestId('ArrowForwardIosIcon');
      const prevIcon = screen.getByTestId('ArrowBackIosIcon');
      const nextButton = nextIcon.closest('button') as HTMLButtonElement;
      const prevButton = prevIcon.closest('button') as HTMLButtonElement;

      // Navigate forward and backward
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();

      fireEvent.click(prevButton);
      expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      expect(screen.getByText('Slide 5 Title')).toBeInTheDocument();

      fireEvent.click(nextButton);
      expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, autoPlay: true });
      const { unmount } = renderWithProviders(<CommonCarousel {...props} />);

      const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();

      removeEventListenerSpy.mockRestore();
    });

    it('should cleanup autoPlay interval on unmount', () => {
      const items = createMockCarouselItems(3);
      const props = createDefaultCarouselProps({ items, autoPlay: true, autoPlayInterval: 3000 });
      const { unmount } = renderWithProviders(<CommonCarousel {...props} />);

      const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });
});
