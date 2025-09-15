/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a minimal theme for testing
const theme = createTheme();

// Custom render function with required providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
}

export const renderWithProviders = (
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

// Mock data types
export interface MockRowData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  cartQuantity: number;
}

// Create mock data helper
export const createMockData = (count: number = 3): MockRowData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i + 1}`,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    price: 100 * (i + 1),
    quantity: 10 * (i + 1),
    cartQuantity: 0,
  }));
};

// Create mock columns
export const createMockColumns = () => [
  { key: 'name' as keyof MockRowData, label: 'Name' },
  { key: 'description' as keyof MockRowData, label: 'Description' },
  { key: 'price' as keyof MockRowData, label: 'Price' },
];

// Default props helper
export const createDefaultProps = (overrides: any = {}) => ({
  page: 0,
  rowsPerPage: 10,
  totalRows: 3,
  onPageChange: jest.fn(),
  data: createMockData(),
  columns: createMockColumns(),
  uniqueKey: 'id' as keyof MockRowData,
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('ActionList Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockData).toBeDefined();
    expect(createMockColumns).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
