/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CardList } from '../../CardList';
import {
  renderWithProviders,
  createMockData,
  createDefaultProps,
  MockRowData,
} from '../test-utils';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'COMMON.SELECT_ALL': 'Select All',
        'COMMON.CLEAR_ALL': 'Clear All',
        'COMMON.DOWNLOAD': 'Download',
        'COMMON.UPLOAD': 'Upload',
        'COMMON.CANCEL': 'Cancel',
        'COMMON.DOWNLOAD_TEXT': 'Are you sure you want to download?',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock child components
jest.mock('../../../Button', () => ({
  CustomButton: ({ label, onClick, className, variant }: any) => (
    <button 
      data-testid={`custom-button-${label?.toLowerCase().replace(/\s+/g, '-')}${variant === 'outlined' ? '-outlined' : ''}`} 
      onClick={onClick}
      className={className}
      data-variant={variant}
    >
      {label}
    </button>
  ),
}));

jest.mock('../../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };
    return (
      <input
        type="checkbox"
        data-testid="custom-checkbox"
        checked={checked || false}
        onChange={handleChange}
        data-indeterminate={indeterminate ? 'true' : 'false'}
      />
    );
  },
}));

jest.mock('../../../CommonPagination/CommonPagination', () => ({
  CommonPagination: ({ page, rowsPerPage, totalRows, onPageChange, onDownloadClick, onUploadClick }: any) => (
    <div data-testid="common-pagination">
      <span data-testid="pagination-info">
        Page {page + 1}, Rows per page: {rowsPerPage}, Total: {totalRows}
      </span>
      <button data-testid="next-page" onClick={() => onPageChange(page + 1)}>Next</button>
      <button data-testid="prev-page" onClick={() => onPageChange(page - 1)}>Previous</button>
      {onDownloadClick && <button data-testid="pagination-download" onClick={onDownloadClick}>Download</button>}
      {onUploadClick && <button data-testid="pagination-upload" onClick={onUploadClick}>Upload</button>}
    </div>
  ),
}));

jest.mock('../../../NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No data found</div>,
}));

