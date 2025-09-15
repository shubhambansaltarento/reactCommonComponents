import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoPlayer from '../../components/VideoPlayer';

describe('VideoPlayer', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render iframe when isOpen is true', () => {
    render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={true} />
    );

    const iframe = screen.getByTitle('YouTube video preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should set correct src attribute on iframe', () => {
    render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/xyz789" isOpen={true} />
    );

    const iframe = screen.getByTitle('YouTube video preview');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/xyz789');
  });

  it('should have correct allow attributes', () => {
    render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={true} />
    );

    const iframe = screen.getByTitle('YouTube video preview');
    expect(iframe).toHaveAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
  });

  it('should have allowFullScreen attribute', () => {
    render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={true} />
    );

    const iframe = screen.getByTitle('YouTube video preview');
    expect(iframe).toHaveAttribute('allowfullscreen');
  });

  it('should have sandbox attribute for security', () => {
    render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={true} />
    );

    const iframe = screen.getByTitle('YouTube video preview');
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
  });

  it('should render with responsive container styles', () => {
    const { container } = render(
      <VideoPlayer videoEmbedUrl="https://www.youtube.com/embed/abc123" isOpen={true} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ position: 'relative' });
  });
});
