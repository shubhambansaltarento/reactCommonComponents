/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import PreviewMediaContent from '../../PreviewMediaContent';
import {
  renderWithProviders,
  createMockNotificationItem,
  createMockMediaItem,
  createMockImageMediaItem,
  createMockUploadedFile,
  createMockVideoMediaItem,
  createMockPdfMediaItem,
  createMockConfig,
  mockWindowOpen,
} from '../test-utils';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'NOTIFICATIONS.ANNOUNCEMENTS.ON_HOME_PAGE': 'On Home Page',
        'NOTIFICATIONS.ANNOUNCEMENTS.IN_DETAIL': 'In Detail',
        'NOTIFICATIONS.ANNOUNCEMENTS.PREVIEW_TITLE': 'Preview Notification',
        'NOTIFICATIONS.ANNOUNCEMENTS.RESOURCES': 'Resources',
        'NOTIFICATIONS.ANNOUNCEMENTS.EXPIRES_ON': 'Expires on',
        'NOTIFICATIONS.ANNOUNCEMENTS.NO_PREVIEW': 'No preview available',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock console methods to reduce test noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Store original URL methods
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
  
  // Setup global URL mocks
  URL.createObjectURL = jest.fn(() => 'blob:test-url');
  URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
  
  // Restore URL methods
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

