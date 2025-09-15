/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';

// Mock console to suppress logs during tests
export const mockConsole = () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
};

// Restore console
export const restoreConsole = () => {
  jest.restoreAllMocks();
};

// Mock translation function
export const mockTranslation = (key: string) => key;

// Create mock headers for file utils
export const createMockHeaders = () => [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Status', key: 'status' },
];

// Create mock headers with required fields
export const createMockHeadersWithRequired = () => [
  { label: 'Name', key: 'name', required: true },
  { label: 'Email', key: 'email', required: true },
  { label: 'Status', key: 'status' },
];

// Create mock rows for file utils
export const createMockRows = () => [
  { name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
];

// Create mock rows with special characters
export const createMockRowsWithSpecialChars = () => [
  { name: 'John, Doe', email: 'john@example.com', status: 'Active' },
  { name: 'Jane "Smith"', email: 'jane@example.com', status: 'Pending\nReview' },
];

// Mock data for options formatter
export const createMockOptionsData = () => [
  { id: '1', name: 'Option A', code: 'A' },
  { id: '2', name: 'Option B', code: 'B' },
  { id: '3', name: 'Option C', code: 'C' },
];

// Mock permissions array
export const createMockPermissions = () => [
  'view_claims',
  'create_claims',
  'view_dashboard',
];

// Timezone constants for testing
export const TEST_TIMEZONES = {
  UTC: 'UTC',
  IST: 'Asia/Kolkata',
  EST: 'America/New_York',
  GMT: 'Europe/London',
};

// Fixed test dates
export const TEST_DATES = {
  VALID_ISO: '2025-07-18T10:45:00Z',
  VALID_ISO_2: '2025-07-20T14:30:00Z',
  INVALID: 'invalid-date',
  EMPTY: '',
};