jest.mock('../../../Popup', () => ({
  Popup: ({ isOpen, onClose, title, children }: any) => (
    isOpen ? (
      <div data-testid="popup">
        <div data-testid="popup-title">{title}</div>
        <button data-testid="popup-close" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
  ),
}));

describe('CardList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const props = createDefaultProps();
      const { container } = renderWithProviders(<CardList {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should render all data items as cards', () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render column labels and values', () => {
      const mockData = createMockData(1);
      const props = createDefaultProps({ data: mockData });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should render NoDataFound when data is empty', () => {
      const props = createDefaultProps({ data: [] });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByTestId('no-data-found')).toBeInTheDocument();
    });

    it('should apply wrapper className with styles', () => {
      const mockStyles = { 'custom-wrapper': 'applied-style' };
      const props = createDefaultProps({
        wrapperClassName: 'custom-wrapper',
        styles: mockStyles,
      });
      const { container } = renderWithProviders(<CardList {...props} />);

      const wrapper = container.querySelector('.applied-style');
      expect(wrapper).toBeInTheDocument();
    });

    it('should apply card className using getCardClassName', () => {
      const mockStyles = { 'highlighted-card': 'highlight-style' };
      const getCardClassName = jest.fn().mockReturnValue('highlighted-card');
      const props = createDefaultProps({
        getCardClassName,
        styles: mockStyles,
      });
      renderWithProviders(<CardList {...props} />);

      expect(getCardClassName).toHaveBeenCalled();
    });

    it('should hide columns when hide property is true', () => {
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name' },
        { key: 'description' as keyof MockRowData, label: 'Description', hide: true },
        { key: 'price' as keyof MockRowData, label: 'Price' },
      ];
      const mockData = createMockData(1);
      const props = createDefaultProps({ columns, data: mockData });
      renderWithProviders(<CardList {...props} />);

      const nameLabels = screen.getAllByText('Name');
      expect(nameLabels.length).toBeGreaterThan(0);
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
      const priceLabels = screen.getAllByText('Price');
      expect(priceLabels.length).toBeGreaterThan(0);
    });

    it('should render dash for empty cell values', () => {
      const mockData = [{ id: 'row-1', name: 'Item 1', description: '', price: 100, status: 'active' }];
      const columns = [
        { key: 'name' as keyof MockRowData, label: 'Name' },
        { key: 'description' as keyof MockRowData, label: 'Description' },
      ];
      const props = createDefaultProps({ data: mockData, columns });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should render Select All checkbox when allowSelection is true', () => {
      const props = createDefaultProps({ allowSelection: true });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('should not render Select All checkbox when allowSelection is false', () => {
      const props = createDefaultProps({ allowSelection: false });
      renderWithProviders(<CardList {...props} />);

      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
    });

    it('should render row checkboxes when allowSelection is true', () => {
      const props = createDefaultProps({ allowSelection: true });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      // 1 for select all + 3 for each row
      expect(checkboxes.length).toBe(4);
    });

    it('should not render row checkboxes when allowSelection is false', () => {
      const props = createDefaultProps({ allowSelection: false });
      renderWithProviders(<CardList {...props} />);

      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument();
    });

    it('should select all rows when Select All checkbox is clicked', async () => {
      const onSelectionChange = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectionChange,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const selectAllCheckbox = checkboxes[0];

      await act(async () => {
        fireEvent.click(selectAllCheckbox);
      });

      expect(onSelectionChange).toHaveBeenCalledWith(mockData);
    });

    it('should deselect all rows when Select All checkbox is unchecked', async () => {
      const onSelectionChange = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectionChange,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const selectAllCheckbox = checkboxes[0];

      // First select all
      await act(async () => {
        fireEvent.click(selectAllCheckbox);
      });
      
      // Then deselect all
      await act(async () => {
        fireEvent.click(selectAllCheckbox);
      });

      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('should toggle individual row selection', async () => {
      const onSelectionChange = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectionChange,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const firstRowCheckbox = checkboxes[1]; // Skip select all

      await act(async () => {
        fireEvent.click(firstRowCheckbox);
      });

      expect(onSelectionChange).toHaveBeenCalledWith([mockData[0]]);
    });

    it('should show Clear All button and clear selection when clicked', async () => {
      const onSelectionChange = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        onSelectionChange,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      // First select all
      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const selectAllCheckbox = checkboxes[0];
      await act(async () => {
        fireEvent.change(selectAllCheckbox, { target: { checked: true } });
      });

      // Click Clear All
      const clearAllButton = screen.getByText('Clear All');
      await act(async () => {
        fireEvent.click(clearAllButton);
      });

      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('should work with controlled selection (selectedRows and onSelectRow)', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true, 
        selectedRows: [mockData[0]],
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const secondRowCheckbox = checkboxes[2];

      await act(async () => {
        fireEvent.click(secondRowCheckbox);
      });

      expect(onSelectRow).toHaveBeenCalled();
    });

    it('should show indeterminate state when some rows are selected', async () => {
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      // Select first row
      const checkboxes = screen.getAllByTestId('custom-checkbox');
      const firstRowCheckbox = checkboxes[1];

      await act(async () => {
        fireEvent.click(firstRowCheckbox);
      });

      // Select All checkbox should be indeterminate
      const selectAllCheckbox = screen.getAllByTestId('custom-checkbox')[0];
      expect(selectAllCheckbox).toHaveAttribute('data-indeterminate', 'true');
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
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('$100')).toBeInTheDocument();
    });
  });

  describe('Render Header and Footer', () => {
    it('should render custom header', () => {
      const renderHeader = (row: MockRowData) => <span data-testid="custom-header">{row.name}</span>;
      const props = createDefaultProps({ renderHeader });
      renderWithProviders(<CardList {...props} />);

      const headers = screen.getAllByTestId('custom-header');
      expect(headers.length).toBe(3);
    });

    it('should render custom footer', () => {
      const renderFooter = (row: MockRowData) => <span data-testid="custom-footer">Footer: {row.id}</span>;
      const props = createDefaultProps({ renderFooter });
      renderWithProviders(<CardList {...props} />);

      const footers = screen.getAllByTestId('custom-footer');
      expect(footers.length).toBe(3);
    });
  });

  describe('Action Buttons', () => {
    it('should render button when buttonLabel and buttonAction are provided', () => {
      const buttonAction = jest.fn();
      const props = createDefaultProps({ 
        buttonLabel: 'View Details',
        buttonAction 
      });
      renderWithProviders(<CardList {...props} />);

      const buttons = screen.getAllByTestId('custom-button-view-details');
      expect(buttons.length).toBe(3);
    });

    it('should call buttonAction when button is clicked', async () => {
      const buttonAction = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        buttonLabel: 'View Details',
        buttonAction,
        data: mockData
      });
      renderWithProviders(<CardList {...props} />);

      const button = screen.getByTestId('custom-button-view-details');
      await act(async () => {
        fireEvent.click(button);
      });

      expect(buttonAction).toHaveBeenCalledWith(mockData[0]);
    });

    it('should render second button when buttonLabel2 and buttonAction2 are provided', () => {
      const buttonAction = jest.fn();
      const buttonAction2 = jest.fn();
      const props = createDefaultProps({ 
        buttonLabel: 'View Details',
        buttonAction,
        buttonLabel2: 'Edit',
        buttonAction2
      });
      renderWithProviders(<CardList {...props} />);

      const viewButtons = screen.getAllByTestId('custom-button-view-details');
      const editButtons = screen.getAllByTestId('custom-button-edit-outlined');
      expect(viewButtons.length).toBe(3);
      expect(editButtons.length).toBe(3);
    });

    it('should call buttonAction2 when second button is clicked', async () => {
      const buttonAction = jest.fn();
      const buttonAction2 = jest.fn();
      const mockData = createMockData(1);
      const props = createDefaultProps({ 
        buttonLabel: 'View Details',
        buttonAction,
        buttonLabel2: 'Edit',
        buttonAction2,
        data: mockData
      });
      renderWithProviders(<CardList {...props} />);

      const editButton = screen.getByTestId('custom-button-edit-outlined');
      await act(async () => {
        fireEvent.click(editButton);
      });

      expect(buttonAction2).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('Pagination', () => {
    it('should render pagination when totalRows > 10', () => {
      const props = createDefaultProps({ totalRows: 15 });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByTestId('common-pagination')).toBeInTheDocument();
    });

    it('should not render pagination when totalRows <= 10', () => {
      const props = createDefaultProps({ totalRows: 5 });
      renderWithProviders(<CardList {...props} />);

      expect(screen.queryByTestId('common-pagination')).not.toBeInTheDocument();
    });

    it('should call onPageChange when page changes', async () => {
      const onPageChange = jest.fn();
      const props = createDefaultProps({ onPageChange, totalRows: 15 });
      renderWithProviders(<CardList {...props} />);

      const nextButton = screen.getByTestId('next-page');
      await act(async () => {
        fireEvent.click(nextButton);
      });

      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Download and Upload', () => {
    it('should render download button when totalRows <= 10 and onDownloadClick is provided', () => {
      const onDownloadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onDownloadClick 
      });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('Download')).toBeInTheDocument();
    });

    it('should render upload button when totalRows <= 10 and onUploadClick is provided', () => {
      const onUploadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onUploadClick 
      });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    it('should call onUploadClick when upload button is clicked', async () => {
      const onUploadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onUploadClick 
      });
      renderWithProviders(<CardList {...props} />);

      const uploadButton = screen.getByText('Upload');
      await act(async () => {
        fireEvent.click(uploadButton);
      });

      expect(onUploadClick).toHaveBeenCalled();
    });

    it('should open download popup when download button is clicked', async () => {
      const onDownloadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onDownloadClick 
      });
      renderWithProviders(<CardList {...props} />);

      const downloadButton = screen.getByText('Download');
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      expect(screen.getByTestId('popup')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to download?')).toBeInTheDocument();
    });

    it('should call onDownloadClick and close popup when confirmed', async () => {
      const onDownloadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onDownloadClick 
      });
      renderWithProviders(<CardList {...props} />);

      // Open popup
      const downloadButton = screen.getByTestId('custom-button-download-outlined');
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Confirm download - get the one inside the popup (without -outlined suffix)
      const confirmButton = screen.getByTestId('custom-button-download');
      await act(async () => {
        fireEvent.click(confirmButton);
      });

      expect(onDownloadClick).toHaveBeenCalled();
    });

    it('should close popup when cancel is clicked', async () => {
      const onDownloadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 5,
        onDownloadClick 
      });
      renderWithProviders(<CardList {...props} />);

      // Open popup
      const downloadButton = screen.getByTestId('custom-button-download-outlined');
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Cancel - the cancel button has outlined variant
      const cancelButton = screen.getByTestId('custom-button-cancel-outlined');
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    });

    it('should pass onDownloadClick and onUploadClick to pagination when totalRows > 10', () => {
      const onDownloadClick = jest.fn();
      const onUploadClick = jest.fn();
      const props = createDefaultProps({ 
        totalRows: 15,
        onDownloadClick,
        onUploadClick
      });
      renderWithProviders(<CardList {...props} />);

      expect(screen.getByTestId('pagination-download')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-upload')).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled Selection', () => {
    it('should use controlled selection when selectedRows and onSelectRow are provided', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true,
        selectedRows: [],
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const checkboxes = screen.getAllByTestId('custom-checkbox');
      await act(async () => {
        fireEvent.click(checkboxes[0]); // Select all
      });

      expect(onSelectRow).toHaveBeenCalledWith(mockData);
    });

    it('should clear controlled selection when Clear All is clicked', async () => {
      const onSelectRow = jest.fn();
      const mockData = createMockData(3);
      const props = createDefaultProps({ 
        allowSelection: true,
        selectedRows: mockData,
        onSelectRow,
        data: mockData 
      });
      renderWithProviders(<CardList {...props} />);

      const clearAllButton = screen.getByText('Clear All');
      await act(async () => {
        fireEvent.click(clearAllButton);
      });

      expect(onSelectRow).toHaveBeenCalledWith([]);
    });
  });
});
