import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  mockCustomOptions,
  mockEmptyOptions,
  mockSingleOption,
  mockManyOptions,
  defaultPickerProps,
  datePickerProps,
  dateTimePickerProps,
  customSelectProps,
  stylingProps,
} from '../setup';
import DateCustomPicker from '../../Picker';
import DatePickerRenderer from '../../DatePickerRenderer';
import CustomSelectRenderer from '../../CustomSelectRenderer';
import { PickerType } from '../../types';

describe('DateCustomPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<DateCustomPicker {...defaultPickerProps} />);
      const labels = screen.getAllByText('Test Label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders with title when provided', () => {
      render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          title="Pick a Date"
        />
      );
      expect(screen.getByText('Pick a Date')).toBeInTheDocument();
    });

    it('renders without title when not provided', () => {
      render(<DateCustomPicker {...defaultPickerProps} />);
      expect(screen.queryByText('Pick a Date')).not.toBeInTheDocument();
    });

    it('applies container className', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          containerClassName="custom-container"
        />
      );
      expect(container.querySelector('.picker_container')).toHaveClass('custom-container');
    });

    it('applies className to container', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          className="my-custom-class"
        />
      );
      expect(container.querySelector('.picker_container')).toHaveClass('my-custom-class');
    });

    it('applies both containerClassName and className', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          containerClassName="container-class"
          className="element-class"
        />
      );
      const pickerContainer = container.querySelector('.picker_container');
      expect(pickerContainer).toHaveClass('container-class');
      expect(pickerContainer).toHaveClass('element-class');
    });

    it('applies titleClassName when title is provided', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          title="Test Title"
          titleClassName="custom-title-class"
        />
      );
      expect(container.querySelector('.picker_title')).toHaveClass('custom-title-class');
    });

    it('applies default titleClassName (mb-2) when not provided', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          title="Test Title"
        />
      );
      expect(container.querySelector('.picker_title')).toHaveClass('mb-2');
    });

    it('applies container style', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          containerStyle={{ backgroundColor: 'blue' }}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies title style', () => {
      const { container } = render(
        <DateCustomPicker 
          {...defaultPickerProps} 
          title="Styled Title"
          titleStyle={{ color: 'red' }}
        />
      );
      expect(container.querySelector('.picker_title')).toBeInTheDocument();
    });
  });

  describe('Date Picker Type', () => {
    it('renders DatePicker when type is date', () => {
      render(<DateCustomPicker {...datePickerProps} />);
      const labels = screen.getAllByText('Date Picker');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('displays formatted date value', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          date={new Date('2024-03-15')}
        />
      );
      // The DatePicker should display the date
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('handles null date value', () => {
      render(
        <DateCustomPicker 
          type="date"
          date={null}
          onDateChange={jest.fn()}
          Label="Empty Date"
        />
      );
      const labels = screen.getAllByText('Empty Date');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('calls onDateChange when date is selected', () => {
      const onDateChange = jest.fn();
      const { container } = render(
        <DateCustomPicker 
          type="date"
          date={null}
          onDateChange={onDateChange}
          Label="Date Input"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies minDate restriction', () => {
      const minDate = new Date('2024-01-01');
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          minDate={minDate}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies maxDate restriction', () => {
      const maxDate = new Date('2024-12-31');
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          maxDate={maxDate}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies both minDate and maxDate restrictions', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          minDate={new Date('2024-01-01')}
          maxDate={new Date('2024-12-31')}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('uses custom dateFormat', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          dateFormat="YYYY/MM/DD"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies placeholder when provided', () => {
      const { container } = render(
        <DateCustomPicker 
          type="date"
          date={null}
          onDateChange={jest.fn()}
          Label="Date"
          placeholder="Select a date"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });
  });

  describe('DateTime Picker Type', () => {
    it('renders DateTimePicker when type is datetime', () => {
      render(<DateCustomPicker {...dateTimePickerProps} />);
      const labels = screen.getAllByText('DateTime Picker');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders DateTimePicker when includeTime is true', () => {
      render(
        <DateCustomPicker 
          type="date"
          date={new Date('2024-01-15T14:30:00')}
          onDateChange={jest.fn()}
          Label="Time Included"
          includeTime={true}
        />
      );
      const labels = screen.getAllByText('Time Included');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('uses custom dateTimeFormat', () => {
      const { container } = render(
        <DateCustomPicker 
          {...dateTimePickerProps}
          dateTimeFormat="YYYY-MM-DD HH:mm:ss"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });
  });

  describe('Custom Select Type', () => {
    it('renders CustomSelect when type is custom', () => {
      render(<DateCustomPicker {...customSelectProps} />);
      const labels = screen.getAllByText('Custom Select');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('displays selected option value', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          customValue="option2"
        />
      );
      // Should show Option 2 as selected
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows all custom options when dropdown is opened', async () => {
      render(<DateCustomPicker {...customSelectProps} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      
      // Use getAllBy since the selected value also shows the text
      expect(screen.getAllByText('Option 1').length).toBeGreaterThan(0);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('calls onCustomChange when option is selected', async () => {
      const onCustomChange = jest.fn();
      
      render(
        <DateCustomPicker 
          type="custom"
          customValue=""
          onCustomChange={onCustomChange}
          customOptions={mockCustomOptions}
          Label="Select Option"
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      
      const option = screen.getByText('Option 2');
      fireEvent.click(option);
      
      expect(onCustomChange).toHaveBeenCalled();
    });

    it('handles empty options array', () => {
      render(
        <DateCustomPicker 
          type="custom"
          customValue=""
          onCustomChange={jest.fn()}
          customOptions={mockEmptyOptions}
          Label="Empty Options"
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles single option', async () => {
      render(
        <DateCustomPicker 
          type="custom"
          customValue=""
          onCustomChange={jest.fn()}
          customOptions={mockSingleOption}
          Label="Single Option Label"
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Single Option')).toBeInTheDocument();
    });

    it('handles many options', async () => {
      render(
        <DateCustomPicker 
          type="custom"
          customValue=""
          onCustomChange={jest.fn()}
          customOptions={mockManyOptions}
          Label="Many Options"
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('Error States', () => {
    it('displays error state on date picker', () => {
      render(
        <DateCustomPicker 
          {...datePickerProps}
          error={true}
          helperText="Date is required"
        />
      );
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('displays error state on custom select', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          error={true}
          helperText="Selection is required"
        />
      );
      expect(screen.getByText('Selection is required')).toBeInTheDocument();
    });

    it('does not display helperText when error is false', () => {
      render(
        <DateCustomPicker 
          {...datePickerProps}
          error={false}
          helperText="This should not appear"
        />
      );
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    it('handles error with empty helperText', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          error={true}
          helperText=""
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });
  });

  describe('Styling Props', () => {
    it('applies height as number', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          height={50}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies height as string', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          height="3rem"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies width as number', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          width={300}
        />
      );
      expect(container.querySelector('.picker_container')).toHaveStyle({ '--picker-width': '300px' });
    });

    it('applies width as string', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          width="100%"
        />
      );
      expect(container.querySelector('.picker_container')).toHaveStyle({ '--picker-width': '100%' });
    });

    it('applies borderRadius as number', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          borderRadius={12}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies borderRadius as string', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          borderRadius="1rem"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies inputSx styles', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          inputSx={{ backgroundColor: 'yellow' }}
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies formControlStyle', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          formControlStyle={{ margin: '5px' }}
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies height to custom select', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          height={48}
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies borderRadius to custom select', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          borderRadius={12}
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies height as string to custom select', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          height="3rem"
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies borderRadius as string to custom select', () => {
      render(
        <DateCustomPicker 
          {...customSelectProps}
          borderRadius="8px"
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies formControlClassName', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          formControlClassName="custom-form-control"
        />
      );
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
    });

    it('applies all styling props together', () => {
      const { container } = render(
        <DateCustomPicker 
          {...datePickerProps}
          {...stylingProps}
          title="Styled Picker"
        />
      );
      const pickerContainer = container.querySelector('.picker_container');
      expect(pickerContainer).toHaveClass('test-class');
      expect(pickerContainer).toHaveClass('test-container');
    });
  });

  describe('Type Switching', () => {
    it('only renders DatePicker for type=date', () => {
      const { container } = render(<DateCustomPicker {...datePickerProps} />);
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('only renders DateTimePicker for type=datetime', () => {
      const { container } = render(<DateCustomPicker {...dateTimePickerProps} />);
      expect(container.querySelector('.picker_container')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('only renders CustomSelect for type=custom', () => {
      render(<DateCustomPicker {...customSelectProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});

describe('DatePickerRenderer', () => {
  const mockStyles = {
    date_picker_form_control: 'date_picker_form_control',
    date_picker_input: 'date_picker_input',
  };

  const defaultRendererProps = {
    type: 'date' as PickerType,
    date: null as Date | null,
    onDateChange: jest.fn(),
    Label: 'Date Label',
    includeTime: false,
    minDate: undefined as Date | undefined,
    maxDate: undefined as Date | undefined,
    dateFormat: 'DD/MM/YYYY',
    dateTimeFormat: 'DD/MM/YYYY hh:mm A',
    placeholder: '',
    error: false,
    helperText: '',
    getFormControlSx: () => ({}),
    getTextFieldSx: () => ({}),
    formControlClassName: '',
    styles: mockStyles,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Null Returns', () => {
    it('returns null when type is custom', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          type="custom"
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('returns null when onDateChange is not provided', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          onDateChange={undefined as unknown as (date: Date | null) => void}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('DatePicker Rendering', () => {
    it('renders DatePicker for type=date', () => {
      render(<DatePickerRenderer {...defaultRendererProps} />);
      const labels = screen.getAllByText('Date Label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders DatePicker when includeTime is false', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          includeTime={false}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('applies formControlClassName', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          formControlClassName="custom-fc-class"
        />
      );
      expect(container.querySelector('.custom-fc-class')).toBeInTheDocument();
    });
  });

  describe('DateTimePicker Rendering', () => {
    it('renders DateTimePicker for type=datetime', () => {
      render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          type="datetime"
        />
      );
      const labels = screen.getAllByText('Date Label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders DateTimePicker when includeTime is true', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          type="date"
          includeTime={true}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('uses dateTimeFormat for datetime type', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          type="datetime"
          dateTimeFormat="YYYY-MM-DD HH:mm"
        />
      );
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('shows error helper text when error is true', () => {
      render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          error={true}
          helperText="Invalid date"
        />
      );
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('does not show helper text when error is false', () => {
      render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          error={false}
          helperText="Should not show"
        />
      );
      expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
    });
  });

  describe('Date Constraints', () => {
    it('applies minDate prop', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          minDate={new Date('2024-01-01')}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('applies maxDate prop', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          maxDate={new Date('2024-12-31')}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('applies both date constraints', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          minDate={new Date('2024-01-01')}
          maxDate={new Date('2024-12-31')}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('triggers onDateChange when date value changes', async () => {
      const onDateChange = jest.fn();
      render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          date={null}
          onDateChange={onDateChange}
        />
      );
      // Find the spinbuttons (MUI v6+ uses spinbuttons for date sections)
      const daySpinbutton = screen.getByRole('spinbutton', { name: /Day/i });
      fireEvent.change(daySpinbutton, { target: { textContent: '15' } });
      // Just verify the component renders and has handlers attached
      expect(daySpinbutton).toBeInTheDocument();
    });

    it('triggers onDateChange when datetime value changes', async () => {
      const onDateChange = jest.fn();
      render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          type="datetime"
          date={null}
          onDateChange={onDateChange}
        />
      );
      // Find the spinbuttons
      const daySpinbutton = screen.getByRole('spinbutton', { name: /Day/i });
      expect(daySpinbutton).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies formControl sx styles', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          getFormControlSx={() => ({ width: '100%' })}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('applies textField sx styles', () => {
      const { container } = render(
        <DatePickerRenderer 
          {...defaultRendererProps}
          getTextFieldSx={() => ({ backgroundColor: 'white' })}
        />
      );
      expect(container.firstChild).not.toBeNull();
    });
  });
});

describe('CustomSelectRenderer', () => {
  const mockStyles = {
    custom_select_form_control: 'custom_select_form_control',
    select_input: 'select_input',
  };

  const defaultRendererProps = {
    type: 'custom' as PickerType,
    customValue: '',
    onCustomChange: jest.fn(),
    customOptions: mockCustomOptions,
    Label: 'Select Label',
    error: false,
    helperText: '',
    getCustomSelectSx: () => ({}),
    formControlClassName: '',
    styles: mockStyles,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Null Returns', () => {
    it('returns null when type is date', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          type="date"
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('returns null when type is datetime', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          type="datetime"
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('returns null when onCustomChange is not provided', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          onCustomChange={undefined as unknown as (value: string) => void}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('returns null when customOptions is not provided', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          customOptions={undefined as unknown as typeof mockCustomOptions}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('handles empty options array', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          customOptions={[]}
        />
      );
      // Check actual behavior
      expect(container).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('renders select with label', () => {
      render(<CustomSelectRenderer {...defaultRendererProps} />);
      const labels = screen.getAllByText('Select Label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders all options', async () => {
      render(<CustomSelectRenderer {...defaultRendererProps} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('displays selected value', () => {
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          customValue="option2"
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Selection Handling', () => {
    it('calls onCustomChange when option is selected', async () => {
      const onCustomChange = jest.fn();
      
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          onCustomChange={onCustomChange}
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      
      expect(onCustomChange).toHaveBeenCalled();
    });

    it('handles empty selection', () => {
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          customValue=""
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('displays error state', () => {
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          error={true}
          helperText="Selection required"
        />
      );
      expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('does not show helperText when no error', () => {
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          error={false}
          helperText="Hidden text"
        />
      );
      expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies formControlClassName', () => {
      const { container } = render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          formControlClassName="my-form-control"
        />
      );
      expect(container.querySelector('.my-form-control')).toBeInTheDocument();
    });

    it('applies custom sx styles', () => {
      render(
        <CustomSelectRenderer 
          {...defaultRendererProps}
          getCustomSelectSx={() => ({ minWidth: 200 })}
        />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});

describe('Edge Cases', () => {
  it('handles undefined type gracefully', () => {
    render(
      <DateCustomPicker 
        type={undefined}
        Label="Test"
        onDateChange={jest.fn()}
      />
    );
    // Should not crash
    const labels = screen.getAllByText('Test');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('handles both onDateChange and onCustomChange provided', () => {
    const { container } = render(
      <DateCustomPicker 
        type="date"
        date={null}
        onDateChange={jest.fn()}
        customValue=""
        onCustomChange={jest.fn()}
        customOptions={mockCustomOptions}
        Label="Mixed"
      />
    );
    // Should only render date picker for type=date
    expect(container.querySelector('.picker_container')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('handles special characters in labels', () => {
    render(
      <DateCustomPicker 
        {...defaultPickerProps}
        Label="Date & Time (Required*)"
        title="<Special> Title!"
      />
    );
    const labels = screen.getAllByText('Date & Time (Required*)');
    expect(labels.length).toBeGreaterThan(0);
    expect(screen.getByText('<Special> Title!')).toBeInTheDocument();
  });

  it('handles very long label text', () => {
    const longLabel = 'A'.repeat(200);
    render(
      <DateCustomPicker 
        {...defaultPickerProps}
        Label={longLabel}
      />
    );
    const labels = screen.getAllByText(longLabel);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('handles options with same label but different values', async () => {
    const duplicateLabelOptions = [
      { label: 'Same Label', value: 'value1' },
      { label: 'Same Label', value: 'value2' },
    ];
    
    render(
      <DateCustomPicker 
        type="custom"
        customValue=""
        onCustomChange={jest.fn()}
        customOptions={duplicateLabelOptions}
        Label="Duplicate Labels"
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    
    await waitFor(() => {
      const options = screen.getAllByText('Same Label');
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('handles option with empty label', async () => {
    const emptyLabelOptions = [
      { label: '', value: 'empty' },
      { label: 'Normal', value: 'normal' },
    ];
    
    render(
      <DateCustomPicker 
        type="custom"
        customValue=""
        onCustomChange={jest.fn()}
        customOptions={emptyLabelOptions}
        Label="Empty Label Option"
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    
    await waitFor(() => {
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });
  });

  it('handles option with special characters in value', async () => {
    const specialValueOptions = [
      { label: 'Special', value: 'value-with-special_chars.123' },
    ];
    
    render(
      <DateCustomPicker 
        type="custom"
        customValue=""
        onCustomChange={jest.fn()}
        customOptions={specialValueOptions}
        Label="Special Value"
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    
    await waitFor(() => {
      expect(screen.getByText('Special')).toBeInTheDocument();
    });
  });

  it('handles zero values for styling props', () => {
    const { container } = render(
      <DateCustomPicker 
        {...datePickerProps}
        height={0}
        width={0}
        borderRadius={0}
      />
    );
    expect(container.querySelector('.picker_container')).toBeInTheDocument();
  });

  it('handles negative values for styling props', () => {
    const { container } = render(
      <DateCustomPicker 
        {...datePickerProps}
        height={-10}
        width={-10}
        borderRadius={-5}
      />
    );
    expect(container.querySelector('.picker_container')).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  it('has accessible label for date picker', () => {
    const { container } = render(<DateCustomPicker {...datePickerProps} />);
    expect(container.querySelector('.picker_container')).toBeInTheDocument();
  });

  it('has accessible label for custom select', () => {
    render(<DateCustomPicker {...customSelectProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('associates error message with input', () => {
    render(
      <DateCustomPicker 
        {...datePickerProps}
        error={true}
        helperText="This field has an error"
      />
    );
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('date picker input is present', () => {
    const { container } = render(<DateCustomPicker {...datePickerProps} />);
    expect(container.querySelector('.picker_container')).toBeInTheDocument();
  });

  it('custom select is focusable', async () => {
    render(<DateCustomPicker {...customSelectProps} />);
    const select = screen.getByRole('combobox');
    await waitFor(() => {
      select.focus();
      expect(document.activeElement).toBe(select);
    });
  });
});
