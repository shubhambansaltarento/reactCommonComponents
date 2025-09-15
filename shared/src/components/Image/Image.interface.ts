export interface ImageProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Optional custom className for styling
   */
  className?: string;
  /**
   * Optional width (can be number or string)
   */
  width?: number | string;
  /**
   * Optional height (can be number or string)
   */
  height?: number | string;
  /**
   * Optional loading behavior
   */
  loading?: "lazy" | "eager";
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional fallback image source
   */
  fallbackSrc?: string;
  /**
   * Optional object-fit CSS property
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  /**
   * Optional border radius
   */
  borderRadius?: string;
  /**
   * Optional shadow styling
   */
  shadow?: boolean;
}
