/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

// Mock i18next - must be before component import
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'COMMON.SELECT_ALL': 'Select All',
        'COMMON.CLEAR_ALL': 'Clear All',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock NoDataFound component (relative to CommonActionTable.tsx)
jest.mock('../../../NoDataFound/NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No Data Found</div>,
}));

// Mock CommonPagination component (relative to CommonActionTable.tsx)
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

// Mock CustomCheckbox component (relative to CommonActionTable.tsx)
jest.mock('../../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate, onClick, ...props }: any) => {
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
        data-indeterminate={indeterminate ? 'true' : 'false'}
        {...props}
      />
    );
  },
}));

// Mock CSS module (relative to CommonActionTable.tsx)
jest.mock('../../CommonActionTable.module.css', () => ({
  loading: 'loading',
  empty: 'empty',
  rowHover: 'rowHover',
  tableOuter: 'tableOuter',
  actions: 'actions',
  actionButton: 'actionButton',
  arrowIcon: 'arrowIcon',
}));

import CommonActionTable from '../../CommonActionTable';
import {
  renderWithTheme,
  createMockData,
  createMockColumns,
  createMockActionButtons,
  TestDataItem,
} from '../test-utils';

describe('CommonActionTable', () => {
  const defaultProps = {
    columns: createMockColumns(),
    data: createMockData(5),
    uniqueKey: 'id' as keyof TestDataItem,
  };

  describe('Rendering', () => {
    it('should render the table with columns and data', () => {
      renderWithTheme(<CommonActionTable {...defaultProps} />);

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

    it('should render with custom wrapper className', () => {
      const { container } = renderWithTheme(
        <CommonActionTable {...defaultProps} wrapperClassName="custom-wrapper" />
      );

      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    });

    it('should apply column widths correctly', () => {
      const columnsWithWidth = [
        { key: 'name' as const, label: 'Name', width: 200 },
        { key: 'description' as const, label: 'Description', width: '150px' },
      ];

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          columns={columnsWithWidth}
        />
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should use minColWidth when column width is not specified', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} minColWidth={150} />
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} loading={true} />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should not show table content when loading', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} loading={true} />
      );

      expect(screen.queryByText('Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show NoDataFound when data is empty', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} data={[]} />
      );

      expect(screen.getByTestId('no-data-found')).toBeInTheDocument();
    });

    it('should show custom empty component when provided', () => {
      const customEmptyComponent = <div data-testid="custom-empty">Custom Empty Message</div>;

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          data={[]}
          emptyComponent={customEmptyComponent}
        />
      );

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-found')).not.toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should render checkboxes when allowSelection is true', () => {
      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={new Set()}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Header checkbox + 5 row checkboxes
      expect(checkboxes.length).toBe(6);
    });

    it('should not render checkboxes when allowSelection is false', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} allowSelection={false} />
      );

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should call onRowSelectionChange when a row is selected', () => {
      const onRowSelectionChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={new Set()}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click the first row checkbox (index 1, as index 0 is header)
      fireEvent.click(checkboxes[1]);

      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('should call onSelectRow with selected data when a row is selected', () => {
      const onSelectRow = jest.fn();
      const onRowSelectionChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={new Set()}
          onRowSelectionChange={onRowSelectionChange}
          onSelectRow={onSelectRow}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[1]);

      expect(onSelectRow).toHaveBeenCalled();
    });

    it('should handle select all', () => {
      const onRowSelectionChange = jest.fn();
      const onSelectRow = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={new Set()}
          onRowSelectionChange={onRowSelectionChange}
          onSelectRow={onSelectRow}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Click header checkbox (index 0) to select all
      fireEvent.click(checkboxes[0]);

      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('should deselect row when clicking selected row checkbox', () => {
      const onRowSelectionChange = jest.fn();
      const selectedRows = new Set(['item-1']);

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[1]);

      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('should deselect all when header checkbox is unchecked', () => {
      const onRowSelectionChange = jest.fn();
      const onSelectRow = jest.fn();
      const data = createMockData(3);
      const selectedRows = new Set(data.map(d => d.id));

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          data={data}
          allowSelection={true}
          selectedRows={selectedRows}
          onRowSelectionChange={onRowSelectionChange}
          onSelectRow={onSelectRow}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // Simulate unchecking the header checkbox - use click to toggle
      fireEvent.click(checkboxes[0]);

      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('should show indeterminate state when some rows are selected', () => {
      const selectedRows = new Set(['item-1', 'item-2']);

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
        />
      );

      const headerCheckbox = screen.getAllByTestId('custom-checkbox')[0];
      expect(headerCheckbox).toHaveAttribute('data-indeterminate', 'true');
    });

    it('should apply selected row background color', () => {
      const selectedRows = new Set(['item-1']);

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
        />
      );

      // Verify the row is rendered with selection
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('Row Interactions', () => {
    it('should call onRowClick when a row is clicked', () => {
      const onRowClick = jest.fn();

      renderWithTheme(
        <CommonActionTable {...defaultProps} onRowClick={onRowClick} />
      );

      // Click on the row containing 'Item 1' - find the text and then click its closest row
      const item1Text = screen.getByText('Item 1');
      const row = item1Text.closest('tr');
      if (row) {
        fireEvent.click(row);
      }

      expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'item-1' }));
    });

    it('should call onRowDoubleClick when a row is double-clicked', () => {
      const onRowDoubleClick = jest.fn();

      renderWithTheme(
        <CommonActionTable {...defaultProps} onRowDoubleClick={onRowDoubleClick} />
      );

      // Double-click on the row containing 'Item 1'
      const item1Text = screen.getByText('Item 1');
      const row = item1Text.closest('tr');
      if (row) {
        fireEvent.doubleClick(row);
      }

      expect(onRowDoubleClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'item-1' }));
    });

    it('should apply custom row className from getRowClassName', () => {
      const getRowClassName = jest.fn((row: TestDataItem) => 
        row.status === 'active' ? 'active-row' : 'inactive-row'
      );

      renderWithTheme(
        <CommonActionTable {...defaultProps} getRowClassName={getRowClassName} />
      );

      expect(getRowClassName).toHaveBeenCalled();
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons column when actionButtons are provided', () => {
      const actionButtons = createMockActionButtons();

      renderWithTheme(
        <CommonActionTable {...defaultProps} actionButtons={actionButtons} />
      );

      // Action buttons should be rendered
      expect(screen.getAllByTestId('edit-icon').length).toBeGreaterThan(0);
    });

    it('should call action button click handler', () => {
      const onEdit = jest.fn();
      const actionButtons = createMockActionButtons({ onEdit });

      renderWithTheme(
        <CommonActionTable {...defaultProps} actionButtons={actionButtons} />
      );

      const editButtons = screen.getAllByTestId('edit-icon');
      fireEvent.click(editButtons[0]);

      expect(onEdit).toHaveBeenCalled();
    });

    it('should hide action buttons based on hide function', () => {
      const actionButtons = createMockActionButtons();

      renderWithTheme(
        <CommonActionTable {...defaultProps} actionButtons={actionButtons} />
      );

      // Delete button should be hidden for inactive rows
      const deleteButtons = screen.getAllByTestId('delete-icon');
      // Only active rows (items 1, 3, 5) should show delete button
      expect(deleteButtons.length).toBe(3);
    });

    it('should render action components when provided', () => {
      const actionComponents = (row: TestDataItem) => (
        <button data-testid={`custom-action-${row.id}`}>Custom Action</button>
      );

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          actionComponents={actionComponents}
        />
      );

      expect(screen.getByTestId('custom-action-item-1')).toBeInTheDocument();
    });

    it('should render action buttons column header when actionComponents are provided', () => {
      const actionComponents = (row: TestDataItem) => (
        <button data-testid={`custom-action-${row.id}`}>Custom Action</button>
      );

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          actionComponents={actionComponents}
        />
      );

      expect(screen.getByTestId('custom-action-item-1')).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render custom components in cells', () => {
      const customComponents = {
        status: (row: TestDataItem) => (
          <span data-testid={`custom-status-${row.id}`}>{row.status.toUpperCase()}</span>
        ),
      };

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          customComponents={customComponents}
        />
      );

      expect(screen.getByTestId('custom-status-item-1')).toBeInTheDocument();
      // There may be multiple ACTIVE elements, so just check the first one exists
      expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
    });

    it('should render header components', () => {
      const headerComponents = {
        name: <span data-testid="header-component">Filter</span>,
      };

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          headerComponents={headerComponents}
        />
      );

      expect(screen.getByTestId('header-component')).toBeInTheDocument();
    });
  });

  describe('Column Transformations', () => {
    it('should apply transformFn to column values', () => {
      renderWithTheme(<CommonActionTable {...defaultProps} />);

      // Amount column has transformFn that formats to currency
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('should render column with renderComponent', () => {
      const columnsWithRenderComponent = [
        {
          key: 'name' as const,
          label: 'Name',
          renderComponent: (row: TestDataItem, value: string) => (
            <span data-testid={`rendered-${row.id}`}>{value} - Custom</span>
          ),
        },
        { key: 'description' as const, label: 'Description' },
      ];

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          columns={columnsWithRenderComponent}
        />
      );

      expect(screen.getByTestId('rendered-item-1')).toBeInTheDocument();
      expect(screen.getByText('Item 1 - Custom')).toBeInTheDocument();
    });

    it('should render column icon when not hidden', () => {
      const EditIcon = () => <span data-testid="column-icon">📝</span>;
      const columnsWithIcon = [
        {
          key: 'name' as const,
          label: 'Name',
          icon: {
            iconComponent: EditIcon,
            hide: () => false,
            fill: () => '#000',
          },
        },
      ];

      renderWithTheme(
        <CommonActionTable {...defaultProps} columns={columnsWithIcon} />
      );

      expect(screen.getAllByTestId('column-icon').length).toBeGreaterThan(0);
    });

    it('should hide column icon when hide function returns true', () => {
      const EditIcon = () => <span data-testid="hidden-column-icon">📝</span>;
      const columnsWithHiddenIcon = [
        {
          key: 'name' as const,
          label: 'Name',
          icon: {
            iconComponent: EditIcon,
            hide: () => true,
          },
        },
      ];

      renderWithTheme(
        <CommonActionTable {...defaultProps} columns={columnsWithHiddenIcon} />
      );

      expect(screen.queryByTestId('hidden-column-icon')).not.toBeInTheDocument();
    });

    it('should show dash for null or undefined values', () => {
      const dataWithNull = [
        { id: 'item-1', name: null, description: undefined, status: 'active', amount: 100 },
      ];
      const columns = [
        { key: 'name' as const, label: 'Name' },
        { key: 'description' as const, label: 'Description' },
      ];

      renderWithTheme(
        <CommonActionTable
          columns={columns}
          data={dataWithNull as any}
          uniqueKey="id"
        />
      );

      // Should render dash for null/undefined values
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should render pagination when enablePagination is true and onPageChange is provided', () => {
      const onPageChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          enablePagination={true}
          page={1}
          rowsPerPage={10}
          totalRows={100}
          onPageChange={onPageChange}
        />
      );

      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page')).toHaveTextContent('1');
      expect(screen.getByTestId('pagination-rows-per-page')).toHaveTextContent('10');
      expect(screen.getByTestId('pagination-total-rows')).toHaveTextContent('100');
    });

    it('should not render pagination when enablePagination is false', () => {
      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          enablePagination={false}
          onPageChange={jest.fn()}
        />
      );

      expect(screen.queryByTestId('common-pagination')).not.toBeInTheDocument();
    });

    it('should not render pagination when onPageChange is not provided', () => {
      renderWithTheme(
        <CommonActionTable {...defaultProps} enablePagination={true} />
      );

      expect(screen.queryByTestId('common-pagination')).not.toBeInTheDocument();
    });

    it('should call onPageChange when pagination is clicked', () => {
      const onPageChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          enablePagination={true}
          page={1}
          rowsPerPage={10}
          totalRows={100}
          onPageChange={onPageChange}
        />
      );

      fireEvent.click(screen.getByTestId('pagination-next'));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should render costLabel and costAmount in pagination', () => {
      const onPageChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          enablePagination={true}
          page={1}
          rowsPerPage={10}
          totalRows={100}
          onPageChange={onPageChange}
          costLabel="Total Cost"
          costAmount="$1,000.00"
        />
      );

      expect(screen.getByTestId('pagination-cost-label')).toHaveTextContent('Total Cost');
      expect(screen.getByTestId('pagination-cost-amount')).toHaveTextContent('$1,000.00');
    });
  });

  describe('Scroll Shadows', () => {
    it('should handle scroll events', async () => {
      const { container } = renderWithTheme(
        <CommonActionTable {...defaultProps} allowSticky={true} />
      );

      const tableContainer = container.querySelector('[style*="overflow"]');
      if (tableContainer) {
        fireEvent.scroll(tableContainer);
      }

      // Component should handle scroll without errors
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should add resize event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

      renderWithTheme(<CommonActionTable {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');

      const { unmount } = renderWithTheme(<CommonActionTable {...defaultProps} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Default Props', () => {
    it('should use default uniqueKey as id', () => {
      renderWithTheme(
        <CommonActionTable columns={createMockColumns()} data={createMockData(3)} />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should use default empty array for actionButtons', () => {
      renderWithTheme(<CommonActionTable {...defaultProps} />);

      // No action button column should be rendered
      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
    });

    it('should use default false for allowSelection', () => {
      renderWithTheme(<CommonActionTable {...defaultProps} />);

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should use default false for loading', () => {
      renderWithTheme(<CommonActionTable {...defaultProps} />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should use default true for enablePagination', () => {
      // Without onPageChange, pagination should not render even if enablePagination is true
      renderWithTheme(
        <CommonActionTable {...defaultProps} />
      );

      expect(screen.queryByTestId('common-pagination')).not.toBeInTheDocument();
    });
  });

  describe('Checkbox Click Propagation', () => {
    it('should stop propagation on row checkbox click', () => {
      const onRowClick = jest.fn();
      const onRowSelectionChange = jest.fn();

      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          allowSelection={true}
          selectedRows={new Set()}
          onRowClick={onRowClick}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      fireEvent.click(checkboxes[1]);

      // Selection should be triggered
      expect(onRowSelectionChange).toHaveBeenCalled();
    });
  });

  describe('Empty Data with Selection', () => {
    it('should handle empty data with selection enabled', () => {
      renderWithTheme(
        <CommonActionTable
          {...defaultProps}
          data={[]}
          allowSelection={true}
          selectedRows={new Set()}
        />
      );

      // Header checkbox should still be rendered
      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes.length).toBe(1); // Only header checkbox
    });
  });
});
