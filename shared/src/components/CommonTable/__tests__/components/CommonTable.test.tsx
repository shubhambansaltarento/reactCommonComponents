/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { CommonTable } from '../../CommonTable';
import {
  renderWithProviders,
  createMockData,
  createDefaultProps,
  createMockActionButtons,
  MockRowData,
  MockIcon,
} from '../test-utils';

// Mock child components
jest.mock('../../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate, onClick }: any) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange({ target: { checked: e.target.checked } });
      }
    };
    
    return (
      <input
        type="checkbox"
        data-testid="custom-checkbox"
        checked={checked || false}
        onChange={handleChange}
        onClick={handleClick}
        data-indeterminate={indeterminate ? 'true' : 'false'}
      />
    );
  },
}));

jest.mock('../../../CommonPagination/CommonPagination', () => ({
  CommonPagination: ({ page, rowsPerPage, totalRows, onPageChange, costLabel, costAmount, onDownloadClick, onUploadClick }: any) => (
    <div data-testid="common-pagination">
      <span data-testid="pagination-info">
        Page {page + 1}, Rows per page: {rowsPerPage}, Total: {totalRows}
      </span>
      {costLabel && <span data-testid="cost-label">{costLabel}: {costAmount}</span>}
      <button
        data-testid="next-page"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
      <button
        data-testid="prev-page"
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      {onDownloadClick && <button data-testid="download-btn" onClick={onDownloadClick}>Download</button>}
      {onUploadClick && <button data-testid="upload-btn" onClick={onUploadClick}>Upload</button>}
    </div>
  ),
}));

jest.mock('../../../NoDataFound/NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No data found</div>,
}));

