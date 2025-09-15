import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CustomAccordion } from '../../CustomAccordion';
import {
  renderWithProviders,
  createDefaultAccordionProps,
  MockIcon,
} from '../test-utils';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  top: 100,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  toJSON: () => {},
}));

describe('CustomAccordion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render the accordion with title', () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} />);

      expect(screen.getByText('Test Accordion')).toBeInTheDocument();
    });

    it('should render children content', () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} defaultExpanded={true} />);

      expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(
        <CustomAccordion {...props} className="custom-accordion" />
      );

      expect(container.querySelector('.custom-accordion')).toBeInTheDocument();
    });

    it('should render with icon when provided', () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} icon={<MockIcon />} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render expand icon', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(<CustomAccordion {...props} />);

      expect(container.querySelector('[data-testid="ExpandMoreIcon"]')).toBeInTheDocument();
    });
  });

  describe('Expansion Behavior', () => {
    it('should be collapsed by default', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(<CustomAccordion {...props} />);

      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).not.toHaveClass('Mui-expanded');
    });

    it('should be expanded when defaultExpanded is true', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(
        <CustomAccordion {...props} defaultExpanded={true} />
      );

      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).toHaveClass('Mui-expanded');
    });

    it('should expand when clicked', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(<CustomAccordion {...props} />);

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).toHaveClass('Mui-expanded');
    });

    it('should collapse when clicked again', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(
        <CustomAccordion {...props} defaultExpanded={true} />
      );

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).not.toHaveClass('Mui-expanded');
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange with single parameter (expanded)', () => {
      const onChange = jest.fn();
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} onChange={onChange} />);

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with two parameters (event, expanded)', () => {
      const onChange = jest.fn((event: React.SyntheticEvent, expanded: boolean) => {});
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} onChange={onChange} />);

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      expect(onChange).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it('should call onChange with false when collapsing', () => {
      const onChange = jest.fn();
      const props = createDefaultAccordionProps();
      renderWithProviders(
        <CustomAccordion {...props} defaultExpanded={true} onChange={onChange} />
      );

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should not throw error when onChange is not provided', () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} />);

      const summary = screen.getByRole('button');
      expect(() => fireEvent.click(summary)).not.toThrow();
    });
  });

  describe('Scroll On Expand', () => {
    it('should scroll when expanded and scrollOnExpand is true (default)', async () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} />);

      // Mock getBoundingClientRect on the summary element
      const summary = screen.getByRole('button');
      summary.getBoundingClientRect = mockGetBoundingClientRect;

      fireEvent.click(summary);

      // Advance timers to trigger the setTimeout
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalled();
      });
    });

    it('should not scroll when scrollOnExpand is false', async () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} scrollOnExpand={false} />);

      const summary = screen.getByRole('button');
      fireEvent.click(summary);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should not scroll on initial render with defaultExpanded', () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} defaultExpanded={true} />);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should not scroll because user hasn't interacted yet
      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should only scroll after user interaction', async () => {
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} />);

      // Initially, no scroll
      expect(mockScrollTo).not.toHaveBeenCalled();

      // Mock getBoundingClientRect
      const summary = screen.getByRole('button');
      summary.getBoundingClientRect = mockGetBoundingClientRect;

      // User clicks to expand
      fireEvent.click(summary);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: expect.any(Number),
          behavior: 'smooth',
        });
      });
    });
  });

  describe('Props Passthrough', () => {
    it('should pass additional props to MUI Accordion', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(
        <CustomAccordion {...props} data-testid="custom-accordion" />
      );

      expect(screen.getByTestId('custom-accordion')).toBeInTheDocument();
    });

    it('should apply default className as empty string', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(<CustomAccordion {...props} />);

      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Icon Display', () => {
    it('should render icon in icon-wrapper when provided', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(
        <CustomAccordion {...props} icon={<MockIcon />} />
      );

      expect(container.querySelector('.icon-wrapper')).toBeInTheDocument();
    });

    it('should not render icon-wrapper when icon is not provided', () => {
      const props = createDefaultAccordionProps();
      const { container } = renderWithProviders(<CustomAccordion {...props} />);

      expect(container.querySelector('.icon-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid expand/collapse clicks', () => {
      const onChange = jest.fn();
      const props = createDefaultAccordionProps();
      renderWithProviders(<CustomAccordion {...props} onChange={onChange} />);

      const summary = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(summary);
      fireEvent.click(summary);
      fireEvent.click(summary);

      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('should handle empty title', () => {
      renderWithProviders(
        <CustomAccordion title="">
          <div>Content</div>
        </CustomAccordion>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle complex children', () => {
      renderWithProviders(
        <CustomAccordion title="Complex" defaultExpanded={true}>
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </CustomAccordion>
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });
});
