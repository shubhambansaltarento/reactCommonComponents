import React from 'react';
import { screen } from '@testing-library/react';
import { CommonSummaryCard } from '../../CommonSummaryCard';
import {
    renderWithProviders,
    createMockSummaryData,
    createDefaultProps,
} from '../test-utils';

describe('CommonSummaryCard', () => {
    describe('Rendering', () => {
        it('should render the component with summary data', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Warranty Details')).toBeInTheDocument();
        });

        it('should render all summary data items', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Warranty Type')).toBeInTheDocument();
            expect(screen.getByText('Extended Warranty')).toBeInTheDocument();
            expect(screen.getByText('Duration')).toBeInTheDocument();
            expect(screen.getByText('2 Years')).toBeInTheDocument();
        });

        it('should format numeric values with locale string', () => {
            const props = createDefaultProps({
                summaryData: [
                    { label: 'Amount', value: 5000 },
                    { label: 'Large Amount', value: 1000000 },
                ],
            });
            renderWithProviders(<CommonSummaryCard {...props} />);

            // Use the same locale formatting as the component
            expect(screen.getByText((5000).toLocaleString())).toBeInTheDocument();
            expect(screen.getByText((1000000).toLocaleString())).toBeInTheDocument();
        });

        it('should render string values as-is', () => {
            const props = createDefaultProps({
                summaryData: [
                    { label: 'Status', value: 'Active' },
                ],
            });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Active')).toBeInTheDocument();
        });
    });

    describe('Success Header', () => {
        it('should show success header by default', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();
        });

        it('should hide success header when showSuccessHeader is false', () => {
            const props = createDefaultProps({ showSuccessHeader: false });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.queryByTestId('CheckCircleOutlineIcon')).not.toBeInTheDocument();
        });

        it('should render success title when provided', () => {
            const props = createDefaultProps({ successTitle: 'Operation Successful!' });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Operation Successful!')).toBeInTheDocument();
        });

        it('should not render success title when not provided', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.queryByText('Operation Successful!')).not.toBeInTheDocument();
        });
    });

    describe('Optional Props', () => {
        it('should handle uniqueRefKey prop', () => {
            const props = createDefaultProps({ uniqueRefKey: 'REF-12345' });
            renderWithProviders(<CommonSummaryCard {...props} />);

            // Component renders but uniqueRefKey is not displayed in current implementation
            expect(screen.getByText('Warranty Details')).toBeInTheDocument();
        });

        it('should handle successMessage prop', () => {
            const props = createDefaultProps({ successMessage: 'Your warranty has been registered.' });
            renderWithProviders(<CommonSummaryCard {...props} />);

            // Component renders but successMessage is not displayed in current implementation
            expect(screen.getByText('Warranty Details')).toBeInTheDocument();
        });
    });

    describe('Empty Data', () => {
        it('should render with empty summary data', () => {
            const props = createDefaultProps({ summaryData: [] });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Warranty Details')).toBeInTheDocument();
        });
    });

    describe('Data Types', () => {
        it('should handle mixed data types in summary', () => {
            const props = createDefaultProps({
                summaryData: [
                    { label: 'Text Value', value: 'Some Text' },
                    { label: 'Number Value', value: 12345 },
                    { label: 'Zero Value', value: 0 },
                ],
            });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Some Text')).toBeInTheDocument();
            expect(screen.getByText('12,345')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('should handle isHighlighted property in data items', () => {
            const props = createDefaultProps({
                summaryData: [
                    { label: 'Highlighted Item', value: 'Important', isHighlighted: true },
                    { label: 'Normal Item', value: 'Regular', isHighlighted: false },
                ],
            });
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByText('Important')).toBeInTheDocument();
            expect(screen.getByText('Regular')).toBeInTheDocument();
        });
    });

    describe('Multiple Items', () => {
        it('should render multiple summary items correctly', () => {
            const summaryData = createMockSummaryData();
            const props = createDefaultProps({ summaryData });
            renderWithProviders(<CommonSummaryCard {...props} />);

            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(summaryData.length);
        });
    });

    describe('Component Structure', () => {
        it('should render with correct heading structure', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            const heading = screen.getByRole('heading', { level: 3 });
            expect(heading).toHaveTextContent('Warranty Details');
        });

        it('should render list component', () => {
            const props = createDefaultProps();
            renderWithProviders(<CommonSummaryCard {...props} />);

            expect(screen.getByRole('list')).toBeInTheDocument();
        });
    });
});
