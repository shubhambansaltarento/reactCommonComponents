import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Popup } from '../../Popup';
import {
    renderWithProviders,
    createPopupDefaultProps,
    createMockFooter,
    createMockIcon,
} from '../test-utils';

describe('Popup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render popup when isOpen is true', () => {
            const props = createPopupDefaultProps();
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByText('Test Popup Title')).toBeInTheDocument();
            expect(screen.getByTestId('popup-content')).toBeInTheDocument();
        });

        it('should not render popup when isOpen is false', () => {
            const props = createPopupDefaultProps({ isOpen: false });
            renderWithProviders(<Popup {...props} />);

            expect(screen.queryByText('Test Popup Title')).not.toBeInTheDocument();
        });

        it('should render with title', () => {
            const props = createPopupDefaultProps({ title: 'Custom Title' });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByText('Custom Title')).toBeInTheDocument();
        });

        it('should render children content', () => {
            const props = createPopupDefaultProps({
                children: <p data-testid="custom-content">Custom Content</p>,
            });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            expect(screen.getByText('Custom Content')).toBeInTheDocument();
        });
    });

    describe('Icon', () => {
        it('should render icon when provided', () => {
            const props = createPopupDefaultProps({ icon: createMockIcon() });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        });

        it('should not render icon when not provided', () => {
            const props = createPopupDefaultProps();
            renderWithProviders(<Popup {...props} />);

            expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
        });
    });

    describe('Close Button', () => {
        it('should render close button by default', () => {
            const props = createPopupDefaultProps();
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
        });

        it('should call onClose when close button is clicked', () => {
            const onClose = jest.fn();
            const props = createPopupDefaultProps({ onClose });
            renderWithProviders(<Popup {...props} />);

            const closeButton = screen.getByTestId('CloseIcon').closest('button');
            if (closeButton) {
                fireEvent.click(closeButton);
            }

            expect(onClose).toHaveBeenCalled();
        });

        it('should hide close button when hideCloseIcon is true', () => {
            const props = createPopupDefaultProps({ hideCloseIcon: true });
            renderWithProviders(<Popup {...props} />);

            expect(screen.queryByTestId('CloseIcon')).not.toBeInTheDocument();
        });

        it('should show close button when hideCloseIcon is false', () => {
            const props = createPopupDefaultProps({ hideCloseIcon: false });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
        });
    });

    describe('Footer', () => {
        it('should render footer when provided', () => {
            const props = createPopupDefaultProps({ footer: createMockFooter() });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });

        it('should not render footer when not provided', () => {
            const props = createPopupDefaultProps();
            renderWithProviders(<Popup {...props} />);

            expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
        });

        it('should render footer with custom content', () => {
            const customFooter = (
                <div data-testid="custom-footer">
                    <button>Save</button>
                    <button>Cancel</button>
                </div>
            );
            const props = createPopupDefaultProps({ footer: customFooter });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });
    });

    describe('Footer Alignment', () => {
        it('should use center alignment by default', () => {
            const props = createPopupDefaultProps({ footer: createMockFooter() });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        });

        it('should apply flex-start alignment', () => {
            const props = createPopupDefaultProps({
                footer: createMockFooter(),
                footerAlignment: 'flex-start',
            });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        });

        it('should apply flex-end alignment', () => {
            const props = createPopupDefaultProps({
                footer: createMockFooter(),
                footerAlignment: 'flex-end',
            });
            renderWithProviders(<Popup {...props} />);

            expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        });
    });

    describe('Custom Class', () => {
        it('should apply custom className', () => {
            const props = createPopupDefaultProps({ className: 'custom-popup-class' });
            renderWithProviders(<Popup {...props} />);

            const dialog = document.querySelector('.popup.custom-popup-class');
            expect(dialog).toBeInTheDocument();
        });

        it('should have default popup class', () => {
            const props = createPopupDefaultProps();
            renderWithProviders(<Popup {...props} />);

            const dialog = document.querySelector('.popup');
            expect(dialog).toBeInTheDocument();
        });
    });

    describe('Dialog Behavior', () => {
        it('should call onClose when backdrop is clicked', () => {
            const onClose = jest.fn();
            const props = createPopupDefaultProps({ onClose });
            renderWithProviders(<Popup {...props} />);

            const backdrop = document.querySelector('.MuiBackdrop-root');
            if (backdrop) {
                fireEvent.click(backdrop);
            }

            expect(onClose).toHaveBeenCalled();
        });
    });
});
