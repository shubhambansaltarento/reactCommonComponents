import { renderHook, act } from '@testing-library/react';
import { usePreviewNotification } from '../../hooks/usePreviewNotification';
import { NotificationItem, MediaItem, PreviewNotificationConfig } from '../../PreviewNotification.interface';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'NOTIFICATIONS.ANNOUNCEMENTS.ON_HOME_PAGE': 'On Home Page',
        'NOTIFICATIONS.ANNOUNCEMENTS.IN_DETAIL': 'In Detail',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:test-url');
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('usePreviewNotification', () => {
  const mockConfig: PreviewNotificationConfig = {
    basePath: '/app',
    apiBaseUrl: 'https://api.example.com',
    viewFileApi: '/api/files/view',
    downloadFileApi: '/api/files/download',
  };

  const createMockPreviewData = (overrides: Partial<NotificationItem> = {}): NotificationItem => ({
    announcementId: 'ann-1',
    title: 'Test Notification',
    description: 'Test Description',
    criticality: 'HIGH',
    type: 'announcement',
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    ...overrides,
  });

  const createMockMedia = (overrides: Partial<MediaItem> = {}): MediaItem => ({
    announcementMediaId: 'media-1',
    announcementId: 'ann-1',
    fileName: 'file.pdf',
    url: '/files/file.pdf',
    mediaType: 'DOC',
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      expect(result.current.tab).toBe(0);
      expect(result.current.previewImage).toBe('');
      expect(result.current.videoDialogOpen).toBe(false);
      expect(result.current.videoEmbedUrl).toBe('');
    });

    it('should return correct tab list', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      expect(result.current.tabList).toEqual([
        { label: 'On Home Page', value: 0 },
        { label: 'In Detail', value: 1 },
      ]);
    });
  });

  describe('Media filtering', () => {
    it('should filter images from media', () => {
      const media = [
        createMockMedia({ mediaType: 'IMAGE', fileName: 'image1.jpg' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc.pdf' }),
        createMockMedia({ mediaType: 'IMAGE', fileName: 'image2.png' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          config: mockConfig,
        })
      );

      expect(result.current.imageArray).toHaveLength(2);
      expect(result.current.imageArray[0].fileName).toBe('image1.jpg');
    });

    it('should filter documents from media', () => {
      const media = [
        createMockMedia({ mediaType: 'IMAGE', fileName: 'image1.jpg' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc.pdf' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc2.docx' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          config: mockConfig,
        })
      );

      expect(result.current.docsArray).toHaveLength(2);
      expect(result.current.docsArray[0].fileName).toBe('doc.pdf');
    });
  });

  describe('Priority style', () => {
    it('should return correct priority style for HIGH', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData({ criticality: 'HIGH' }),
          media: [],
          config: mockConfig,
        })
      );

      expect(result.current.priorityStyle).toEqual({
        bg: '#ffebee',
        text: '#f44336',
      });
    });

    it('should return correct priority style for LOW', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData({ criticality: 'LOW' }),
          media: [],
          config: mockConfig,
        })
      );

      expect(result.current.priorityStyle).toEqual({
        bg: '#e8f5e9',
        text: '#4caf50',
      });
    });

    it('should return correct priority style for MEDIUM', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData({ criticality: 'MEDIUM' }),
          media: [],
          config: mockConfig,
        })
      );

      expect(result.current.priorityStyle).toEqual({
        bg: '#fff3e0',
        text: '#ff9800',
      });
    });

    it('should use custom priority colors when provided', () => {
      const customColors = {
        HIGH: { bg: '#custom-bg', text: '#custom-text' },
      };

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData({ criticality: 'HIGH' }),
          media: [],
          config: mockConfig,
          priorityColors: customColors,
        })
      );

      expect(result.current.priorityStyle).toEqual({
        bg: '#custom-bg',
        text: '#custom-text',
      });
    });
  });

  describe('Tab handling', () => {
    it('should change tab on handleTabChange', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.handleTabChange({} as React.SyntheticEvent, 1);
      });

      expect(result.current.tab).toBe(1);
    });

    it('should handle string tab values', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.handleTabChange({} as React.SyntheticEvent, '1');
      });

      expect(result.current.tab).toBe(1);
    });
  });

  describe('handlePreviewClick', () => {
    it('should open YouTube video in dialog', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.handlePreviewClick('https://www.youtube.com/watch?v=abc123');
      });

      expect(result.current.videoDialogOpen).toBe(true);
      expect(result.current.videoEmbedUrl).toBe('https://www.youtube.com/embed/abc123?autoplay=1');
    });

    it('should open non-YouTube URLs in new window', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.handlePreviewClick('https://example.com');
      });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
      expect(result.current.videoDialogOpen).toBe(false);
    });

    it('should add https:// to URLs without protocol', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.handlePreviewClick('example.com');
      });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should handle empty URL', () => {
      const mockOnError = jest.fn();
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.handlePreviewClick('');
      });

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });

  describe('getVideoFiles', () => {
    it('should return empty array when not training preview', () => {
      const media = [
        createMockMedia({ mediaType: 'DOC', fileName: 'video.mp4' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          isTrainingPreview: false,
          config: mockConfig,
        })
      );

      expect(result.current.getVideoFiles()).toEqual([]);
    });

    it('should return video files for training preview with onVideoClick', () => {
      const media = [
        createMockMedia({ mediaType: 'DOC', fileName: 'video.mp4' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc.pdf' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          isTrainingPreview: true,
          onVideoClick: jest.fn(),
          config: mockConfig,
        })
      );

      const videos = result.current.getVideoFiles();
      expect(videos).toHaveLength(1);
      expect(videos[0].fileName).toBe('video.mp4');
    });
  });

  describe('getNonVideoDocuments', () => {
    it('should return all docs when not training preview', () => {
      const media = [
        createMockMedia({ mediaType: 'DOC', fileName: 'video.mp4' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc.pdf' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          isTrainingPreview: false,
          config: mockConfig,
        })
      );

      expect(result.current.getNonVideoDocuments()).toHaveLength(2);
    });

    it('should filter out videos for training preview with onVideoClick', () => {
      const media = [
        createMockMedia({ mediaType: 'DOC', fileName: 'video.mp4' }),
        createMockMedia({ mediaType: 'DOC', fileName: 'doc.pdf' }),
      ];

      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media,
          isTrainingPreview: true,
          onVideoClick: jest.fn(),
          config: mockConfig,
        })
      );

      const docs = result.current.getNonVideoDocuments();
      expect(docs).toHaveLength(1);
      expect(docs[0].fileName).toBe('doc.pdf');
    });
  });

  describe('Dropped images handling', () => {
    it('should create object URL for dropped images', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const droppedImages = [{ file: mockFile, fileName: 'test.jpg' }];

      renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          droppedImages,
          config: mockConfig,
        })
      );

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
    });

    it('should revoke object URL on cleanup', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const droppedImages = [{ file: mockFile, fileName: 'test.jpg' }];

      const { unmount } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          droppedImages,
          config: mockConfig,
        })
      );

      unmount();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('State setters', () => {
    it('should expose setTab', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.setTab(1);
      });

      expect(result.current.tab).toBe(1);
    });

    it('should expose setVideoDialogOpen', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.setVideoDialogOpen(true);
      });

      expect(result.current.videoDialogOpen).toBe(true);
    });

    it('should expose setVideoEmbedUrl', () => {
      const { result } = renderHook(() =>
        usePreviewNotification({
          previewData: createMockPreviewData(),
          media: [],
          config: mockConfig,
        })
      );

      act(() => {
        result.current.setVideoEmbedUrl('https://test.com/video');
      });

      expect(result.current.videoEmbedUrl).toBe('https://test.com/video');
    });
  });
});
