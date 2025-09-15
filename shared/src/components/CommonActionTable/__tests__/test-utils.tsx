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

// Mock NoDataFound component (relative to CommonActionTable.tsx)
jest.mock('../../NoDataFound/NoDataFound', () => ({
  NoDataFound: () => <div data-testid="no-data-found">No Data Found</div>,
}));

// Mock CommonPagination component (relative to CommonActionTable.tsx)
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

// Mock CustomCheckbox component (relative to CommonActionTable.tsx)
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

// Mock CSS module (relative to CommonActionTable.tsx)
jest.mock('../CommonActionTable.module.css', () => ({
  loading: 'loading',
  empty: 'empty',
  rowHover: 'rowHover',
  tableOuter: 'tableOuter',
  actions: 'actions',
  actionButton: 'actionButton',
  arrowIcon: 'arrowIcon',
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
describe('CommonActionTable Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithTheme).toBeDefined();
    expect(createMockData).toBeDefined();
    expect(createMockColumns).toBeDefined();
    expect(createMockActionButtons).toBeDefined();
  });
});
