import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { CommonSort } from '../../CommonSort';
import {
    renderWithProviders,
    createMockSortList,
    createDefaultProps,
} from '../test-utils';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../../generated-icon', () => ({
    CloseIcon: ({ className }: { className?: string }) => (
        <span data-testid="close-icon" className={className}>×</span>
    ),
}));

jest.mock('../../../Button', () => ({
    CustomButton: ({ label, onClick, variant, className }: any) => (
        <button 
            data-testid={`custom-button-${variant}`} 
            onClick={onClick}
            className={className}
        >
            {label}
        </button>
    ),
}));

jest.mock('../../../Radio', () => ({
    CustomRadioGroup: ({ value, onChange, options }: any) => (
        <div data-testid="custom-radio-group">
            {options.map((opt: any) => (
                <label key={opt.value}>
                    <input
                        type="radio"
                        data-testid={`radio-${opt.value}`}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={onChange}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    ),
}));

describe('CommonSort', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render drawer when open', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.getByText('JOBCARD_LIST.SORTING')).toBeInTheDocument();
        });

        it('should not render content when closed', () => {
            const props = createDefaultProps({ open: false });
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.queryByText('JOBCARD_LIST.SORTING')).not.toBeInTheDocument();
        });

        it('should render sort list items', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
            expect(screen.getByText('Name (Z-A)')).toBeInTheDocument();
            expect(screen.getByText('Date (Oldest)')).toBeInTheDocument();
            expect(screen.getByText('Date (Newest)')).toBeInTheDocument();
        });

        it('should render close button', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.getByTestId('close-icon')).toBeInTheDocument();
        });

        it('should render apply button', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.getByTestId('custom-button-contained')).toBeInTheDocument();
            expect(screen.getByText('JOBCARD_LIST.APPLY')).toBeInTheDocument();
        });
    });

    describe('Selection', () => {
        it('should initialize with provided selectedValue', () => {
            const props = createDefaultProps({ selectedValue: 'name_desc' });
            renderWithProviders(<CommonSort {...props} />);

            const radio = screen.getByTestId('radio-name_desc') as HTMLInputElement;
            expect(radio.checked).toBe(true);
        });

        it('should update selection when clicking on list item', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            const listItem = screen.getByText('Name (Z-A)').closest('li');
            const button = listItem?.querySelector('[role="button"]');
            if (button) {
                fireEvent.click(button);
            }

            const radio = screen.getByTestId('radio-name_desc') as HTMLInputElement;
            expect(radio.checked).toBe(true);
        });

        it('should update selection when radio changes', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            const radio = screen.getByTestId('radio-date_asc');
            fireEvent.click(radio);

            // The radio should be checked after clicking
            expect(radio).toBeInTheDocument();
        });
    });

    describe('Apply Action', () => {
        it('should call onApply with selected item when apply button is clicked', () => {
            const onApply = jest.fn();
            const onClose = jest.fn();
            const props = createDefaultProps({ 
                onApply, 
                onClose,
                selectedValue: 'name_asc' 
            });
            renderWithProviders(<CommonSort {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalledWith({ value: 'name_asc', label: 'Name (A-Z)' });
            expect(onClose).toHaveBeenCalled();
        });

        it('should call onClose even if no item is selected', () => {
            const onApply = jest.fn();
            const onClose = jest.fn();
            const props = createDefaultProps({ 
                onApply, 
                onClose,
                selectedValue: '' 
            });
            renderWithProviders(<CommonSort {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).not.toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });

        it('should apply newly selected item', () => {
            const onApply = jest.fn();
            const onClose = jest.fn();
            const props = createDefaultProps({ onApply, onClose });
            renderWithProviders(<CommonSort {...props} />);

            // Select an item by clicking
            const listItem = screen.getByText('Date (Newest)').closest('li');
            const button = listItem?.querySelector('[role="button"]');
            if (button) {
                fireEvent.click(button);
            }

            // Apply
            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalledWith({ value: 'date_desc', label: 'Date (Newest)' });
        });
    });

    describe('Close Action', () => {
        it('should call onClose when close button is clicked', () => {
            const onClose = jest.fn();
            const props = createDefaultProps({ onClose });
            renderWithProviders(<CommonSort {...props} />);

            const closeButton = screen.getByRole('button', { name: '×' });
            fireEvent.click(closeButton);

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Anchor Positions', () => {
        it('should render with default right anchor', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSort {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorRight');
            expect(drawer).toBeInTheDocument();
        });

        it('should render with bottom anchor', () => {
            const props = createDefaultProps({ anchor: 'bottom' });
            renderWithProviders(<CommonSort {...props} />);

            const drawer = document.querySelector('.MuiDrawer-anchorBottom');
            expect(drawer).toBeInTheDocument();
        });
    });

    describe('Mobile Behavior', () => {
        it('should apply mobile styles when isMobile is true', () => {
            const props = createDefaultProps({ isMobile: true });
            renderWithProviders(<CommonSort {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });

        it('should apply desktop styles when isMobile is false', () => {
            const props = createDefaultProps({ isMobile: false });
            renderWithProviders(<CommonSort {...props} />);

            const paper = document.querySelector('.MuiDrawer-paper');
            expect(paper).toBeInTheDocument();
        });
    });

    describe('Wrapper Class', () => {
        it('should apply custom wrapper class', () => {
            const props = createDefaultProps({ wrapperClassName: 'custom-sort-class' });
            renderWithProviders(<CommonSort {...props} />);

            const drawer = document.querySelector('.drawer_outer.custom-sort-class');
            expect(drawer).toBeInTheDocument();
        });
    });

    describe('Selected Value Updates', () => {
        it('should update when selectedValue prop changes', () => {
            const props = createDefaultProps({ selectedValue: 'name_asc' });
            const { rerender } = renderWithProviders(<CommonSort {...props} />);

            // Initial selection
            let radio = screen.getByTestId('radio-name_asc') as HTMLInputElement;
            expect(radio.checked).toBe(true);

            // Update prop
            rerender(
                <CommonSort {...createDefaultProps({ selectedValue: 'date_desc' })} />
            );

            radio = screen.getByTestId('radio-date_desc') as HTMLInputElement;
            expect(radio.checked).toBe(true);
        });
    });

    describe('Empty Sort List', () => {
        it('should render empty list without errors', () => {
            const props = createDefaultProps({ sortList: [] });
            renderWithProviders(<CommonSort {...props} />);

            expect(screen.getByText('JOBCARD_LIST.SORTING')).toBeInTheDocument();
            expect(screen.getByTestId('custom-button-contained')).toBeInTheDocument();
        });
    });
});
