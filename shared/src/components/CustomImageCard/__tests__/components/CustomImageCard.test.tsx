import React from 'react';
import { screen } from '@testing-library/react';
import { ImageCard } from '../../CustomImageCard';
import {
    renderWithProviders,
    createDefaultProps,
} from '../test-utils';

describe('ImageCard', () => {
    describe('Rendering', () => {
        it('should render the component with image', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
        });

        it('should render with default height and maxHeight', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toBeInTheDocument();
        });

        it('should render with custom height', () => {
            const props = createDefaultProps({ height: '300px' });
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toBeInTheDocument();
        });

        it('should render with custom maxHeight', () => {
            const props = createDefaultProps({ maxHeight: '400' });
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toBeInTheDocument();
        });
    });

    describe('Heading', () => {
        it('should render heading when provided', () => {
            const props = createDefaultProps({ heading: 'Test Heading' });
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.getByText('Test Heading')).toBeInTheDocument();
        });

        it('should not render heading text when not provided', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.queryByText('Test Heading')).not.toBeInTheDocument();
        });
    });

    describe('Date', () => {
        it('should render date when provided', () => {
            const props = createDefaultProps({ date: '01/01/2024' });
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.getByText('01/01/2024')).toBeInTheDocument();
        });

        it('should not render date text when not provided', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.queryByText('01/01/2024')).not.toBeInTheDocument();
        });
    });

    describe('Description', () => {
        it('should render description when provided', () => {
            const props = createDefaultProps({ description: 'This is a test description' });
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.getByText('This is a test description')).toBeInTheDocument();
        });

        it('should not render description text when not provided', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
        });
    });

    describe('Full Content', () => {
        it('should render all content together', () => {
            const props = createDefaultProps({
                heading: 'Full Test Heading',
                date: '12/25/2024',
                description: 'Full test description content',
            });
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.getByRole('img', { name: 'preview' })).toBeInTheDocument();
            expect(screen.getByText('Full Test Heading')).toBeInTheDocument();
            expect(screen.getByText('12/25/2024')).toBeInTheDocument();
            expect(screen.getByText('Full test description content')).toBeInTheDocument();
        });

        it('should render with all custom props', () => {
            const props = createDefaultProps({
                heading: 'Custom Card',
                date: '06/15/2025',
                description: 'Custom description for the image card',
                height: '350px',
                maxHeight: '500',
            });
            renderWithProviders(<ImageCard {...props} />);

            expect(screen.getByText('Custom Card')).toBeInTheDocument();
            expect(screen.getByText('06/15/2025')).toBeInTheDocument();
            expect(screen.getByText('Custom description for the image card')).toBeInTheDocument();
        });
    });

    describe('Image Source', () => {
        it('should render with different image sources', () => {
            const props = createDefaultProps({ image: '/local/path/image.png' });
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toHaveAttribute('src', '/local/path/image.png');
        });

        it('should have correct alt text', () => {
            const props = createDefaultProps();
            renderWithProviders(<ImageCard {...props} />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toHaveAttribute('alt', 'preview');
        });
    });

    describe('Minimal Rendering', () => {
        it('should render with only required image prop', () => {
            renderWithProviders(<ImageCard image="https://example.com/minimal.jpg" />);

            const image = screen.getByRole('img', { name: 'preview' });
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', 'https://example.com/minimal.jpg');
        });
    });
});
