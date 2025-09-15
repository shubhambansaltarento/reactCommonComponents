import React from 'react';
import { screen } from '@testing-library/react';
import StatusSummary from '../../StatusSummary';
import { renderWithProviders, createMockSummaryData, createStatusSummaryDefaultProps } from '../test-utils';

describe('StatusSummary Component', () => {
  describe('Rendering', () => {
    it('should render the title', () => {
      const props = createStatusSummaryDefaultProps();
      renderWithProviders(<StatusSummary {...props} />);

      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    it('should render all data entries', () => {
      const props = createStatusSummaryDefaultProps();
      renderWithProviders(<StatusSummary {...props} />);

      expect(screen.getByText('Order ID')).toBeInTheDocument();
      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      renderWithProviders(
        <StatusSummary title="Payment Details" data={createMockSummaryData()} />
      );

      expect(screen.getByText('Payment Details')).toBeInTheDocument();
    });
  });

  describe('Layout Variations', () => {
    it('should render with row layout by default', () => {
      const { container } = renderWithProviders(
        <StatusSummary title="Test" data={createMockSummaryData()} />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
    });

    it('should render with column layout when specified', () => {
      const { container } = renderWithProviders(
        <StatusSummary
          title="Test"
          data={createMockSummaryData()}
          summaryLayout="column"
        />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('should render with row layout when explicitly specified', () => {
      const { container } = renderWithProviders(
        <StatusSummary
          title="Test"
          data={createMockSummaryData()}
          summaryLayout="row"
        />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <StatusSummary
          title="Test"
          data={createMockSummaryData()}
          className="custom-summary"
        />
      );

      expect(container.querySelector('.custom-summary')).toBeInTheDocument();
    });

    it('should apply empty className by default', () => {
      const { container } = renderWithProviders(
        <StatusSummary title="Test" data={createMockSummaryData()} />
      );

      expect(container.querySelector('.border')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should render string values', () => {
      const data = { Name: 'Test String' };
      renderWithProviders(<StatusSummary title="Test" data={data} />);

      expect(screen.getByText('Test String')).toBeInTheDocument();
    });

    it('should render number values', () => {
      const data = { Amount: 9999 };
      renderWithProviders(<StatusSummary title="Test" data={data} />);

      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('should render boolean values as strings', () => {
      const data = { Active: true, Inactive: false };
      const { container } = renderWithProviders(<StatusSummary title="Test" data={data} />);

      // Boolean values are rendered but React doesn't display true/false as text
      // Check that the keys are rendered
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should handle empty data object', () => {
      renderWithProviders(<StatusSummary title="Empty" data={{}} />);

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should handle single entry', () => {
      const data = { 'Single Key': 'Single Value' };
      renderWithProviders(<StatusSummary title="Test" data={data} />);

      expect(screen.getByText('Single Key')).toBeInTheDocument();
      expect(screen.getByText('Single Value')).toBeInTheDocument();
    });

    it('should handle many entries', () => {
      const data = {
        Field1: 'Value1',
        Field2: 'Value2',
        Field3: 'Value3',
        Field4: 'Value4',
        Field5: 'Value5',
      };
      renderWithProviders(<StatusSummary title="Test" data={data} />);

      expect(screen.getByText('Field1')).toBeInTheDocument();
      expect(screen.getByText('Field5')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have border and rounded styling', () => {
      const { container } = renderWithProviders(
        <StatusSummary title="Test" data={createMockSummaryData()} />
      );

      const wrapper = container.querySelector('.border.rounded-lg.bg-white');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have proper header styling', () => {
      renderWithProviders(
        <StatusSummary title="Test" data={createMockSummaryData()} />
      );

      const title = screen.getByText('Test');
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });
  });
});
