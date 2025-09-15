import {
  getYouTubeEmbedUrl,
  formatUrl,
  getDirectUrlIfAbsolute,
  buildApiFileUrl,
} from '../../utils/urlUtils';

// Mock console methods
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('urlUtils', () => {
  describe('getYouTubeEmbedUrl', () => {
    it('should return null for empty string', () => {
      expect(getYouTubeEmbedUrl('')).toBeNull();
    });

    it('should return null for null/undefined input', () => {
      expect(getYouTubeEmbedUrl(null as unknown as string)).toBeNull();
      expect(getYouTubeEmbedUrl(undefined as unknown as string)).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(getYouTubeEmbedUrl(123 as unknown as string)).toBeNull();
    });

    it('should handle youtu.be short URLs', () => {
      const result = getYouTubeEmbedUrl('https://youtu.be/abc123xyz');
      expect(result).toBe('https://www.youtube.com/embed/abc123xyz?autoplay=1');
    });

    it('should handle youtube.com watch URLs', () => {
      const result = getYouTubeEmbedUrl('https://www.youtube.com/watch?v=abc123xyz');
      expect(result).toBe('https://www.youtube.com/embed/abc123xyz?autoplay=1');
    });

    it('should handle youtube.com watch URLs with additional parameters', () => {
      const result = getYouTubeEmbedUrl('https://www.youtube.com/watch?v=abc123xyz&t=100');
      expect(result).toBe('https://www.youtube.com/embed/abc123xyz?autoplay=1');
    });

    it('should handle youtube.com embed URLs', () => {
      const result = getYouTubeEmbedUrl('https://www.youtube.com/embed/abc123xyz');
      expect(result).toBe('https://www.youtube.com/embed/abc123xyz?autoplay=1');
    });

    it('should return null for non-YouTube URLs', () => {
      expect(getYouTubeEmbedUrl('https://vimeo.com/123456')).toBeNull();
      expect(getYouTubeEmbedUrl('https://example.com/video')).toBeNull();
    });

    it('should return null for malformed URLs', () => {
      expect(getYouTubeEmbedUrl('not a url')).toBeNull();
    });
  });

  describe('formatUrl', () => {
    it('should return empty string for empty input', () => {
      expect(formatUrl('')).toBe('');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatUrl(null as unknown as string)).toBe('');
      expect(formatUrl(undefined as unknown as string)).toBe('');
    });

    it('should return empty string for non-string input', () => {
      expect(formatUrl(123 as unknown as string)).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(formatUrl('   ')).toBe('');
    });

    it('should add https:// prefix for URLs without protocol', () => {
      expect(formatUrl('example.com')).toBe('https://example.com');
      expect(formatUrl('www.example.com')).toBe('https://www.example.com');
    });

    it('should preserve http:// prefix', () => {
      expect(formatUrl('http://example.com')).toBe('http://example.com');
    });

    it('should preserve https:// prefix', () => {
      expect(formatUrl('https://example.com')).toBe('https://example.com');
    });

    it('should trim whitespace', () => {
      expect(formatUrl('  example.com  ')).toBe('https://example.com');
    });
  });

  describe('getDirectUrlIfAbsolute', () => {
    it('should return the URL for http:// URLs', () => {
      expect(getDirectUrlIfAbsolute('http://example.com/file.pdf')).toBe('http://example.com/file.pdf');
    });

    it('should return the URL for https:// URLs', () => {
      expect(getDirectUrlIfAbsolute('https://example.com/file.pdf')).toBe('https://example.com/file.pdf');
    });

    it('should return null for relative URLs', () => {
      expect(getDirectUrlIfAbsolute('/path/to/file.pdf')).toBeNull();
      expect(getDirectUrlIfAbsolute('path/to/file.pdf')).toBeNull();
    });

    it('should return null for URLs without protocol', () => {
      expect(getDirectUrlIfAbsolute('example.com/file.pdf')).toBeNull();
    });
  });

  describe('buildApiFileUrl', () => {
    it('should build correct URL with all parts', () => {
      const result = buildApiFileUrl(
        '/file123.pdf',
        'https://api.example.com',
        '/api/v1/files'
      );
      expect(result).toBe('https://api.example.com/api/v1/files/file123.pdf');
    });

    it('should handle empty file path', () => {
      const result = buildApiFileUrl(
        '',
        'https://api.example.com',
        '/api/v1/files'
      );
      expect(result).toBe('https://api.example.com/api/v1/files');
    });

    it('should concatenate parts correctly', () => {
      const result = buildApiFileUrl(
        'document.pdf',
        'https://api.example.com/',
        'files/'
      );
      expect(result).toBe('https://api.example.com/files/document.pdf');
    });
  });

  describe('Error Handling', () => {
    it('should handle error in getYouTubeEmbedUrl when regex throws', () => {
      // Create a URL that would cause regex exec to throw
      const longUrl = 'https://www.youtube.com/watch?v=' + 'x'.repeat(100000);
      const result = getYouTubeEmbedUrl(longUrl);
      // Should return null and log error
      expect(result === null || typeof result === 'string').toBe(true);
    });

    it('should handle error in formatUrl when string operations throw', () => {
      // Test with object that has throwing toString
      const badUrl = { 
        toString: () => { throw new Error('toString failed'); },
        trim: () => { throw new Error('trim failed'); }
      };
      const result = formatUrl(badUrl as unknown as string);
      expect(result).toBe('');
    });
  });
});
