import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithProviders,
  createUploadSheetProps,
  createSuccessResult,
  createErrorResult,
  createMockFile,
} from '../test-utils';
import { UploadSheet } from '../../index';

describe('UploadSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      expect(container).toBeInTheDocument();
    });

    it('should render as a dialog overlay', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const overlay = container.querySelector('[role="dialog"]');
      expect(overlay).toBeInTheDocument();
    });

    it('should render with aria-modal true', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const dialog = container.querySelector('[aria-modal="true"]');
      expect(dialog).toBeInTheDocument();
    });

    it('should render title from config', () => {
      const uploadConfig = { title: 'Custom Upload Title' };
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadConfig })} />
      );
      expect(getByText('Custom Upload Title')).toBeInTheDocument();
    });

    it('should render default title when no config provided', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const title = container.querySelector('#upload-sheet-title');
      expect(title?.textContent).toContain('Upload Excel');
    });

    it('should render close button', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const closeButton = container.querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render Upload component', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should render DownloadTemplate component', () => {
      const { getByText } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      expect(getByText(/Download Template/i)).toBeInTheDocument();
    });

    it('should render upload button', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
      const uploadButton = uploadButtonContainer?.querySelector('button');
      expect(uploadButton).toBeInTheDocument();
      expect(uploadButton?.textContent).toContain('Upload Excel');
    });

    it('should render custom upload button label', () => {
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadButtonLabel: 'Submit File' })} />
      );
      expect(getByText('Submit File')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const onClose = jest.fn();
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose })} />
      );
      
      const closeButton = container.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
      
      await act(async () => {
        fireEvent.click(closeButton);
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when overlay is clicked', async () => {
      const onClose = jest.fn();
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose })} />
      );
      
      const overlay = container.querySelector('.overlay') as HTMLElement;
      
      await act(async () => {
        fireEvent.click(overlay);
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('should not close when sheet content is clicked', async () => {
      const onClose = jest.fn();
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose })} />
      );
      
      const sheet = container.querySelector('.sheet') as HTMLElement;
      
      await act(async () => {
        fireEvent.click(sheet);
      });

      // onClose should not be called when clicking inside the sheet
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', async () => {
      const onClose = jest.fn();
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose })} />
      );
      
      const overlay = container.querySelector('[role="dialog"]') as HTMLElement;
      
      await act(async () => {
        fireEvent.keyDown(overlay, { key: 'Escape' });
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose for other keys', async () => {
      const onClose = jest.fn();
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose })} />
      );
      
      const overlay = container.querySelector('[role="dialog"]') as HTMLElement;
      
      await act(async () => {
        fireEvent.keyDown(overlay, { key: 'Enter' });
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Upload Button State', () => {
    it('should have upload button disabled when no file is selected', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
      const uploadButton = uploadButtonContainer?.querySelector('button');
      expect(uploadButton).toBeDisabled();
    });

    it('should enable upload button when file is selected', async () => {
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps()} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
        const uploadButton = uploadButtonContainer?.querySelector('button');
        expect(uploadButton).not.toBeDisabled();
      });
    });
  });

  describe('Upload Integration', () => {
    // Helper function to get upload button
    const getUploadButton = (container: HTMLElement) => {
      const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
      return uploadButtonContainer?.querySelector('button');
    };

    it('should trigger upload when upload button is clicked', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadFile })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const uploadButton = getUploadButton(container);
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = getUploadButton(container) as HTMLButtonElement;
      
      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        expect(uploadFile).toHaveBeenCalled();
      });
    });

    it('should call onUploadSuccess after successful upload', async () => {
      const successResult = createSuccessResult();
      const uploadFile = jest.fn().mockResolvedValue(successResult);
      const onUploadSuccess = jest.fn();
      
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadFile, onUploadSuccess })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const uploadButton = getUploadButton(container);
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = getUploadButton(container) as HTMLButtonElement;
      
      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        expect(onUploadSuccess).toHaveBeenCalledWith(successResult);
      });
    });

    it('should call onUploadError after failed upload', async () => {
      const uploadFile = jest.fn().mockRejectedValue(new Error('Upload failed'));
      const onUploadError = jest.fn();
      
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadFile, onUploadError })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const uploadButton = getUploadButton(container);
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = getUploadButton(container) as HTMLButtonElement;
      
      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        expect(onUploadError).toHaveBeenCalled();
      });
    });
  });

  describe('Download Template Integration', () => {
    it('should call onDownloadCTA when download button is clicked', async () => {
      const onDownloadCTA = jest.fn();
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onDownloadCTA })} />
      );
      
      const downloadButton = getByText('Download Template');
      
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      expect(onDownloadCTA).toHaveBeenCalled();
    });

    it('should pass downloadConfig to DownloadTemplate', () => {
      const downloadConfig = {
        templateSectionTitle: 'Custom Template Title',
        templateDescription: 'Custom description',
        downloadButtonLabel: 'Get Template',
      };
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ downloadConfig })} />
      );
      
      expect(getByText('Custom Template Title')).toBeInTheDocument();
      expect(getByText('Custom description')).toBeInTheDocument();
      expect(getByText('Get Template')).toBeInTheDocument();
    });
  });

  describe('Error Sheet Download', () => {
    it('should pass downloadErrorSheet to Upload component', async () => {
      const errorResult = createErrorResult();
      const uploadFile = jest.fn().mockResolvedValue(errorResult);
      const downloadErrorSheet = jest.fn();
      
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadFile, downloadErrorSheet })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      const getUploadButton = () => {
        const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
        return uploadButtonContainer?.querySelector('button');
      };

      await waitFor(() => {
        const uploadButton = getUploadButton();
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = getUploadButton() as HTMLButtonElement;
      
      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        // Error container should appear
        const errorButtons = container.querySelectorAll('button');
        expect(errorButtons.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct role on overlay', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it('should have aria-labelledby pointing to title', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const dialog = container.querySelector('[aria-labelledby="upload-sheet-title"]');
      expect(dialog).toBeInTheDocument();
    });

    it('should have tabIndex -1 on overlay for focus management', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const overlay = container.querySelector('[role="dialog"]');
      expect(overlay).toHaveAttribute('tabindex', '-1');
    });

    it('should render title with correct heading level', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const heading = container.querySelector('h2#upload-sheet-title');
      expect(heading).toBeInTheDocument();
    });

    it('should have close button with aria-label', () => {
      const { container } = renderWithProviders(<UploadSheet {...createUploadSheetProps()} />);
      const closeButton = container.querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Config Merging', () => {
    it('should pass uploadConfig to Upload component', () => {
      const uploadConfig = {
        chooseFileText: 'Select Your File',
        supportedFormatsText: 'Only XLSX files',
      };
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadConfig })} />
      );
      
      expect(getByText('Select Your File')).toBeInTheDocument();
      expect(getByText('Only XLSX files')).toBeInTheDocument();
    });

    it('should handle empty uploadConfig', () => {
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadConfig: {} })} />
      );
      
      // Default values should be used
      expect(getByText('Choose File')).toBeInTheDocument();
    });

    it('should handle empty downloadConfig', () => {
      const { getByText } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ downloadConfig: {} })} />
      );
      
      // Default values should be used
      expect(getByText('Download Template')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onClose gracefully', async () => {
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose: undefined })} />
      );
      
      const closeButton = container.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
      
      // Should not throw when clicking close without onClose handler
      await act(async () => {
        fireEvent.click(closeButton);
      });

      expect(container).toBeInTheDocument();
    });

    it('should handle undefined onClose for overlay click', async () => {
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose: undefined })} />
      );
      
      const overlay = container.querySelector('.overlay') as HTMLElement;
      
      // Should not throw when clicking overlay without onClose handler
      await act(async () => {
        fireEvent.click(overlay);
      });

      expect(container).toBeInTheDocument();
    });

    it('should handle undefined onClose for Escape key', async () => {
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ onClose: undefined })} />
      );
      
      const overlay = container.querySelector('[role="dialog"]') as HTMLElement;
      
      // Should not throw when pressing Escape without onClose handler
      await act(async () => {
        fireEvent.keyDown(overlay, { key: 'Escape' });
      });

      expect(container).toBeInTheDocument();
    });

    it('should handle upload click when no upload component is available', async () => {
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps()} />
      );
      
      // Manually set the button to not disabled for testing
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      // Clear the global reference
      (globalThis as any).uploadComponent = undefined;

      const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
      const uploadButton = uploadButtonContainer?.querySelector('button');
      
      // Should not throw
      await act(async () => {
        if (uploadButton) {
          fireEvent.click(uploadButton);
        }
      });

      expect(container).toBeInTheDocument();
    });

    it('should handle additionalFormData', async () => {
      const uploadFile = jest.fn().mockResolvedValue(createSuccessResult());
      const additionalFormData = { dealerId: '123', region: 'US' };
      
      const { container } = renderWithProviders(
        <UploadSheet {...createUploadSheetProps({ uploadFile, additionalFormData })} />
      );
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const validFile = createMockFile('test.xlsx');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      });

      await waitFor(() => {
        const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
        const uploadButton = uploadButtonContainer?.querySelector('button');
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButtonContainer = container.querySelector('.uploadButtonContainer');
      const uploadButton = uploadButtonContainer?.querySelector('button');

      await act(async () => {
        if (uploadButton) {
          fireEvent.click(uploadButton);
        }
      });

      await waitFor(() => {
        expect(uploadFile).toHaveBeenCalled();
        const calledFormData = uploadFile.mock.calls[0][1] as FormData;
        expect(calledFormData.get('dealerId')).toBe('123');
        expect(calledFormData.get('region')).toBe('US');
      });
    });
  });
});
