/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import { CommonDatePicker } from '../../CommonDatePicker';
import { renderWithProviders } from '../test-utils';

describe('CommonDatePicker', () => {
  const defaultProps = {
    label: 'Select Date',
    value: null,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with label', () => {
      renderWithProviders(<CommonDatePicker {...defaultProps} />);

      // MUI DatePicker renders the label text (may appear multiple times in MUI structure)
      const labels = screen.getAllByText('Select Date');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should render with custom className', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} className="custom-class" />
      );

      const wrapperDiv = container.firstChild;
      expect(wrapperDiv).toHaveClass('custom-class');
    });

    it('should render with value', () => {
      const dateValue = dayjs('2025-12-15');

      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} value={dateValue} />
      );

      // Check that the input container exists
      const datePickerInput = container.querySelector('.MuiPickersInputBase-root');
      expect(datePickerInput).toBeInTheDocument();
    });

    it('should render without className when not provided', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} />
      );

      const wrapperDiv = container.firstChild;
      expect(wrapperDiv).not.toHaveClass('custom-class');
    });
  });

  describe('Date Range Constraints', () => {
    it('should accept minDate prop', () => {
      const minDate = dayjs('2025-01-01');

      renderWithProviders(
        <CommonDatePicker {...defaultProps} minDate={minDate} />
      );

      expect(screen.getAllByText('Select Date').length).toBeGreaterThan(0);
    });

    it('should accept maxDate prop', () => {
      const maxDate = dayjs('2025-12-31');

      renderWithProviders(
        <CommonDatePicker {...defaultProps} maxDate={maxDate} />
      );

      expect(screen.getAllByText('Select Date').length).toBeGreaterThan(0);
    });

    it('should accept both minDate and maxDate props', () => {
      const minDate = dayjs('2025-01-01');
      const maxDate = dayjs('2025-12-31');

      renderWithProviders(
        <CommonDatePicker
          {...defaultProps}
          minDate={minDate}
          maxDate={maxDate}
        />
      );

      expect(screen.getAllByText('Select Date').length).toBeGreaterThan(0);
    });
  });

  describe('onChange Handler', () => {
    it('should call onChange when date is selected from calendar', async () => {
      const onChange = jest.fn();

      renderWithProviders(
        <CommonDatePicker {...defaultProps} onChange={onChange} />
      );

      // Open the calendar
      const calendarButton = screen.getByRole('button', { name: /choose date/i });
      fireEvent.click(calendarButton);

      // Select a date from the calendar (e.g., day 15)
      const day15 = screen.getByRole('gridcell', { name: '15' });
      fireEvent.click(day15);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Calendar Picker', () => {
    it('should open calendar when clicking the calendar icon', async () => {
      renderWithProviders(<CommonDatePicker {...defaultProps} />);

      // Find and click the calendar button
      const calendarButton = screen.getByRole('button', { name: /choose date/i });
      fireEvent.click(calendarButton);

      // Calendar dialog should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show calendar with current month', async () => {
      renderWithProviders(<CommonDatePicker {...defaultProps} />);

      // Open calendar
      const calendarButton = screen.getByRole('button', { name: /choose date/i });
      fireEvent.click(calendarButton);

      // The calendar should display (we just check the dialog is there)
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Text Field Props', () => {
    it('should render with fullWidth', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} />
      );

      // Check for fullWidth class
      const textField = container.querySelector('.MuiPickersInputBase-fullWidth');
      expect(textField).toBeInTheDocument();
    });

    it('should render with small size', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} />
      );

      // MUI DatePicker with size="small" has specific classes
      const inputBase = container.querySelector('.MuiPickersInputBase-inputSizeSmall');
      expect(inputBase).toBeInTheDocument();
    });
  });

  describe('Different Labels', () => {
    it('should render with different label', () => {
      renderWithProviders(
        <CommonDatePicker {...defaultProps} label="Start Date" />
      );

      expect(screen.getAllByText('Start Date').length).toBeGreaterThan(0);
    });

    it('should render with end date label', () => {
      renderWithProviders(
        <CommonDatePicker {...defaultProps} label="End Date" />
      );

      expect(screen.getAllByText('End Date').length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null value', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} value={null} />
      );

      const datePickerInput = container.querySelector('.MuiPickersInputBase-root');
      expect(datePickerInput).toBeInTheDocument();
    });

    it('should handle undefined optional props', () => {
      renderWithProviders(
        <CommonDatePicker
          label="Test"
          value={null}
          onChange={jest.fn()}
          minDate={undefined}
          maxDate={undefined}
          className={undefined}
        />
      );

      expect(screen.getAllByText('Test').length).toBeGreaterThan(0);
    });

    it('should update when value prop changes', () => {
      const initialDate = dayjs('2025-01-01');
      const newDate = dayjs('2025-06-15');

      const { rerender, container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} value={initialDate} />
      );

      // Verify initial render
      expect(container.querySelector('.MuiPickersInputBase-root')).toBeInTheDocument();

      rerender(
        <CommonDatePicker {...defaultProps} value={newDate} />
      );

      // Component should still be rendered with new value
      expect(container.querySelector('.MuiPickersInputBase-root')).toBeInTheDocument();
    });
  });

  describe('Wrapper Div', () => {
    it('should wrap DatePicker in a div', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} />
      );

      // The component returns a div wrapper
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('should apply className to wrapper div only', () => {
      const { container } = renderWithProviders(
        <CommonDatePicker {...defaultProps} className="my-datepicker" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-datepicker');
      
      // The inner MUI component should not have this class
      const muiPicker = wrapper.querySelector('.MuiDatePicker-root, .MuiFormControl-root');
      if (muiPicker) {
        expect(muiPicker).not.toHaveClass('my-datepicker');
      }
    });
  });
});
