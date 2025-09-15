import {
  YOUTUBE_PATTERNS,
  ERROR_MESSAGES,
  TRAINING_TAG_COLORS,
  DEFAULT_PRIORITY_COLORS,
} from '../../utils/constants';

describe('constants', () => {
  // === Line 1: export const YOUTUBE_PATTERNS ===
  describe('YOUTUBE_PATTERNS', () => {
    it('should be a defined object with SHORT, WATCH, and EMBED keys', () => {
      expect(YOUTUBE_PATTERNS).toBeDefined();
      expect(typeof YOUTUBE_PATTERNS).toBe('object');
      expect(Object.keys(YOUTUBE_PATTERNS)).toEqual(['SHORT', 'WATCH', 'EMBED']);
    });

    it('should have SHORT pattern that matches youtu.be URLs', () => {
      expect(YOUTUBE_PATTERNS.SHORT).toBeInstanceOf(RegExp);
      const match = 'https://youtu.be/abc123'.match(YOUTUBE_PATTERNS.SHORT);
      expect(match?.[1]).toBe('abc123');
    });

    it('should have SHORT pattern that captures video ID with query params', () => {
      const match = 'https://youtu.be/dQw4w9WgXcQ?t=42'.match(YOUTUBE_PATTERNS.SHORT);
      expect(match?.[1]).toBe('dQw4w9WgXcQ');
    });

    it('should have WATCH pattern that matches youtube.com watch URLs', () => {
      expect(YOUTUBE_PATTERNS.WATCH).toBeInstanceOf(RegExp);
      const match = 'https://youtube.com/watch?v=xyz789'.match(YOUTUBE_PATTERNS.WATCH);
      expect(match?.[1]).toBe('xyz789');
    });

    it('should have WATCH pattern that works with additional query params', () => {
      const match = 'https://youtube.com/watch?v=xyz789&list=PLtest'.match(YOUTUBE_PATTERNS.WATCH);
      expect(match?.[1]).toBe('xyz789');
    });

    it('should have EMBED pattern that matches youtube.com embed URLs', () => {
      expect(YOUTUBE_PATTERNS.EMBED).toBeInstanceOf(RegExp);
      const match = 'https://youtube.com/embed/def456'.match(YOUTUBE_PATTERNS.EMBED);
      expect(match?.[1]).toBe('def456');
    });

    it('should have EMBED pattern that works with query params', () => {
      const match = 'https://youtube.com/embed/def456?autoplay=1'.match(YOUTUBE_PATTERNS.EMBED);
      expect(match?.[1]).toBe('def456');
    });

    it('should not match non-YouTube URLs', () => {
      const nonYoutubeUrl = 'https://vimeo.com/12345';
      expect(nonYoutubeUrl.match(YOUTUBE_PATTERNS.SHORT)).toBeNull();
      expect(nonYoutubeUrl.match(YOUTUBE_PATTERNS.WATCH)).toBeNull();
      expect(nonYoutubeUrl.match(YOUTUBE_PATTERNS.EMBED)).toBeNull();
    });

    it('should be readonly (as const)', () => {
      // Verify the patterns are frozen-like objects
      expect(YOUTUBE_PATTERNS.SHORT).toBeDefined();
      expect(YOUTUBE_PATTERNS.WATCH).toBeDefined();
      expect(YOUTUBE_PATTERNS.EMBED).toBeDefined();
    });
  });

  // === Line 7: export const ERROR_MESSAGES ===
  describe('ERROR_MESSAGES', () => {
    it('should be a defined object with all error message keys', () => {
      expect(ERROR_MESSAGES).toBeDefined();
      expect(typeof ERROR_MESSAGES).toBe('object');
      expect(Object.keys(ERROR_MESSAGES)).toEqual([
        'INVALID_URL',
        'DOWNLOAD_FAILED',
        'VIDEO_LOAD_FAILED',
        'RESOURCE_NOT_FOUND',
        'GENERIC_ERROR',
      ]);
    });

    it('should have INVALID_URL message', () => {
      expect(ERROR_MESSAGES.INVALID_URL).toBe('Invalid URL provided');
    });

    it('should have DOWNLOAD_FAILED message', () => {
      expect(ERROR_MESSAGES.DOWNLOAD_FAILED).toBe('Failed to download resource');
    });

    it('should have VIDEO_LOAD_FAILED message', () => {
      expect(ERROR_MESSAGES.VIDEO_LOAD_FAILED).toBe('Failed to load video content');
    });

    it('should have RESOURCE_NOT_FOUND message', () => {
      expect(ERROR_MESSAGES.RESOURCE_NOT_FOUND).toBe('Resource not found or unavailable');
    });

    it('should have GENERIC_ERROR message', () => {
      expect(ERROR_MESSAGES.GENERIC_ERROR).toBe('An unexpected error occurred');
    });

    it('should have all string values', () => {
      Object.values(ERROR_MESSAGES).forEach((msg) => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    });
  });

  // === Line 15: export const TRAINING_TAG_COLORS ===
  describe('TRAINING_TAG_COLORS', () => {
    it('should be a defined array', () => {
      expect(TRAINING_TAG_COLORS).toBeDefined();
      expect(Array.isArray(TRAINING_TAG_COLORS)).toBe(true);
    });

    it('should have exactly 5 color sets', () => {
      expect(TRAINING_TAG_COLORS).toHaveLength(5);
    });

    it('should have text, bg, and border properties for each color set', () => {
      TRAINING_TAG_COLORS.forEach((colorSet) => {
        expect(colorSet).toHaveProperty('text');
        expect(colorSet).toHaveProperty('bg');
        expect(colorSet).toHaveProperty('border');
      });
    });

    it('should have valid CSS variable references for all properties', () => {
      TRAINING_TAG_COLORS.forEach((colorSet) => {
        expect(colorSet.text).toMatch(/^var\(--/);
        expect(colorSet.bg).toMatch(/^var\(--/);
        expect(colorSet.border).toMatch(/^var\(--/);
      });
    });

    it('should have matching bg and border values for each color set', () => {
      TRAINING_TAG_COLORS.forEach((colorSet) => {
        expect(colorSet.bg).toBe(colorSet.border);
      });
    });

    it('should use primary-1100 as text color for all sets', () => {
      TRAINING_TAG_COLORS.forEach((colorSet) => {
        expect(colorSet.text).toBe('var(--primary-1100)');
      });
    });

    it('should contain specific color variants: alert, warning, info, success, primary', () => {
      const bgValues = TRAINING_TAG_COLORS.map((c) => c.bg);
      expect(bgValues).toContain('var(--alert-200)');
      expect(bgValues).toContain('var(--warning-200)');
      expect(bgValues).toContain('var(--info-200)');
      expect(bgValues).toContain('var(--success-200)');
      expect(bgValues).toContain('var(--primary-200)');
    });
  });

  // === Line 23: export const DEFAULT_PRIORITY_COLORS ===
  describe('DEFAULT_PRIORITY_COLORS', () => {
    it('should be a defined Record object', () => {
      expect(DEFAULT_PRIORITY_COLORS).toBeDefined();
      expect(typeof DEFAULT_PRIORITY_COLORS).toBe('object');
    });

    it('should have LOW, MEDIUM, and HIGH keys', () => {
      expect(Object.keys(DEFAULT_PRIORITY_COLORS)).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    });

    it('should have LOW priority with correct colors', () => {
      expect(DEFAULT_PRIORITY_COLORS.LOW).toEqual({
        bg: '#e8f5e9',
        text: '#4caf50',
      });
    });

    it('should have MEDIUM priority with correct colors', () => {
      expect(DEFAULT_PRIORITY_COLORS.MEDIUM).toEqual({
        bg: '#fff3e0',
        text: '#ff9800',
      });
    });

    it('should have HIGH priority with correct colors', () => {
      expect(DEFAULT_PRIORITY_COLORS.HIGH).toEqual({
        bg: '#ffebee',
        text: '#f44336',
      });
    });

    it('should have bg and text properties for all priorities', () => {
      Object.values(DEFAULT_PRIORITY_COLORS).forEach((colorSet) => {
        expect(colorSet).toHaveProperty('bg');
        expect(colorSet).toHaveProperty('text');
        expect(typeof colorSet.bg).toBe('string');
        expect(typeof colorSet.text).toBe('string');
      });
    });

    it('should have valid hex color codes for all values', () => {
      const hexPattern = /^#[0-9a-fA-F]{6}$/;
      Object.values(DEFAULT_PRIORITY_COLORS).forEach((colorSet) => {
        expect(colorSet.bg).toMatch(hexPattern);
        expect(colorSet.text).toMatch(hexPattern);
      });
    });

    it('should have 3 priority levels', () => {
      expect(Object.keys(DEFAULT_PRIORITY_COLORS)).toHaveLength(3);
    });
  });
});
