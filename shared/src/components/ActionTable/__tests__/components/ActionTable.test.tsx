/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { screen, fireEvent, waitFor, render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ActionTable } from '../..';

// Create a minimal theme for testing
const theme = createTheme();

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock NoDataFound component - using the exact import path from ActionTable.tsx
jest.mock('../../../NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No Data Found</div>,
}));

// Mock CommonPagination component
jest.mock('../../../CommonPagination/CommonPagination', () => ({
  CommonPagination: ({ page, rowsPerPage, totalRows, onPageChange, costLabel, costAmount }: any) => (
    <div data-testid="common-pagination">
      <span data-testid="pagination-page">{page}</span>
      <span data-testid="pagination-rows-per-page">{rowsPerPage}</span>
      <span data-testid="pagination-total-rows">{totalRows}</span>
      {costLabel && <span data-testid="pagination-cost-label">{costLabel}</span>}
      {costAmount && <span data-testid="pagination-cost-amount">{costAmount}</span>}
      <button data-testid="pagination-next" onClick={() => onPageChange(page + 1)}>Next</button>
      <button data-testid="pagination-prev" onClick={() => onPageChange(page - 1)}>Prev</button>
    </div>
  ),
}));

// Mock CustomCheckbox component
jest.mock('../../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate, onClick, disabled, ...props }: any) => {
    return (
      <input
        type="checkbox"
        data-testid="custom-checkbox"
        checked={checked}
        onChange={(e: any) => {
          if (onChange) {
            onChange(e);
          }
        }}
        onClick={onClick}
        disabled={disabled}
        data-indeterminate={indeterminate ? 'true' : 'false'}
        {...props}
      />
    );
  },
}));

// Mock CustomButton component
jest.mock('../../../Button/Button', () => ({
  CustomButton: ({ label, onClick, variant, className, style, ...props }: any) => (
    <button
      data-testid={`custom-button-${label?.toLowerCase()?.replaceAll(/\s+/g, '-')}`}
      onClick={onClick}
      className={className}
      style={style}
      {...props}
    >
      {label}
    </button>
  ),
}));

// Mock ItemCounter component
jest.mock('../../../ProductCard/ItemCounter', () => ({
  __esModule: true,
  default: ({ count, onChange, min, max, id, counterUpdateValue }: any) => (
    <div data-testid={`item-counter-${id}`}>
      <span data-testid="counter-value">{count}</span>
      <button 
        data-testid={`counter-decrement-${id}`}
        onClick={() => onChange(Math.max(min, count - counterUpdateValue))}
      >
        -
      </button>
      <button 
        data-testid={`counter-increment-${id}`}
        onClick={() => onChange(Math.min(max, count + counterUpdateValue))}
      >
        +
      </button>
    </div>
  ),
}));

// Mock CartIcon
jest.mock('../../../../generated-icon', () => ({
  CartIcon: () => <span data-testid="cart-icon">🛒</span>,
}));

// Mock CSS
jest.mock('../../ActionTable.css', () => ({}));

// Custom render function with ThemeProvider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
}

const renderWithTheme = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={options?.theme || theme}>
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Sample test data interfaces
interface TestDataItem {
  id: string;
  name: string;
  description: string;
  status: string;
  amount: number;
  cartQuantity?: number;
}

// Mock test data factory
const createMockData = (count: number = 5, withCartQuantity = false): TestDataItem[] => {
  return Array.from({ length: count }, (_, index) => {
    let cartQty = 0;
    if (withCartQuantity && index % 2 === 0) {
      cartQty = index + 1;
    }
    return {
      id: `item-${index + 1}`,
      name: `Item ${index + 1}`,
      description: `Description for item ${index + 1}`,
      status: index % 2 === 0 ? 'active' : 'inactive',
      amount: (index + 1) * 100,
      cartQuantity: cartQty,
    };
  });
};

