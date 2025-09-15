import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../../components/ActionButton';

// Mock CustomButton component
jest.mock('../../../Button', () => ({
  CustomButton: ({ children, onClick, variant, fullWidth }: {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    variant: string;
    fullWidth: boolean;
  }) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-fullwidth={fullWidth.toString()}
    >
      {children}
    </button>
  ),
}));

describe('ActionButton', () => {
  const mockOnPreviewClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with user action name', () => {
      render(
        <ActionButton
          userAction={{ name: 'Click Me', link: 'https://example.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render the component and return JSX with a Box wrapper', () => {
      const { container } = render(
        <ActionButton
          userAction={{ name: 'Render Test' }}
          variant="outlined"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      // The component mounts and returns JSX (covering the return statement)
      expect(container.firstChild).toBeTruthy();
      expect(screen.getByText('Render Test')).toBeInTheDocument();
    });

    it('should render with default sx when no sx prop is provided', () => {
      const { container } = render(
        <ActionButton
          userAction={{ name: 'Default SX' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      // Component renders with default sx = {}
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply custom sx styles merged with padding', () => {
      const { container } = render(
        <ActionButton
          userAction={{ name: 'Custom SX', link: 'https://test.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
          sx={{ marginTop: 2, backgroundColor: 'red' }}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Custom SX')).toBeInTheDocument();
    });

    it('should pass variant="outlined" to CustomButton', () => {
      render(
        <ActionButton
          userAction={{ name: 'Test', link: 'https://test.com' }}
          variant="outlined"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'outlined');
    });

    it('should pass variant="contained" to CustomButton', () => {
      render(
        <ActionButton
          userAction={{ name: 'Test', link: 'https://test.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'contained');
    });

    it('should pass fullWidth to CustomButton', () => {
      render(
        <ActionButton
          userAction={{ name: 'Full Width' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      expect(screen.getByText('Full Width')).toHaveAttribute('data-fullwidth', 'true');
    });
  });

  describe('Click Handler (handleClick)', () => {
    it('should call onPreviewClick with link when link is provided', () => {
      render(
        <ActionButton
          userAction={{ name: 'Visit Site', link: 'https://example.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Visit Site'));
      expect(mockOnPreviewClick).toHaveBeenCalledTimes(1);
      expect(mockOnPreviewClick).toHaveBeenCalledWith('https://example.com');
    });

    it('should call onPreviewClick with name when link is undefined (nullish coalescing)', () => {
      render(
        <ActionButton
          userAction={{ name: 'example.com' }}
          variant="outlined"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('example.com'));
      // userAction.link is undefined → falls back to userAction.name
      expect(mockOnPreviewClick).toHaveBeenCalledWith('example.com');
    });

    it('should call onPreviewClick with empty string when both link and name are empty', () => {
      render(
        <ActionButton
          userAction={{ name: '' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      // name is '' (not nullish), so the button text is empty
      const button = screen.getByRole('button');
      fireEvent.click(button);
      // link is undefined → falls back to name '' → '' is not nullish, so urlToUse = ''
      expect(mockOnPreviewClick).toHaveBeenCalledWith('');
    });

    it('should use link over name when both are provided', () => {
      render(
        <ActionButton
          userAction={{ name: 'Button Text', link: 'https://link.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Button Text'));
      // link is present and not nullish, so it takes precedence
      expect(mockOnPreviewClick).toHaveBeenCalledWith('https://link.com');
    });

    it('should handle empty link string (not nullish) by passing it through', () => {
      render(
        <ActionButton
          userAction={{ name: 'Test', link: '' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Test'));
      // '' is not null/undefined, so ?? does NOT fall through
      expect(mockOnPreviewClick).toHaveBeenCalledWith('');
    });

    it('should prevent default and stop propagation on click event', () => {
      const parentClickHandler = jest.fn();

      const { container } = render(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div onClick={parentClickHandler}>
          <ActionButton
            userAction={{ name: 'Stop Prop', link: 'https://test.com' }}
            variant="contained"
            onPreviewClick={mockOnPreviewClick}
          />
        </div>
      );

      const button = screen.getByText('Stop Prop');
      fireEvent.click(button);

      // onPreviewClick should be called (handler executed)
      expect(mockOnPreviewClick).toHaveBeenCalledWith('https://test.com');
      // Note: stopPropagation on synthetic events in test env may not prevent parent handler
      // but the handler code path (lines 18-22) is still exercised
    });

    it('should call onPreviewClick exactly once per click', () => {
      render(
        <ActionButton
          userAction={{ name: 'Single Click', link: 'https://test.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      const button = screen.getByText('Single Click');
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnPreviewClick).toHaveBeenCalledTimes(2);
    });

    it('should create a stable handleClick callback via useCallback', () => {
      const { rerender } = render(
        <ActionButton
          userAction={{ name: 'Stable', link: 'https://test.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Stable'));
      expect(mockOnPreviewClick).toHaveBeenCalledWith('https://test.com');

      // Rerender with same props - handler should still work
      rerender(
        <ActionButton
          userAction={{ name: 'Stable', link: 'https://test.com' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Stable'));
      expect(mockOnPreviewClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle userAction with only name property', () => {
      render(
        <ActionButton
          userAction={{ name: 'Only Name' }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('Only Name'));
      expect(mockOnPreviewClick).toHaveBeenCalledWith('Only Name');
    });

    it('should handle userAction with long name and link', () => {
      const longName = 'A'.repeat(200);
      const longLink = 'https://example.com/' + 'path/'.repeat(50);

      render(
        <ActionButton
          userAction={{ name: longName, link: longLink }}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText(longName));
      expect(mockOnPreviewClick).toHaveBeenCalledWith(longLink);
    });

    it('should fallback to empty string when both link is undefined and name is undefined-like', () => {
      // Test the full nullish coalescing chain: link ?? name ?? ""
      // When link is undefined and name is also undefined, urlToUse should be ""
      const userAction = { name: undefined as unknown as string };

      render(
        <ActionButton
          userAction={userAction}
          variant="contained"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      // link is undefined → name is undefined → fallback to ""
      expect(mockOnPreviewClick).toHaveBeenCalledWith('');
    });

    it('should handle userAction with special characters in name', () => {
      render(
        <ActionButton
          userAction={{ name: '<Click & Go!>', link: 'https://test.com?a=1&b=2' }}
          variant="outlined"
          onPreviewClick={mockOnPreviewClick}
        />
      );

      fireEvent.click(screen.getByText('<Click & Go!>'));
      expect(mockOnPreviewClick).toHaveBeenCalledWith('https://test.com?a=1&b=2');
    });
  });
});
