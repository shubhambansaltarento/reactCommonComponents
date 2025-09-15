import { YOUTUBE_PATTERNS, ERROR_MESSAGES } from "./constants";

export const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    if (!url || typeof url !== 'string') {
      console.warn('Invalid YouTube URL provided:', url);
      return null;
    }

    const ytShort = YOUTUBE_PATTERNS.SHORT.exec(url);
    if (ytShort?.[1]) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;

    const ytWatch = YOUTUBE_PATTERNS.WATCH.exec(url);
    if (ytWatch?.[1]) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;

    const ytEmbed = YOUTUBE_PATTERNS.EMBED.exec(url);
    if (ytEmbed?.[1]) return `https://www.youtube.com/embed/${ytEmbed[1]}?autoplay=1`;

    return null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
};

export const formatUrl = (url: string): string => {
  try {
    if (!url || typeof url !== 'string') {
      console.warn(ERROR_MESSAGES.INVALID_URL, url);
      return '';
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return '';
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return '';
  }
};

/**
 * Returns the URL directly if it's an absolute URL (http/https).
 * Otherwise returns null.
 */
export const getDirectUrlIfAbsolute = (url: string): string | null => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return null;
};

/**
 * Builds a file URL using the API base URL and view file API path.
 */
export const buildApiFileUrl = (
  url: string,
  apiBaseUrl: string,
  viewFileApi: string
): string => {
  return `${apiBaseUrl}${viewFileApi}${url}`;
};
