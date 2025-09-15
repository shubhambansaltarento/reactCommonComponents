/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CommonDrawerInterface } from '../CommonDrawer.interface';

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

// Default props helper for CommonDrawer
export const createDefaultProps = (overrides: Partial<CommonDrawerInterface> = {}): CommonDrawerInterface => ({
  open: true,
  onClose: jest.fn(),
  body: <div data-testid="drawer-body">Body Content</div>,
  isMobile: false,
  ...overrides,
});

// Mock body content helper
export const createMockBody = (content: string = 'Test Body Content') => (
  <div data-testid="mock-body">{content}</div>
);

// Mock footer content helper
export const createMockFooter = (content: string = 'Test Footer Content') => (
  <div data-testid="mock-footer">{content}</div>
);

// This export prevents Jest from treating this as an empty test file
describe('CommonDrawer Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createDefaultProps).toBeDefined();
    expect(createMockBody).toBeDefined();
    expect(createMockFooter).toBeDefined();
  });
});
