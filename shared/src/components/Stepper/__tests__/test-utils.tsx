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

// Step type for testing
export interface MockStep {
  label: string;
  status: string;
  icon?: React.ReactNode;
}

// Create mock steps helper
export const createMockSteps = (count: number = 4): MockStep[] => {
  const statuses = ['draft', 'pending', 'approved', 'completed', 'delivered'];
  return Array.from({ length: count }, (_, i) => ({
    label: `Step ${i + 1}`,
    status: statuses[i] || `status-${i}`,
  }));
};

// Create mock steps with icons
export const createMockStepsWithIcons = (count: number = 4): MockStep[] => {
  return createMockSteps(count).map((step, index) => ({
    ...step,
    icon: <span data-testid={`step-icon-${index}`}>Icon{index}</span>,
  }));
};

// Default props helper for Stepper component
export const createDefaultStepperProps = () => ({
  activeStep: 1,
  steps: createMockSteps(4),
});

// Color config for testing
export const mockColorConfig = {
  completed: '#00ff00',
  active: '#0000ff',
  pending: '#888888',
};

// Custom class names for testing
export const mockClassNames = {
  container: 'custom-container',
  stepperMain: 'custom-stepper-main',
  stepItem: 'custom-step-item',
  stepItemLimited: 'custom-step-limited',
  connectorLine: 'custom-connector',
  stepCircle: 'custom-step-circle',
  stepCircleInner: 'custom-step-circle-inner',
  stepLabel: 'custom-step-label',
  mobileStatus: 'custom-mobile-status',
  mobileStatusLabel: 'custom-mobile-label',
  mobileStatusSpan: 'custom-mobile-span',
};
