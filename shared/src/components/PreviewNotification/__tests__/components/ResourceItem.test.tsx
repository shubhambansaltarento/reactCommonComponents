import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceItem from '../../components/ResourceItem';
import { MediaItem, PreviewNotificationConfig } from '../../PreviewNotification.interface';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('ResourceItem', () => {
  const mockConfig: PreviewNotificationConfig = {
    basePath: '/app',
    apiBaseUrl: 'https://api.example.com',
    viewFileApi: '/api/files/view',
    downloadFileApi: '/api/files/download',
  };

  const mockOnDownload = jest.fn();
  const mockOnVideoClick = jest.fn();
  const mockOnPdfClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockFile = (overrides: Partial<MediaItem> = {}): MediaItem => ({
    announcementMediaId: 'media-1',
    announcementId: 'ann-1',
    fileName: 'document.pdf',
    url: '/files/document.pdf',
    mediaType: 'DOC',
    ...overrides,
  });

  describe('Rendering', () => {
    it('should render file name', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'report.pdf' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.getByText('report.pdf')).toBeInTheDocument();
    });

    it('should render "Unnamed file" when fileName is empty', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: '' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.getByText('Unnamed file')).toBeInTheDocument();
    });

    it('should show "Video file" caption for video files', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.getByText('Video file')).toBeInTheDocument();
    });

    it('should show "PDF document" caption for PDF files', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.pdf' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.getByText('PDF document')).toBeInTheDocument();
    });

    it('should render download button for non-training preview', () => {
      render(
        <ResourceItem
          file={createMockFile()}
          onDownload={mockOnDownload}
          config={mockConfig}
          isTrainingPreview={false}
        />
      );

      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    it('should hide download button for training preview', () => {
      render(
        <ResourceItem
          file={createMockFile()}
          onDownload={mockOnDownload}
          config={mockConfig}
          isTrainingPreview={true}
        />
      );

      expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
    });
  });

  describe('Video handling', () => {
    it('should show play button for video files when onVideoClick is provided', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4' })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          config={mockConfig}
        />
      );

      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
    });

    it('should not show play button when onVideoClick is not provided', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.queryByRole('button', { name: /play video/i })).not.toBeInTheDocument();
    });

    it('should call onVideoClick when play button is clicked', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4', url: '/videos/test.mp4' })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /play video/i }));
      expect(mockOnVideoClick).toHaveBeenCalledWith(
        expect.any(String),
        'video.mp4'
      );
    });

    it('should call onVideoClick when video link is clicked', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4', url: '/videos/test.mp4' })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByText('video.mp4'));
      expect(mockOnVideoClick).toHaveBeenCalledWith(
        expect.any(String),
        'video.mp4'
      );
    });
  });

  describe('PDF handling', () => {
    it('should call onPdfClick when PDF link is clicked', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.pdf', url: '/docs/test.pdf' })}
          onDownload={mockOnDownload}
          onPdfClick={mockOnPdfClick}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByText('document.pdf'));
      expect(mockOnPdfClick).toHaveBeenCalledWith(
        expect.any(String),
        'document.pdf'
      );
    });
  });

  describe('Download handling', () => {
    it('should call onDownload when download button is clicked', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.pdf', url: '/docs/test.pdf' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /download/i }));
      expect(mockOnDownload).toHaveBeenCalled();
    });
  });

  describe('Link click handling', () => {
    it('should open file in new window when clicked (non-video, non-pdf)', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.docx', url: '/docs/test.docx' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByText('document.docx'));
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/api/file'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should use direct URL for training preview with absolute URL', () => {
      render(
        <ResourceItem
          file={createMockFile({ 
            fileName: 'document.docx', 
            url: 'https://external.com/file.docx' 
          })}
          onDownload={mockOnDownload}
          isTrainingPreview={true}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByText('document.docx'));
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://external.com/file.docx',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('URL building', () => {
    it('should build correct view URL for regular preview', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'video.mp4', url: '/files/video.mp4' })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          isTrainingPreview={false}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /play video/i }));
      expect(mockOnVideoClick).toHaveBeenCalledWith(
        'https://api.example.com/api/files/view/files/video.mp4',
        'video.mp4'
      );
    });

    it('should use direct URL for training preview with absolute URL', () => {
      render(
        <ResourceItem
          file={createMockFile({ 
            fileName: 'video.mp4', 
            url: 'https://cdn.example.com/video.mp4' 
          })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          isTrainingPreview={true}
          config={mockConfig}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /play video/i }));
      expect(mockOnVideoClick).toHaveBeenCalledWith(
        'https://cdn.example.com/video.mp4',
        'video.mp4'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for download button', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'report.pdf' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      expect(screen.getByRole('button', { name: 'Download report.pdf' })).toBeInTheDocument();
    });

    it('should have accessible label for play button', () => {
      render(
        <ResourceItem
          file={createMockFile({ fileName: 'tutorial.mp4' })}
          onDownload={mockOnDownload}
          onVideoClick={mockOnVideoClick}
          config={mockConfig}
        />
      );

      expect(screen.getByRole('button', { name: 'Play video tutorial.mp4' })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle window.open error gracefully when clicking file link', () => {
      // Mock window.open to throw an error
      const originalOpen = window.open;
      window.open = jest.fn(() => {
        throw new Error('Failed to open window');
      });

      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.docx', url: '/docs/test.docx' })}
          onDownload={mockOnDownload}
          config={mockConfig}
        />
      );

      // Should not throw
      fireEvent.click(screen.getByText('document.docx'));
      expect(console.error).toHaveBeenCalledWith('Error opening file link:', expect.any(Error));

      // Restore
      window.open = originalOpen;
    });

    it('should handle onDownload error gracefully', () => {
      const mockErrorDownload = jest.fn(() => {
        throw new Error('Download failed');
      });

      render(
        <ResourceItem
          file={createMockFile({ fileName: 'document.pdf' })}
          onDownload={mockErrorDownload}
          config={mockConfig}
        />
      );

      // Should not throw
      fireEvent.click(screen.getByRole('button', { name: /download/i }));
      expect(console.error).toHaveBeenCalledWith('Error downloading file:', expect.any(Error));
    });
  });
});
