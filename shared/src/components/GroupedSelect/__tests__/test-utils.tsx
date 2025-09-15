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

// Option type for testing
export interface MockOption {
  label: string;
  value: string | number;
}

// Group type for testing
export interface MockGroup {
  label: string;
  options: MockOption[];
}

// Create mock simple options
export const createMockOptions = (count: number = 3): MockOption[] => {
  return Array.from({ length: count }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  }));
};

// Create mock grouped options
export const createMockGroupedOptions = (): MockGroup[] => {
  return [
    {
      label: 'Group A',
      options: [
        { label: 'Item A1', value: 'a1' },
        { label: 'Item A2', value: 'a2' },
        { label: 'Item A3', value: 'a3' },
      ],
    },
    {
      label: 'Group B',
      options: [
        { label: 'Item B1', value: 'b1' },
        { label: 'Item B2', value: 'b2' },
      ],
    },
  ];
};

// Create default props helper
export const createDefaultProps = () => ({
  options: createMockGroupedOptions(),
  value: [] as MockOption[],
  onChange: jest.fn(),
});
