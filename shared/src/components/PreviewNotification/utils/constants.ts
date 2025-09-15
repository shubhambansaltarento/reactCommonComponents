export const YOUTUBE_PATTERNS = {
  SHORT: /youtu\.be\/([^?&/]+)/,
  WATCH: /[?&]v=([^&]+)/,
  EMBED: /youtube\.com\/embed\/([^?&/]+)/,
} as const;

export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL provided',
  DOWNLOAD_FAILED: 'Failed to download resource',
  VIDEO_LOAD_FAILED: 'Failed to load video content',
  RESOURCE_NOT_FOUND: 'Resource not found or unavailable',
  GENERIC_ERROR: 'An unexpected error occurred'
} as const;

export const TRAINING_TAG_COLORS = [
  { text: 'var(--primary-1100)', bg: 'var(--alert-200)', border: 'var(--alert-200)' },
  { text: 'var(--primary-1100)', bg: 'var(--warning-200)', border: 'var(--warning-200)' },
  { text: 'var(--primary-1100)', bg: 'var(--info-200)', border: 'var(--info-200)' },
  { text: 'var(--primary-1100)', bg: 'var(--success-200)', border: 'var(--success-200)' },
  { text: 'var(--primary-1100)', bg: 'var(--primary-200)', border: 'var(--primary-200)' },
];

export const DEFAULT_PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  LOW: { bg: '#e8f5e9', text: '#4caf50' },
  MEDIUM: { bg: '#fff3e0', text: '#ff9800' },
  HIGH: { bg: '#ffebee', text: '#f44336' },
};
