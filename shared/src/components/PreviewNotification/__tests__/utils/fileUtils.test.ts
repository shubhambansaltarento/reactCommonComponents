import { isVideoFile, isPdfFile } from '../../utils/fileUtils';

describe('fileUtils', () => {
  describe('isVideoFile', () => {
    it('should return false for empty fileName and no contentType', () => {
      expect(isVideoFile('', undefined)).toBe(false);
      expect(isVideoFile('', '')).toBe(false);
    });

    it('should identify mp4 files by extension', () => {
      expect(isVideoFile('video.mp4')).toBe(true);
      expect(isVideoFile('video.MP4')).toBe(true);
    });

    it('should identify various video extensions', () => {
      expect(isVideoFile('video.avi')).toBe(true);
      expect(isVideoFile('video.mov')).toBe(true);
      expect(isVideoFile('video.wmv')).toBe(true);
      expect(isVideoFile('video.flv')).toBe(true);
      expect(isVideoFile('video.webm')).toBe(true);
      expect(isVideoFile('video.mkv')).toBe(true);
      expect(isVideoFile('video.ogg')).toBe(true);
      expect(isVideoFile('video.ogv')).toBe(true);
      expect(isVideoFile('video.3gp')).toBe(true);
    });

    it('should identify video files by content type', () => {
      expect(isVideoFile('file', 'video/mp4')).toBe(true);
      expect(isVideoFile('file', 'video/webm')).toBe(true);
      expect(isVideoFile('file', 'video/ogg')).toBe(true);
    });

    it('should return false for non-video files', () => {
      expect(isVideoFile('document.pdf')).toBe(false);
      expect(isVideoFile('image.jpg')).toBe(false);
      expect(isVideoFile('document.docx')).toBe(false);
    });

    it('should return false for non-video content types', () => {
      expect(isVideoFile('file', 'application/pdf')).toBe(false);
      expect(isVideoFile('file', 'image/jpeg')).toBe(false);
    });

    it('should prioritize extension match', () => {
      expect(isVideoFile('video.mp4', 'application/octet-stream')).toBe(true);
    });

    it('should handle files without extensions', () => {
      expect(isVideoFile('videofile')).toBe(false);
      expect(isVideoFile('videofile', 'video/mp4')).toBe(true);
    });

    it('should handle null/undefined fileName', () => {
      expect(isVideoFile(null as unknown as string)).toBe(false);
      expect(isVideoFile(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isPdfFile', () => {
    it('should return false for empty fileName and no contentType', () => {
      expect(isPdfFile('', undefined)).toBe(false);
      expect(isPdfFile('', '')).toBe(false);
    });

    it('should identify pdf files by extension', () => {
      expect(isPdfFile('document.pdf')).toBe(true);
      expect(isPdfFile('document.PDF')).toBe(true);
    });

    it('should identify pdf files by content type', () => {
      expect(isPdfFile('file', 'application/pdf')).toBe(true);
    });

    it('should identify pdf files by content type containing pdf', () => {
      expect(isPdfFile('file', 'application/x-pdf')).toBe(true);
    });

    it('should return false for non-pdf files', () => {
      expect(isPdfFile('document.docx')).toBe(false);
      expect(isPdfFile('image.jpg')).toBe(false);
      expect(isPdfFile('video.mp4')).toBe(false);
    });

    it('should return false for non-pdf content types', () => {
      expect(isPdfFile('file', 'application/msword')).toBe(false);
      expect(isPdfFile('file', 'image/jpeg')).toBe(false);
    });

    it('should prioritize extension match', () => {
      expect(isPdfFile('document.pdf', 'application/octet-stream')).toBe(true);
    });

    it('should handle files without extensions', () => {
      expect(isPdfFile('pdffile')).toBe(false);
      expect(isPdfFile('pdffile', 'application/pdf')).toBe(true);
    });

    it('should handle null/undefined fileName', () => {
      expect(isPdfFile(null as unknown as string)).toBe(false);
      expect(isPdfFile(undefined as unknown as string)).toBe(false);
    });
  });
});
