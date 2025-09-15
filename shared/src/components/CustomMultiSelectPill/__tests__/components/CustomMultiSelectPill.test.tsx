import React from 'react';
import { CustomSelectPill } from '../../CustomMultiSelectPill';
import {
  renderWithProviders,
  screen,
  fireEvent,
  mockOptions,
  mockPriorityColors,
  defaultSingleSelectProps,
  defaultMultiSelectProps,
  resetMocks,
  createOptions,
} from '../test-utils';
import { Option } from '../../CustomMultiSelectPill.interface';

// Helper function to check if checkbox is checked (defined outside to avoid nesting)
const isCheckboxChecked = (cb: HTMLElement) => (cb as HTMLInputElement).checked;

describe('CustomSelectPill Component', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('Single Select Mode (ToggleButtonGroup)', () => {
    describe('Rendering', () => {
      it('should render ToggleButtonGroup when multiple is false', () => {
        renderWithProviders(
          <CustomSelectPill {...defaultSingleSelectProps} />
        );

        // Should render toggle buttons for each option
        for (const opt of mockOptions.basic) {
          expect(screen.getByRole('button', { name: opt.label })).toBeInTheDocument();
        }
      });

      it('should render all options as toggle buttons', () => {
        renderWithProviders(
          <CustomSelectPill {...defaultSingleSelectProps} />
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(mockOptions.basic.length);
      });

      it('should render single option correctly', () => {
        renderWithProviders(
          <CustomSelectPill
            options={mockOptions.single}
            onChange={jest.fn()}
            multiple={false}
          />
        );

        expect(screen.getByRole('button', { name: 'Only Option' })).toBeInTheDocument();
      });

      it('should render with icons when provided', () => {
        renderWithProviders(
          <CustomSelectPill
            options={mockOptions.withIcons}
            onChange={jest.fn()}
            multiple={false}
          />
        );

        expect(screen.getByTestId('mock-home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      });

      it('should apply custom toggleLabelCls', () => {
        const { container } = renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            toggleLabelCls="custom-label-class"
          />
        );

        const labels = container.querySelectorAll('.custom-label-class');
        expect(labels.length).toBeGreaterThan(0);
      });
    });

    describe('Selection', () => {
      it('should mark selected value as pressed', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
          />
        );

        const selectedButton = screen.getByRole('button', { name: 'Option A' });
        expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
      });

      it('should mark non-selected values as not pressed', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
          />
        );

        const optionB = screen.getByRole('button', { name: 'Option B' });
        const optionC = screen.getByRole('button', { name: 'Option C' });

        expect(optionB).toHaveAttribute('aria-pressed', 'false');
        expect(optionC).toHaveAttribute('aria-pressed', 'false');
      });

      it('should call onChange with selected value when clicking a button', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            onChange={handleChange}
          />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Option B' }));

        expect(handleChange).toHaveBeenCalledWith('b');
      });

      it('should not deselect when clicking the already selected value', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
            onChange={handleChange}
          />
        );

        // Click on already selected option
        fireEvent.click(screen.getByRole('button', { name: 'Option A' }));

        // onChange should not be called when trying to deselect
        expect(handleChange).not.toHaveBeenCalled();
      });

      it('should switch selection when clicking a different option', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
            onChange={handleChange}
          />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Option C' }));

        expect(handleChange).toHaveBeenCalledWith('c');
      });

      it('should show check icon on selected option', () => {
        const { container } = renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
          />
        );

        // Check icon should be visible (the green circle with check mark)
        const checkIcon = container.querySelector('[data-testid="CheckIcon"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    describe('Disabled State', () => {
      it('should disable all buttons when disabled prop is true', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            disabled={true}
          />
        );

        const buttons = screen.getAllByRole('button');
        for (const button of buttons) {
          expect(button).toBeDisabled();
        }
      });

      it('should not call onChange when disabled button is clicked', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            onChange={handleChange}
            disabled={true}
          />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Option A' }));

        expect(handleChange).not.toHaveBeenCalled();
      });
    });

    describe('Priority Colors', () => {
      it('should apply priority color styles to buttons', () => {
        const { container } = renderWithProviders(
          <CustomSelectPill
            options={mockOptions.priorities}
            onChange={jest.fn()}
            multiple={false}
            priorityColors={mockPriorityColors}
          />
        );

        // Check that toggle-button-priority class is applied
        const priorityButtons = container.querySelectorAll('.toggle-button-priority');
        expect(priorityButtons.length).toBe(mockOptions.priorities.length);
      });

      it('should not apply priority class when priorityColors is not provided', () => {
        const { container } = renderWithProviders(
          <CustomSelectPill
            options={mockOptions.priorities}
            onChange={jest.fn()}
            multiple={false}
          />
        );

        const priorityButtons = container.querySelectorAll('.toggle-button-priority');
        expect(priorityButtons.length).toBe(0);
      });
    });

    describe('Controlled Value', () => {
      it('should sync with external value changes', () => {
        const { rerender } = renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="a"
          />
        );

        expect(screen.getByRole('button', { name: 'Option A' })).toHaveAttribute(
          'aria-pressed',
          'true'
        );

        // Update value externally
        rerender(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value="b"
          />
        );

        expect(screen.getByRole('button', { name: 'Option B' })).toHaveAttribute(
          'aria-pressed',
          'true'
        );
        expect(screen.getByRole('button', { name: 'Option A' })).toHaveAttribute(
          'aria-pressed',
          'false'
        );
      });

      it('should handle empty value', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value=""
          />
        );

        // No button should be selected
        const buttons = screen.getAllByRole('button');
        for (const button of buttons) {
          expect(button).toHaveAttribute('aria-pressed', 'false');
        }
      });

      it('should handle undefined value', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultSingleSelectProps}
            value={undefined}
          />
        );

        // Component should render without errors
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });
  });

  describe('Multi Select Mode (Autocomplete)', () => {
    describe('Rendering', () => {
      it('should render Autocomplete when multiple is true', () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} />
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      it('should render with label "Select options"', () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} />
        );

        expect(screen.getByLabelText('Select options')).toBeInTheDocument();
      });

      it('should show placeholder when no values are selected', () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} value={[]} />
        );

        expect(
          screen.getByPlaceholderText('Please select dealers')
        ).toBeInTheDocument();
      });
    });

    describe('Dropdown Options', () => {
      it('should show "All" option at the top', async () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} />
        );

        // Open the dropdown by clicking the popup indicator
        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Wait for dropdown to open
        const allOption = await screen.findByText('All');
        expect(allOption).toBeInTheDocument();
      });

      it('should show all options in dropdown', async () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        for (const opt of mockOptions.basic) {
          expect(await screen.findByText(opt.label)).toBeInTheDocument();
        }
      });

      it('should render checkboxes for each option', async () => {
        renderWithProviders(
          <CustomSelectPill {...defaultMultiSelectProps} />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Wait for dropdown to open and check for checkboxes
        const checkboxes = await screen.findAllByRole('checkbox');
        // +1 for "All" option
        expect(checkboxes.length).toBe(mockOptions.basic.length + 1);
      });

      it('should render icons in options when provided', async () => {
        renderWithProviders(
          <CustomSelectPill
            options={mockOptions.withIcons}
            onChange={jest.fn()}
            multiple={true}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Icons should be visible in the dropdown
        expect(await screen.findByTestId('mock-home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      });
    });

    describe('Selection', () => {
      it('should call onChange with selected options when selecting an option', async () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            onChange={handleChange}
            value={[]}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Click on Option A
        const optionA = await screen.findByText('Option A');
        fireEvent.click(optionA);

        expect(handleChange).toHaveBeenCalledWith([
          expect.objectContaining({ label: 'Option A', value: 'a' }),
        ]);
      });

      it('should handle selecting multiple options', async () => {
        const handleChange = jest.fn();
        const selectedOptions: Option[] = [{ label: 'Option A', value: 'a' }];

        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            onChange={handleChange}
            value={selectedOptions}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Click on Option B
        const optionB = await screen.findByText('Option B');
        fireEvent.click(optionB);

        expect(handleChange).toHaveBeenCalled();
      });

      it('should mark selected options as checked', async () => {
        const selectedOptions: Option[] = [{ label: 'Option A', value: 'a' }];

        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            value={selectedOptions}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        // Wait for dropdown to open by looking for the "All" option which is only in dropdown
        await screen.findByText('All');

        // Find checkboxes and verify checked state
        const checkboxes = screen.getAllByRole('checkbox');
        // At least one checkbox should be checked
        const checkedCheckboxes = checkboxes.filter(isCheckboxChecked);
        expect(checkedCheckboxes.length).toBeGreaterThan(0);
      });
    });

    describe('Select All', () => {
      it('should select all options when clicking "All"', async () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            onChange={handleChange}
            value={[]}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        const allOption = await screen.findByText('All');
        fireEvent.click(allOption);

        // Should be called with all options
        expect(handleChange).toHaveBeenCalledWith(mockOptions.basic);
      });

      it('should deselect all options when clicking "All" and all are selected', async () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            onChange={handleChange}
            value={mockOptions.basic}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        const allOption = await screen.findByText('All');
        fireEvent.click(allOption);

        // Should be called with empty array
        expect(handleChange).toHaveBeenCalledWith([]);
      });

      it('should check "All" checkbox when all options are selected', async () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            value={mockOptions.basic}
          />
        );

        const openButton = screen.getByRole('button', { name: 'Open' });
        fireEvent.click(openButton);

        await screen.findByText('All');

        // All checkboxes should be checked
        const checkboxes = screen.getAllByRole('checkbox');
        for (const checkbox of checkboxes) {
          expect(checkbox).toBeChecked();
        }
      });
    });

    describe('Controlled Value', () => {
      it('should sync with external value changes', () => {
        const initialValue: Option[] = [{ label: 'Option A', value: 'a' }];
        const { rerender } = renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            value={initialValue}
          />
        );

        // Update value externally
        const newValue: Option[] = [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ];
        rerender(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            value={newValue}
          />
        );

        // Component should update to reflect new values
        // The chips should be visible in the input
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      it('should handle empty array value', () => {
        renderWithProviders(
          <CustomSelectPill
            {...defaultMultiSelectProps}
            value={[]}
          />
        );

        expect(
          screen.getByPlaceholderText('Please select dealers')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle many options', () => {
      const manyOptions = createOptions(20);
      renderWithProviders(
        <CustomSelectPill
          options={manyOptions}
          onChange={jest.fn()}
          multiple={false}
        />
      );

      expect(screen.getAllByRole('button')).toHaveLength(20);
    });

    it('should handle options with special characters in labels', () => {
      const specialOptions: Option[] = [
        { label: 'Option & More', value: 'amp' },
        { label: 'Option "Quoted"', value: 'quoted' },
        { label: 'Option <Tag>', value: 'tag' },
      ];

      renderWithProviders(
        <CustomSelectPill
          options={specialOptions}
          onChange={jest.fn()}
          multiple={false}
        />
      );

      expect(screen.getByRole('button', { name: 'Option & More' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Option "Quoted"' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Option <Tag>' })).toBeInTheDocument();
    });

    it('should handle rapid selection changes', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CustomSelectPill
          {...defaultSingleSelectProps}
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');

      // Rapid clicks
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[2]);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('should work without onChange callback', () => {
      expect(() =>
        renderWithProviders(
          <CustomSelectPill options={mockOptions.basic} multiple={false} />
        )
      ).not.toThrow();
    });

    it('should handle switching between single and multi mode', () => {
      const { rerender } = renderWithProviders(
        <CustomSelectPill {...defaultSingleSelectProps} value="a" />
      );

      expect(screen.getAllByRole('button')).toHaveLength(3);

      // Switch to multi mode
      rerender(
        <CustomSelectPill
          {...defaultMultiSelectProps}
          value={[{ label: 'Option A', value: 'a' }]}
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper toggle button group role in single select', () => {
      renderWithProviders(
        <CustomSelectPill {...defaultSingleSelectProps} />
      );

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should have proper combobox role in multi select', () => {
      renderWithProviders(
        <CustomSelectPill {...defaultMultiSelectProps} />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have aria-pressed on toggle buttons', () => {
      renderWithProviders(
        <CustomSelectPill {...defaultSingleSelectProps} value="a" />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-pressed');
    });
  });
});
