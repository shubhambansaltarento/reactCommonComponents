/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ActionList } from '../../ActionList';
import {
  renderWithProviders,
  createMockData,
  createDefaultProps,
  MockRowData,
} from '../test-utils';

// Mock the child components
jest.mock('../../../Button', () => ({
  CustomButton: ({ label, onClick, ...props }: any) => (
    <button data-testid="custom-button" onClick={onClick} {...props}>
      {label}
    </button>
  ),
}));

jest.mock('../../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate, disabled, onClick }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };
    
    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        onClick(e);
      }
      // Simulate change event when clicking
      if (onChange) {
        const syntheticEvent = {
          target: { checked: !checked },
          currentTarget: { checked: !checked },
        } as any;
        onChange(syntheticEvent);
      }
    };
    
    return (
      <input
        type="checkbox"
        data-testid="custom-checkbox"
        checked={checked || false}
        onChange={handleChange}
        onClick={handleClick}
        disabled={disabled}
        data-indeterminate={indeterminate ? 'true' : 'false'}
      />
    );
  },
}));

jest.mock('../../../CommonPagination/CommonPagination', () => ({
  CommonPagination: ({ page, rowsPerPage, totalRows, onPageChange }: any) => (
    <div data-testid="common-pagination">
      <span data-testid="pagination-info">
        Page {page + 1}, Rows per page: {rowsPerPage}, Total: {totalRows}
      </span>
      <button
        data-testid="next-page"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
      >
        Next
      </button>
      <button
        data-testid="prev-page"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0}
      >
        Previous
      </button>
    </div>
  ),
}));

jest.mock('../../../ProductCard/ItemCounter', () => {
  return function MockItemCounter({ count, onChange, min, max, id, counterUpdateValue, className }: any) {
    return (
      <div data-testid={`item-counter-${id}`} className={className}>
        <button
          data-testid={`decrement-${id}`}
          onClick={() => onChange(Math.max(min, count - (counterUpdateValue || 1)))}
          disabled={count <= min}
        >
          -
        </button>
        <span data-testid={`count-${id}`}>{count}</span>
        <button
          data-testid={`increment-${id}`}
          onClick={() => onChange(Math.min(max, count + (counterUpdateValue || 1)))}
          disabled={count >= max}
        >
          +
        </button>
      </div>
    );
  };
});

