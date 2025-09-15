/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

// This export prevents Jest from treating this as an empty test file
describe('CommonDatePicker Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
  });
});
