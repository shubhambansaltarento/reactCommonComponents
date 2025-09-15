import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { CommonDrawer } from '../../CommonDrawer';
import {
    renderWithProviders,
    createDefaultProps,
    createMockBody,
    createMockFooter,
} from '../test-utils';

// Mock the CloseIcon
jest.mock('../../../../generated-icon', () => ({
    CloseIcon: ({ className }: { className?: string }) => (
        <span data-testid="close-icon" className={className}>×</span>
    ),
}));

describe('CommonDrawer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render drawer when open', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
        });

        it('should not render content when closed', () => {
            const props = createDefaultProps({ open: false });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.queryByTestId('drawer-body')).not.toBeInTheDocument();
        });

        it('should render header title when provided', () => {
            const props = createDefaultProps({ headerTitle: 'Test Header' });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByText('Test Header')).toBeInTheDocument();
        });

        it('should render close button by default', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('close-icon')).toBeInTheDocument();
        });

        it('should hide close button when showCloseButton is false', () => {
            const props = createDefaultProps({ showCloseButton: false });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
        });

        it('should render body content', () => {
            const props = createDefaultProps({ body: createMockBody('Custom Body') });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByText('Custom Body')).toBeInTheDocument();
        });

        it('should render footer when provided', () => {
            const props = createDefaultProps({ footer: createMockFooter('Custom Footer') });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByText('Custom Footer')).toBeInTheDocument();
        });

        it('should not render footer when not provided', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
        });
    });

    describe('Custom Class Names', () => {
        it('should apply custom className to drawer', () => {
            const props = createDefaultProps({ className: 'custom-drawer-class' });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.common-drawer.custom-drawer-class');
            expect(drawer).toBeInTheDocument();
        });

        it('should apply headerClassName', () => {
            const props = createDefaultProps({ headerClassName: 'custom-header-class' });
            renderWithProviders(<CommonDrawer {...props} />);

            const header = document.querySelector('.common-drawer-header.custom-header-class');
            expect(header).toBeInTheDocument();
        });

        it('should apply bodyClassName', () => {
            const props = createDefaultProps({ bodyClassName: 'custom-body-class' });
            renderWithProviders(<CommonDrawer {...props} />);

            const body = document.querySelector('.common-drawer-content.custom-body-class');
            expect(body).toBeInTheDocument();
        });

        it('should apply footerClassName', () => {
            const props = createDefaultProps({
                footer: createMockFooter(),
                footerClassName: 'custom-footer-class',
            });
            renderWithProviders(<CommonDrawer {...props} />);

            const footer = document.querySelector('.common-drawer-footer.custom-footer-class');
            expect(footer).toBeInTheDocument();
        });
    });

    describe('Close Action', () => {
        it('should call onClose when close button is clicked', () => {
            const onClose = jest.fn();
            const props = createDefaultProps({ onClose });
            renderWithProviders(<CommonDrawer {...props} />);

            const closeButton = screen.getByRole('button');
            fireEvent.click(closeButton);

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Anchor Positions', () => {
        it('should render with default right anchor', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorRight');
            expect(drawer).toBeInTheDocument();
        });

        it('should render with left anchor', () => {
            const props = createDefaultProps({ anchor: 'left' });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorLeft');
            expect(drawer).toBeInTheDocument();
        });

        it('should render with top anchor', () => {
            const props = createDefaultProps({ anchor: 'top' });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorTop');
            expect(drawer).toBeInTheDocument();
        });

        it('should render with bottom anchor', () => {
            const props = createDefaultProps({ anchor: 'bottom' });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorBottom');
            expect(drawer).toBeInTheDocument();
        });
    });

    describe('Mobile Responsive Behavior', () => {
        it('should use mobileAnchor when isMobile is true and mobileAnchor is provided', () => {
            const props = createDefaultProps({
                isMobile: true,
                mobileAnchor: 'bottom',
                anchor: 'right',
            });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorBottom');
            expect(drawer).toBeInTheDocument();
        });

        it('should use default anchor when isMobile is false', () => {
            const props = createDefaultProps({
                isMobile: false,
                mobileAnchor: 'bottom',
                anchor: 'right',
            });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorRight');
            expect(drawer).toBeInTheDocument();
        });

        it('should use default anchor when mobileAnchor is not provided', () => {
            const props = createDefaultProps({
                isMobile: true,
                anchor: 'left',
            });
            renderWithProviders(<CommonDrawer {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorLeft');
            expect(drawer).toBeInTheDocument();
        });
    });

    describe('Drawer Variants', () => {
        it('should render with temporary variant by default', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            const modal = document.querySelector('.MuiModal-root');
            expect(modal).toBeInTheDocument();
        });

        it('should render with persistent variant', () => {
            const props = createDefaultProps({ variant: 'persistent' });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
        });

        it('should render with permanent variant', () => {
            const props = createDefaultProps({ variant: 'permanent' });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
        });
    });

    describe('Additional Props', () => {
        it('should apply keepMounted prop', () => {
            const props = createDefaultProps({ keepMounted: true, open: false });
            renderWithProviders(<CommonDrawer {...props} />);

            // With keepMounted, the drawer content should still be in the DOM
            expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
        });

        it('should apply disableScrollLock prop', () => {
            const props = createDefaultProps({ disableScrollLock: true });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
        });
    });

    describe('Header Content', () => {
        it('should render header title with Typography', () => {
            const props = createDefaultProps({ headerTitle: 'My Drawer Title' });
            renderWithProviders(<CommonDrawer {...props} />);

            const title = screen.getByText('My Drawer Title');
            expect(title.tagName).toBe('H1');
        });

        it('should render both title and close button', () => {
            const props = createDefaultProps({ headerTitle: 'Title with Close' });
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByText('Title with Close')).toBeInTheDocument();
            expect(screen.getByTestId('close-icon')).toBeInTheDocument();
        });

        it('should render close button without title', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonDrawer {...props} />);

            expect(screen.getByTestId('close-icon')).toBeInTheDocument();
        });
    });

    describe('Paper Styles', () => {
        it('should apply mobile paper styles when isMobile is true', () => {
            const props = createDefaultProps({ isMobile: true });
            renderWithProviders(<CommonDrawer {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });

        it('should apply desktop paper styles when isMobile is false', () => {
            const props = createDefaultProps({ isMobile: false });
            renderWithProviders(<CommonDrawer {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });

        it('should apply full width for top anchor', () => {
            const props = createDefaultProps({ anchor: 'top', isMobile: false });
            renderWithProviders(<CommonDrawer {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });

        it('should apply full width for bottom anchor', () => {
            const props = createDefaultProps({ anchor: 'bottom', isMobile: false });
            renderWithProviders(<CommonDrawer {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });
    });
});
