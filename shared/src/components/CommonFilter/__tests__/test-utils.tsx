/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CheckboxTab, DateTab, FilterTabConfig } from '../CommonFilter.interface';

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Create mock checkbox tab
export const createMockCheckboxTab = (overrides: Partial<CheckboxTab> = {}): CheckboxTab => ({
  label: 'Status',
  key: 'status',
  type: 'checkbox',
  tabValues: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ],
  ...overrides,
});

// Create mock date tab
export const createMockDateTab = (overrides: Partial<DateTab> = {}): DateTab => ({
  label: 'Date Range',
  key: 'dateRange',
  type: 'date',
  toDate: true,
  ...overrides,
});

// Create mock tabs array
export const createMockTabs = (): FilterTabConfig[] => [
  createMockCheckboxTab(),
  createMockDateTab(),
];

// Default props helper
export const createDefaultProps = (overrides: any = {}) => ({
  open: true,
  onClose: jest.fn(),
  tabs: createMockTabs(),
  onApply: jest.fn(),
  onClear: jest.fn(),
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CommonFilter Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockCheckboxTab).toBeDefined();
    expect(createMockDateTab).toBeDefined();
    expect(createMockTabs).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
