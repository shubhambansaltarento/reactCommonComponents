import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithProviders,
  mockOptions,
  mockManyOptions,
  createMultiSelectProps,
  createSingleSelectProps,
} from '../setup';
import { CustomMultiSelect } from '../../CustomMultiSelect';

describe('CustomMultiSelect', () => {
  describe('Rendering', () => {
    it('should render without crashing in multi-select mode', () => {
      const props = createMultiSelectProps();
      expect(() => renderWithProviders(<CustomMultiSelect {...props} />)).not.toThrow();
    });

    it('should render without crashing in single-select mode', () => {
      const props = createSingleSelectProps();
      expect(() => renderWithProviders(<CustomMultiSelect {...props} />)).not.toThrow();
    });

    it('should render with label', () => {
      const props = createMultiSelectProps({ label: 'Test Label' });
      const { getByLabelText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should render with placeholder in multi-select mode', () => {
      const props = createMultiSelectProps();
      const { getByPlaceholderText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByPlaceholderText('Select options')).toBeInTheDocument();
    });

    it('should render with placeholder in single-select mode', () => {
      const props = createSingleSelectProps();
      const { getByPlaceholderText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByPlaceholderText('Select option')).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      const props = createMultiSelectProps({ disabled: true });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const input = container.querySelector('input');
      expect(input).toBeDisabled();
    });

    it('should render with custom className', () => {
      const props = createMultiSelectProps({ className: 'custom-class' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).toHaveClass('custom-class');
    });

    it('should render with error state', () => {
      const props = createMultiSelectProps({ error: true });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const input = container.querySelector('.MuiOutlinedInput-root');
      expect(input).toHaveClass('Mui-error');
    });

    it('should render with small size by default', () => {
      const props = createMultiSelectProps();
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      // Check that the input has small size class
      const inputBase = container.querySelector('.MuiInputBase-sizeSmall');
      expect(inputBase).toBeInTheDocument();
    });

    it('should render with medium size', () => {
      const props = createMultiSelectProps({ size: 'medium' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      // Check that input doesn't have small size class
      const inputBase = container.querySelector('.MuiInputBase-sizeSmall');
      expect(inputBase).not.toBeInTheDocument();
    });
  });

  describe('Multi-Select Mode', () => {
    it('should open dropdown when clicked', async () => {
      const props = createMultiSelectProps();
      const { container, getByRole } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      // Click on the popup button to open dropdown
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('should show all options plus "All" option in dropdown', async () => {
      const props = createMultiSelectProps();
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      // Check "All" option is present
      expect(getByText('All')).toBeInTheDocument();
      
      // Check all regular options are present
      for (const option of mockOptions) {
        expect(getByText(option.label)).toBeInTheDocument();
      }
    });

    it('should select an option when clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createMultiSelectProps({ onChange: mockOnChange });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('Option 1'));
      
      expect(mockOnChange).toHaveBeenCalledWith(['option1']);
    });

    it('should select multiple options', async () => {
      const mockOnChange = jest.fn();
      const props = createMultiSelectProps({ onChange: mockOnChange });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      // Select first option - dropdown stays open due to disableCloseOnSelect
      fireEvent.click(getByText('Option 1'));
      
      expect(mockOnChange).toHaveBeenCalledWith(['option1']);
      
      // Select second option - dropdown should still be open
      fireEvent.click(getByText('Option 2'));
      
      expect(mockOnChange).toHaveBeenLastCalledWith(['option1', 'option2']);
    });

    it('should select all options when "All" is clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createMultiSelectProps({ onChange: mockOnChange });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('All'));
      
      expect(mockOnChange).toHaveBeenCalledWith(['option1', 'option2', 'option3']);
    });

    it('should deselect all options when "All" is clicked again', async () => {
      const mockOnChange = jest.fn();
      const props = createMultiSelectProps({ 
        onChange: mockOnChange,
        value: ['option1', 'option2', 'option3']
      });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('All'));
      
      expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('should show selected values as chips', () => {
      const props = createMultiSelectProps({ value: ['option1', 'option2'] });
      const { getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByText('Option 1')).toBeInTheDocument();
      expect(getByText('Option 2')).toBeInTheDocument();
    });

    it('should remove a selected value when chip delete is clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createMultiSelectProps({ 
        onChange: mockOnChange,
        value: ['option1', 'option2']
      });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      // Find and click the delete button on the first chip
      const deleteButtons = container.querySelectorAll('.MuiChip-deleteIcon');
      expect(deleteButtons.length).toBeGreaterThan(0);
      
      fireEvent.click(deleteButtons[0]);
      
      expect(mockOnChange).toHaveBeenCalledWith(['option2']);
    });

    it('should display +N chip when more than 10 options are selected', () => {
      const props = createMultiSelectProps({ 
        options: mockManyOptions,
        value: mockManyOptions.map(o => o.value)
      });
      const { getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      // Should show "+2" chip for the remaining 2 options (12 - 10 = 2)
      expect(getByText('+2')).toBeInTheDocument();
    });

    it('should use defaultValues when provided', () => {
      const props = createMultiSelectProps({ defaultValues: ['option1'] });
      const { getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByText('Option 1')).toBeInTheDocument();
    });

    it('should apply custom-multiselect-outlined class when options are selected', () => {
      const props = createMultiSelectProps({ value: ['option1'] });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).toHaveClass('custom-multiselect-outlined');
    });
  });

  describe('Single-Select Mode', () => {
    it('should open dropdown when clicked', async () => {
      const props = createSingleSelectProps();
      const { container, getByRole } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('should show all options in dropdown (no "All" option)', async () => {
      const props = createSingleSelectProps();
      const { container, getByRole, getByText, queryByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      // "All" option should not be present in single-select
      expect(queryByText('All')).not.toBeInTheDocument();
      
      // Check all regular options are present
      for (const option of mockOptions) {
        expect(getByText(option.label)).toBeInTheDocument();
      }
    });

    it('should select an option when clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createSingleSelectProps({ onChange: mockOnChange });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('Option 1'));
      
      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should display the selected value in the input', async () => {
      const props = createSingleSelectProps({ value: 'option1' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Option 1');
    });

    it('should change selection when a different option is clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createSingleSelectProps({ 
        onChange: mockOnChange,
        value: 'option1'
      });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('Option 2'));
      
      expect(mockOnChange).toHaveBeenCalledWith('option2');
    });

    it('should clear selection when clear button is clicked', async () => {
      const mockOnChange = jest.fn();
      const props = createSingleSelectProps({ 
        onChange: mockOnChange,
        value: 'option1'
      });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const clearButton = container.querySelector('.MuiAutocomplete-clearIndicator');
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(mockOnChange).toHaveBeenCalledWith('');
      }
    });

    it('should use first defaultValue in single-select mode', () => {
      const props = createSingleSelectProps({ defaultValues: ['option2', 'option3'] });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Option 2');
    });

    it('should apply custom-multiselect-outlined class when option is selected', () => {
      const props = createSingleSelectProps({ value: 'option1' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).toHaveClass('custom-multiselect-outlined');
    });

    it('should not apply custom-multiselect-outlined class when no option is selected', () => {
      const props = createSingleSelectProps({ value: '' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).not.toHaveClass('custom-multiselect-outlined');
    });

    it('should render disabled state in single-select mode', () => {
      const props = createSingleSelectProps({ disabled: true });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const input = container.querySelector('input');
      expect(input).toBeDisabled();
    });
  });

  describe('Controlled Component Behavior', () => {
    it('should update selection when value prop changes', () => {
      const props = createMultiSelectProps({ value: ['option1'] });
      const { rerender, getByText, queryByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      expect(getByText('Option 1')).toBeInTheDocument();
      expect(queryByText('Option 2')).not.toBeInTheDocument();
      
      // Update value prop
      rerender(
        <CustomMultiSelect {...createMultiSelectProps({ value: ['option1', 'option2'] })} />
      );
      
      expect(getByText('Option 1')).toBeInTheDocument();
      expect(getByText('Option 2')).toBeInTheDocument();
    });

    it('should update single-select value when value prop changes', () => {
      const props = createSingleSelectProps({ value: 'option1' });
      const { rerender, container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      let input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Option 1');
      
      // Update value prop
      rerender(
        <CustomMultiSelect {...createSingleSelectProps({ value: 'option2' })} />
      );
      
      input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Option 2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const props = createMultiSelectProps({ options: [] });
      expect(() => renderWithProviders(<CustomMultiSelect {...props} />)).not.toThrow();
    });

    it('should handle undefined value', () => {
      const props = createMultiSelectProps({ value: undefined });
      expect(() => renderWithProviders(<CustomMultiSelect {...props} />)).not.toThrow();
    });

    it('should handle undefined onChange', async () => {
      const props = createMultiSelectProps({ onChange: undefined });
      const { container, getByRole, getByText } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      // Should not throw when clicking option without onChange
      expect(() => fireEvent.click(getByText('Option 1'))).not.toThrow();
    });

    it('should handle empty string in selectedValues', () => {
      const props = createSingleSelectProps({ value: '' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).not.toHaveClass('custom-multiselect-outlined');
    });

    it('should handle sx prop', () => {
      const props = createMultiSelectProps({ sx: { width: 300 } });
      expect(() => renderWithProviders(<CustomMultiSelect {...props} />)).not.toThrow();
    });
  });

  describe('Checkbox Icons in Multi-Select', () => {
    it('should show unchecked checkbox icon for unselected options', async () => {
      const props = createMultiSelectProps();
      const { container, getByRole } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      const listbox = getByRole('listbox');
      const uncheckedIcons = listbox.querySelectorAll('[data-testid="CheckBoxOutlineBlankIcon"]');
      expect(uncheckedIcons.length).toBeGreaterThan(0);
    });

    it('should show checked checkbox icon for selected options', async () => {
      const props = createMultiSelectProps({ value: ['option1'] });
      const { container, getByRole } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const popupButton = container.querySelector('.MuiAutocomplete-popupIndicator');
      fireEvent.click(popupButton!);
      
      await waitFor(() => {
        expect(getByRole('listbox')).toBeInTheDocument();
      });
      
      const listbox = getByRole('listbox');
      const checkedIcons = listbox.querySelectorAll('[data-testid="CheckBoxIcon"]');
      expect(checkedIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Chip Rendering', () => {
    it('should render chips with small size when size is small', () => {
      const props = createMultiSelectProps({ value: ['option1'], size: 'small' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips.length).toBeGreaterThan(0);
      expect(chips[0]).toHaveClass('MuiChip-sizeSmall');
    });

    it('should render chips with medium size when size is medium', () => {
      const props = createMultiSelectProps({ value: ['option1'], size: 'medium' });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips.length).toBeGreaterThan(0);
      expect(chips[0]).toHaveClass('MuiChip-sizeMedium');
    });

    it('should render outlined chip variant', () => {
      const props = createMultiSelectProps({ value: ['option1'] });
      const { container } = renderWithProviders(<CustomMultiSelect {...props} />);
      
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips.length).toBeGreaterThan(0);
      expect(chips[0]).toHaveClass('MuiChip-outlined');
    });
  });
});
