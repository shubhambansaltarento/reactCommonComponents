import React from 'react';
import { screen } from '@testing-library/react';
import Status from '../../Status';
import { renderWithProviders, createStatusDefaultProps } from '../test-utils';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock the PNG image
jest.mock('../../image-icon/SuccessTick.png', () => 'mocked-success-tick.png');

describe('Status Component', () => {
  describe('Rendering', () => {
    it('should render success status with default text', () => {
      renderWithProviders(<Status status="success" />);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render error status with default text', () => {
      renderWithProviders(<Status status="error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render pending status with default text', () => {
      renderWithProviders(<Status status="pending" />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render warning status with default text', () => {
      renderWithProviders(<Status status="warning" />);
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('should render custom text instead of default', () => {
      renderWithProviders(<Status status="success" text="Custom Success" />);
      expect(screen.getByText('Custom Success')).toBeInTheDocument();
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });
  });

  describe('Size Variations', () => {
    it('should render with small size', () => {
      const { container } = renderWithProviders(<Status status="success" size="sm" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with medium size (default)', () => {
      const { container } = renderWithProviders(<Status status="success" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with large size', () => {
      const { container } = renderWithProviders(<Status status="success" size="lg" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with extra large size', () => {
      const { container } = renderWithProviders(<Status status="success" size="xl" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Status Subtext', () => {
    it('should render status subtext when provided', () => {
      renderWithProviders(
        <Status status="success" statusSubtext="Order completed successfully" />
      );
      expect(screen.getByText('Order completed successfully')).toBeInTheDocument();
    });

    it('should not render subtext when not provided', () => {
      const { container } = renderWithProviders(<Status status="success" />);
      // Only the status text should be present
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <Status status="success" className="custom-status" />
      );
      expect(container.querySelector('.custom-status')).toBeInTheDocument();
    });

    it('should apply empty className by default', () => {
      const { container } = renderWithProviders(<Status status="success" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Status Icons', () => {
    it('should render success icon (image)', () => {
      renderWithProviders(<Status status="success" />);
      const img = screen.getByAltText('Success');
      expect(img).toBeInTheDocument();
    });

    it('should render error icon (svg)', () => {
      const { container } = renderWithProviders(<Status status="error" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render pending icon (animated svg)', () => {
      const { container } = renderWithProviders(<Status status="pending" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('animate-spin');
    });

    it('should render warning icon (svg)', () => {
      const { container } = renderWithProviders(<Status status="warning" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('All Status Types with All Sizes', () => {
    const statuses: Array<'success' | 'error' | 'pending' | 'warning'> = [
      'success', 'error', 'pending', 'warning'
    ];
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];

    statuses.forEach((status) => {
      sizes.forEach((size) => {
        it(`should render ${status} status with ${size} size`, () => {
          const { container } = renderWithProviders(
            <Status status={status} size={size} />
          );
          expect(container.firstChild).toBeInTheDocument();
        });
      });
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      renderWithProviders(
        <Status
          status="success"
          text="Order Complete"
          size="lg"
          className="my-custom-class"
          statusSubtext="Your order has been processed"
        />
      );

      expect(screen.getByText('Order Complete')).toBeInTheDocument();
      expect(screen.getByText('Your order has been processed')).toBeInTheDocument();
    });
  });
});
