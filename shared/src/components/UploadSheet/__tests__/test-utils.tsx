/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UploadSheetProps, UploadConfig, DownloadTemplateConfig } from '../index';
import { UploadProps, UploadResult } from '../components/Upload';
import { DownloadProps } from '../components/DownloadTemplate';

// Custom render function
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Mock file factory
export const createMockFile = (
  name = 'test.xlsx',
  size = 1024,
  type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock upload result factory
export const createSuccessResult = (): UploadResult => ({
  status: 'SUCCESS',
  data: {
    summary: { errorCount: 0 },
    headers: ['col1', 'col2'],
    parsedLines: [{ col1: 'value1', col2: 'value2' }]
  }
});

export const createErrorResult = (errorCode = 'VALIDATION_ERROR'): UploadResult => ({
  status: 'ERROR',
  errors: [{ code: errorCode }],
  data: {
    summary: { errorCount: 2 },
    headers: ['col1', 'col2'],
    parsedLines: [{ col1: 'value1', col2: 'value2' }]
  }
});

export const createErrorResultWithoutDownload = (): UploadResult => ({
  status: 'ERROR',
  errors: [{ code: 'GENERIC_ERROR' }]
});

// Default props factory for UploadSheet
export const createUploadSheetProps = (overrides: Partial<UploadSheetProps> = {}): UploadSheetProps => ({
  endPoint: '/api/upload',
  uploadFile: jest.fn().mockResolvedValue(createSuccessResult()),
  onUploadSuccess: jest.fn(),
  onUploadError: jest.fn(),
  onDownloadCTA: jest.fn(),
  onClose: jest.fn(),
  additionalFormData: { key: 'value' },
  downloadErrorSheet: jest.fn(),
  ...overrides,
});

// Default props factory for Upload component
export const createUploadProps = (overrides: Partial<UploadProps> = {}): UploadProps => ({
  endPoint: '/api/upload',
  uploadFile: jest.fn().mockResolvedValue(createSuccessResult()),
  onUploadSuccess: jest.fn(),
  onUploadError: jest.fn(),
  additionalFormData: { key: 'value' },
  downloadErrorSheet: jest.fn(),
  onFileSelect: jest.fn(),
  onUploadingChange: jest.fn(),
  ...overrides,
});

// Default props factory for DownloadTemplate component
export const createDownloadTemplateProps = (overrides: Partial<DownloadProps> = {}): DownloadProps => ({
  onCTAClick: jest.fn(),
  ...overrides,
});

// Default upload config
export const defaultUploadConfig: UploadConfig = {
  title: 'Upload Excel',
  chooseFileText: 'Choose File',
  acceptedFileTypes: '.csv,.xlsx,.xls',
  maxFileSize: '25 MB',
  supportedFormatsText: 'Supported file types: CSV, XLSX',
  maxSizeText: 'Maximum size: 25 MB',
  successMessage: 'File uploaded successfully!',
  errorMessages: {
    upload: 'Upload failed',
    partialError: 'There are some errors with your upload.',
    unknown: 'Unknown error occurred'
  },
  downloadButtonLabel: 'Download Excel'
};

// Default download config
export const defaultDownloadConfig: DownloadTemplateConfig = {
  templateSectionTitle: 'Template',
  templateDescription: 'You can download the template',
  downloadButtonLabel: 'Download Template'
};

// Re-export testing utilities
export * from '@testing-library/react';
