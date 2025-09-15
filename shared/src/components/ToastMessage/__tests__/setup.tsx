/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastMessageProps } from '../index';

// Custom render function
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Mock translation function for tests
export const mockT = (key: string) => key;

// Default props factory
export const createDefaultProps = (overrides: Partial<ToastMessageProps> = {}): ToastMessageProps => ({
  id: 'test-toast-1',
  message: 'Test toast message',
  type: 'info',
  duration: 5000,
  onClose: jest.fn(),
  ...overrides,
});

// Re-export testing utilities
export * from '@testing-library/react';
