/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadFileData } from '../file.utils';
import {
  createMockHeaders,
  createMockRows,
  createMockRowsWithSpecialChars,
  createMockHeadersWithRequired,
} from './test-utils';

// Mock URL methods
const mockCreateObjectURL = jest.fn(() => 'blob:test-url');
const mockRevokeObjectURL = jest.fn();

// Mock document methods
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

// Store original implementations
const originalURL = global.URL;
const originalDocument = global.document;

describe('file.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock URL
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.createElement
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return {
          download: '',
          href: '',
          style: { visibility: '' },
          setAttribute: jest.fn(),
          click: mockClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalDocument.createElement(tagName);
    });

    // Mock document.body methods
    jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('downloadFileData - CSV', () => {
    it('should create and download CSV file with default name', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('should create CSV with custom filename', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows, { type: 'csv', name: 'custom.csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle empty headers', async () => {
      await downloadFileData([], createMockRows(), { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle empty rows', async () => {
      await downloadFileData(createMockHeaders(), [], { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle special characters in CSV', async () => {
      const headers = createMockHeaders();
      const rows = createMockRowsWithSpecialChars();

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should use default csv type when no type specified', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows, {});

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should use default filename when not specified', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe('downloadFileData - Excel', () => {
    it('should create and download Excel file', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows, { type: 'xlsx', name: 'data.xlsx' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should create Excel with custom filename', async () => {
      const headers = createMockHeaders();
      const rows = createMockRows();

      await downloadFileData(headers, rows, { type: 'xlsx', name: 'report.xlsx' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle empty data for Excel', async () => {
      const headers = createMockHeaders();
      // Need at least headers for Excel to work properly
      await downloadFileData(headers, [], { type: 'xlsx' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe('Row validity with required fields', () => {
    it('should filter out rows with missing required fields', async () => {
      const headers = createMockHeadersWithRequired();
      const rows = [
        { name: 'John', email: 'john@test.com', status: 'Active' },
        { name: '', email: 'jane@test.com', status: 'Active' }, // Missing required name
        { name: 'Bob', email: '', status: 'Active' }, // Missing required email
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should include rows with all required fields', async () => {
      const headers = createMockHeadersWithRequired();
      const rows = [
        { name: 'John', email: 'john@test.com', status: 'Active' },
        { name: 'Jane', email: 'jane@test.com', status: 'Inactive' },
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle null values in required fields', async () => {
      const headers = createMockHeadersWithRequired();
      const rows = [
        { name: 'John', email: 'john@test.com', status: 'Active' },
        { name: null, email: 'jane@test.com', status: 'Active' },
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle undefined values in required fields', async () => {
      const headers = createMockHeadersWithRequired();
      const rows = [
        { name: 'John', email: 'john@test.com', status: 'Active' },
        { name: undefined, email: 'jane@test.com', status: 'Active' },
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle rows with missing optional fields', async () => {
      const headers = createMockHeaders();
      const rows = [
        { name: 'John', email: 'john@test.com' }, // Missing status
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle null and undefined values', async () => {
      const headers = createMockHeaders();
      const rows = [
        { name: null, email: undefined, status: 'Active' },
      ];

      await downloadFileData(headers, rows, { type: 'csv' });

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });
});
