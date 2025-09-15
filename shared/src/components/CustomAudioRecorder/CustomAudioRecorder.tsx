import React, { useCallback } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { CustomButton } from '../Button/Button';
import { Typography, Box } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from 'react-i18next';
import { RecordMicIcon } from '../../generated-icon';

interface CustomAudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    disabled?: boolean;
    className?: string;
}

export const CustomAudioRecorder: React.FC<CustomAudioRecorderProps> = ({
    onRecordingComplete,
    disabled = false,
    className = '',
}) => {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const {t} = useTranslation("translations");

    const {
        isRecording,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        clearRecording,
        error,
    } = useAudioRecorder();

    // Automatically call onRecordingComplete when audioBlob becomes available
    React.useEffect(() => {
        if (audioBlob && onRecordingComplete && !isProcessing) {
            setIsProcessing(true);
            onRecordingComplete(audioBlob);
            // Clear the recording after calling the callback
            clearRecording();
            setIsProcessing(false);
        }
    }, [audioBlob, onRecordingComplete, clearRecording, isProcessing]);

    const handleRecordClick = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return (
        <Box className={`audio-recorder w-full ${className}`}>
            {error && (
                <Box className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded border border-red-200">
                    {error}
                </Box>
            )}

            <Box className="flex items-center gap-3">
                <CustomButton
                    className={`recorder-button w-full ${isRecording ? 'recording' : ''}`}
                    startIcon={isRecording ? <StopIcon /> : <RecordMicIcon />}
                    label={
                        isProcessing
                            ? t("COMMON.PROCESSING")
                            : isRecording
                                ? `${t("COMMON.STOP_RECORDING")} (${formatTime(recordingTime)})`
                                : t("COMMON.RECORD_FEEDBACK")
                    }
                    onClick={handleRecordClick}
                    disabled={disabled || isProcessing}
                    variant="outlined"
                    color={isRecording ? 'error' : 'primary'}
                />

                {isRecording && (
                    <Box className="recording-indicator flex items-center gap-2">
                        <Box
                            className="recording-dot w-3 h-3 bg-red-500 rounded-full"
                            sx={{
                                animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                }
                            }}
                        />
                        <Typography variant="caption" className="text-gray-600">
                            {formatTime(recordingTime)}
                        </Typography>
                    </Box>
                )}

                {isProcessing && (
                    <Typography variant="caption" className="text-blue-600">
                        Processing recording...
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
