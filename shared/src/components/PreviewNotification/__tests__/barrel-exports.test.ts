/**
 * Tests for barrel export files to ensure all public APIs are properly exported.
 * This covers the index.ts re-export files that SonarQube flags as uncovered.
 */

// Import from the top-level PreviewNotification barrel
import {
  PreviewMediaContent,
  ActionButton,
  PriorityChip,
  ResourceItem,
  VideoPlayer,
  usePreviewNotification,
} from '../index';

// Import from sub-barrels
import {
  ActionButton as ActionButtonFromComponents,
  PriorityChip as PriorityChipFromComponents,
  ResourceItem as ResourceItemFromComponents,
  VideoPlayer as VideoPlayerFromComponents,
} from '../components';

import {
  YOUTUBE_PATTERNS,
  ERROR_MESSAGES,
  TRAINING_TAG_COLORS,
  DEFAULT_PRIORITY_COLORS,
  isVideoFile,
  isPdfFile,
  getYouTubeEmbedUrl,
  formatUrl,
  getDirectUrlIfAbsolute,
  buildApiFileUrl,
} from '../utils';

import { usePreviewNotification as usePreviewNotificationFromHooks } from '../hooks';

describe('PreviewNotification barrel exports', () => {
  describe('PreviewNotification/index.ts', () => {
    it('should export PreviewMediaContent', () => {
      expect(PreviewMediaContent).toBeDefined();
    });

    it('should export ActionButton', () => {
      expect(ActionButton).toBeDefined();
    });

    it('should export PriorityChip', () => {
      expect(PriorityChip).toBeDefined();
    });

    it('should export ResourceItem', () => {
      expect(ResourceItem).toBeDefined();
    });

    it('should export VideoPlayer', () => {
      expect(VideoPlayer).toBeDefined();
    });

    it('should export usePreviewNotification', () => {
      expect(usePreviewNotification).toBeDefined();
    });
  });

  describe('PreviewNotification/components/index.ts', () => {
    it('should export ActionButton', () => {
      expect(ActionButtonFromComponents).toBeDefined();
    });

    it('should export PriorityChip', () => {
      expect(PriorityChipFromComponents).toBeDefined();
    });

    it('should export ResourceItem', () => {
      expect(ResourceItemFromComponents).toBeDefined();
    });

    it('should export VideoPlayer', () => {
      expect(VideoPlayerFromComponents).toBeDefined();
    });

    it('should re-export the same references as the parent barrel', () => {
      expect(ActionButtonFromComponents).toBe(ActionButton);
      expect(PriorityChipFromComponents).toBe(PriorityChip);
      expect(ResourceItemFromComponents).toBe(ResourceItem);
      expect(VideoPlayerFromComponents).toBe(VideoPlayer);
    });
  });

  describe('PreviewNotification/utils/index.ts', () => {
    it('should export YOUTUBE_PATTERNS', () => {
      expect(YOUTUBE_PATTERNS).toBeDefined();
    });

    it('should export ERROR_MESSAGES', () => {
      expect(ERROR_MESSAGES).toBeDefined();
    });

    it('should export TRAINING_TAG_COLORS', () => {
      expect(TRAINING_TAG_COLORS).toBeDefined();
    });

    it('should export DEFAULT_PRIORITY_COLORS', () => {
      expect(DEFAULT_PRIORITY_COLORS).toBeDefined();
    });

    it('should export isVideoFile', () => {
      expect(isVideoFile).toBeDefined();
      expect(typeof isVideoFile).toBe('function');
    });

    it('should export isPdfFile', () => {
      expect(isPdfFile).toBeDefined();
      expect(typeof isPdfFile).toBe('function');
    });

    it('should export getYouTubeEmbedUrl', () => {
      expect(getYouTubeEmbedUrl).toBeDefined();
      expect(typeof getYouTubeEmbedUrl).toBe('function');
    });

    it('should export formatUrl', () => {
      expect(formatUrl).toBeDefined();
      expect(typeof formatUrl).toBe('function');
    });

    it('should export getDirectUrlIfAbsolute', () => {
      expect(getDirectUrlIfAbsolute).toBeDefined();
      expect(typeof getDirectUrlIfAbsolute).toBe('function');
    });

    it('should export buildApiFileUrl', () => {
      expect(buildApiFileUrl).toBeDefined();
      expect(typeof buildApiFileUrl).toBe('function');
    });
  });

  describe('PreviewNotification/hooks/index.ts', () => {
    it('should export usePreviewNotification', () => {
      expect(usePreviewNotificationFromHooks).toBeDefined();
    });

    it('should re-export the same reference as the parent barrel', () => {
      expect(usePreviewNotificationFromHooks).toBe(usePreviewNotification);
    });
  });

});
