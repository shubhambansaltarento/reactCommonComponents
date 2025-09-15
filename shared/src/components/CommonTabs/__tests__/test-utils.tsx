/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TabListInterface } from '../CommonTabs.interface';

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

// Mock icon elements for testing (JSX.Element, not components)
export const mockHomeIcon = <span data-testid="mock-icon">Icon</span>;
export const mockSettingsIcon = (
  <span data-testid="mock-settings-icon">Settings</span>
);

// Factory function to create tab list items
export const createTabItem = (
  overrides: Partial<TabListInterface> = {}
): TabListInterface => ({
  label: 'Tab Label',
  value: 'tab-value',
  ...overrides,
});

// Factory to create multiple tabs
export const createTabList = (count: number = 3): TabListInterface[] => {
  return Array.from({ length: count }, (_, index) => ({
    label: `Tab ${index + 1}`,
    value: `tab-${index + 1}`,
  }));
};

// Predefined tab lists for common test scenarios
export const mockTabLists = {
  basic: [
    { label: 'Home', value: 'home' },
    { label: 'Profile', value: 'profile' },
    { label: 'Settings', value: 'settings' },
  ] as TabListInterface[],

  withDisabledBoolean: [
    { label: 'Active', value: 'active' },
    { label: 'Disabled', value: 'disabled', disabled: true },
    { label: 'Another Active', value: 'another' },
  ] as TabListInterface[],

  withDisabledFunction: [
    { label: 'Tab A', value: 'a' },
    {
      label: 'Tab B',
      value: 'b',
      disabled: (value: string) => value === 'b',
    },
    { label: 'Tab C', value: 'c' },
  ] as TabListInterface[],

  withCounts: [
    { label: 'Inbox', value: 'inbox', count: 5 },
    { label: 'Drafts', value: 'drafts', count: 12 },
    { label: 'Sent', value: 'sent', count: 0 },
  ] as TabListInterface[],

  withIcons: [
    { label: 'Home', value: 'home', iconComponent: mockHomeIcon },
    { label: 'Settings', value: 'settings', iconComponent: mockSettingsIcon },
  ] as TabListInterface[],

  withClassName: [
    { label: 'Custom Tab', value: 'custom', className: 'custom-tab-class' },
    { label: 'Normal Tab', value: 'normal' },
  ] as TabListInterface[],

  mixed: [
    { label: 'Active Tab', value: 'active' },
    { label: 'With Count', value: 'count', count: 3 },
    { label: 'Disabled', value: 'disabled', disabled: true },
    { label: 'With Icon', value: 'icon', iconComponent: mockHomeIcon },
    { label: 'Custom Class', value: 'custom', className: 'special-class' },
  ] as TabListInterface[],

  empty: [] as TabListInterface[],

  single: [{ label: 'Only Tab', value: 'only' }] as TabListInterface[],
};

// Default props for CommonTabs
export const defaultTabsProps = {
  value: 'home',
  onChange: jest.fn(),
  tabList: mockTabLists.basic,
};

// Helper to reset all mock functions
export const resetMocks = () => {
  jest.clearAllMocks();
};

// Re-export testing library utilities for convenience
export { screen, fireEvent, waitFor, within } from '@testing-library/react';