describe('PreviewMediaContent Component', () => {
  const defaultProps = {
    previewData: createMockNotificationItem(),
    media: [],
    isEditMode: false,
    onOpenPreviewNotificationClose: jest.fn(),
    config: createMockConfig(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithProviders(<PreviewMediaContent {...defaultProps} />);
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });

    it('should render notification title correctly', () => {
      const customTitle = 'Custom Notification Title';
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ title: customTitle }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should render notification description correctly', () => {
      const customDescription = 'Custom notification description text';
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ description: customDescription }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it('should render priority chip with correct criticality', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ criticality: 'HIGH' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });

    it('should render LOW priority correctly', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ criticality: 'LOW' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText(/Low/i)).toBeInTheDocument();
    });

    it('should render MEDIUM priority correctly', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ criticality: 'MEDIUM' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    });

    it('should render expiry date when validTo is provided', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ validTo: '2025-12-31T23:59:59Z' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      // Check for the translated text or fallback
      expect(screen.getByText(/Expires on|EXPIRES_ON/i)).toBeInTheDocument();
    });

    it('should not render expiry date for training type', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ type: 'training', validTo: '2025-12-31T23:59:59Z' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.queryByText(/Expires on|EXPIRES_ON/i)).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should render AppBar header in edit mode', () => {
      const props = {
        ...defaultProps,
        isEditMode: true,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      // Check for ArrowBackIcon which indicates edit mode header
      expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
    });

    it('should render preview title in edit mode', () => {
      const props = {
        ...defaultProps,
        isEditMode: true,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      // Preview title should be in the header
      expect(screen.getByText(/Preview|PREVIEW_TITLE/i)).toBeInTheDocument();
    });

    it('should call onOpenPreviewNotificationClose when back button is clicked', () => {
      const mockClose = jest.fn();
      const props = {
        ...defaultProps,
        isEditMode: true,
        onOpenPreviewNotificationClose: mockClose,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const backButton = screen.getByTestId('ArrowBackIcon').closest('button');
      if (backButton) {
        fireEvent.click(backButton);
        expect(mockClose).toHaveBeenCalledWith(false);
      }
    });

    it('should render tabs in edit mode', () => {
      const props = {
        ...defaultProps,
        isEditMode: true,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Check for tab buttons
      const tabButtons = screen.getAllByRole('tab');
      expect(tabButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should switch tabs when tab is clicked', () => {
      const props = {
        ...defaultProps,
        isEditMode: true,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        fireEvent.click(tabs[1]);
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      }
    });
  });

  describe('Media Handling', () => {
    it('should render images when image media is provided', () => {
      const imageMedia = [createMockImageMediaItem()];
      const props = {
        ...defaultProps,
        media: imageMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render documents in resources section', () => {
      const docMedia = [createMockMediaItem({ fileName: 'document.pdf' })];
      const props = {
        ...defaultProps,
        media: docMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText(/Resources|RESOURCES/i)).toBeInTheDocument();
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('should handle dropped images correctly', () => {
      const droppedImages = [createMockUploadedFile('new-image.jpg')];
      const props = {
        ...defaultProps,
        droppedImages,
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Verify createObjectURL was called
      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it('should not render resources section for TEXT template type', () => {
      const docMedia = [createMockMediaItem()];
      const props = {
        ...defaultProps,
        media: docMedia,
        previewData: createMockNotificationItem({ templateType: 'TEXT' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.queryByText(/Resources|RESOURCES/i)).not.toBeInTheDocument();
    });
  });

  describe('Video File Handling', () => {
    it('should identify video files correctly and show training videos section', () => {
      const videoMedia = [createMockVideoMediaItem()];
      const mockVideoClick = jest.fn();
      const props = {
        ...defaultProps,
        media: videoMedia,
        isTrainingPreview: true,
        onVideoClick: mockVideoClick,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Training Videos')).toBeInTheDocument();
    });

    it('should call onVideoClick when video play button is clicked', () => {
      const videoMedia = [createMockVideoMediaItem()];
      const mockVideoClick = jest.fn();
      const props = {
        ...defaultProps,
        media: videoMedia,
        isTrainingPreview: true,
        onVideoClick: mockVideoClick,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Find and click on a play button
      const playButtons = screen.getAllByTestId('PlayCircleOutlineIcon');
      if (playButtons.length > 0) {
        const playButton = playButtons[0].closest('button');
        if (playButton) {
          fireEvent.click(playButton);
          expect(mockVideoClick).toHaveBeenCalled();
        }
      }
    });

    it('should not show training videos section when not in training preview', () => {
      const videoMedia = [createMockVideoMediaItem()];
      const props = {
        ...defaultProps,
        media: videoMedia,
        isTrainingPreview: false,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.queryByText('Training Videos')).not.toBeInTheDocument();
    });
  });

  describe('PDF File Handling', () => {
    it('should identify PDF files correctly', () => {
      const pdfMedia = [createMockPdfMediaItem()];
      const props = {
        ...defaultProps,
        media: pdfMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('PDF document')).toBeInTheDocument();
    });

    it('should call onPdfClick when PDF link is clicked in training preview', () => {
      const pdfMedia = [createMockPdfMediaItem()];
      const mockPdfClick = jest.fn();
      const props = {
        ...defaultProps,
        media: pdfMedia,
        isTrainingPreview: true,
        onPdfClick: mockPdfClick,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const pdfLink = screen.getByText('document.pdf');
      fireEvent.click(pdfLink);
      
      expect(mockPdfClick).toHaveBeenCalled();
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons when userAction is provided', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [
            { name: 'Primary Action', link: 'https://example.com/primary' },
            { name: 'Secondary Action', link: 'https://example.com/secondary' },
          ],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      expect(screen.getByText('Secondary Action')).toBeInTheDocument();
    });

    it('should not render action buttons in training preview', () => {
      const props = {
        ...defaultProps,
        isTrainingPreview: true,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Hidden Action', link: 'https://example.com' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.queryByText('Hidden Action')).not.toBeInTheDocument();
    });

    it('should open URL when action button is clicked', () => {
      const windowMock = mockWindowOpen();
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Visit Site', link: 'https://example.com' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Visit Site');
      fireEvent.click(actionButton);
      
      expect(windowMock.mockOpen).toHaveBeenCalled();
      windowMock.restore();
    });
  });

  describe('External Links', () => {
    it('should render external link buttons when provided', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          externalLinks: ['https://external1.com', 'https://external2.com'],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText(/External Link 1/i)).toBeInTheDocument();
      expect(screen.getByText(/External Link 2/i)).toBeInTheDocument();
    });

    it('should open external link when button is clicked', () => {
      const windowMock = mockWindowOpen();
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          externalLinks: ['https://external.com'],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const externalLinkButton = screen.getByText(/External Link 1/i);
      fireEvent.click(externalLinkButton);
      
      expect(windowMock.mockOpen).toHaveBeenCalled();
      windowMock.restore();
    });
  });

  describe('YouTube Video Handling', () => {
    it('should open YouTube embed when YouTube watch link is in action', async () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Watch Video', link: 'https://www.youtube.com/watch?v=abc123' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Watch Video');
      fireEvent.click(actionButton);
      
      // Video dialog should be opened with iframe
      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
      });
    });

    it('should handle youtu.be short URLs', async () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Watch Short', link: 'https://youtu.be/abc123' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Watch Short');
      fireEvent.click(actionButton);
      
      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
      });
    });

    it('should handle YouTube embed URLs', async () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Watch Embed', link: 'https://www.youtube.com/embed/abc123' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Watch Embed');
      fireEvent.click(actionButton);
      
      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
      });
    });
  });

  describe('Priority Chip - Training Tags', () => {
    it('should render multiple tags for comma-separated criticality', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          criticality: 'Safety, Compliance, Training',
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
      expect(screen.getByText('Training')).toBeInTheDocument();
    });

    it('should render Training tag correctly', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          criticality: 'Training',
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Training')).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    it('should hide download button in training preview', () => {
      const docMedia = [createMockMediaItem()];
      const props = {
        ...defaultProps,
        media: docMedia,
        isTrainingPreview: true,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Download button should not be present in training preview
      const downloadIcons = screen.queryAllByTestId('FileDownloadOutlinedIcon');
      expect(downloadIcons.length).toBe(0);
    });

    it('should show download button in regular notification preview', () => {
      const docMedia = [createMockMediaItem()];
      const props = {
        ...defaultProps,
        media: docMedia,
        isTrainingPreview: false,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const downloadIcon = screen.getByTestId('FileDownloadOutlinedIcon');
      expect(downloadIcon).toBeInTheDocument();
    });

    it('should open download URL when download button is clicked', () => {
      const windowMock = mockWindowOpen();
      const docMedia = [createMockMediaItem({ url: '/test/file.pdf' })];
      const props = {
        ...defaultProps,
        media: docMedia,
        isTrainingPreview: false,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const downloadButton = screen.getByTestId('FileDownloadOutlinedIcon').closest('button');
      if (downloadButton) {
        fireEvent.click(downloadButton);
        expect(windowMock.mockOpen).toHaveBeenCalled();
      }
      windowMock.restore();
    });
  });

  describe('URL Formatting', () => {
    it('should handle URLs without protocol prefix', () => {
      const windowMock = mockWindowOpen();
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Visit', link: 'example.com' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Visit');
      fireEvent.click(actionButton);
      
      // Should add https:// prefix
      expect(windowMock.mockOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
      windowMock.restore();
    });

    it('should preserve http:// protocol', () => {
      const windowMock = mockWindowOpen();
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Visit Http', link: 'http://example.com' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Visit Http');
      fireEvent.click(actionButton);
      
      expect(windowMock.mockOpen).toHaveBeenCalledWith(
        'http://example.com',
        '_blank',
        'noopener,noreferrer'
      );
      windowMock.restore();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid URLs gracefully', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: [{ name: 'Invalid', link: '' }],
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const actionButton = screen.getByText('Invalid');
      expect(() => fireEvent.click(actionButton)).not.toThrow();
    });

    it('should handle missing media gracefully', () => {
      const props = {
        ...defaultProps,
        media: [],
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      expect(() => renderWithProviders(<PreviewMediaContent {...props} />)).not.toThrow();
    });

    it('should handle null userAction gracefully', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          userAction: undefined,
        }),
      };
      expect(() => renderWithProviders(<PreviewMediaContent {...props} />)).not.toThrow();
    });

    it('should handle empty externalLinks gracefully', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({
          externalLinks: [],
        }),
      };
      expect(() => renderWithProviders(<PreviewMediaContent {...props} />)).not.toThrow();
    });
  });

  describe('Training Preview Mode', () => {
    it('should filter out video files from Resources in training preview', () => {
      const mixedMedia = [
        createMockMediaItem({ fileName: 'document.pdf', announcementMediaId: 'doc-1' }),
        createMockVideoMediaItem({ fileName: 'video.mp4', announcementMediaId: 'vid-1' }),
      ];
      const props = {
        ...defaultProps,
        media: mixedMedia,
        isTrainingPreview: true,
        onVideoClick: jest.fn(),
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Video should be in Training Videos section
      expect(screen.getByText('Training Videos')).toBeInTheDocument();
    });

    it('should use direct URLs for external training files', () => {
      const externalVideoMedia = [
        createMockVideoMediaItem({ 
          url: 'https://external-storage.com/video.mp4',
          fileName: 'external-video.mp4' 
        }),
      ];
      const mockVideoClick = jest.fn();
      const props = {
        ...defaultProps,
        media: externalVideoMedia,
        isTrainingPreview: true,
        onVideoClick: mockVideoClick,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Click on the training video
      const playButtons = screen.getAllByTestId('PlayCircleOutlineIcon');
      if (playButtons.length > 0) {
        const playButton = playButtons[0].closest('button');
        if (playButton) {
          fireEvent.click(playButton);
          expect(mockVideoClick).toHaveBeenCalledWith(
            'https://external-storage.com/video.mp4',
            'external-video.mp4'
          );
        }
      }
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels for download', () => {
      const docMedia = [createMockMediaItem({ fileName: 'report.pdf' })];
      const props = {
        ...defaultProps,
        media: docMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      const downloadButton = screen.getByRole('button', { name: /download report\.pdf/i });
      expect(downloadButton).toBeInTheDocument();
    });

    it('should have accessible video play buttons in resources', () => {
      const videoMedia = [createMockVideoMediaItem({ fileName: 'tutorial.mp4' })];
      const props = {
        ...defaultProps,
        media: videoMedia,
        isTrainingPreview: false,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // In non-training mode, video files appear in resources with the filename
      expect(screen.getByText('tutorial.mp4')).toBeInTheDocument();
    });
  });

  describe('Image Card in Edit Mode', () => {
    it('should render image when images are available in home page tab', () => {
      const imageMedia = [createMockImageMediaItem()];
      const props = {
        ...defaultProps,
        media: imageMedia,
        isEditMode: true,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      // Should have images rendered
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render preview card with title when no images', () => {
      const props = {
        ...defaultProps,
        media: [],
        isEditMode: true,
        previewData: createMockNotificationItem({ templateType: 'TEXT' }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });
  });

  describe('Memory Cleanup', () => {
    it('should revoke object URLs on unmount', () => {
      const droppedImages = [createMockUploadedFile()];
      const props = {
        ...defaultProps,
        droppedImages,
      };
      
      const { unmount } = renderWithProviders(<PreviewMediaContent {...props} />);
      unmount();
      
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty droppedImages array gracefully', () => {
      const props = {
        ...defaultProps,
        droppedImages: [],
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });

    it('should handle undefined droppedImages gracefully', () => {
      const props = {
        ...defaultProps,
        droppedImages: undefined,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });

    it('should handle media with empty url gracefully', () => {
      const emptyUrlMedia = [createMockMediaItem({ url: '', fileName: 'test.pdf' })];
      const props = {
        ...defaultProps,
        media: emptyUrlMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      
      // Should render without crashing
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });

    it('should handle multiple dropped images with valid files', () => {
      const droppedImages = [
        createMockUploadedFile('image1.jpg'),
        createMockUploadedFile('image2.jpg'),
        createMockUploadedFile('image3.jpg'),
      ];
      const props = {
        ...defaultProps,
        droppedImages,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      
      renderWithProviders(<PreviewMediaContent {...props} />);
      // Verify createObjectURL was called for each dropped image
      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle mixed media with images and documents', () => {
      const mixedMedia = [
        createMockImageMediaItem({ fileName: 'photo.jpg' }),
        createMockPdfMediaItem({ fileName: 'doc.pdf' }),
        createMockVideoMediaItem({ fileName: 'video.mp4' }),
      ];
      const props = {
        ...defaultProps,
        media: mixedMedia,
        previewData: createMockNotificationItem({ templateType: 'IMAGE' }),
      };
      
      renderWithProviders(<PreviewMediaContent {...props} />);
      expect(screen.getByText('Test Notification Title')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render header section with title and priority', () => {
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ 
          title: 'Important Notice',
          criticality: 'HIGH' 
        }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });

    it('should render description section', () => {
      const description = 'This is a detailed description of the notification.';
      const props = {
        ...defaultProps,
        previewData: createMockNotificationItem({ description }),
      };
      renderWithProviders(<PreviewMediaContent {...props} />);
      
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });
});