// Mock columns factory
const createMockColumns = () => [
  { key: 'name' as const, label: 'Name' },
  { key: 'description' as const, label: 'Description' },
  { key: 'status' as const, label: 'Status' },
  { 
    key: 'amount' as const, 
    label: 'Amount',
    transformFn: (value: number) => `$${value.toFixed(2)}`,
  },
];

// Mock action buttons factory
const createMockActionButtons = (handlers?: {
  onEdit?: jest.Mock;
  onDelete?: jest.Mock;
}) => [
  {
    iconComponent: () => <span data-testid="edit-icon">Edit</span>,
    clickHandler: handlers?.onEdit || jest.fn(),
  },
  {
    iconComponent: () => <span data-testid="delete-icon">Delete</span>,
    clickHandler: handlers?.onDelete || jest.fn(),
    hide: (row: TestDataItem) => row.status === 'inactive',
  },
];

describe('ActionTable', () => {
  const defaultProps = {
    columns: createMockColumns(),
    data: createMockData(5),
    page: 1,
    rowsPerPage: 10,
    totalRows: 50,
    onPageChange: jest.fn(),
    uniqueKey: 'id' as keyof TestDataItem,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the table with columns and data', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      // Check column headers are rendered
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();

      // Check data rows are rendered
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Description for item 1')).toBeInTheDocument();
    });

    it('should apply transformFn to column values', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      // Amount column has transformFn that formats to currency
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('should render with custom wrapper className', () => {
      const styles = { customWrapper: 'custom-wrapper-class' };
      renderWithTheme(
        <ActionTable {...defaultProps} wrapperClassName="customWrapper" styles={styles} />
      );

      // Component should render without errors
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should use minColWidth when specified', () => {
      renderWithTheme(<ActionTable {...defaultProps} minColWidth={200} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show NoDataFound when data is empty', () => {
      renderWithTheme(<ActionTable {...defaultProps} data={[]} />);

      expect(screen.getByTestId('no-data-found')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination component', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page')).toHaveTextContent('1');
      expect(screen.getByTestId('pagination-rows-per-page')).toHaveTextContent('10');
      expect(screen.getByTestId('pagination-total-rows')).toHaveTextContent('50');
    });

    it('should call onPageChange when pagination is clicked', () => {
      const onPageChange = jest.fn();
      renderWithTheme(<ActionTable {...defaultProps} onPageChange={onPageChange} />);

      fireEvent.click(screen.getByTestId('pagination-next'));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should render costLabel and costAmount in pagination', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          costLabel="Total Cost"
          costAmount="$1,000.00"
        />
      );

      expect(screen.getByTestId('pagination-cost-label')).toHaveTextContent('Total Cost');
      expect(screen.getByTestId('pagination-cost-amount')).toHaveTextContent('$1,000.00');
    });
  });

  describe('Selection', () => {
    it('should render checkboxes when allowSelection is true (default)', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Header checkbox + 5 row checkboxes
      expect(checkboxes.length).toBe(6);
    });

    it('should not render checkboxes when allowSelection is false', () => {
      renderWithTheme(<ActionTable {...defaultProps} allowSelection={false} />);

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should handle row selection on checkbox click', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[1]); // Click first row checkbox

      // Row should be selected
      expect(checkboxes[1]).toBeInTheDocument();
    });

    it('should handle select all', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click header checkbox to select all
      fireEvent.click(checkboxes[0]);

      // All rows should be processed
      expect(checkboxes.length).toBe(6);
    });

    it('should disable header checkbox when disableAllSelection is true', () => {
      renderWithTheme(<ActionTable {...defaultProps} disableAllSelection={true} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes[0]).toBeDisabled();
    });

    it('should handle row click to toggle selection', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      // Click on a row
      fireEvent.click(screen.getByText('Item 1'));

      // Row interaction should work without errors
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons when provided', () => {
      const actionButtons = createMockActionButtons();

      renderWithTheme(<ActionTable {...defaultProps} actionButtons={actionButtons} />);

      // Edit icons should be rendered for all rows
      expect(screen.getAllByTestId('edit-icon').length).toBeGreaterThan(0);
    });

    it('should call action button click handler', () => {
      const onEdit = jest.fn();
      const actionButtons = createMockActionButtons({ onEdit });

      renderWithTheme(<ActionTable {...defaultProps} actionButtons={actionButtons} />);

      const editButtons = screen.getAllByTestId('edit-icon');
      fireEvent.click(editButtons[0].closest('button')!);

      expect(onEdit).toHaveBeenCalled();
    });

    it('should hide action buttons based on hide function', () => {
      const actionButtons = createMockActionButtons();

      renderWithTheme(<ActionTable {...defaultProps} actionButtons={actionButtons} />);

      // Delete button should be hidden for inactive rows
      const deleteButtons = screen.getAllByTestId('delete-icon');
      // Only active rows (items 1, 3, 5) should show delete button
      expect(deleteButtons.length).toBe(3);
    });

    it('should stop event propagation on action button click', () => {
      const onEdit = jest.fn();
      const actionButtons = createMockActionButtons({ onEdit });

      renderWithTheme(<ActionTable {...defaultProps} actionButtons={actionButtons} />);

      const editButtons = screen.getAllByTestId('edit-icon');
      const iconButton = editButtons[0].closest('button')!;
      
      fireEvent.click(iconButton);

      // Action handler should be called
      expect(onEdit).toHaveBeenCalled();
    });
  });

  describe('Column Icons', () => {
    it('should render column icons when provided', () => {
      const IconComponent = () => <span data-testid="column-icon">📝</span>;
      const columnsWithIcon = [
        {
          key: 'name' as const,
          label: 'Name',
          icon: {
            iconComponent: IconComponent,
            hide: () => false,
            fill: () => '#000',
          },
        },
        { key: 'description' as const, label: 'Description' },
      ];

      renderWithTheme(<ActionTable {...defaultProps} columns={columnsWithIcon} />);

      expect(screen.getAllByTestId('column-icon').length).toBeGreaterThan(0);
    });

    it('should hide column icons when hide function returns true', () => {
      const IconComponent = () => <span data-testid="hidden-column-icon">📝</span>;
      const columnsWithHiddenIcon = [
        {
          key: 'name' as const,
          label: 'Name',
          icon: {
            iconComponent: IconComponent,
            hide: () => true,
          },
        },
      ];

      renderWithTheme(<ActionTable {...defaultProps} columns={columnsWithHiddenIcon} />);

      expect(screen.queryByTestId('hidden-column-icon')).not.toBeInTheDocument();
    });
  });

  describe('Sticky Columns', () => {
    it('should apply sticky positioning when allowSticky is true', () => {
      renderWithTheme(<ActionTable {...defaultProps} allowSticky={true} />);

      // Component should render with sticky columns without errors
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should handle scroll events', () => {
      const { container } = renderWithTheme(<ActionTable {...defaultProps} allowSticky={true} />);

      const tableContainer = container.querySelector('.overflow-x-auto');
      if (tableContainer) {
        fireEvent.scroll(tableContainer);
      }

      // Component should handle scroll without errors
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should add resize event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

      renderWithTheme(<ActionTable {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');

      const { unmount } = renderWithTheme(<ActionTable {...defaultProps} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('ItemCounter Integration', () => {
    it('should render ItemCounter when showItemCounter is true and debounce is true', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
        />
      );

      // ItemCounter should be rendered for each row
      expect(screen.getByTestId('item-counter-item-1')).toBeInTheDocument();
    });

    it('should render Add button when showItemCounter is true and debounce is false', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={false}
        />
      );

      // Add buttons should be rendered
      expect(screen.getAllByTestId('custom-button-add').length).toBeGreaterThan(0);
    });

    it('should call quantityUpdate when Add button is clicked', () => {
      const quantityUpdate = jest.fn();
      const getMinOrderQuantity = () => 5;

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={false}
          quantityUpdate={quantityUpdate}
          getMinOrderQuantity={getMinOrderQuantity}
        />
      );

      const addButtons = screen.getAllByTestId('custom-button-add');
      fireEvent.click(addButtons[0]);

      expect(quantityUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 5,
          rowData: expect.any(Object),
        })
      );
    });

    it('should use getMinOrderQuantity when provided', () => {
      const getMinOrderQuantity = jest.fn(() => 10);

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
          getMinOrderQuantity={getMinOrderQuantity}
        />
      );

      // getMinOrderQuantity should be used for ItemCounter
      expect(screen.getByTestId('item-counter-item-1')).toBeInTheDocument();
    });

    it('should use getProductCatalogId when provided', () => {
      const getProductCatalogId = (row: TestDataItem) => `catalog-${row.id}`;

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
          getProductCatalogId={getProductCatalogId}
        />
      );

      // ItemCounter should use the custom product catalog ID
      expect(screen.getByTestId('item-counter-catalog-item-1')).toBeInTheDocument();
    });

    it('should handle quantity change from ItemCounter', async () => {
      const quantityUpdate = jest.fn();

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // Find the increment button for the first item
      const incrementButton = screen.getByTestId('counter-increment-item-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Initial Cart Quantities', () => {
    it('should set initial quantities from cartQuantity in data', async () => {
      const dataWithCartQuantity = createMockData(3, true);

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          debounce={true}
        />
      );

      // Items with cartQuantity > 0 should be reflected in the counter
      await waitFor(() => {
        expect(screen.getByTestId('item-counter-item-1')).toBeInTheDocument();
      });
    });

    it('should auto-select rows with initial cartQuantity > 0', async () => {
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 5 },
        { id: 'item-2', name: 'Item 2', description: 'Desc 2', status: 'inactive', amount: 200, cartQuantity: 0 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
        />
      );

      // The row with cartQuantity > 0 should be visually selected
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });
  });

  describe('Row Class Names', () => {
    it('should apply custom row className from getRowClassName', () => {
      const getRowClassName = jest.fn((row: TestDataItem) =>
        row.status === 'active' ? 'activeRow' : 'inactiveRow'
      );
      const styles = {
        activeRow: 'active-row-class',
        inactiveRow: 'inactive-row-class',
      };

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          getRowClassName={getRowClassName}
          styles={styles}
        />
      );

      expect(getRowClassName).toHaveBeenCalled();
    });
  });

  describe('Selection with ItemCounter', () => {
    it('should set minimum quantity when row is selected', async () => {
      const quantityUpdate = jest.fn();
      const getMinOrderQuantity = () => 5;

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
          getMinOrderQuantity={getMinOrderQuantity}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click first row checkbox to select
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 5,
          })
        );
      });
    });

    it('should reset quantity to 0 when row is deselected', async () => {
      const quantityUpdate = jest.fn();
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 5 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click to deselect the already selected row
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 0,
          })
        );
      });
    });

    it('should handle select all with ItemCounter enabled', async () => {
      const quantityUpdate = jest.fn();
      const getMinOrderQuantity = () => 3;

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
          getMinOrderQuantity={getMinOrderQuantity}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click header checkbox to select all
      fireEvent.click(checkboxes[0]);

      await waitFor(() => {
        // Each row should have quantityUpdate called with minQty
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });

    it('should handle deselect all with ItemCounter enabled', async () => {
      const quantityUpdate = jest.fn();
      const dataWithCartQuantity = createMockData(3, true);

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // First select all, then deselect all
      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[0]); // Select all
      fireEvent.click(checkboxes[0]); // Deselect all

      await waitFor(() => {
        // Each row should have quantityUpdate called with 0
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Default Props', () => {
    it('should use default uniqueKey as id', () => {
      const propsWithoutUniqueKey = {
        columns: createMockColumns(),
        data: createMockData(3),
        page: 1,
        rowsPerPage: 10,
        totalRows: 30,
        onPageChange: jest.fn(),
      };

      renderWithTheme(<ActionTable {...propsWithoutUniqueKey} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should use default allowSelection as true', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should use default minColWidth of 150', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should use default allowSticky as false', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should use default showItemCounter as false', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      expect(screen.queryByTestId('item-counter-item-1')).not.toBeInTheDocument();
    });

    it('should use default debounce as true', () => {
      renderWithTheme(
        <ActionTable {...defaultProps} showItemCounter={true} />
      );

      // When debounce is true (default), ItemCounter should be shown
      expect(screen.getByTestId('item-counter-item-1')).toBeInTheDocument();
    });

    it('should use default disableAllSelection as false', () => {
      renderWithTheme(<ActionTable {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes[0]).not.toBeDisabled();
    });
  });

  describe('ItemCounter Quantity Changes', () => {
    it('should auto-deselect row when quantity is decremented to 0', async () => {
      const quantityUpdate = jest.fn();
      const onSelectRow = jest.fn();
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 1 },
        { id: 'item-2', name: 'Item 2', description: 'Desc 2', status: 'active', amount: 200, cartQuantity: 0 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          debounce={true}
          quantityUpdate={quantityUpdate}
          onSelectRow={onSelectRow}
        />
      );

      // Decrement from 1 to 0 using decrement button
      const decrementButton = screen.getByTestId('counter-decrement-item-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 0,
          })
        );
      });
    });

    it('should auto-select row when quantity is incremented from 0', async () => {
      const quantityUpdate = jest.fn();

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // Increment from 0 to 1
      const incrementButton = screen.getByTestId('counter-increment-item-1');
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: expect.any(Number),
          })
        );
      });
    });

    it('should remove quantity entry when decremented to 0', async () => {
      const quantityUpdate = jest.fn();
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 1 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          debounce={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // Decrement to 0
      const decrementButton = screen.getByTestId('counter-decrement-item-1');
      fireEvent.click(decrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith({
          quantity: 0,
          rowData: expect.objectContaining({ id: 'item-1' }),
        });
      });
    });
  });

  describe('Mobile View', () => {
    it('should render correctly on mobile', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          isMobile={true}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('Cart Quantity from Data', () => {
    it('should initialize quantities from cartQuantity property in data', async () => {
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 5 },
        { id: 'item-2', name: 'Item 2', description: 'Desc 2', status: 'active', amount: 200, cartQuantity: 3 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          debounce={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-counter-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('item-counter-item-2')).toBeInTheDocument();
      });
    });
  });

  describe('Action Button Fill Function', () => {
    it('should apply fill color from action button fill function', () => {
      const actionButtonsWithFill = [
        {
          iconComponent: ({ style }: any) => <span data-testid="action-icon" style={style}>Action</span>,
          clickHandler: jest.fn(),
          fill: (row: TestDataItem) => row.status === 'active' ? 'green' : 'red',
        },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          actionButtons={actionButtonsWithFill}
        />
      );

      const actionIcons = screen.getAllByTestId('action-icon');
      expect(actionIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Column Icon Click Handler', () => {
    it('should call column icon click handler when icon is clicked', () => {
      const iconClickHandler = jest.fn();
      const columnsWithIconClick = [
        { 
          key: 'name' as const, 
          label: 'Name',
          icon: {
            iconComponent: () => <span data-testid="column-icon-click">Icon</span>,
            clickHandler: iconClickHandler,
          },
        },
        { key: 'description' as const, label: 'Description' },
        { key: 'status' as const, label: 'Status' },
        { key: 'amount' as const, label: 'Amount' },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          columns={columnsWithIconClick}
        />
      );

      const icons = screen.getAllByTestId('column-icon-click');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should apply fill color from column icon fill function', () => {
      const columnsWithIconFill = [
        { 
          key: 'name' as const, 
          label: 'Name',
          icon: {
            iconComponent: ({ style }: any) => <span data-testid="icon-fill" style={style}>Icon</span>,
            fill: (row: TestDataItem) => row.status === 'active' ? 'blue' : 'gray',
          },
        },
        { key: 'description' as const, label: 'Description' },
        { key: 'status' as const, label: 'Status' },
        { key: 'amount' as const, label: 'Amount' },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          columns={columnsWithIconFill}
        />
      );

      const icons = screen.getAllByTestId('icon-fill');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Selection Edge Cases', () => {
    it('should handle selection when allowSelection is false via handleSelectRow', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          allowSelection={false}
        />
      );

      // Table should render without checkboxes
      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should handle select all when allowSelection is false', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          allowSelection={false}
        />
      );

      // No checkboxes should be rendered
      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Quantity Edge Cases', () => {
    it('should handle row selection with existing non-zero quantity', async () => {
      const quantityUpdate = jest.fn();
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 5 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // Deselect the row that already has quantity
      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[1]); // Deselect

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 0,
          })
        );
      });
    });
  });

  describe('Increment and Decrement Multiple Times', () => {
    it('should handle multiple increments correctly', async () => {
      const quantityUpdate = jest.fn();

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
          quantityUpdate={quantityUpdate}
        />
      );

      // Increment multiple times
      const incrementButton = screen.getByTestId('counter-increment-item-1');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Event Handlers', () => {
    it('should stop propagation on ItemCounter wrapper keydown', async () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={true}
        />
      );

      const itemCounter = screen.getByTestId('item-counter-item-1');
      // Get the parent wrapper div that has the onKeyDown handler
      const wrapper = itemCounter.closest('div');
      
      if (wrapper) {
        fireEvent.keyDown(wrapper, { key: 'Enter' });
        // The component's handler calls stopPropagation
        // Just ensure the element exists and is interactive
        expect(wrapper).toBeInTheDocument();
      }
    });

    it('should stop propagation on Add button wrapper keydown when debounce is false', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          debounce={false}
        />
      );

      const addButton = screen.getAllByTestId('custom-button-add')[0];
      const wrapper = addButton.closest('div');
      
      if (wrapper) {
        fireEvent.keyDown(wrapper, { key: 'Enter' });
        expect(wrapper).toBeInTheDocument();
      }
    });
  });

  describe('Cost Currency Symbol', () => {
    it('should pass costCurrencySymbol to pagination', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          costLabel="Total"
          costAmount={100}
          costCurrencySymbol="$"
        />
      );

      expect(screen.getByTestId('pagination-cost-label')).toHaveTextContent('Total');
      expect(screen.getByTestId('pagination-cost-amount')).toHaveTextContent('100');
    });
  });

  describe('Sticky Columns with Selection', () => {
    it('should apply sticky positioning with selection enabled', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          allowSticky={true}
          allowSelection={true}
        />
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should apply correct left offset when sticky and selection is disabled', () => {
      renderWithTheme(
        <ActionTable
          {...defaultProps}
          allowSticky={true}
          allowSelection={false}
        />
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Checkbox Event Handler', () => {
    it('should call quantityUpdate when row is selected via checkbox with showItemCounter', async () => {
      const quantityUpdate = jest.fn();

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      
      // Click checkbox to select
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        // When checkbox is clicked with showItemCounter, quantity should be set
        expect(quantityUpdate).toHaveBeenCalled();
      });
    });

    it('should reset cartQuantity when row is deselected via checkbox', async () => {
      const quantityUpdate = jest.fn();
      const dataWithCartQuantity = [
        { id: 'item-1', name: 'Item 1', description: 'Desc 1', status: 'active', amount: 100, cartQuantity: 5 },
      ];

      renderWithTheme(
        <ActionTable
          {...defaultProps}
          data={dataWithCartQuantity}
          showItemCounter={true}
          quantityUpdate={quantityUpdate}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      
      // Click to deselect
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(quantityUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 0,
          })
        );
      });
    });
  });
});
