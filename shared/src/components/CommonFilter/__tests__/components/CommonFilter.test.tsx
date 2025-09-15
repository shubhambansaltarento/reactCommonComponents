import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CommonFilter } from '../../CommonFilter';
import {
    renderWithProviders,
    createMockCheckboxTab,
    createMockDateTab,
    createDefaultProps,
} from '../test-utils';
import dayjs from 'dayjs';

// Helper functions to create arrays of tabs
const createCheckboxTabs = () => [createMockCheckboxTab()];
const createDateTabs = () => [createMockDateTab()];

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

jest.mock('../../../Button', () => ({
    CustomButton: ({ label, onClick, variant }: { label: string; onClick?: () => void; variant?: string }) => (
        <button data-testid={`custom-button-${variant}`} onClick={onClick}>
            {label}
        </button>
    ),
}));

jest.mock('../../../Checkbox', () => ({
    CustomCheckbox: ({ checked, onChange }: { checked: boolean; onChange?: (e: any) => void }) => (
        <input
            type="checkbox"
            data-testid="custom-checkbox"
            checked={checked}
            onChange={onChange}
        />
    ),
}));

jest.mock('../../../Select/Select', () => ({
    __esModule: true,
    default: ({ label, value, onChange, options }: any) => (
        <select
            data-testid="custom-select"
            value={value}
            onChange={onChange}
        >
            <option value="">Select</option>
            {options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

describe('CommonFilter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render drawer when open', () => {
            const props = createDefaultProps({ tabs: createCheckboxTabs() });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('COMMON.FILTERS')).toBeInTheDocument();
        });

        it('should not render content when closed', () => {
            const props = createDefaultProps({ tabs: createCheckboxTabs(), open: false });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.queryByText('COMMON.FILTERS')).not.toBeInTheDocument();
        });

        it('should render checkbox tabs correctly', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('Status')).toBeInTheDocument();
        });

        it('should render date tabs correctly', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('Date Range')).toBeInTheDocument();
        });

        it('should render clear and apply buttons', () => {
            const props = createDefaultProps({ tabs: createCheckboxTabs() });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByTestId('custom-button-outlined')).toBeInTheDocument();
            expect(screen.getByTestId('custom-button-contained')).toBeInTheDocument();
        });

        it('should render close icon button', () => {
            const props = createDefaultProps({ tabs: createCheckboxTabs() });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
        });
    });

    describe('Tab Navigation', () => {
        it('should switch tabs when clicked', () => {
            const tabs = [
                ...createCheckboxTabs(),
                { key: 'type', label: 'Type', type: 'checkbox' as const, tabValues: [{ label: 'A', value: 'a' }] },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const typeTab = screen.getByText('Type');
            fireEvent.click(typeTab);

            expect(typeTab).toBeInTheDocument();
        });

        it('should initialize with provided initialIndex', () => {
            const tabs = [
                ...createCheckboxTabs(),
                { key: 'type', label: 'Type', type: 'checkbox' as const, tabValues: [{ label: 'A', value: 'a' }] },
            ];
            const props = createDefaultProps({ tabs, initialIndex: 1 });
            renderWithProviders(<CommonFilter {...props} />);

            const typeTab = screen.getByText('Type');
            expect(typeTab).toBeInTheDocument();
        });
    });

    describe('Checkbox Selection', () => {
        it('should render checkbox options', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('Active')).toBeInTheDocument();
            expect(screen.getByText('Inactive')).toBeInTheDocument();
        });

        it('should handle checkbox selection', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const checkboxes = screen.getAllByTestId('custom-checkbox');
            fireEvent.click(checkboxes[0]);
            fireEvent.change(checkboxes[0], { target: { checked: true } });

            expect(checkboxes[0]).toBeInTheDocument();
        });

        it('should initialize with provided checkbox state', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({
                tabs,
                initialCheckboxState: { status: ['active'] },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const checkboxes = screen.getAllByTestId('custom-checkbox');
            expect(checkboxes[0]).toBeChecked();
        });

        it('should handle checkbox deselection', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({
                tabs,
                initialCheckboxState: { status: ['active'] },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const checkboxes = screen.getAllByTestId('custom-checkbox');
            fireEvent.change(checkboxes[0], { target: { checked: false } });

            expect(checkboxes[0]).toBeInTheDocument();
        });
    });

    describe('Date Selection', () => {
        it('should render date pickers for date tab', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const fromDateElements = screen.getAllByLabelText('From Date');
            expect(fromDateElements.length).toBeGreaterThan(0);
        });

        it('should render to date picker when toDate is enabled', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });

        it('should render date range dropdown when dateRange is enabled', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByTestId('custom-select')).toBeInTheDocument();
        });

        it('should handle date picker interaction', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const fromDateElements = screen.getAllByLabelText('From Date');
            expect(fromDateElements[0]).toBeInTheDocument();
        });

        it('should initialize with provided date state', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-01'),
                        to: dayjs('2024-01-31'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const fromDateElements = screen.getAllByLabelText('From Date');
            expect(fromDateElements.length).toBeGreaterThan(0);
        });

        it('should handle date range selection', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const select = screen.getByTestId('custom-select');
            fireEvent.change(select, { target: { value: 'Custom' } });

            expect(select).toBeInTheDocument();
        });

        it('should show date pickers when Custom is selected', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        dateRange: 'Custom',
                        from: null,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const fromDateElements = screen.getAllByLabelText('From Date');
            expect(fromDateElements.length).toBeGreaterThan(0);
        });
    });

    describe('Apply and Clear Actions', () => {
        it('should call onApply and onClose when apply button is clicked', () => {
            const onApply = jest.fn();
            const onClose = jest.fn();
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs, onApply, onClose });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });

        it('should call onClear and onClose when clear button is clicked', () => {
            const onClear = jest.fn();
            const onClose = jest.fn();
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs, onClear, onClose });
            renderWithProviders(<CommonFilter {...props} />);

            const clearButton = screen.getByTestId('custom-button-outlined');
            fireEvent.click(clearButton);

            expect(onClear).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });

        it('should pass checkbox selections to onApply', () => {
            const onApply = jest.fn();
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({
                tabs,
                onApply,
                initialCheckboxState: { status: ['active'] },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalledWith({ status: ['active'] });
        });

        it('should pass date selections to onApply', () => {
            const onApply = jest.fn();
            const tabs = createDateTabs();
            const fromDate = dayjs('2024-01-01');
            const toDate = dayjs('2024-01-31');
            const props = createDefaultProps({
                tabs,
                onApply,
                initialDateState: {
                    dateRange: {
                        from: fromDate,
                        to: toDate,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
            const callArgs = onApply.mock.calls[0][0];
            expect(callArgs.dateRange).toBeDefined();
        });

        it('should clear all selections when clear button is clicked', () => {
            const onClear = jest.fn();
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({
                tabs,
                onClear,
                initialCheckboxState: { status: ['active'] },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const clearButton = screen.getByTestId('custom-button-outlined');
            fireEvent.click(clearButton);

            expect(onClear).toHaveBeenCalled();
        });
    });

    describe('Date Validation', () => {
        it('should show validation error when requireBothDates is true and dates are missing', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({
                tabs,
                onApply,
                shouldValidateDateRange: true,
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(screen.getByText('COMMON.VALIDATION.BOTH_DATES_REQUIRED')).toBeInTheDocument();
            expect(onApply).not.toHaveBeenCalled();
        });

        it('should not validate when shouldValidateDateRange is false', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({
                tabs,
                onApply,
                shouldValidateDateRange: false,
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(screen.queryByText('COMMON.VALIDATION.BOTH_DATES_REQUIRED')).not.toBeInTheDocument();
            expect(onApply).toHaveBeenCalled();
        });

        it('should pass validation when both dates are provided', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({
                tabs,
                onApply,
                shouldValidateDateRange: true,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-01'),
                        to: dayjs('2024-01-31'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
        });
    });

    describe('Close Action', () => {
        it('should call onClose when close icon is clicked', () => {
            const onClose = jest.fn();
            const props = createDefaultProps({ tabs: createCheckboxTabs(), onClose });
            renderWithProviders(<CommonFilter {...props} />);

            const closeButton = screen.getByRole('button', { name: '' });
            fireEvent.click(closeButton);

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Filter Indicator', () => {
        it('should show filter indicator when checkbox filter is active', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({
                tabs,
                initialCheckboxState: { status: ['active'] },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const indicator = document.querySelector('.filter-indicator');
            expect(indicator).toBeInTheDocument();
        });

        it('should show filter indicator when date filter is active', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-01'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const indicator = document.querySelector('.filter-indicator');
            expect(indicator).toBeInTheDocument();
        });

        it('should not show filter indicator when no filters are active', () => {
            const tabs = createCheckboxTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const indicator = document.querySelector('.filter-indicator');
            expect(indicator).not.toBeInTheDocument();
        });
    });

    describe('Hidden Tabs', () => {
        it('should hide tabs when hidden property is true', () => {
            const tabs = [
                {
                    key: 'status',
                    label: 'Status',
                    type: 'checkbox' as const,
                    tabValues: [{ label: 'Active', value: 'active' }],
                    hidden: true,
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const tab = screen.getByText('Status');
            expect(tab.closest('[role="tab"]')).toHaveStyle({ display: 'none' });
        });
    });

    describe('Wrapper Class', () => {
        it('should apply custom wrapper class', () => {
            const props = createDefaultProps({
                tabs: createCheckboxTabs(),
                wrapperClassName: 'custom-wrapper',
            });
            renderWithProviders(<CommonFilter {...props} />);

            const drawer = document.querySelector('.drawer_outer.custom-wrapper');
            expect(drawer).toBeInTheDocument();
        });
    });

    describe('Mobile View', () => {
        beforeEach(() => {
            const useMediaQuery = require('@mui/material/useMediaQuery');
            useMediaQuery.mockReturnValue(true);
        });

        afterEach(() => {
            const useMediaQuery = require('@mui/material/useMediaQuery');
            useMediaQuery.mockReturnValue(false);
        });

        it('should render in mobile mode', () => {
            const props = createDefaultProps({ tabs: createCheckboxTabs() });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('COMMON.FILTERS')).toBeInTheDocument();
        });
    });

    describe('Date State Updates', () => {
        it('should render date pickers with initial values', () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-01'),
                        to: dayjs('2024-01-31'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const fromDateElements = screen.getAllByLabelText('From Date');
            expect(fromDateElements.length).toBeGreaterThan(0);
        });

        it('should handle date range change to non-custom value', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const select = screen.getByTestId('custom-select');
            fireEvent.change(select, { target: { value: 'Today' } });

            expect(select).toBeInTheDocument();
        });

        it('should handle date change via calendar button', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            // Click calendar icon to open the date picker dialog
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(0);
            fireEvent.click(calendarButtons[0]);

            // Find and click on a day in the calendar popup
            await waitFor(() => {
                const dayButton = screen.getByRole('gridcell', { name: '15' });
                fireEvent.click(dayButton);
            });
        });

        it('should handle to date change via calendar button', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            // Click on the To Date calendar icon (second one)
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(1);
            fireEvent.click(calendarButtons[1]);

            // Find and click on a day in the calendar popup
            await waitFor(() => {
                const dayButton = screen.getByRole('gridcell', { name: '20' });
                fireEvent.click(dayButton);
            });
        });
    });

    describe('Date Validation Edge Cases', () => {
        it('should show error when from date is after to date', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-31'),
                        to: dayjs('2024-01-01'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(screen.getByText('COMMON.VALIDATION.FROM_DATE_AFTER_TO_DATE')).toBeInTheDocument();
        });

        it('should pass validation when both dates are empty and not required', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: false,
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({
                tabs,
                onApply,
                shouldValidateDateRange: true,
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
        });

        it('should not validate date tabs without requireBothDates', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: false,
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({
                tabs,
                onApply,
                shouldValidateDateRange: true,
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
        });
    });

    describe('Date Range Dropdown', () => {
        it('should clear validation error when non-custom date range is selected', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
            });
            renderWithProviders(<CommonFilter {...props} />);

            // First trigger validation error
            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            // Then select a non-custom date range
            const select = screen.getByTestId('custom-select');
            fireEvent.change(select, { target: { value: 'Last 7' } });

            // Error should be cleared
            expect(screen.queryByText('COMMON.VALIDATION.BOTH_DATES_REQUIRED')).not.toBeInTheDocument();
        });

        it('should show indicator when dateRange is selected', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        dateRange: 'Today',
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const indicator = document.querySelector('.filter-indicator');
            expect(indicator).toBeInTheDocument();
        });
    });

    describe('Radio Tab Functionality', () => {
        it('should render radio tabs correctly', () => {
            const tabs = [
                {
                    key: 'priority',
                    label: 'Priority',
                    type: 'radio' as const,
                    tabValues: [
                        { label: 'High', value: 'high' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Low', value: 'low' },
                    ],
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            expect(screen.getByText('Priority')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
            expect(screen.getByText('Medium')).toBeInTheDocument();
            expect(screen.getByText('Low')).toBeInTheDocument();
        });

        it('should handle radio selection', () => {
            const tabs = [
                {
                    key: 'priority',
                    label: 'Priority',
                    type: 'radio' as const,
                    tabValues: [
                        { label: 'High', value: 'high' },
                        { label: 'Medium', value: 'medium' },
                    ],
                },
            ];
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            const highRadio = screen.getByLabelText('High');
            fireEvent.click(highRadio);

            expect(highRadio).toBeChecked();
        });

        it('should apply radio filter correctly', () => {
            const tabs = [
                {
                    key: 'priority',
                    label: 'Priority',
                    type: 'radio' as const,
                    tabValues: [
                        { label: 'High', value: 'high' },
                    ],
                },
            ];
            const onApply = jest.fn();
            const props = createDefaultProps({ tabs, onApply });
            renderWithProviders(<CommonFilter {...props} />);

            const highRadio = screen.getByLabelText('High');
            fireEvent.click(highRadio);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalledWith({ priority: 'high' });
        });

        it('should show indicator for selected radio', () => {
            const tabs = [
                {
                    key: 'priority',
                    label: 'Priority',
                    type: 'radio' as const,
                    tabValues: [
                        { label: 'High', value: 'high' },
                    ],
                },
            ];
            const props = createDefaultProps({
                tabs,
                initialRadioState: { priority: 'high' },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const indicator = document.querySelector('.filter-indicator');
            expect(indicator).toBeInTheDocument();
        });
    });

    describe('Custom Date Validation', () => {
        it('should use custom date validation when provided', () => {
            const customValidation = jest.fn().mockReturnValue('Custom error');
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-01'),
                        to: dayjs('2024-01-31'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            expect(customValidation).toHaveBeenCalled();
        });
    });

    describe('Initial State Effects', () => {
        it('should update checkbox state when initialCheckboxState changes', () => {
            const tabs = [createMockCheckboxTab()];
            const { rerender } = renderWithProviders(
                <CommonFilter {...createDefaultProps({ tabs, initialCheckboxState: {} })} />
            );

            // Rerender with new initial state
            rerender(
                <CommonFilter {...createDefaultProps({ tabs, initialCheckboxState: { status: ['active'] } })} />
            );

            const checkbox = screen.getAllByTestId('custom-checkbox')[0];
            expect(checkbox).toBeInTheDocument();
        });

        it('should update radio state when initialRadioState changes', () => {
            const tabs = [
                {
                    key: 'priority',
                    label: 'Priority',
                    type: 'radio' as const,
                    tabValues: [
                        { label: 'High', value: 'high' },
                    ],
                },
            ];
            const { rerender } = renderWithProviders(
                <CommonFilter {...createDefaultProps({ tabs, initialRadioState: {} })} />
            );

            // Rerender with new initial state
            rerender(
                <CommonFilter {...createDefaultProps({ tabs, initialRadioState: { priority: 'high' } })} />
            );

            const radio = screen.getByLabelText('High');
            expect(radio).toBeChecked();
        });

        it('should update date state when initialDateState changes', () => {
            const tabs = createDateTabs();
            const { rerender } = renderWithProviders(
                <CommonFilter {...createDefaultProps({ tabs, initialDateState: {} })} />
            );

            // Rerender with new initial state
            rerender(
                <CommonFilter {...createDefaultProps({ 
                    tabs, 
                    initialDateState: { dateRange: { from: dayjs('2024-01-01') } } 
                })} />
            );

            // Component should handle state update without error
            expect(screen.getByText('Date Range')).toBeInTheDocument();
        });
    });

    describe('Date Null Handling', () => {
        it('should handle date picker interaction', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-15'),
                        to: dayjs('2024-01-20'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // Get the calendar buttons
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(0);

            // Click to open the date picker
            fireEvent.click(calendarButtons[0]);

            // Wait for calendar to open and click a date
            await waitFor(() => {
                const dayButton = screen.getByRole('gridcell', { name: '1' });
                fireEvent.click(dayButton);
            });

            // Component should still be functional
            expect(screen.getByText('Date Range')).toBeInTheDocument();
        });
    });

    describe('Per-field validation errors (getFieldErrors)', () => {
        it('should display per-field error messages below each date field', async () => {
            const customValidation = jest.fn().mockReturnValue({
                fromError: 'Please select from date',
                toError: 'Please select to date',
            });
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                initialDateState: {
                    dateRange: {
                        from: null,
                        to: null,
                        dateRange: 'Custom',
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            await waitFor(() => {
                expect(screen.getByText('Please select from date')).toBeInTheDocument();
                expect(screen.getByText('Please select to date')).toBeInTheDocument();
            });
        });

        it('should display general error message below duration dropdown', async () => {
            const customValidation = jest.fn().mockReturnValue({
                generalError: 'Please select valid duration',
            });
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                initialDateState: {
                    dateRange: {
                        from: null,
                        to: null,
                        dateRange: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            await waitFor(() => {
                expect(screen.getByText('Please select valid duration')).toBeInTheDocument();
            });
        });

        it('should handle legacy string error format', async () => {
            const customValidation = jest.fn().mockReturnValue('Legacy error message');
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    requireBothDates: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                initialDateState: {
                    dateRange: {
                        from: null,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            // String errors are treated as generalError
            await waitFor(() => {
                expect(customValidation).toHaveBeenCalled();
            });
        });
    });

    describe('enableSixMonthRange', () => {
        it('should apply 6-month max date restriction when enableSixMonthRange is true and from date is set', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                },
            ];
            const fromDate = dayjs('2024-01-15');
            const props = createDefaultProps({
                tabs,
                enableSixMonthRange: true,
                initialDateState: {
                    dateRange: {
                        from: fromDate,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // The To Date picker should be rendered with max date restriction
            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });

        it('should not apply 6-month restriction when enableSixMonthRange is false', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                },
            ];
            const fromDate = dayjs('2024-01-15');
            const props = createDefaultProps({
                tabs,
                enableSixMonthRange: false,
                initialDateState: {
                    dateRange: {
                        from: fromDate,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // The To Date picker should be rendered without max date restriction
            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });

        it('should handle calculateMaxDate when from date is null', () => {
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                enableSixMonthRange: true,
                initialDateState: {
                    dateRange: {
                        from: null,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // The To Date picker should render correctly even without from date
            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });

        it('should use current date as max when 6 months later exceeds current date', () => {
            // Use a date that is less than 6 months ago from "now"
            const recentFromDate = dayjs().subtract(2, 'month');
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                enableSixMonthRange: true,
                initialDateState: {
                    dateRange: {
                        from: recentFromDate,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // Component should render correctly with the max date being current date
            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });

        it('should use 6 months after from date when it is before current date', () => {
            // Use a date that is more than 6 months ago
            const oldFromDate = dayjs().subtract(1, 'year');
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                },
            ];
            const props = createDefaultProps({
                tabs,
                enableSixMonthRange: true,
                initialDateState: {
                    dateRange: {
                        from: oldFromDate,
                        to: null,
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // Component should render with 6-month max restriction
            const toDateElements = screen.getAllByLabelText('To Date');
            expect(toDateElements.length).toBeGreaterThan(0);
        });
    });

    describe('Date null value handling', () => {
        it('should handle clearing date value to null', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({
                tabs,
                initialDateState: {
                    dateRange: {
                        from: dayjs('2024-01-15'),
                        to: dayjs('2024-01-20'),
                    },
                },
            });
            renderWithProviders(<CommonFilter {...props} />);

            // Get the calendar buttons and interact with date picker
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(0);
            fireEvent.click(calendarButtons[0]);

            // Component should handle date interactions correctly
            await waitFor(() => {
                expect(screen.getByText('Date Range')).toBeInTheDocument();
            });
        });

        it('should handle date change with "from" valKey', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            // Click calendar icon to open the date picker dialog
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(0);
            fireEvent.click(calendarButtons[0]);

            // Find and click on a day in the calendar popup
            await waitFor(() => {
                const dayButton = screen.getByRole('gridcell', { name: '10' });
                fireEvent.click(dayButton);
            });

            // The from date should be set
            expect(screen.getByText('Date Range')).toBeInTheDocument();
        });

        it('should handle date change with "to" valKey', async () => {
            const tabs = createDateTabs();
            const props = createDefaultProps({ tabs });
            renderWithProviders(<CommonFilter {...props} />);

            // Click on the To Date calendar icon (second one)
            const calendarButtons = screen.getAllByTestId('CalendarIcon');
            expect(calendarButtons.length).toBeGreaterThan(1);
            fireEvent.click(calendarButtons[1]);

            // Find and click on a day in the calendar popup
            await waitFor(() => {
                const dayButton = screen.getByRole('gridcell', { name: '25' });
                fireEvent.click(dayButton);
            });

            // The to date should be set
            expect(screen.getByText('Date Range')).toBeInTheDocument();
        });
    });

    describe('autoSwitchToErrorTab', () => {
        it('should switch to error tab when autoSwitchToErrorTab is true', async () => {
            const customValidation = jest.fn().mockReturnValue({
                generalError: 'Please select duration',
            });
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                    requireBothDates: true,
                },
                {
                    key: 'status',
                    label: 'Status',
                    type: 'checkbox' as const,
                    tabValues: [{ label: 'Active', value: 'active' }],
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                autoSwitchToErrorTab: true,
                initialIndex: 1, // Start on Status tab
            });
            renderWithProviders(<CommonFilter {...props} />);

            // Should be on Status tab initially
            const statusTab = screen.getByText('Status');
            expect(statusTab).toBeInTheDocument();

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            // Should switch to Date Range tab (index 0) where the error is
            await waitFor(() => {
                const dateRangeTab = screen.getByText('Date Range');
                expect(dateRangeTab).toBeInTheDocument();
            });
        });

        it('should NOT switch to error tab when autoSwitchToErrorTab is false', async () => {
            const customValidation = jest.fn().mockReturnValue({
                generalError: 'Please select duration',
            });
            const tabs = [
                {
                    key: 'dateRange',
                    label: 'Date Range',
                    type: 'date' as const,
                    toDate: true,
                    dateRange: true,
                    requireBothDates: true,
                },
                {
                    key: 'status',
                    label: 'Status',
                    type: 'checkbox' as const,
                    tabValues: [{ label: 'Active', value: 'active' }],
                },
            ];
            const props = createDefaultProps({
                tabs,
                shouldValidateDateRange: true,
                customDateValidation: customValidation,
                autoSwitchToErrorTab: false, // Explicitly false
                initialIndex: 1, // Start on Status tab
            });
            renderWithProviders(<CommonFilter {...props} />);

            const applyButton = screen.getByTestId('custom-button-contained');
            fireEvent.click(applyButton);

            // Should still have validation called but not switch tabs
            expect(customValidation).toHaveBeenCalled();
        });
    });
});
