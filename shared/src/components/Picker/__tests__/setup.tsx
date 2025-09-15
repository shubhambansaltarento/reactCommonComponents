import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomOption, PickerType } from '../types';

// Mock CSS modules
jest.mock('../Picker.module.css', () => ({
  picker_container: 'picker_container',
  picker_title: 'picker_title',
  date_picker_form_control: 'date_picker_form_control',
  date_picker_input: 'date_picker_input',
  custom_select_form_control: 'custom_select_form_control',
  select_input: 'select_input',
}));

// Custom render wrapper
interface WrapperProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<WrapperProps> = ({ children }) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock custom options for testing
export const mockCustomOptions: CustomOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

export const mockEmptyOptions: CustomOption[] = [];

export const mockSingleOption: CustomOption[] = [
  { label: 'Single Option', value: 'single' },
];

export const mockManyOptions: CustomOption[] = Array.from({ length: 20 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `option${i + 1}`,
}));

// Default props for DateCustomPicker
export const defaultPickerProps = {
  type: 'date' as PickerType,
  date: null as Date | null,
  onDateChange: jest.fn(),
  Label: 'Test Label',
};

// Props for date picker
export const datePickerProps = {
  type: 'date' as PickerType,
  date: new Date('2024-01-15'),
  onDateChange: jest.fn(),
  Label: 'Date Picker',
};

// Props for datetime picker
export const dateTimePickerProps = {
  type: 'datetime' as PickerType,
  date: new Date('2024-01-15T10:30:00'),
  onDateChange: jest.fn(),
  Label: 'DateTime Picker',
};

// Props for custom select
export const customSelectProps = {
  type: 'custom' as PickerType,
  customValue: 'option1',
  onCustomChange: jest.fn(),
  customOptions: mockCustomOptions,
  Label: 'Custom Select',
};

// Styling props for testing
export const stylingProps = {
  className: 'test-class',
  containerClassName: 'test-container',
  formControlClassName: 'test-form-control',
  titleClassName: 'test-title',
  height: 40,
  width: 200,
  borderRadius: 8,
  containerStyle: { padding: '10px' },
  titleStyle: { fontWeight: 'bold' as const },
  inputSx: { backgroundColor: '#f5f5f5' },
  formControlStyle: { margin: '5px' },
};

// Helper to create mock date change handler
export const createDateChangeHandler = () => {
  const handler = jest.fn();
  return {
    handler,
    getLastCall: () => handler.mock.calls.at(-1)?.[0],
    reset: () => handler.mockClear(),
  };
};

// Helper to create mock custom change handler  
export const createCustomChangeHandler = () => {
  const handler = jest.fn();
  return {
    handler,
    getLastCallValue: () => handler.mock.calls.at(-1)?.[0],
    reset: () => handler.mockClear(),
  };
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };
