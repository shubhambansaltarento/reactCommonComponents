/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Option } from '../CustomMultiSelect.interface';

// Create a minimal theme for testing
const theme = createTheme();

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Wrapper component with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock translation function for tests
export const mockT = (key: string) => key;

// Mock options for testing
export const mockOptions: Option[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

export const mockSingleOption: Option[] = [
  { label: 'Single Option', value: 'single' },
];

export const mockManyOptions: Option[] = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Option 4', value: 'opt4' },
  { label: 'Option 5', value: 'opt5' },
  { label: 'Option 6', value: 'opt6' },
  { label: 'Option 7', value: 'opt7' },
  { label: 'Option 8', value: 'opt8' },
  { label: 'Option 9', value: 'opt9' },
  { label: 'Option 10', value: 'opt10' },
  { label: 'Option 11', value: 'opt11' },
  { label: 'Option 12', value: 'opt12' },
];

// Default props factory for multi-select
export const createMultiSelectProps = (overrides = {}) => ({
  options: mockOptions,
  multiple: true as const,
  onChange: jest.fn(),
  ...overrides,
});

// Default props factory for single-select
export const createSingleSelectProps = (overrides = {}) => ({
  options: mockOptions,
  multiple: false as const,
  onChange: jest.fn(),
  ...overrides,
});

// Re-export testing utilities
export * from '@testing-library/react';
