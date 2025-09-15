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

// Mock data for StatusSummary and StatusCard
export const createMockSummaryData = () => ({
  'Order ID': '12345',
  'Customer': 'John Doe',
  'Amount': 1500,
  'Status': 'Completed',
});

// Default props helpers
export const createStatusDefaultProps = () => ({
  status: 'success' as const,
});

export const createStatusCardDefaultProps = () => ({
  title: 'Order Summary',
  status: 'success' as const,
  data: createMockSummaryData(),
});

export const createStatusSummaryDefaultProps = () => ({
  title: 'Summary',
  data: createMockSummaryData(),
});
