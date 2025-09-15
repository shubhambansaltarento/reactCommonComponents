import React from 'react';
import { screen } from '@testing-library/react';
import StatusCard from '../../StatusCard';
import { renderWithProviders, createMockSummaryData, createStatusCardDefaultProps } from '../test-utils';

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

describe('StatusCard Component', () => {
  describe('Rendering', () => {
    it('should render the status card with title', () => {
      const props = createStatusCardDefaultProps();
      renderWithProviders(<StatusCard {...props} />);

      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    it('should render status icon by default', () => {
      const props = createStatusCardDefaultProps();
      renderWithProviders(<StatusCard {...props} />);

      // Success status shows an image
      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });

    it('should render summary data', () => {
      const props = createStatusCardDefaultProps();
      renderWithProviders(<StatusCard {...props} />);

      expect(screen.getByText('Order ID')).toBeInTheDocument();
      expect(screen.getByText('12345')).toBeInTheDocument();
    });
  });

  describe('Status Types', () => {
    it('should render success status', () => {
      renderWithProviders(
        <StatusCard title="Test" status="success" data={createMockSummaryData()} />
      );

      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });

    it('should render error status', () => {
      const { container } = renderWithProviders(
        <StatusCard title="Test" status="error" data={createMockSummaryData()} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render pending status', () => {
      const { container } = renderWithProviders(
        <StatusCard title="Test" status="pending" data={createMockSummaryData()} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render warning status', () => {
      const { container } = renderWithProviders(
        <StatusCard title="Test" status="warning" data={createMockSummaryData()} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Status Text and Subtext', () => {
    it('should render custom status text', () => {
      renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          statusText="Payment Successful"
          data={createMockSummaryData()}
        />
      );

      expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    });

    it('should render status subtext', () => {
      renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          statusSubtext="Transaction ID: ABC123"
          data={createMockSummaryData()}
        />
      );

      expect(screen.getByText('Transaction ID: ABC123')).toBeInTheDocument();
    });

    it('should render both status text and subtext', () => {
      renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          statusText="Order Complete"
          statusSubtext="Thank you for your order"
          data={createMockSummaryData()}
        />
      );

      expect(screen.getByText('Order Complete')).toBeInTheDocument();
      expect(screen.getByText('Thank you for your order')).toBeInTheDocument();
    });
  });

  describe('Show Icon Prop', () => {
    it('should show icon by default', () => {
      renderWithProviders(
        <StatusCard title="Test" status="success" data={createMockSummaryData()} />
      );

      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });

    it('should hide icon when showIcon is false', () => {
      renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          showIcon={false}
          data={createMockSummaryData()}
        />
      );

      expect(screen.queryByAltText('Success')).not.toBeInTheDocument();
    });

    it('should show icon when showIcon is true', () => {
      renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          showIcon={true}
          data={createMockSummaryData()}
        />
      );

      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });
  });

  describe('Summary Layout', () => {
    it('should render with row layout by default', () => {
      const { container } = renderWithProviders(
        <StatusCard title="Test" status="success" data={createMockSummaryData()} />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
    });

    it('should render with column layout when specified', () => {
      const { container } = renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          data={createMockSummaryData()}
          summaryLayout="column"
        />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });
  });

  describe('Data Prop', () => {
    it('should render summary when data is provided', () => {
      renderWithProviders(
        <StatusCard title="Test" status="success" data={createMockSummaryData()} />
      );

      expect(screen.getByText('Order ID')).toBeInTheDocument();
    });

    it('should not render summary when data is not provided', () => {
      renderWithProviders(
        <StatusCard title="Test" status="success" />
      );

      expect(screen.queryByText('Order ID')).not.toBeInTheDocument();
    });

    it('should not render summary when data is undefined', () => {
      renderWithProviders(
        <StatusCard title="Test" status="success" data={undefined} />
      );

      expect(screen.queryByText('Order ID')).not.toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <StatusCard
          title="Test"
          status="success"
          className="custom-card"
          data={createMockSummaryData()}
        />
      );

      expect(container.querySelector('.custom-card')).toBeInTheDocument();
    });

    it('should apply empty className by default', () => {
      const { container } = renderWithProviders(
        <StatusCard title="Test" status="success" data={createMockSummaryData()} />
      );

      expect(container.querySelector('.space-y-4')).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      const { container } = renderWithProviders(
        <StatusCard
          title="Complete Order"
          status="success"
          statusText="Payment Received"
          statusSubtext="Your order is being processed"
          data={createMockSummaryData()}
          className="my-custom-class"
          summaryLayout="column"
          showIcon={true}
        />
      );

      expect(screen.getByText('Complete Order')).toBeInTheDocument();
      expect(screen.getByText('Payment Received')).toBeInTheDocument();
      expect(screen.getByText('Your order is being processed')).toBeInTheDocument();
      expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
      expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    });
  });
});
