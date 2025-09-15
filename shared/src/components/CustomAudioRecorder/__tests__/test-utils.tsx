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

// Mock useAudioRecorder hook return type
export interface MockAudioRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  startRecording: jest.Mock;
  stopRecording: jest.Mock;
  clearRecording: jest.Mock;
  error: string | null;
}

// Create default mock for useAudioRecorder
export const createMockAudioRecorder = (overrides: Partial<MockAudioRecorderReturn> = {}): MockAudioRecorderReturn => ({
  isRecording: false,
  recordingTime: 0,
  audioBlob: null,
  startRecording: jest.fn(),
  stopRecording: jest.fn(),
  clearRecording: jest.fn(),
  error: null,
  ...overrides,
});

// Default props helper for CustomAudioRecorder
export const createDefaultProps = (overrides: any = {}) => ({
  onRecordingComplete: jest.fn(),
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CustomAudioRecorder Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockAudioRecorder).toBeDefined();
    expect(createDefaultProps).toBeDefined();
  });
});
