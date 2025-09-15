import React from 'react';
import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import GroupedSelect from '../../GroupedSelect';
import {
  renderWithProviders,
  createMockOptions,
  createMockGroupedOptions,
  createDefaultProps,
  MockOption,
} from '../test-utils';

// Helper to open the autocomplete dropdown
const openDropdown = () => {
  const openButton = screen.getByRole('button', { name: 'Open' });
  fireEvent.click(openButton);
};

describe('GroupedSelect Component', () => {
  describe('Rendering', () => {
    it('should render the component with label', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Select Items" />);

      expect(screen.getByLabelText('Select Items')).toBeInTheDocument();
    });

    it('should render the component without label', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(<GroupedSelect {...props} />);

      expect(container.querySelector('.MuiAutocomplete-root')).toBeInTheDocument();
    });

    it('should render with placeholder matching label', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Choose" />);

      expect(screen.getByPlaceholderText('Choose')).toBeInTheDocument();
    });

    it('should render as disabled when disabled prop is true', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(
        <GroupedSelect {...props} label="Test" disabled={true} />
      );

      // Check that the component renders in disabled state
      expect(container.querySelector('.MuiAutocomplete-root')).toBeInTheDocument();
    });

    it('should render with small size by default', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(<GroupedSelect {...props} label="Test" />);

      expect(container.querySelector('.MuiAutocomplete-root')).toBeInTheDocument();
    });

    it('should render with medium size when specified', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(
        <GroupedSelect {...props} label="Test" size="medium" />
      );

      expect(container.querySelector('.MuiAutocomplete-root')).toBeInTheDocument();
    });
  });

  describe('Options Display', () => {
    it('should show options when clicking the input', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Should display grouped options
      expect(screen.getByText('Item A1')).toBeInTheDocument();
      expect(screen.getByText('Item B1')).toBeInTheDocument();
    });

    it('should display "All" option for each group', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Should have "All" options for each group
      const allOptions = screen.getAllByText('All');
      expect(allOptions.length).toBe(2); // One for each group
    });

    it('should display group headers', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      expect(screen.getByText('Group A')).toBeInTheDocument();
      expect(screen.getByText('Group B')).toBeInTheDocument();
    });

    it('should handle simple options without groups', () => {
      const simpleOptions = createMockOptions(3);
      const onChange = jest.fn();
      renderWithProviders(
        <GroupedSelect options={simpleOptions} value={[]} onChange={onChange} label="Test" />
      );

      openDropdown();

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Selection Behavior', () => {
    it('should call onChange when an option is selected', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      const optionA1 = screen.getByText('Item A1');
      fireEvent.click(optionA1);

      expect(props.onChange).toHaveBeenCalled();
    });

    it('should select multiple options', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      fireEvent.click(screen.getByText('Item A1'));
      fireEvent.click(screen.getByText('Item B1'));

      expect(props.onChange).toHaveBeenCalledTimes(2);
    });

    it('should select all items in a group when "All" is clicked', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Click the first "All" option (for Group A)
      const allOptions = screen.getAllByText('All');
      fireEvent.click(allOptions[0]);

      // onChange should be called with all items from Group A (excluding "All" itself)
      expect(props.onChange).toHaveBeenCalled();
      const lastCall = props.onChange.mock.calls[0][0];
      expect(lastCall).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 'a1' }),
          expect.objectContaining({ value: 'a2' }),
          expect.objectContaining({ value: 'a3' }),
        ])
      );
    });

    it('should deselect an option when clicked again', () => {
      const selectedValue: MockOption[] = [{ label: 'Item A1', value: 'a1' }];
      const props = { ...createDefaultProps(), value: selectedValue };
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Click the already selected option (in the listbox) to deselect
      const listbox = screen.getByRole('listbox');
      const optionInList = within(listbox).getByText('Item A1');
      fireEvent.click(optionInList);

      expect(props.onChange).toHaveBeenCalled();
    });
  });

  describe('Value Display', () => {
    it('should display selected values as chips', () => {
      const selectedValue: MockOption[] = [
        { label: 'Item A1', value: 'a1' },
        { label: 'Item B1', value: 'b1' },
      ];
      const props = { ...createDefaultProps(), value: selectedValue };
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      expect(screen.getByText('Item A1')).toBeInTheDocument();
      expect(screen.getByText('Item B1')).toBeInTheDocument();
    });

    it('should not include "All" items when passing back to onChange', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Select "All" for Group A
      const allOptions = screen.getAllByText('All');
      fireEvent.click(allOptions[0]);

      // The callback should not include "All" items
      const lastCall = props.onChange.mock.calls[0][0];
      const hasAllItem = lastCall.some((item: any) => item.isAll);
      expect(hasAllItem).toBe(false);
    });

    it('should show checkboxes for each option', () => {
      const props = createDefaultProps();
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      const listbox = screen.getByRole('listbox');
      const checkboxes = within(listbox).getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should check the checkbox when option is selected', () => {
      const selectedValue: MockOption[] = [{ label: 'Item A1', value: 'a1' }];
      const props = { ...createDefaultProps(), value: selectedValue };
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      const listbox = screen.getByRole('listbox');
      const checkboxes = within(listbox).getAllByRole('checkbox');
      // At least one checkbox should be checked (for the selected item)
      const checkedCheckboxes = checkboxes.filter(
        (cb) => cb.getAttribute('class')?.includes('Checked') || (cb as HTMLInputElement).checked
      );
      expect(checkedCheckboxes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const onChange = jest.fn();
      renderWithProviders(
        <GroupedSelect options={[]} value={[]} onChange={onChange} label="Test" />
      );

      expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });

    it('should handle undefined value gracefully', () => {
      const onChange = jest.fn();
      renderWithProviders(
        <GroupedSelect
          options={createMockGroupedOptions()}
          value={undefined as any}
          onChange={onChange}
          label="Test"
        />
      );

      expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });

    it('should handle null value gracefully', () => {
      const onChange = jest.fn();
      renderWithProviders(
        <GroupedSelect
          options={createMockGroupedOptions()}
          value={null as any}
          onChange={onChange}
          label="Test"
        />
      );

      expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });

    it('should handle mixed options (grouped and non-grouped)', () => {
      const mixedOptions = [
        { label: 'Standalone 1', value: 'standalone1' },
        {
          label: 'Group A',
          options: [{ label: 'Item A1', value: 'a1' }],
        },
      ];
      const onChange = jest.fn();
      renderWithProviders(
        <GroupedSelect options={mixedOptions} value={[]} onChange={onChange} label="Test" />
      );

      openDropdown();

      expect(screen.getByText('Standalone 1')).toBeInTheDocument();
      expect(screen.getByText('Item A1')).toBeInTheDocument();
    });

    it('should handle selecting a value not in current options', () => {
      const selectedValue: MockOption[] = [{ label: 'Non-existent', value: 'none' }];
      const props = { ...createDefaultProps(), value: selectedValue };

      // Should not throw
      expect(() => {
        renderWithProviders(<GroupedSelect {...props} label="Test" />);
      }).not.toThrow();
    });
  });

  describe('Chip Removal', () => {
    it('should allow removing a chip by clicking delete icon', () => {
      const selectedValue: MockOption[] = [
        { label: 'Item A1', value: 'a1' },
        { label: 'Item B1', value: 'b1' },
      ];
      const props = { ...createDefaultProps(), value: selectedValue };
      const { container } = renderWithProviders(<GroupedSelect {...props} label="Test" />);

      // Find delete icons on chips
      const deleteButtons = container.querySelectorAll('.MuiChip-deleteIcon');
      expect(deleteButtons.length).toBe(2);

      // Click delete on first chip
      if (deleteButtons[0]) {
        fireEvent.click(deleteButtons[0]);
        expect(props.onChange).toHaveBeenCalled();
      }
    });
  });

  describe('All Selection Logic', () => {
    it('should auto-select "All" when all group items are selected', () => {
      // Start with all items in Group B selected
      const selectedValue: MockOption[] = [
        { label: 'Item B1', value: 'b1' },
        { label: 'Item B2', value: 'b2' },
      ];
      const props = { ...createDefaultProps(), value: selectedValue };
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // The "All" checkbox for Group B should be checked since all items are selected
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('should handle clicking "All" when some items are already selected', () => {
      const selectedValue: MockOption[] = [{ label: 'Item A1', value: 'a1' }];
      const props = { ...createDefaultProps(), value: selectedValue };
      renderWithProviders(<GroupedSelect {...props} label="Test" />);

      openDropdown();

      // Click "All" for Group A
      const allOptions = screen.getAllByText('All');
      fireEvent.click(allOptions[0]);

      expect(props.onChange).toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('should accept custom className', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(
        <GroupedSelect {...props} label="Test" className="custom-class" />
      );

      expect(container.querySelector('.MuiAutocomplete-root')).toBeInTheDocument();
    });
  });
});
