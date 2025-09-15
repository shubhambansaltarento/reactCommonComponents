/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SortListConfig, CommonSortProps } from '../CommonSort.interface';

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

// Create mock sort list
export const createMockSortList = (): SortListConfig[] => [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'date_asc', label: 'Date (Oldest)' },
  { value: 'date_desc', label: 'Date (Newest)' },
];

// Default props helper for CommonSort
export const createDefaultProps = (overrides: Partial<CommonSortProps> = {}): CommonSortProps => ({
  open: true,
  onClose: jest.fn(),
  sortList: createMockSortList(),
  onApply: jest.fn(),
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CommonSort Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockSortList).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
