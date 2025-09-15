/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PopupProps } from '../Popup.interface';

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

// Default props helper for Popup
export const createPopupDefaultProps = (overrides: Partial<PopupProps> = {}): PopupProps => ({
  isOpen: true,
  onClose: jest.fn(),
  title: 'Test Popup Title',
  children: <div data-testid="popup-content">Popup Content</div>,
  ...overrides,
});

// Default props helper for PopupModal
export const createPopupModalDefaultProps = (overrides: any = {}) => ({
  isOpen: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  heading: 'Test Modal Heading',
  ...overrides,
});

// Mock footer content helper
export const createMockFooter = (content: string = 'Footer Content') => (
  <div data-testid="mock-footer">{content}</div>
);

// Mock icon helper
export const createMockIcon = () => (
  <span data-testid="mock-icon">🔔</span>
);

// This export prevents Jest from treating this as an empty test file
describe('Popup Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createPopupDefaultProps).toBeDefined();
    expect(createPopupModalDefaultProps).toBeDefined();
    expect(createMockFooter).toBeDefined();
    expect(createMockIcon).toBeDefined();
  });
});
