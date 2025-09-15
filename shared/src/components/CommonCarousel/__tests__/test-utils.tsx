/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a minimal theme for testing
const theme = createTheme();

// Custom render function with required providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={options?.theme || theme}>
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock carousel item type
export interface MockCarouselItem {
  announcementId: string;
  media?: { url: string }[];
  title: string;
  description: string;
  validTo: string;
  criticality?: string;
}

// Create mock carousel items
export const createMockCarouselItems = (count: number = 3): MockCarouselItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    announcementId: `announcement-${i + 1}`,
    media: i % 2 === 0 ? [{ url: `/image-${i + 1}.jpg` }] : undefined,
    title: `Slide ${i + 1} Title`,
    description: `This is the description for slide ${i + 1}`,
    validTo: new Date(2026, 0, 15 + i).toISOString(),
    criticality: i === 0 ? 'high' : 'normal',
  }));
};

// Create mock carousel items with media
export const createMockCarouselItemsWithMedia = (count: number = 3): MockCarouselItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    announcementId: `announcement-${i + 1}`,
    media: [{ url: `/image-${i + 1}.jpg` }],
    title: `Slide ${i + 1} Title`,
    description: `This is the description for slide ${i + 1}`,
    validTo: new Date(2026, 0, 15 + i).toISOString(),
    criticality: i === 0 ? 'high' : 'normal',
  }));
};

// Create mock carousel items without media
export const createMockCarouselItemsWithoutMedia = (count: number = 3): MockCarouselItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    announcementId: `announcement-${i + 1}`,
    title: `Slide ${i + 1} Title`,
    description: `This is the description for slide ${i + 1}`,
    validTo: new Date(2026, 0, 15 + i).toISOString(),
    criticality: i === 0 ? 'high' : 'normal',
  }));
};

// Default props helper
export const createDefaultCarouselProps = (overrides: any = {}) => ({
  items: createMockCarouselItems(),
  height: 300,
  autoPlay: false,
  autoPlayInterval: 3000,
  showDots: true,
  showArrows: true,
  dotsStyle: 'dots' as const,
  baseUrl: 'https://example.com',
  onReadMore: jest.fn(),
  ...overrides,
});

// This export prevents Jest from treating this as an empty test file
describe('CommonCarousel Test Utilities', () => {
  it('should export test utilities', () => {
    expect(renderWithProviders).toBeDefined();
    expect(createMockCarouselItems).toBeDefined();
    expect(createMockCarouselItemsWithMedia).toBeDefined();
    expect(createMockCarouselItemsWithoutMedia).toBeDefined();
    expect(createDefaultCarouselProps).toBeDefined();
  });
});
