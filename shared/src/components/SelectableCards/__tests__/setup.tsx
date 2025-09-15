/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SelectableCardOption } from '../CustomSelectableCards';

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
export const mockOptions: SelectableCardOption[] = [
  {
    value: 'IMAGE',
    titleKey: 'selectableCards.imageTitle',
    descriptionKey: 'selectableCards.imageDescription',
  },
  {
    value: 'TEXT',
    titleKey: 'selectableCards.textTitle',
    descriptionKey: 'selectableCards.textDescription',
  },
];

export const mockSingleOption: SelectableCardOption[] = [
  {
    value: 'SINGLE',
    titleKey: 'selectableCards.singleTitle',
    descriptionKey: 'selectableCards.singleDescription',
  },
];

export const mockManyOptions: SelectableCardOption[] = [
  {
    value: 'OPTION_1',
    titleKey: 'selectableCards.option1Title',
    descriptionKey: 'selectableCards.option1Description',
  },
  {
    value: 'OPTION_2',
    titleKey: 'selectableCards.option2Title',
    descriptionKey: 'selectableCards.option2Description',
  },
  {
    value: 'OPTION_3',
    titleKey: 'selectableCards.option3Title',
    descriptionKey: 'selectableCards.option3Description',
  },
  {
    value: 'OPTION_4',
    titleKey: 'selectableCards.option4Title',
    descriptionKey: 'selectableCards.option4Description',
  },
];

// Default props factory
export const createDefaultProps = (overrides = {}) => ({
  name: 'test-card-group',
  value: '',
  onChange: jest.fn(),
  options: mockOptions,
  ...overrides,
});

// Re-export testing utilities
export * from '@testing-library/react';
