import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithProviders,
  createUploadProps,
  defaultUploadConfig,
  createSuccessResult,
  createErrorResult,
  createMockFile,
  createErrorResultWithoutDownload,
} from '../test-utils';
import Upload from '../../components/Upload';

describe('Upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      expect(container).toBeInTheDocument();
    });

    it('should render with custom config', () => {
      const customConfig = {
        title: 'Custom Upload Title',
        chooseFileText: 'Select a file',
      };
      const { getByText } = renderWithProviders(
        <Upload {...createUploadProps({ config: customConfig })} />
      );
      expect(getByText('Select a file')).toBeInTheDocument();
    });

    it('should render Choose File button by default', () => {
      const { getByText } = renderWithProviders(<Upload {...createUploadProps()} />);
      expect(getByText('Choose File')).toBeInTheDocument();
    });

    it('should render file input element', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should render supported formats text', () => {
      const { getByText } = renderWithProviders(<Upload {...createUploadProps()} />);
      expect(getByText(/Supported file types/i)).toBeInTheDocument();
    });

    it('should render max size text', () => {
      const { getByText } = renderWithProviders(<Upload {...createUploadProps()} />);
      expect(getByText(/Maximum size/i)).toBeInTheDocument();
    });

    it('should render Excel icon', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const excelIcon = container.querySelector('svg');
      expect(excelIcon).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should accept valid file when selected via input', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx', 1024);

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const selectedText = container.querySelector('.selectedFileName');
        expect(selectedText?.textContent).toContain('test.xlsx');
      });
    });

    it('should show file size when file is selected', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx', 1024 * 1024); // 1MB

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const sizeText = container.querySelectorAll('.selectedFileName')[1];
        expect(sizeText?.textContent).toContain('MB');
      });
    });

    it('should call onFileSelect when file is selected', async () => {
      const onFileSelect = jest.fn();
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ onFileSelect })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        expect(onFileSelect).toHaveBeenCalled();
      });
    });

    it('should reset state when new file is selected', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file1 = createMockFile('first.xlsx');
      const file2 = createMockFile('second.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file1] } });
      });

      await waitFor(() => {
        expect(container.querySelector('.selectedFileName')?.textContent).toContain('first.xlsx');
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file2] } });
      });

      await waitFor(() => {
        expect(container.querySelector('.selectedFileName')?.textContent).toContain('second.xlsx');
      });
    });
  });

  describe('Choose File Button', () => {
    it('should open file dialog when button is clicked', async () => {
      const { getByText, container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = jest.spyOn(fileInput, 'click');
      
      const chooseFileButton = getByText('Choose File');
      
      await act(async () => {
        fireEvent.click(chooseFileButton);
      });

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('Upload Functionality via triggerUpload', () => {
    it('should expose triggerUpload on window object', async () => {
      renderWithProviders(<Upload {...createUploadProps()} />);
      
      expect((globalThis as any).uploadComponent).toBeDefined();
      expect(typeof (globalThis as any).uploadComponent.triggerUpload).toBe('function');
    });

    it('should call uploadFile when triggerUpload is called with valid file', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(uploadFile).toHaveBeenCalled();
      });
    });

    it('should pass endpoint and FormData to uploadFile', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const endPoint = '/api/custom/upload';
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, endPoint })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(uploadFile).toHaveBeenCalledWith(endPoint, expect.any(FormData));
      });
    });

    it('should include additionalFormData in upload', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const additionalFormData = { customKey: 'customValue', anotherKey: 'anotherValue' };
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, additionalFormData })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(uploadFile).toHaveBeenCalled();
        const calledFormData = uploadFile.mock.calls[0][1] as FormData;
        expect(calledFormData.get('customKey')).toBe('customValue');
        expect(calledFormData.get('anotherKey')).toBe('anotherValue');
      });
    });

    it('should include file details in FormData', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        const calledFormData = uploadFile.mock.calls[0][1] as FormData;
        expect(calledFormData.get('file')).toBeTruthy();
        expect(calledFormData.get('fileName')).toBe('test.xlsx');
      });
    });
  });

  describe('Upload States', () => {
    it('should call onUploadingChange with true when upload starts', async () => {
      let resolveUpload: (value: unknown) => void;
      const uploadPromise = new Promise((resolve) => {
        resolveUpload = resolve;
      });
      const uploadFile = jest.fn().mockReturnValue(uploadPromise);
      const onUploadingChange = jest.fn();

      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, onUploadingChange })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      act(() => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(onUploadingChange).toHaveBeenCalledWith(true);
      });

      // Resolve the upload
      await act(async () => {
        resolveUpload!(createSuccessResult());
      });

      await waitFor(() => {
        expect(onUploadingChange).toHaveBeenCalledWith(false);
      });
    });

    it('should call onUploadSuccess after successful upload', async () => {
      const successResult = createSuccessResult();
      const uploadFile = jest.fn().mockResolvedValue(successResult);
      const onUploadSuccess = jest.fn();
      
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, onUploadSuccess })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(onUploadSuccess).toHaveBeenCalledWith(successResult);
      });
    });

    it('should show success message after successful upload', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        const successContainer = container.querySelector('.successContainer');
        expect(successContainer).toBeInTheDocument();
      });
    });

    it('should call onUploadError after failed upload', async () => {
      const uploadError = new Error('Upload failed');
      const uploadFile = jest.fn().mockRejectedValue(uploadError);
      const onUploadError = jest.fn();
      
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, onUploadError })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(onUploadError).toHaveBeenCalled();
      });
    });

    it('should show error message on upload failure', async () => {
      const uploadFile = jest.fn().mockRejectedValue(new Error('Upload failed'));
      
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        const errorContainer = container.querySelector('.errorContainer');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('should show error for partial error result with download button', async () => {
      const errorResult = createErrorResult();
      const uploadFile = jest.fn().mockResolvedValue(errorResult);
      
      const { container, getByText } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        const errorContainer = container.querySelector('.errorContainer');
        expect(errorContainer).toBeInTheDocument();
        // Download button should be visible for errors with downloadable data
        expect(getByText(defaultUploadConfig.downloadButtonLabel!)).toBeInTheDocument();
      });
    });

    it('should not show download button for error without downloadable data', async () => {
      const errorResult = createErrorResultWithoutDownload();
      const uploadFile = jest.fn().mockResolvedValue(errorResult);
      
      const { container, queryByText } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        const errorContainer = container.querySelector('.errorContainer');
        expect(errorContainer).toBeInTheDocument();
        // Download button should NOT be visible for errors without downloadable data
        expect(queryByText(defaultUploadConfig.downloadButtonLabel!)).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Sheet Download', () => {
    it('should call downloadErrorSheet when download button is clicked', async () => {
      const errorResult = createErrorResult();
      const uploadFile = jest.fn().mockResolvedValue(errorResult);
      const downloadErrorSheet = jest.fn();

      const { container, getByText } = renderWithProviders(
        <Upload 
          {...createUploadProps({ 
            uploadFile,
            downloadErrorSheet,
          })} 
        />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(getByText(defaultUploadConfig.downloadButtonLabel!)).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(getByText(defaultUploadConfig.downloadButtonLabel!));
      });

      expect(downloadErrorSheet).toHaveBeenCalledWith(errorResult);
    });
  });

  describe('Config Merging', () => {
    it('should merge partial config with defaults', () => {
      const partialConfig = { chooseFileText: 'Select File' };
      const { getByText } = renderWithProviders(
        <Upload {...createUploadProps({ config: partialConfig })} />
      );
      
      expect(getByText('Select File')).toBeInTheDocument();
      expect(getByText(/Supported file types/i)).toBeInTheDocument();
    });

    it('should handle empty config object', () => {
      const { getByText } = renderWithProviders(
        <Upload {...createUploadProps({ config: {} })} />
      );
      
      expect(getByText('Choose File')).toBeInTheDocument();
    });

    it('should handle undefined config', () => {
      const { getByText } = renderWithProviders(
        <Upload {...createUploadProps({ config: undefined })} />
      );
      
      expect(getByText('Choose File')).toBeInTheDocument();
    });

    it('should use custom success message', async () => {
      const customConfig = { successMessage: 'Custom success!' };
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      
      const { container } = renderWithProviders(
        <Upload {...createUploadProps({ uploadFile, config: customConfig })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      await waitFor(() => {
        expect(container.textContent).toContain('Custom success!');
      });
    });
  });

  describe('File Size Formatting', () => {
    it('should format bytes correctly', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const smallFile = createMockFile('small.xlsx', 500); // 500 bytes

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [smallFile] } });
      });

      await waitFor(() => {
        const sizeText = container.querySelectorAll('.selectedFileName')[1];
        expect(sizeText?.textContent).toContain('500 B');
      });
    });

    it('should format KB correctly', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const kbFile = createMockFile('medium.xlsx', 50 * 1024); // 50KB

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [kbFile] } });
      });

      await waitFor(() => {
        const sizeText = container.querySelectorAll('.selectedFileName')[1];
        expect(sizeText?.textContent).toContain('KB');
      });
    });

    it('should format MB correctly', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const mbFile = createMockFile('large.xlsx', 2 * 1024 * 1024); // 2MB

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mbFile] } });
      });

      await waitFor(() => {
        const sizeText = container.querySelectorAll('.selectedFileName')[1];
        expect(sizeText?.textContent).toContain('MB');
      });
    });

    it('should handle zero byte file', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const zeroFile = createMockFile('empty.xlsx', 0);

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [zeroFile] } });
      });

      await waitFor(() => {
        const sizeText = container.querySelectorAll('.selectedFileName')[1];
        expect(sizeText?.textContent).toContain('0 B');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible file input with id', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const fileInput = container.querySelector('input[type="file"]#file-input');
      expect(fileInput).toBeInTheDocument();
    });

    it('should have proper file type attribute', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput.getAttribute('accept')).toContain('.csv');
      expect(fileInput.getAttribute('accept')).toContain('.xlsx');
    });

    it('should render buttons with proper roles', () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file list', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [] } });
      });

      // Should not crash
      expect(container).toBeInTheDocument();
    });

    it('should handle null files', async () => {
      const { container } = renderWithProviders(<Upload {...createUploadProps()} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: null } });
      });

      // Should not crash
      expect(container).toBeInTheDocument();
    });

    it('should handle file with special characters in name', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const specialFile = createMockFile('file (1) - copy [2].xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [specialFile] } });
      });

      await waitFor(() => {
        const selectedText = container.querySelector('.selectedFileName');
        expect(selectedText?.textContent).toContain('file (1) - copy [2].xlsx');
      });
    });

    it('should not trigger upload when no file selected', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      renderWithProviders(<Upload {...createUploadProps({ uploadFile })} />);

      await act(async () => {
        (globalThis as any).uploadComponent.triggerUpload();
      });

      expect(uploadFile).not.toHaveBeenCalled();
    });

    it('should reset file input value after selection', async () => {
      const { container } = renderWithProviders(
        <Upload {...createUploadProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      // The input value should be reset (empty) to allow re-selecting the same file
      expect(fileInput.value).toBe('');
    });
  });
});
