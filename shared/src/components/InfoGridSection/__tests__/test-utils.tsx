/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  InfoGridCell,
  InfoGridRow,
  InfoGridSectionProps,
} from '../InfoGridSection.interface';

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

// Factory function to create a single cell
export const createCell = (overrides: Partial<InfoGridCell> = {}): InfoGridCell => ({
  label: 'Cell Label',
  value: 'Cell Value',
  ...overrides,
});

// Factory function to create a row with cells
export const createRow = (
  columnCount: number = 3,
  overrides: Partial<InfoGridCell>[] = []
): InfoGridRow => ({
  columns: Array.from({ length: columnCount }, (_, index) => ({
    label: `Label ${index + 1}`,
    value: `Value ${index + 1}`,
    ...overrides[index],
  })),
});

// Factory function to create sections with header and body rows
export const createSections = (bodyRowCount: number = 2): InfoGridRow[] => {
  const headerRow: InfoGridRow = {
    columns: [
      { label: 'Order Number', value: 'ORD-001' },
      { label: 'Status', value: 'Pending' },
      { label: 'Date', value: '01-Jan-2026' },
    ],
  };

  const bodyRows = Array.from({ length: bodyRowCount }, (_, index) => ({
    columns: [
      {
        key: index === 0 ? 'totalpartsordered' : 'totaldeliveries',
        label: index === 0 ? 'Total Parts' : 'Total Deliveries',
        value: (index + 1) * 10,
      },
      { label: `Stat ${index + 1}A`, value: 100 + index },
      { label: `Stat ${index + 1}B`, value: 200 + index },
    ],
  }));

  return [headerRow, ...bodyRows];
};

// Predefined mock data for common test scenarios
export const mockSections = {
  // Basic sections with header + 2 body rows
  basic: createSections(2),

  // Empty sections
  empty: [] as InfoGridRow[],

  // Header only (no body rows)
  headerOnly: [createRow(3)],

  // Sections with color classes
  withColors: [
    {
      columns: [
        { label: 'Header 1', value: 'H1' },
        { label: 'Header 2', value: 'H2' },
      ],
    },
    {
      columns: [
        { key: 'totalpartsordered', label: 'Total', value: 50 },
        { label: 'Success', value: 30, colorClass: 'text-green' },
        { label: 'Warning', value: 15, colorClass: 'is-warning' },
        { label: 'Danger', value: 5, colorClass: 'is-danger' },
      ],
    },
  ] as InfoGridRow[],

  // Sections with color styles
  withColorStyles: [
    {
      columns: [{ label: 'Header', value: 'Test' }],
    },
    {
      columns: [
        { key: 'totalpartsordered', label: 'Parts', value: 100 },
        {
          label: 'Styled',
          value: 50,
          colorStyle: { color: 'red', backgroundColor: '#fff' },
        },
      ],
    },
  ] as InfoGridRow[],

  // Sections with show-icon class
  withIcon: [
    {
      columns: [{ label: 'Header', value: 'Test' }],
    },
    {
      columns: [
        { key: 'totalpartsordered', label: 'Parts', value: 100 },
        { label: 'With Icon', value: 25, colorClass: 'show-icon text-blue' },
      ],
    },
  ] as InfoGridRow[],

  // Multiple body rows
  multipleRows: createSections(4),

  // Single body row
  singleBodyRow: createSections(1),
};

// Default props for InfoGridSection
export const defaultInfoGridProps: InfoGridSectionProps = {
  sections: mockSections.basic,
};

// Helper to reset all mock functions
export const resetMocks = () => {
  jest.clearAllMocks();
};

// Re-export testing library utilities for convenience
export { screen, fireEvent, waitFor, within } from '@testing-library/react';