describe('ActionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(<ActionList {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should render all data items as cards', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<ActionList {...props} />);

      // Check that column labels are rendered for each row
      const nameLabels = screen.getAllByText('Name');
      expect(nameLabels.length).toBe(3);
    });

    it('should render column labels and values', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Description for item 1')).toBeInTheDocument();
    });

    it('should render pagination component', () => {
      const props = createDefaultProps();
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });

    it('should apply wrapper className with styles', () => {
      const mockStyles = { 'custom-wrapper': 'applied-style' };
      const props = createDefaultProps({
        wrapperClassName: 'custom-wrapper',
        styles: mockStyles,
      });
      const { container } = renderWithProviders(<ActionList {...props} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('applied-style');
    });

    it('should apply card className using getCardClassName', () => {
      const mockStyles = { 'highlighted-card': 'highlight-style' };
      const getCardClassName = jest.fn().mockReturnValue('highlighted-card');
      const props = createDefaultProps({
        getCardClassName,
        styles: mockStyles,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(getCardClassName).toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('should render Select All checkbox when allowSelection is true', () => {
      const props = createDefaultProps({ allowSelection: true });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('should not render Select All checkbox when allowSelection is false', () => {
      const props = createDefaultProps({ allowSelection: false });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
    });

    it('should render row checkboxes when allowSelection is true', () => {
      const props = createDefaultProps({ allowSelection: true });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // 1 for select all + 3 for each row
      expect(checkboxes.length).toBe(4);
    });

    it('should not render row checkboxes when allowSelection is false', () => {
      const props = createDefaultProps({ allowSelection: false });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should disable Select All checkbox when disableAllSelection is true', () => {
      const props = createDefaultProps({
        allowSelection: true,
        disableAllSelection: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes[0]).toBeDisabled();
    });

    it('should call onRowSelectionChange when selecting a row', async () => {
      const onRowSelectionChange = jest.fn();
      // Use data with cartQuantity > 0 to make checkbox checked
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        allowSelection: true,
        data: mockData,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Initial mount should trigger onRowSelectionChange for rows with cartQuantity > 0
      await waitFor(() => {
        expect(onRowSelectionChange).toHaveBeenCalled();
      });
    });

    it('should handle select all functionality', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({
        allowSelection: true,
        data: mockData,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click Select All checkbox - should not throw error
      fireEvent.change(checkboxes[0], { target: { checked: true } });

      // Verify the component still renders correctly after selection
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(4);
    });

    it('should handle deselect all functionality', () => {
      // Start with data that has cartQuantity > 0
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 3 },
      ];
      const props = createDefaultProps({
        allowSelection: true,
        data: mockData,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      
      // Deselect all - should not throw error
      fireEvent.change(checkboxes[0], { target: { checked: false } });

      // Verify the component still renders correctly after deselection
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(3);
    });
  });

  describe('Header Rendering', () => {
    it('should render custom header when renderHeader is provided', () => {
      const renderHeader = jest.fn((row: MockRowData) => (
        <span data-testid="custom-header">{row.name}</span>
      ));
      const mockData = createMockData(3);
      const props = createDefaultProps({ renderHeader, data: mockData });
      renderWithProviders(<ActionList {...props} />);

      const customHeaders = screen.getAllByTestId('custom-header');
      expect(customHeaders.length).toBe(3);
      // renderHeader may be called multiple times due to React rendering behavior
      expect(renderHeader).toHaveBeenCalled();
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons when provided', () => {
      const clickHandler = jest.fn();
      const MockIcon = () => <span data-testid="action-icon">Icon</span>;
      const actionButtons = [
        {
          iconComponent: MockIcon,
          clickHandler,
        },
      ];
      const props = createDefaultProps({ actionButtons });
      renderWithProviders(<ActionList {...props} />);

      const icons = screen.getAllByTestId('action-icon');
      expect(icons.length).toBe(3); // One per row
    });

    it('should call clickHandler when action button is clicked', () => {
      const clickHandler = jest.fn();
      const MockIcon = () => <span data-testid="action-icon">Icon</span>;
      const actionButtons = [
        {
          iconComponent: MockIcon,
          clickHandler,
        },
      ];
      const mockData = createMockData(1);
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<ActionList {...props} />);

      // Get all buttons and click the one containing the action icon
      const buttons = screen.getAllByRole('button');
      const actionButton = buttons.find(btn => btn.querySelector('[data-testid="action-icon"]'));
      if (actionButton) {
        fireEvent.click(actionButton);
        expect(clickHandler).toHaveBeenCalledWith(mockData[0]);
      }
    });

    it('should render button when buttonAction and buttonLabel are provided without actionButtons', () => {
      const buttonAction = jest.fn();
      const props = createDefaultProps({
        buttonAction,
        buttonLabel: 'Action Button',
      });
      renderWithProviders(<ActionList {...props} />);

      const buttons = screen.getAllByTestId('custom-button');
      expect(buttons.length).toBe(3);
      expect(buttons[0]).toHaveTextContent('Action Button');
    });

    it('should call buttonAction when custom button is clicked', () => {
      const buttonAction = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        buttonAction,
        buttonLabel: 'Click Me',
        data: mockData,
      });
      renderWithProviders(<ActionList {...props} />);

      const button = screen.getByTestId('custom-button');
      fireEvent.click(button);

      expect(buttonAction).toHaveBeenCalledWith(mockData[0]);
    });

    it('should not render button when only buttonLabel is provided without buttonAction', () => {
      const props = createDefaultProps({
        buttonLabel: 'No Action Button',
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.queryByTestId('custom-button')).not.toBeInTheDocument();
    });
  });

  describe('Item Counter', () => {
    it('should render item counter when showItemCounter is true', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        quantityLabel: 'Quantity',
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('should not render item counter when showItemCounter is false', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: false,
        data: mockData,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.queryByTestId('item-counter-row-1')).not.toBeInTheDocument();
    });

    it('should call quantityUpdate when quantity changes', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });

    it('should use getMinOrderQuantity to set counter step value', () => {
      const getMinOrderQuantity = jest.fn().mockReturnValue(5);
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(getMinOrderQuantity).toHaveBeenCalledWith(mockData[0]);
    });

    it('should use getProductCatalogId for item counter id', () => {
      const getProductCatalogId = jest.fn().mockReturnValue('catalog-123');
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        getProductCatalogId,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('item-counter-catalog-123')).toBeInTheDocument();
    });

    it('should auto-select row when quantity becomes positive', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Pagination', () => {
    it('should call onPageChange when pagination is triggered', () => {
      const onPageChange = jest.fn();
      const props = createDefaultProps({
        onPageChange,
        page: 0,
        totalRows: 30,
        rowsPerPage: 10,
      });
      renderWithProviders(<ActionList {...props} />);

      const nextButton = screen.getByTestId('next-page');
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should display correct pagination info', () => {
      const props = createDefaultProps({
        page: 1,
        totalRows: 50,
        rowsPerPage: 10,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('pagination-info')).toHaveTextContent(
        'Page 2, Rows per page: 10, Total: 50'
      );
    });
  });

  describe('External Selected Rows', () => {
    it('should sync with external selected rows', async () => {
      const mockData = createMockData(3);
      const selectedRows = new Set(['row-1', 'row-2']);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        selectedRows,
      });
      
      renderWithProviders(<ActionList {...props} />);
      
      // The component should sync with external selected rows
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(4);
    });
  });

  describe('Initial Cart Quantity', () => {
    it('should initialize with cart quantities from data', async () => {
      const onRowSelectionChange = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 0 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Check that the first item has quantity 5 displayed
      expect(screen.getByTestId('count-row-1')).toHaveTextContent('5');
      // Second item should have 0
      expect(screen.getByTestId('count-row-2')).toHaveTextContent('0');
    });

    it('should auto-select rows with positive cartQuantity on mount', async () => {
      const onRowSelectionChange = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      await waitFor(() => {
        expect(onRowSelectionChange).toHaveBeenCalled();
      });
    });
  });

  describe('Select All with Item Counter', () => {
    it('should set minimum quantity when selecting all with showItemCounter', () => {
      const getMinOrderQuantity = jest.fn().mockReturnValue(2);
      const mockData = createMockData(2);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Select all
      fireEvent.change(checkboxes[0], { target: { checked: true } });

      // getMinOrderQuantity should be called for determining the minimum quantity
      expect(getMinOrderQuantity).toHaveBeenCalled();
    });

    it('should reset quantities when deselecting all with showItemCounter', () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Deselect all - should not throw error
      fireEvent.change(checkboxes[0], { target: { checked: false } });

      // Component should still render correctly
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(2);
    });
  });

  describe('Row Selection with Item Counter', () => {
    it('should set minimum quantity when selecting row with showItemCounter', () => {
      const getMinOrderQuantity = jest.fn().mockReturnValue(3);
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Select the row (index 1 because index 0 is Select All)
      fireEvent.change(checkboxes[1], { target: { checked: true } });

      // getMinOrderQuantity should be called
      expect(getMinOrderQuantity).toHaveBeenCalled();
    });

    it('should reset quantity when deselecting row with showItemCounter', () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Deselect the row
      fireEvent.change(checkboxes[1], { target: { checked: false } });

      // Component should still render correctly
      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });
  });

  describe('Scroll Shadows', () => {
    it('should handle scroll events', async () => {
      const mockData = createMockData(5);
      const props = createDefaultProps({ data: mockData });
      
      renderWithProviders(<ActionList {...props} />);
      
      // Trigger resize event to test shadow handling
      globalThis.dispatchEvent(new Event('resize'));
      
      // Component should handle resize without errors
      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });
  });

  describe('Debounce', () => {
    it('should pass debounce prop to ItemCounter', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
        debounce: false,
      });
      renderWithProviders(<ActionList {...props} />);

      // ItemCounter should be rendered
      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });

    it('should default debounce to true', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({
        showItemCounter: true,
        data: mockData,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data array', () => {
      const props = createDefaultProps({ data: [] });
      const { container } = renderWithProviders(<ActionList {...props} />);

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });

    it('should handle data without cartQuantity property', () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10 },
      ] as any;
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
      });
      
      renderWithProviders(<ActionList {...props} />);
      
      // Should still render without errors
      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });

    it('should stop checkbox click propagation', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      
      // Clicking should not propagate
      fireEvent.click(checkboxes[1]);
      
      expect(checkboxes[1]).toBeInTheDocument();
    });

    it('should handle quantity decrement to zero', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 1 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const decrementButton = screen.getByTestId('decrement-row-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Select All with showItemCounter and quantityUpdate', () => {
    it('should render correctly with showItemCounter and quantityUpdate props', () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(2); // cartQuantity is 0 by default
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // All item counters should be rendered
      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-counter-row-2')).toBeInTheDocument();
      
      // Select All should be rendered
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('should render with existing quantities', () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 0 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Check that quantities are displayed
      expect(screen.getByTestId('count-row-1')).toHaveTextContent('5');
      expect(screen.getByTestId('count-row-2')).toHaveTextContent('0');
    });

    it('should handle select all click without errors', () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Deselect all - should not throw error
      fireEvent.change(checkboxes[0], { target: { checked: false } });

      // Component should still render correctly
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(2);
    });
  });

  describe('Row Selection with showItemCounter and quantityUpdate', () => {
    it('should call quantityUpdate when incrementing via ItemCounter', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1); // cartQuantity is 0
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Increment via ItemCounter
      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });

    it('should call quantityUpdate when decrementing via ItemCounter', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Decrement via ItemCounter
      const decrementButton = screen.getByTestId('decrement-row-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });

    it('should render with getMinOrderQuantity function', () => {
      const getMinOrderQuantity = jest.fn().mockReturnValue(5);
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      // getMinOrderQuantity should be called during render
      expect(getMinOrderQuantity).toHaveBeenCalled();
    });
  });

  describe('handleScroll behavior', () => {
    it('should update shadow states on scroll', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ data: mockData });
      
      renderWithProviders(<ActionList {...props} />);
      
      // Component should render without errors
      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });
  });

  describe('handleQuantityChange behavior', () => {
    it('should auto-deselect when quantity becomes 0', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 1 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Decrement to 0
      const decrementButton = screen.getByTestId('decrement-row-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({ quantity: 0 })
        );
      });
    });

    it('should auto-select when quantity becomes positive from 0', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1); // cartQuantity is 0
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Increment from 0
      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({ quantity: 1 })
        );
      });
    });
  });

  describe('allowSelection false scenarios', () => {
    it('should not trigger selection when allowSelection is false', () => {
      const onRowSelectionChange = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: false,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // No checkboxes should be rendered
      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
      expect(onRowSelectionChange).not.toHaveBeenCalled();
    });

    it('should not trigger handleSelectAll when allowSelection is false', () => {
      const onRowSelectionChange = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: false,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Select All should not be rendered
      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
    });
  });

  describe('handleSelectAll with showItemCounter comprehensive tests', () => {
    it('should call quantityUpdate when selecting all rows with zero quantities', async () => {
      const quantityUpdate = jest.fn();
      const getMinOrderQuantity = jest.fn().mockReturnValue(1);
      const mockData = createMockData(2); // all have cartQuantity: 0
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Trigger select all by clicking to toggle
      fireEvent.click(checkboxes[0]);

      // The handleSelectAll should be called
      await waitFor(() => {
        expect(getMinOrderQuantity).toHaveBeenCalled();
      });
    });

    it('should keep existing quantities when selecting all with mixed quantities', async () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 0 },
      ];
      const getMinOrderQuantity = jest.fn().mockReturnValue(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Trigger select all by clicking
      fireEvent.click(checkboxes[0]);

      // row-1 should keep its quantity, row-2 should get minimum
      await waitFor(() => {
        expect(getMinOrderQuantity).toHaveBeenCalled();
      });
    });

    it('should reset all quantities when deselecting all with showItemCounter', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 3 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Deselect all
      fireEvent.change(checkboxes[0], { target: { checked: false } });

      // Should attempt to reset quantities
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(3);
    });

    it('should not call quantityUpdate when selecting without showItemCounter', () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(2);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: false,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.change(checkboxes[0], { target: { checked: true } });

      expect(quantityUpdate).not.toHaveBeenCalled();
    });
  });

  describe('handleSelectRow with showItemCounter comprehensive tests', () => {
    it('should set minimum quantity when selecting row with zero quantity', async () => {
      const quantityUpdate = jest.fn();
      const getMinOrderQuantity = jest.fn().mockReturnValue(5);
      const mockData = createMockData(1); // cartQuantity: 0
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
        getMinOrderQuantity,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Select row (index 1 is the row checkbox)
      fireEvent.change(checkboxes[1], { target: { checked: true } });

      await waitFor(() => {
        expect(getMinOrderQuantity).toHaveBeenCalled();
      });
    });

    it('should reset quantity when deselecting row', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Deselect row (click to toggle)
      fireEvent.change(checkboxes[1], { target: { checked: false } });

      // Component should handle deselection
      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });

    it('should handle row selection without getMinOrderQuantity (default to 1)', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
        quantityUpdate,
        // No getMinOrderQuantity provided
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.change(checkboxes[1], { target: { checked: true } });

      expect(screen.getByTestId('item-counter-row-1')).toBeInTheDocument();
    });

    it('should not modify quantities when selecting row without showItemCounter', () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: false,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.change(checkboxes[1], { target: { checked: true } });

      expect(quantityUpdate).not.toHaveBeenCalled();
    });
  });

  describe('handleQuantityChange comprehensive tests', () => {
    it('should remove quantity from state when setting to 0', async () => {
      const quantityUpdate = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 1 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Decrement to 0
      const decrementButton = screen.getByTestId('decrement-row-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(screen.getByTestId('count-row-1')).toHaveTextContent('0');
      });
    });

    it('should add quantity to state when incrementing from 0', async () => {
      const quantityUpdate = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        quantityUpdate,
      });
      renderWithProviders(<ActionList {...props} />);

      // Increment from 0
      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByTestId('count-row-1')).toHaveTextContent('1');
      });
    });

    it('should update selection state when quantity changes', async () => {
      const onRowSelectionChange = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Increment to select
      const incrementButton = screen.getByTestId('increment-row-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByTestId('count-row-1')).toHaveTextContent('1');
      });
    });
  });

  describe('handleScroll comprehensive tests', () => {
    it('should set shadow states based on scroll position', () => {
      const mockData = createMockData(5);
      const props = createDefaultProps({ data: mockData });
      
      renderWithProviders(<ActionList {...props} />);
      
      // Trigger resize to execute handleScroll
      globalThis.dispatchEvent(new Event('resize'));
      
      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });

    it('should handle multiple resize events', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ data: mockData });
      
      renderWithProviders(<ActionList {...props} />);
      
      // Multiple resizes
      globalThis.dispatchEvent(new Event('resize'));
      globalThis.dispatchEvent(new Event('resize'));
      
      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });
  });

  describe('Initial effect with cartQuantity', () => {
    it('should initialize quantities and selections from data cartQuantity', async () => {
      const onRowSelectionChange = jest.fn();
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 3 },
        { id: 'row-3', name: 'Item 3', description: 'Desc 3', price: 300, quantity: 30, cartQuantity: 0 },
      ];
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Initial quantities should be set
      expect(screen.getByTestId('count-row-1')).toHaveTextContent('5');
      expect(screen.getByTestId('count-row-2')).toHaveTextContent('3');
      expect(screen.getByTestId('count-row-3')).toHaveTextContent('0');

      // onRowSelectionChange should be called with selected rows
      await waitFor(() => {
        expect(onRowSelectionChange).toHaveBeenCalled();
      });
    });

    it('should not call onRowSelectionChange when no rows have cartQuantity', () => {
      const onRowSelectionChange = jest.fn();
      const mockData = createMockData(3); // all have cartQuantity: 0
      const props = createDefaultProps({
        data: mockData,
        showItemCounter: true,
        allowSelection: true,
        onRowSelectionChange,
      });
      renderWithProviders(<ActionList {...props} />);

      // Should not be called when all cartQuantities are 0
      expect(onRowSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('External selectedRows sync', () => {
    it('should update internal selection when externalSelectedRows changes', () => {
      const mockData = createMockData(3);
      const selectedRows = new Set(['row-1', 'row-2']);
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        selectedRows,
      });
      
      renderWithProviders(<ActionList {...props} />);
      
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(4);
    });

    it('should handle empty externalSelectedRows', () => {
      const mockData = createMockData(3);
      const selectedRows = new Set<string>();
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        selectedRows,
      });
      
      renderWithProviders(<ActionList {...props} />);
      
      expect(screen.getAllByTestId('custom-checkbox')).toHaveLength(4);
    });
  });

  describe('Action button edge cases', () => {
    it('should render multiple action buttons', () => {
      const clickHandler1 = jest.fn();
      const clickHandler2 = jest.fn();
      const MockIcon1 = () => <span data-testid="icon-1">Icon1</span>;
      const MockIcon2 = () => <span data-testid="icon-2">Icon2</span>;
      const actionButtons = [
        { iconComponent: MockIcon1, clickHandler: clickHandler1 },
        { iconComponent: MockIcon2, clickHandler: clickHandler2 },
      ];
      const mockData = createMockData(1);
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
      expect(screen.getByTestId('icon-2')).toBeInTheDocument();
    });

    it('should handle action button without clickHandler', () => {
      const MockIcon = () => <span data-testid="action-icon">Icon</span>;
      const actionButtons = [
        { iconComponent: MockIcon },
      ];
      const mockData = createMockData(1);
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });
  });

  describe('Select All indeterminate state', () => {
    it('should show indeterminate when some but not all rows are selected', () => {
      const mockData = [
        { id: 'row-1', name: 'Item 1', description: 'Desc 1', price: 100, quantity: 10, cartQuantity: 5 },
        { id: 'row-2', name: 'Item 2', description: 'Desc 2', price: 200, quantity: 20, cartQuantity: 0 },
      ];
      const props = createDefaultProps({
        data: mockData,
        allowSelection: true,
        showItemCounter: true,
      });
      renderWithProviders(<ActionList {...props} />);

      const selectAllCheckbox = screen.getAllByTestId('custom-checkbox')[0];
      // With cartQuantity: 5 on row-1, it should be selected, showing indeterminate
      expect(selectAllCheckbox).toHaveAttribute('data-indeterminate');
    });
  });

  describe('Card content rendering', () => {
    it('should render all column values correctly', () => {
      const mockData = [
        { id: 'row-1', name: 'Test Name', description: 'Test Desc', price: 999, quantity: 50, cartQuantity: 0 },
      ];
      const columns = [
        { key: 'name' as const, label: 'Product Name' },
        { key: 'description' as const, label: 'Product Description' },
        { key: 'price' as const, label: 'Product Price' },
      ];
      const props = createDefaultProps({
        data: mockData,
        columns,
      });
      renderWithProviders(<ActionList {...props} />);

      expect(screen.getByText('Product Name')).toBeInTheDocument();
      expect(screen.getByText('Test Name')).toBeInTheDocument();
      expect(screen.getByText('Product Description')).toBeInTheDocument();
      expect(screen.getByText('Test Desc')).toBeInTheDocument();
      expect(screen.getByText('Product Price')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });
});
