import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CustomAudioRecorder } from '../../CustomAudioRecorder';
import {
    renderWithProviders,
    createMockAudioRecorder,
    createDefaultProps,
    MockAudioRecorderReturn,
} from '../test-utils';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../../generated-icon', () => ({
    RecordMicIcon: () => <span data-testid="record-mic-icon">🎤</span>,
}));

jest.mock('../../../Button/Button', () => ({
    CustomButton: ({ label, onClick, disabled, startIcon, className, variant, color }: any) => (
        <button
            data-testid="custom-button"
            onClick={onClick}
            disabled={disabled}
            className={className}
            data-variant={variant}
            data-color={color}
        >
            {startIcon}
            {label}
        </button>
    ),
}));

// Mock useAudioRecorder hook
let mockAudioRecorderReturn: MockAudioRecorderReturn;

jest.mock('../../../../hooks/useAudioRecorder', () => ({
    useAudioRecorder: () => mockAudioRecorderReturn,
}));

describe('CustomAudioRecorder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAudioRecorderReturn = createMockAudioRecorder();
    });

    describe('Rendering', () => {
        it('should render the component with record button', () => {
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByTestId('custom-button')).toBeInTheDocument();
            expect(screen.getByText('COMMON.RECORD_FEEDBACK')).toBeInTheDocument();
        });

        it('should render with custom className', () => {
            const props = createDefaultProps({ className: 'custom-class' });
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const container = document.querySelector('.audio-recorder.custom-class');
            expect(container).toBeInTheDocument();
        });

        it('should render record mic icon when not recording', () => {
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByTestId('record-mic-icon')).toBeInTheDocument();
        });
    });

    describe('Recording State', () => {
        it('should show stop button with time when recording', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                recordingTime: 65,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText(/COMMON.STOP_RECORDING/)).toBeInTheDocument();
            // Time appears in both button label and indicator, use getAllByText
            const timeElements = screen.getAllByText(/1:05/);
            expect(timeElements.length).toBeGreaterThan(0);
        });

        it('should show recording indicator when recording', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                recordingTime: 30,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText('0:30')).toBeInTheDocument();
        });

        it('should format time correctly for minutes and seconds', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                recordingTime: 125,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText('2:05')).toBeInTheDocument();
        });

        it('should show stop icon when recording', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByTestId('StopIcon')).toBeInTheDocument();
        });
    });

    describe('Click Actions', () => {
        it('should call startRecording when clicking record button', async () => {
            const startRecording = jest.fn();
            mockAudioRecorderReturn = createMockAudioRecorder({ startRecording });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            fireEvent.click(button);

            await waitFor(() => {
                expect(startRecording).toHaveBeenCalled();
            });
        });

        it('should call stopRecording when clicking stop button while recording', () => {
            const stopRecording = jest.fn();
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                stopRecording,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            fireEvent.click(button);

            expect(stopRecording).toHaveBeenCalled();
        });
    });

    describe('Disabled State', () => {
        it('should disable button when disabled prop is true', () => {
            const props = createDefaultProps({ disabled: true });
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button).toBeDisabled();
        });

        it('should enable button when disabled prop is false', () => {
            const props = createDefaultProps({ disabled: false });
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button).not.toBeDisabled();
        });
    });

    describe('Error State', () => {
        it('should display error message when error exists', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                error: 'Microphone access denied',
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText('Microphone access denied')).toBeInTheDocument();
        });

        it('should not display error box when no error', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({ error: null });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.queryByText('Microphone access denied')).not.toBeInTheDocument();
        });
    });

    describe('Recording Complete', () => {
        it('should call onRecordingComplete when audioBlob is available', async () => {
            const onRecordingComplete = jest.fn();
            const clearRecording = jest.fn();
            const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
            
            mockAudioRecorderReturn = createMockAudioRecorder({
                audioBlob: mockBlob,
                clearRecording,
            });
            
            const props = createDefaultProps({ onRecordingComplete });
            renderWithProviders(<CustomAudioRecorder {...props} />);

            await waitFor(() => {
                expect(onRecordingComplete).toHaveBeenCalledWith(mockBlob);
            });
        });

        it('should clear recording after calling onRecordingComplete', async () => {
            const onRecordingComplete = jest.fn();
            const clearRecording = jest.fn();
            const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
            
            mockAudioRecorderReturn = createMockAudioRecorder({
                audioBlob: mockBlob,
                clearRecording,
            });
            
            const props = createDefaultProps({ onRecordingComplete });
            renderWithProviders(<CustomAudioRecorder {...props} />);

            await waitFor(() => {
                expect(clearRecording).toHaveBeenCalled();
            });
        });
    });

    describe('Button Styling', () => {
        it('should have outlined variant', () => {
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('data-variant', 'outlined');
        });

        it('should have primary color when not recording', () => {
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('data-color', 'primary');
        });

        it('should have error color when recording', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({ isRecording: true });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('data-color', 'error');
        });

        it('should have recording class when recording', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({ isRecording: true });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            const button = screen.getByTestId('custom-button');
            expect(button.className).toContain('recording');
        });
    });

    describe('Time Formatting', () => {
        it('should format zero seconds correctly', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                recordingTime: 0,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText('0:00')).toBeInTheDocument();
        });

        it('should format single digit seconds with leading zero', () => {
            mockAudioRecorderReturn = createMockAudioRecorder({
                isRecording: true,
                recordingTime: 5,
            });
            const props = createDefaultProps();
            renderWithProviders(<CustomAudioRecorder {...props} />);

            expect(screen.getByText('0:05')).toBeInTheDocument();
        });
    });
});