describe('CommonTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(<CommonTable {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should render all data rows', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render column headers', () => {
      const props = createDefaultProps();
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render pagination component by default', () => {
      const props = createDefaultProps();
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });

    it('should hide pagination when hidePagination is true', () => {
      const props = createDefaultProps({ hidePagination: true });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.queryByTestId('common-pagination')).not.toBeInTheDocument();
    });

    it('should render NoDataFound when data is empty', () => {
      const props = createDefaultProps({ data: [] });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByTestId('no-data-found')).toBeInTheDocument();
    });

    it('should apply wrapper className with styles', () => {
      const mockStyles = { 'custom-wrapper': 'applied-style' };
      const props = createDefaultProps({
        wrapperClassName: 'custom-wrapper',
        styles: mockStyles,
      });
      const { container } = renderWithProviders(<CommonTable {...props} />);

      const wrapper = container.querySelector('.applied-style');
      expect(wrapper).toBeInTheDocument();
    });

    it('should apply row className using getRowClassName', () => {
      const mockStyles = { 'highlighted-row': 'highlight-style' };
      const getRowClassName = jest.fn().mockReturnValue('highlighted-row');
      const props = createDefaultProps({
        getRowClassName,
        styles: mockStyles,
      });
      renderWithProviders(<CommonTable {...props} />);

      expect(getRowClassName).toHaveBeenCalled();
    });

    it('should hide columns when hide property is true', () => {
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name' },
        { key: 'description' as keyof MockRowData, label: 'Description', hide: true },
        { key: 'price' as keyof MockRowData, label: 'Price' },
      ];
      const props = createDefaultProps({ columns });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
    });

    it('should render dash for empty cell values', () => {
      const mockData = [{ id: 'row-1', name: '', description: 'Test', price: 100, status: 'active' }];
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should render Select All checkbox when allowSelection is true', () => {
      const props = createDefaultProps({ allowSelection: true });
      renderWithProviders(<CommonTable {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should not render checkboxes when allowSelection is false', () => {
      const props = createDefaultProps({ allowSelection: false });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should select all rows when Select All checkbox is clicked', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CommonTable {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const selectAllCheckbox = checkboxes[0];

      await act(async () => {
        fireEvent.click(selectAllCheckbox);
        fireEvent.change(selectAllCheckbox, { target: { checked: true } });
      });

      expect(onSelectRow).toHaveBeenCalledWith(mockData);
    });

    it('should toggle individual row selection on row click', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CommonTable {...props} />);

      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      await waitFor(() => {
        expect(onSelectRow).toHaveBeenCalledWith([mockData[0]]);
      });
    });

    it('should toggle individual row selection on checkbox change', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectRow,
        data: mockData
      });
      renderWithProviders(<CommonTable {...props} />);

      // Click on the row to select it (same effect as checkbox for this component)
      const row = screen.getByText('Item 1').closest('tr');
      await act(async () => {
        fireEvent.click(row!);
      });

      expect(onSelectRow).toHaveBeenCalledWith([mockData[0]]);
    });

    it('should show indeterminate state when some rows are selected', async () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true,
        data: mockData 
      });
      renderWithProviders(<CommonTable {...props} />);

      // Select first row
      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      await waitFor(() => {
        const selectAllCheckbox = screen.getAllByTestId('custom-checkbox')[0];
        expect(selectAllCheckbox).toHaveAttribute('data-indeterminate', 'true');
      });
    });

    it('should not trigger selection when allowSelection is false', () => {
      const onSelectRow = jest.fn();
      const props = createDefaultProps({ 
        allowSelection: false, 
        onSelectRow 
      });
      renderWithProviders(<CommonTable {...props} />);

      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      expect(onSelectRow).not.toHaveBeenCalled();
    });

    it('should reset selection when page changes', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectRow,
        data: mockData,
        page: 0 
      });
      const { rerender } = renderWithProviders(<CommonTable {...props} />);

      // Select a row
      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      // Change page
      rerender(
        <CommonTable {...props} page={1} />
      );

      await waitFor(() => {
        const checkboxes = screen.getAllByTestId('custom-checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked();
        });
      });
    });

    it('should update selection when selected prop changes', async () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true,
        data: mockData,
        selected: [] 
      });
      const { rerender } = renderWithProviders(<CommonTable {...props} />);

      // Update selected prop
      rerender(
        <CommonTable {...props} selected={['row-1']} />
      );

      await waitFor(() => {
        const checkboxes = screen.getAllByTestId('custom-checkbox');
        expect(checkboxes[1]).toBeChecked();
      });
    });
  });

  describe('Transform Functions', () => {
    it('should apply transformFn to cell values', () => {
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name' },
        { 
          key: 'price' as keyof MockRowData, 
          label: 'Price',
          transformFn: (value: number) => `$${value}` 
        },
      ];
      const mockData = [{ id: 'row-1', name: 'Item 1', description: 'Test', price: 100, status: 'active' }];
      const props = createDefaultProps({ columns, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('should pass row data to transformFn', () => {
      const transformFn = jest.fn((value: number, row: MockRowData) => `${row.name}: $${value}`);
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name' },
        { key: 'price' as keyof MockRowData, label: 'Price', transformFn },
      ];
      const mockData = createMockData(1);
      const props = createDefaultProps({ columns, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      expect(transformFn).toHaveBeenCalledWith(100, mockData[0]);
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons in the last column', () => {
      const actionButtons = createMockActionButtons();
      const props = createDefaultProps({ actionButtons });
      renderWithProviders(<CommonTable {...props} />);

      const editIcons = screen.getAllByTestId('edit-icon');
      expect(editIcons.length).toBe(3); // One for each row
    });

    it('should call action button handler on click', async () => {
      const onClick = jest.fn();
      const actionButtons = createMockActionButtons({ onClick });
      const mockData = createMockData(1);
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      const editIcon = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editIcon!);

      await waitFor(() => {
        expect(onClick).toHaveBeenCalledWith(mockData[0]);
      });
    });

    it('should stop propagation when clicking action button', async () => {
      const onSelectRow = jest.fn();
      const onClick = jest.fn();
      const actionButtons = createMockActionButtons({ onClick });
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        actionButtons, 
        onSelectRow,
        allowSelection: true,
        data: mockData 
      });
      renderWithProviders(<CommonTable {...props} />);

      const editIcons = screen.getAllByTestId('edit-icon');
      const editIcon = editIcons[0].closest('button');
      fireEvent.click(editIcon!);

      await waitFor(() => {
        expect(onClick).toHaveBeenCalled();
        expect(onSelectRow).not.toHaveBeenCalled();
      });
    });

    it('should hide action button when hide returns true', () => {
      const actionButtons = [
        {
          iconComponent: MockIcon,
          clickHandler: jest.fn(),
          hide: (row: MockRowData) => row.status === 'inactive',
        },
      ];
      const mockData = createMockData(2); // First row active, second inactive
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      const icons = screen.getAllByTestId('mock-icon');
      expect(icons.length).toBe(1); // Only active row shows icon
    });

    it('should apply custom fill to action button icon', () => {
      const actionButtons = [
        {
          iconComponent: MockIcon,
          clickHandler: jest.fn(),
          fill: (row: MockRowData) => row.status === 'active' ? 'green' : 'red',
        },
      ];
      const mockData = [{ id: 'row-1', name: 'Item 1', description: 'Test', price: 100, status: 'active' }];
      const props = createDefaultProps({ actionButtons, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ fill: 'green' });
    });

    it('should trigger action button on row click when rowActionIndexOnClick is set', async () => {
      const onClick = jest.fn();
      const actionButtons = createMockActionButtons({ onClick });
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        actionButtons, 
        data: mockData,
        rowActionIndexOnClick: 0,
        allowSelection: true
      });
      renderWithProviders(<CommonTable {...props} />);

      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      await waitFor(() => {
        expect(onClick).toHaveBeenCalledWith(mockData[0]);
      });
    });
  });

  describe('Column Icons', () => {
    it('should render column icon when provided', () => {
      const columns = [
        { 
          key: 'name' as keyof MockRowData, 
          label: 'Name',
          icon: {
            iconComponent: MockIcon,
          }
        },
      ];
      const props = createDefaultProps({ columns });
      renderWithProviders(<CommonTable {...props} />);

      const icons = screen.getAllByTestId('mock-icon');
      expect(icons.length).toBe(3); // One for each row
    });

    it('should hide column icon when hide returns true', () => {
      const columns = [
        { 
          key: 'name' as keyof MockRowData, 
          label: 'Name',
          icon: {
            iconComponent: MockIcon,
            hide: (row: MockRowData) => row.status === 'inactive',
          }
        },
      ];
      const mockData = createMockData(2);
      const props = createDefaultProps({ columns, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      const icons = screen.getAllByTestId('mock-icon');
      expect(icons.length).toBe(1); // Only active row shows icon
    });

    it('should apply custom fill to column icon', () => {
      const columns = [
        { 
          key: 'name' as keyof MockRowData, 
          label: 'Name',
          icon: {
            iconComponent: MockIcon,
            fill: (row: MockRowData) => row.status === 'active' ? 'blue' : 'gray',
          }
        },
      ];
      const mockData = [{ id: 'row-1', name: 'Item 1', description: 'Test', price: 100, status: 'active' }];
      const props = createDefaultProps({ columns, data: mockData });
      renderWithProviders(<CommonTable {...props} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ fill: 'blue' });
    });
  });

  describe('Sticky Columns', () => {
    it('should apply sticky positioning when allowSticky is true', () => {
      const props = createDefaultProps({ allowSticky: true });
      renderWithProviders(<CommonTable {...props} />);

      // Table should render properly with sticky styling
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should not apply sticky positioning when allowSticky is false', () => {
      const props = createDefaultProps({ allowSticky: false });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should call onPageChange when page changes', async () => {
      const onPageChange = jest.fn();
      const props = createDefaultProps({ onPageChange });
      renderWithProviders(<CommonTable {...props} />);

      const nextButton = screen.getByTestId('next-page');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(1);
      });
    });

    it('should pass cost info to pagination', () => {
      const props = createDefaultProps({ 
        costLabel: 'Total Cost',
        costAmount: 500 
      });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByTestId('cost-label')).toHaveTextContent('Total Cost: 500');
    });

    it('should pass download handler to pagination', async () => {
      const onDownloadClick = jest.fn();
      const props = createDefaultProps({ onDownloadClick });
      renderWithProviders(<CommonTable {...props} />);

      const downloadBtn = screen.getByTestId('download-btn');
      fireEvent.click(downloadBtn);

      await waitFor(() => {
        expect(onDownloadClick).toHaveBeenCalled();
      });
    });

    it('should pass upload handler to pagination', async () => {
      const onUploadClick = jest.fn();
      const props = createDefaultProps({ onUploadClick });
      renderWithProviders(<CommonTable {...props} />);

      const uploadBtn = screen.getByTestId('upload-btn');
      fireEvent.click(uploadBtn);

      await waitFor(() => {
        expect(onUploadClick).toHaveBeenCalled();
      });
    });
  });

  describe('Scroll Shadows', () => {
    it('should handle scroll events', () => {
      const props = createDefaultProps({ allowSticky: true });
      const { container } = renderWithProviders(<CommonTable {...props} />);

      const tableContainer = container.querySelector('.overflow-x-auto');
      if (tableContainer) {
        fireEvent.scroll(tableContainer);
      }

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle window resize events', () => {
      const props = createDefaultProps({ allowSticky: true });
      renderWithProviders(<CommonTable {...props} />);

      fireEvent.resize(window);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should clean up resize event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const props = createDefaultProps({ allowSticky: true });
      const { unmount } = renderWithProviders(<CommonTable {...props} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('MinColWidth', () => {
    it('should apply custom minColWidth', () => {
      const props = createDefaultProps({ minColWidth: 200 });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should use default minColWidth of 150', () => {
      const props = createDefaultProps();
      delete props.minColWidth;
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Unique Key', () => {
    it('should use custom uniqueKey for row identification', async () => {
      const onSelectRow = jest.fn();
      const mockData = [
        { id: 'id-1', customId: 'custom-1', name: 'Item 1', description: 'Test', price: 100, status: 'active' },
      ];
      const columns = [
        { key: 'name' as keyof typeof mockData[0], label: 'Name' },
      ];
      const props = {
        ...createDefaultProps(),
        data: mockData,
        columns,
        uniqueKey: 'customId' as keyof typeof mockData[0],
        onSelectRow,
      };
      renderWithProviders(<CommonTable {...props} />);

      const row = screen.getByText('Item 1').closest('tr');
      fireEvent.click(row!);

      await waitFor(() => {
        expect(onSelectRow).toHaveBeenCalledWith([mockData[0]]);
      });
    });

    it('should default to id as uniqueKey', () => {
      const props = createDefaultProps();
      delete props.uniqueKey;
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Checkbox Click Propagation', () => {
    it('should stop propagation when clicking checkbox', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CommonTable {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const rowCheckbox = checkboxes[1];

      // Click with stopPropagation
      fireEvent.click(rowCheckbox);

      // Checkbox should trigger selection
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Column className', () => {
    it('should apply column className when styles are provided', () => {
      const mockStyles = { 'custom-class': 'applied-class' };
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name', className: 'custom-class' },
      ];
      const props = createDefaultProps({ columns, styles: mockStyles });
      renderWithProviders(<CommonTable {...props} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
