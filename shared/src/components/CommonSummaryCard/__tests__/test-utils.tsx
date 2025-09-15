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

// Mock summary data item type
export interface MockSummaryDataItem {
  label: string;
  value: string | number;
  isHighlighted?: boolean;
}

// Create mock summary data
export const createMockSummaryData = (): MockSummaryDataItem[] => [
  { label: 'Warranty Type', value: 'Extended Warranty' },
  { label: 'Duration', value: '2 Years' },
  { label: 'Amount', value: 5000 },
  { label: 'Start Date', value: '01/01/2024' },
];

// Default props helper for CommonSummaryCard
export const createDefaultProps = (overrides: any = {}) => ({
  summaryData: createMockSummaryData(),
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CommonSummaryCard Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockSummaryData).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
