/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommonActionList } from '../../CommonActionList';
import {
  renderWithTheme,
  createMockData,
  createMockColumns,
  createMockActionButtons,
  TestDataItem,
} from '../test-utils';

describe('CommonActionList', () => {
  const defaultProps = {
    columns: createMockColumns(),
    data: createMockData(3),
    uniqueKey: 'id' as keyof TestDataItem,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with data', () => {
      renderWithTheme(<CommonActionList {...defaultProps} />);
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render column labels for each item', () => {
      renderWithTheme(<CommonActionList {...defaultProps} />);
      
      const nameLabels = screen.getAllByText('Name');
      const descriptionLabels = screen.getAllByText('Description');
      
      expect(nameLabels.length).toBe(defaultProps.data.length);
      expect(descriptionLabels.length).toBe(defaultProps.data.length);
    });

    it('should apply wrapper className when provided', () => {
      const { container } = renderWithTheme(
        <CommonActionList {...defaultProps} wrapperClassName="custom-wrapper" />
      );
      
      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    });

    it('should apply custom card className using getCardClassName', () => {
      const getCardClassName = jest.fn((row: TestDataItem) => 
        row.status === 'active' ? 'active-card' : 'inactive-card'
      );
      
      renderWithTheme(
        <CommonActionList {...defaultProps} getCardClassName={getCardClassName} />
      );
      
      expect(getCardClassName).toHaveBeenCalledTimes(defaultProps.data.length);
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      renderWithTheme(<CommonActionList {...defaultProps} loading={true} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should not render data when loading', () => {
      renderWithTheme(<CommonActionList {...defaultProps} loading={true} />);
      
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show NoDataFound when data is empty', () => {
      renderWithTheme(<CommonActionList {...defaultProps} data={[]} />);
      
      // NoDataFound component renders - check for empty state wrapper class
      const emptyContainer = document.querySelector('.empty');
      expect(emptyContainer).toBeInTheDocument();
    });

    it('should show custom empty component when provided', () => {
      const customEmptyComponent = <div data-testid="custom-empty">Custom Empty Message</div>;
      
      renderWithTheme(
        <CommonActionList {...defaultProps} data={[]} emptyComponent={customEmptyComponent} />
      );
      
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-found')).not.toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should show checkboxes when allowSelection is true', () => {
      renderWithTheme(<CommonActionList {...defaultProps} allowSelection={true} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      // One for "Select All" and one per row
      expect(checkboxes.length).toBe(defaultProps.data.length + 1);
    });

    it('should not show checkboxes when allowSelection is false', () => {
      renderWithTheme(<CommonActionList {...defaultProps} allowSelection={false} />);
      
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should call onRowSelectionChange when row is selected', () => {
      const onRowSelectionChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onRowSelectionChange={onRowSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      // Click the first row checkbox (index 1, as index 0 is "Select All")
      fireEvent.click(checkboxes[1]);
      
      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('should call onSelectRow when row is selected', () => {
      const onSelectRow = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onSelectRow={onSelectRow}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      
      expect(onSelectRow).toHaveBeenCalled();
    });

    it('should handle select all functionality', () => {
      const onRowSelectionChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onRowSelectionChange={onRowSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      // First checkbox is "Select All"
      fireEvent.click(checkboxes[0]);
      
      expect(onRowSelectionChange).toHaveBeenCalled();
      const calledWith = onRowSelectionChange.mock.calls[0][0];
      expect(calledWith.size).toBe(defaultProps.data.length);
    });

    it('should show Select All and Clear All text when allowSelection is true', () => {
      renderWithTheme(<CommonActionList {...defaultProps} allowSelection={true} />);
      
      expect(screen.getByText(/Select All|COMMON\.SELECT_ALL/)).toBeInTheDocument();
      expect(screen.getByText(/Clear All|COMMON\.CLEAR_ALL/)).toBeInTheDocument();
    });

    it('should handle clear all functionality when items are selected', () => {
      const onRowSelectionChange = jest.fn();
      const selectedRows = new Set(['item-1', 'item-2']);
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
          onRowSelectionChange={onRowSelectionChange}
        />
      );
      
      // Clear All text (may be translated or show the key)
      const clearAllButton = screen.getByText(/Clear All|COMMON\.CLEAR_ALL/);
      fireEvent.click(clearAllButton);
      
      expect(onRowSelectionChange).toHaveBeenCalledWith(new Set());
    });

    it('should handle clear all with local state when onRowSelectionChange is not provided', async () => {
      const onSelectRow = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onSelectRow={onSelectRow}
        />
      );
      
      // First select an item to enable the clear all button
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // Select first row
      
      // Now click clear all
      const clearAllButton = screen.getByText(/Clear All|COMMON\.CLEAR_ALL/);
      fireEvent.click(clearAllButton);
      
      await waitFor(() => {
        expect(onSelectRow).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('Card Interactions', () => {
    it('should call onCardClick when card is clicked', () => {
      const onCardClick = jest.fn();
      
      renderWithTheme(
        <CommonActionList {...defaultProps} onCardClick={onCardClick} />
      );
      
      // Find and click the first card
      const cards = document.querySelectorAll('.card_outer');
      fireEvent.click(cards[0]);
      
      expect(onCardClick).toHaveBeenCalledWith(defaultProps.data[0]);
    });

    it('should call onCardDoubleClick when card is double-clicked', () => {
      const onCardDoubleClick = jest.fn();
      
      renderWithTheme(
        <CommonActionList {...defaultProps} onCardDoubleClick={onCardDoubleClick} />
      );
      
      const cards = document.querySelectorAll('.card_outer');
      fireEvent.doubleClick(cards[0]);
      
      expect(onCardDoubleClick).toHaveBeenCalledWith(defaultProps.data[0]);
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons when provided', () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      const actionButtons = createMockActionButtons({ onEdit, onDelete });
      
      renderWithTheme(
        <CommonActionList {...defaultProps} actionButtons={actionButtons} />
      );
      
      // Action buttons render IconButtons, so look for buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call action button handler when clicked', () => {
      const onEdit = jest.fn();
      const actionButtons = createMockActionButtons({ onEdit });
      
      renderWithTheme(
        <CommonActionList {...defaultProps} actionButtons={actionButtons} />
      );
      
      // Find buttons and click them - Edit icon renders as "Edit" text
      const editIcons = screen.getAllByTestId('edit-icon');
      fireEvent.click(editIcons[0]);
      
      expect(onEdit).toHaveBeenCalledWith(defaultProps.data[0]);
    });

    it('should hide action buttons based on hide function', () => {
      const actionButtons = createMockActionButtons();
      
      renderWithTheme(
        <CommonActionList {...defaultProps} actionButtons={actionButtons} />
      );
      
      // Delete button is hidden for inactive items
      // Active items (index 0 and 2) show delete, inactive (index 1) doesn't
      const deleteIcons = screen.getAllByTestId('delete-icon');
      // Only active items (2 out of 3) should show delete icon
      expect(deleteIcons.length).toBe(2);
    });

    it('should render actionComponents when provided', () => {
      const actionComponents = (row: TestDataItem) => (
        <div data-testid={`custom-action-${row.id}`}>Custom Action</div>
      );
      
      renderWithTheme(
        <CommonActionList {...defaultProps} actionComponents={actionComponents} />
      );
      
      expect(screen.getByTestId('custom-action-item-1')).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render headerComponents when provided', () => {
      const headerComponents = (row: TestDataItem) => (
        <div data-testid={`header-${row.id}`}>Header: {row.name}</div>
      );
      
      renderWithTheme(
        <CommonActionList {...defaultProps} headerComponents={headerComponents} />
      );
      
      expect(screen.getByTestId('header-item-1')).toBeInTheDocument();
      expect(screen.getByText('Header: Item 1')).toBeInTheDocument();
    });

    it('should render footerComponents when provided', () => {
      const footerComponents = (row: TestDataItem) => (
        <div data-testid={`footer-${row.id}`}>Footer: {row.name}</div>
      );
      
      renderWithTheme(
        <CommonActionList {...defaultProps} footerComponents={footerComponents} />
      );
      
      expect(screen.getByTestId('footer-item-1')).toBeInTheDocument();
      expect(screen.getByText('Footer: Item 1')).toBeInTheDocument();
    });

    it('should render button with buttonLabel and buttonAction', () => {
      const buttonAction = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          buttonLabel="Submit"
          buttonAction={buttonAction}
        />
      );
      
      // Find all buttons with the text "Submit"
      const submitButtons = screen.getAllByRole('button', { name: 'Submit' });
      expect(submitButtons.length).toBe(defaultProps.data.length);
      
      fireEvent.click(submitButtons[0]);
      expect(buttonAction).toHaveBeenCalledWith(defaultProps.data[0]);
    });
  });

  describe('Column Transformations', () => {
    it('should apply transformFn to column values', () => {
      renderWithTheme(<CommonActionList {...defaultProps} />);
      
      // Amount column has transformFn that adds $ prefix
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('should render custom renderComponent when provided', () => {
      const columnsWithRenderComponent = [
        { key: 'name' as const, label: 'Name' },
        { key: 'description' as const, label: 'Description' },
        { 
          key: 'amount' as const, 
          label: 'Amount',
          transformFn: (value: number) => `$${value.toFixed(2)}`,
        },
        {
          key: 'status' as const,
          label: 'Status Badge',
          renderComponent: (row: TestDataItem) => (
            <span data-testid={`status-badge-${row.id}`} className={row.status}>
              {row.status.toUpperCase()}
            </span>
          ),
        },
      ];
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          columns={columnsWithRenderComponent}
        />
      );
      
      expect(screen.getByTestId('status-badge-item-1')).toBeInTheDocument();
    });

    it('should render icon when column has icon configuration', () => {
      const columnsWithIcon = [
        {
          key: 'name' as const,
          label: 'Name',
          icon: {
            iconComponent: ({ className, style }: any) => (
              <span data-testid="column-icon" className={className} style={style}>
                Icon
              </span>
            ),
            hide: () => false,
            fill: () => 'red',
          },
        },
        ...createMockColumns().slice(1),
      ];
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          columns={columnsWithIcon}
        />
      );
      
      const icons = screen.getAllByTestId('column-icon');
      expect(icons.length).toBe(defaultProps.data.length);
    });
  });

  describe('Pagination', () => {
    it('should render pagination when enablePagination is true and totalRows > 10', () => {
      const onPageChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          enablePagination={true}
          totalRows={50}
          page={1}
          rowsPerPage={10}
          onPageChange={onPageChange}
        />
      );
      
      // Pagination renders a navigation element
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should not render pagination when totalRows <= 10', () => {
      const onPageChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          enablePagination={true}
          totalRows={5}
          page={1}
          rowsPerPage={10}
          onPageChange={onPageChange}
        />
      );
      
      // No pagination when totalRows <= 10
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should not render pagination when enablePagination is false', () => {
      const onPageChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          enablePagination={false}
          totalRows={50}
          page={1}
          rowsPerPage={10}
          onPageChange={onPageChange}
        />
      );
      
      // No pagination when disabled
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should call onPageChange when pagination is interacted with', () => {
      const onPageChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          enablePagination={true}
          totalRows={50}
          page={1}
          rowsPerPage={10}
          onPageChange={onPageChange}
        />
      );
      
      // Find the next page button using text content
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should display cost information in pagination when provided', () => {
      const onPageChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          enablePagination={true}
          totalRows={50}
          page={1}
          rowsPerPage={10}
          onPageChange={onPageChange}
          costLabel="Total Cost"
          costAmount="500.00"
        />
      );
      
      expect(screen.getByText('Total Cost')).toBeInTheDocument();
      // Cost amount may be formatted differently based on locale
      expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    });
  });

  describe('Component Change Callback', () => {
    it('should call onComponentChange when selection changes', () => {
      const onComponentChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onComponentChange={onComponentChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      
      expect(onComponentChange).toHaveBeenCalled();
    });

    it('should call onComponentChange with correct params on select all', () => {
      const onComponentChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          onComponentChange={onComponentChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      
      expect(onComponentChange).toHaveBeenCalledWith(
        'selectAll',
        true,
        defaultProps.data
      );
    });
  });

  describe('Scroll Container', () => {
    it('should apply scroll styles when pagination is disabled and data > 10', () => {
      const largeData = createMockData(15);
      
      const { container } = renderWithTheme(
        <CommonActionList
          {...defaultProps}
          data={largeData}
          enablePagination={false}
        />
      );
      
      // The component should have scroll container styles applied
      expect(container.querySelector('.p-4')).toBeInTheDocument();
    });
  });

  describe('External Selected Rows', () => {
    it('should use external selectedRows when provided', () => {
      const selectedRows = new Set(['item-1']);
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      // Second checkbox (first row) should be checked
      expect((checkboxes[1] as HTMLInputElement).checked).toBe(true);
    });

    it('should handle deselection of externally selected rows', async () => {
      const selectedRows = new Set(['item-1']);
      const onRowSelectionChange = jest.fn();
      
      renderWithTheme(
        <CommonActionList
          {...defaultProps}
          allowSelection={true}
          selectedRows={selectedRows}
          onRowSelectionChange={onRowSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      // Uncheck the first row
      fireEvent.click(checkboxes[1]);
      
      await waitFor(() => {
        expect(onRowSelectionChange).toHaveBeenCalled();
      });
    });
  });
});
