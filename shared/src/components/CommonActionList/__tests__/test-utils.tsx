/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a minimal theme for testing
const theme = createTheme();

// Mock i18next
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

// Mock NoDataFound component (relative to CommonActionList.tsx)
jest.mock('../../NoDataFound/NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No Data Found</div>,
}));

// Mock CommonPagination component (relative to CommonActionList.tsx)
jest.mock('../../CommonPagination/CommonPagination', () => ({
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

// Mock CustomCheckbox component (relative to CommonActionList.tsx)
jest.mock('../../Checkbox', () => ({
  CustomCheckbox: ({ checked, onChange, indeterminate, onClick, ...props }: any) => (
    <input
      type="checkbox"
      data-testid="custom-checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      data-indeterminate={indeterminate}
      {...props}
    />
  ),
}));

// Mock CustomButton component (relative to CommonActionList.tsx)
jest.mock('../../Button', () => ({
  CustomButton: ({ label, onClick, ...props }: any) => (
    <button
      data-testid={`custom-button-${label?.toLowerCase()?.replaceAll(/\s+/g, '-')}`}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  ),
}));

// Mock renderActionButtons utility (relative to CommonActionList.tsx)
jest.mock('../../CommonActionTable/actionButtonUtils', () => ({
  renderActionButtons: ({ row, actionButtons, actionComponents, uniqueKey }: any) => {
    if (actionComponents) {
      return actionComponents(row);
    }
    return (
      <div data-testid="action-buttons">
        {actionButtons
          ?.filter((btn: any) => !btn.hide?.(row))
          .map((btn: any, index: number) => (
            <button
              key={`${row[uniqueKey]}-action-${index}`}
              data-testid={`action-btn-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                btn.clickHandler?.(row);
              }}
            >
              {btn.tooltip || `Action ${index}`}
            </button>
          ))}
      </div>
    );
  },
}));

// Mock renderContentWithSupport utility (relative to CommonActionList.tsx)
jest.mock('../../CommonActionTable/renderUtils', () => ({
  renderContentWithSupport: (row: any, column: any, customComponents: any) => {
    const value = row[column.key];
    
    if (column.renderComponent) {
      return column.renderComponent(row, value);
    }
    
    if (customComponents?.[String(column.key)]) {
      return customComponents[String(column.key)](row, column);
    }
    
    if (column.transformFn) {
      return column.transformFn(value, row);
    }
    
    return value ?? '-';
  },
}));

// Mock CSS module (relative to CommonActionList.tsx - but CSS modules are imported from the same directory)
jest.mock('../CommonActionList.module.css', () => ({
  loading: 'loading',
  empty: 'empty',
  selectAll: 'selectAll',
  cardFooter: 'cardFooter',
  cardActions: 'cardActions',
  actionButton: 'actionButton',
}));

// Custom render function with ThemeProvider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
}

export const renderWithTheme = (
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
export interface TestDataItem {
  id: string;
  name: string;
  description: string;
  status: string;
  amount: number;
}

// Mock test data factory
export const createMockData = (count: number = 5): TestDataItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    name: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`,
    status: index % 2 === 0 ? 'active' : 'inactive',
    amount: (index + 1) * 100,
  }));
};

// Mock columns factory
export const createMockColumns = () => [
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
export const createMockActionButtons = (handlers?: {
  onEdit?: jest.Mock;
  onDelete?: jest.Mock;
}) => [
  {
    iconComponent: () => <span data-testid="edit-icon">Edit</span>,
    clickHandler: handlers?.onEdit || jest.fn(),
    tooltip: 'Edit',
  },
  {
    iconComponent: () => <span data-testid="delete-icon">Delete</span>,
    clickHandler: handlers?.onDelete || jest.fn(),
    tooltip: 'Delete',
    hide: (row: TestDataItem) => row.status === 'inactive',
  },
];

// This export prevents Jest from treating this as an empty test file
describe('CommonActionList Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithTheme).toBeDefined();
    expect(createMockData).toBeDefined();
    expect(createMockColumns).toBeDefined();
    expect(createMockActionButtons).toBeDefined();
  });
});
