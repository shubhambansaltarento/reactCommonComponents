/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Option, PriorityColor } from '../CustomMultiSelectPill.interface';
import { SvgIconProps } from '@mui/material/SvgIcon';

// Create MUI theme for testing
const theme = createTheme();

// Test wrapper with MUI ThemeProvider
const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// Custom render function with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

// Mock icon component for testing
export const MockIcon: React.FC<SvgIconProps> = (props) => (
  <svg data-testid="mock-icon" {...(props as any)} />
);

// Another mock icon for variety
export const MockHomeIcon: React.FC<SvgIconProps> = (props) => (
  <svg data-testid="mock-home-icon" {...(props as any)} />
);

// Extended interface for options with icons
export interface OptionWithIcon extends Option {
  icon?: React.ComponentType<SvgIconProps>;
}

// Factory function to create option items
export const createOption = (overrides: Partial<Option> = {}): Option => ({
  label: 'Option Label',
  value: 'option-value',
  ...overrides,
});

// Factory to create multiple options
export const createOptions = (count: number = 3): Option[] => {
  return Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: `option-${index + 1}`,
  }));
};

// Predefined option lists for common test scenarios
export const mockOptions = {
  basic: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ] as Option[],

  withIcons: [
    { label: 'Home', value: 'home', icon: MockHomeIcon },
    { label: 'Settings', value: 'settings', icon: MockIcon },
  ] as OptionWithIcon[],

  single: [{ label: 'Only Option', value: 'only' }] as Option[],

  empty: [] as Option[],

  priorities: [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ] as Option[],
};

// Priority colors for testing
export const mockPriorityColors: Record<string, PriorityColor> = {
  high: { bg: '#ffebee', text: '#c62828' },
  medium: { bg: '#fff3e0', text: '#ef6c00' },
  low: { bg: '#e8f5e9', text: '#2e7d32' },
};

// Default props for single select mode
export const defaultSingleSelectProps = {
  options: mockOptions.basic,
  onChange: jest.fn(),
  multiple: false as const,
};

// Default props for multi select mode
export const defaultMultiSelectProps = {
  options: mockOptions.basic,
  onChange: jest.fn(),
  multiple: true as const,
};

// Helper to reset all mock functions
export const resetMocks = () => {
  jest.clearAllMocks();
};

// Re-export testing library utilities for convenience
export { screen, fireEvent, waitFor, within } from '@testing-library/react';
