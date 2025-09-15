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

// Default props helper for ImageCard
export const createDefaultProps = (overrides: any = {}) => ({
  image: 'https://example.com/test-image.jpg',
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CustomImageCard Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
