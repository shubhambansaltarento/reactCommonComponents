import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { PopupModal } from '../../PopupModal';
import {
    renderWithProviders,
    createPopupModalDefaultProps,
    createMockIcon,
} from '../test-utils';

// Mock CustomButton
jest.mock('../../../Button', () => ({
    CustomButton: ({ children, onClick, variant, color, className }: any) => (
        <button
            data-testid={`custom-button-${variant}`}
            onClick={onClick}
            className={className}
            data-color={color}
        >
            {children}
        </button>
    ),
}));

describe('PopupModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render modal when isOpen is true', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Test Modal Heading')).toBeInTheDocument();
        });

        it('should not render modal when isOpen is false', () => {
            const props = createPopupModalDefaultProps({ isOpen: false });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.queryByText('Test Modal Heading')).not.toBeInTheDocument();
        });

        it('should render heading text', () => {
            const props = createPopupModalDefaultProps({ heading: 'Custom Heading' });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Custom Heading')).toBeInTheDocument();
        });
    });

    describe('Description', () => {
        it('should render description when provided', () => {
            const props = createPopupModalDefaultProps({
                description: 'This is the modal description',
            });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('This is the modal description')).toBeInTheDocument();
        });

        it('should not render description text when not provided', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.queryByText('This is the modal description')).not.toBeInTheDocument();
        });
    });

    describe('Icon', () => {
        it('should render icon when provided', () => {
            const props = createPopupModalDefaultProps({ icon: createMockIcon() });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        });

        it('should not render icon when not provided', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
        });
    });

    describe('Buttons', () => {
        it('should render confirm button with default label', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Confirm')).toBeInTheDocument();
        });

        it('should render cancel button with default label', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });

        it('should render confirm button with custom label', () => {
            const props = createPopupModalDefaultProps({ confirmLabel: 'Yes, Delete' });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
        });

        it('should render cancel button with custom label', () => {
            const props = createPopupModalDefaultProps({ cancelLabel: 'No, Keep' });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('No, Keep')).toBeInTheDocument();
        });
    });

    describe('Button Actions', () => {
        it('should call onConfirm when confirm button is clicked', () => {
            const onConfirm = jest.fn();
            const props = createPopupModalDefaultProps({ onConfirm });
            renderWithProviders(<PopupModal {...props} />);

            const confirmButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(confirmButton);

            expect(onConfirm).toHaveBeenCalled();
        });

        it('should call onClose when cancel button is clicked', () => {
            const onClose = jest.fn();
            const props = createPopupModalDefaultProps({ onClose });
            renderWithProviders(<PopupModal {...props} />);

            const cancelButton = screen.getByTestId('custom-button-outlined');
            fireEvent.click(cancelButton);

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Close Icon', () => {
        it('should render close icon button', () => {
            const props = createPopupModalDefaultProps();
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
        });

        it('should call onClose when close icon is clicked', () => {
            const onClose = jest.fn();
            const props = createPopupModalDefaultProps({ onClose });
            renderWithProviders(<PopupModal {...props} />);

            const closeButton = screen.getByTestId('CloseIcon').closest('button');
            if (closeButton) {
                fireEvent.click(closeButton);
            }

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Full Content', () => {
        it('should render all content together', () => {
            const props = createPopupModalDefaultProps({
                heading: 'Delete Item',
                description: 'Are you sure you want to delete this item?',
                confirmLabel: 'Delete',
                cancelLabel: 'Keep',
                icon: createMockIcon(),
            });
            renderWithProviders(<PopupModal {...props} />);

            expect(screen.getByText('Delete Item')).toBeInTheDocument();
            expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
            expect(screen.getByText('Keep')).toBeInTheDocument();
            expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        });
    });

    describe('Dialog Behavior', () => {
        it('should call onClose when backdrop is clicked', () => {
            const onClose = jest.fn();
            const props = createPopupModalDefaultProps({ onClose });
            renderWithProviders(<PopupModal {...props} />);

            const backdrop = document.querySelector('.MuiBackdrop-root');
            if (backdrop) {
                fireEvent.click(backdrop);
            }

            expect(onClose).toHaveBeenCalled();
        });
    });
});
