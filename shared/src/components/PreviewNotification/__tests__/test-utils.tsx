/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NotificationItem, MediaItem } from '../PreviewNotification.interface';

// Create a minimal theme
const theme = createTheme();

// Default states
const defaultAppDataState = { toast: null };
const defaultUserState = { userDetails: {}, permissions: [] };

// Simple reducers
const appDataReducer = (state = defaultAppDataState) => state;
const userReducer = (state = defaultUserState) => state;

// Create a mock store
const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      AppData: appDataReducer,
      user: userReducer,
    },
    preloadedState: {
      AppData: { ...defaultAppDataState, ...initialState.AppData },
      user: { ...defaultUserState, ...initialState.user },
    },
  });
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  }: any = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Mock notification data factory
export const createMockNotificationItem = (overrides: Partial<NotificationItem> = {}): NotificationItem => ({
  announcementId: 'test-announcement-1',
  type: 'announcement',
  title: 'Test Notification Title',
  description: 'This is a test notification description.',
  criticality: 'HIGH',
  validFrom: '2025-01-01T00:00:00Z',
  validTo: '2025-12-31T23:59:59Z',
  templateType: 'IMAGE',
  userAction: [
    { name: 'Action 1', link: 'https://example.com/action1' },
    { name: 'Action 2', link: 'https://example.com/action2' },
  ],
  externalLinks: ['https://external-link.com'],
  ...overrides,
});

// Mock media item factory
export const createMockMediaItem = (overrides: Partial<MediaItem> = {}): MediaItem => ({
  announcementMediaId: 'media-1',
  announcementId: 'test-announcement-1',
  fileName: 'test-file.pdf',
  url: '/files/test-file.pdf',
  mediaType: 'DOC',
  ...overrides,
});

// Mock image media item
export const createMockImageMediaItem = (overrides: Partial<MediaItem> = {}): MediaItem => ({
  announcementMediaId: 'image-1',
  announcementId: 'test-announcement-1',
  fileName: 'test-image.jpg',
  url: '/images/test-image.jpg',
  mediaType: 'IMAGE',
  ...overrides,
});

// Mock uploaded file factory
export const createMockUploadedFile = (fileName = 'uploaded-image.jpg'): { file: File; fileName: string } => {
  const file = new File(['test content'], fileName, { type: 'image/jpeg' });
  return { file, fileName };
};

// Mock video media item
export const createMockVideoMediaItem = (overrides: Partial<MediaItem & { contentType?: string }> = {}): MediaItem & { contentType?: string } => ({
  announcementMediaId: 'video-1',
  announcementId: 'test-announcement-1',
  fileName: 'training-video.mp4',
  url: '/videos/training-video.mp4',
  mediaType: 'DOC',
  contentType: 'video/mp4',
  ...overrides,
});

// Mock PDF media item
export const createMockPdfMediaItem = (overrides: Partial<MediaItem & { contentType?: string }> = {}): MediaItem & { contentType?: string } => ({
  announcementMediaId: 'pdf-1',
  announcementId: 'test-announcement-1',
  fileName: 'document.pdf',
  url: '/docs/document.pdf',
  mediaType: 'DOC',
  contentType: 'application/pdf',
  ...overrides,
});

// Mock config for PreviewMediaContent
export const createMockConfig = () => ({
  basePath: '/test-path',
  apiBaseUrl: 'https://api.test.com',
  viewFileApi: '/v1/docs/view',
  downloadFileApi: '/v1/docs/download',
});

// Helper to mock window.open
export const mockWindowOpen = () => {
  const originalOpen = window.open;
  const mockOpen = jest.fn();
  window.open = mockOpen;
  return {
    mockOpen,
    restore: () => { window.open = originalOpen; },
  };
};

// Helper to mock URL.createObjectURL
export const mockCreateObjectURL = () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const mockCreate = jest.fn(() => 'blob:test-url');
  const mockRevoke = jest.fn();
  URL.createObjectURL = mockCreate;
  URL.revokeObjectURL = mockRevoke;
  return {
    mockCreate,
    mockRevoke,
    restore: () => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    },
  };
};

// Mock translation function
export const mockT = (key: string): string => {
  const translations: Record<string, string> = {
    'NOTIFICATIONS.ANNOUNCEMENTS.ON_HOME_PAGE': 'On Home Page',
    'NOTIFICATIONS.ANNOUNCEMENTS.IN_DETAIL': 'In Detail',
    'NOTIFICATIONS.ANNOUNCEMENTS.PREVIEW_TITLE': 'Preview Notification',
    'NOTIFICATIONS.ANNOUNCEMENTS.RESOURCES': 'Resources',
    'NOTIFICATIONS.ANNOUNCEMENTS.EXPIRES_ON': 'Expires on',
    'NOTIFICATIONS.ANNOUNCEMENTS.NO_PREVIEW': 'No preview available',
  };
  return translations[key] || key;
};

export { createMockStore };

// Prevent Jest from treating this as an empty test file
describe('Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockNotificationItem).toBeDefined();
    expect(createMockMediaItem).toBeDefined();
  });
});
