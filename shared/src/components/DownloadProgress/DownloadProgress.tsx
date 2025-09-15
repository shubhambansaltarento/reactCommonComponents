"use client";

import React from 'react';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { DownloadIcon } from '../../generated-icon';

export interface DownloadProgressProps {
  isDownloading: boolean;
  onDownload: () => void;
  progress?: number;
  size?: number;
  color?: string;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  isDownloading,
  onDownload,
  progress = 0,
  size = 20,
  color = '#1976d2',
}) => (
  <Box display="inline-flex" alignItems="center" justifyContent="center" gap={0.5} sx={{ minWidth: 50 }}>
    {isDownloading ? (
      <Box display="flex" alignItems="center" gap={0.5}>
        <CircularProgress
          variant={progress > 0 ? "determinate" : "indeterminate"}
          value={progress}
          size={size}
          sx={{ color }}
        />
        {progress > 0 && (
          <Box component="span" sx={{ fontSize: '12px', color, minWidth: '28px' }}>
            {progress}%
          </Box>
        )}
      </Box>
    ) : (
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        size="small"
        sx={{ padding: 0 }}
        aria-label="download"
      >
        <DownloadIcon />
      </IconButton>
    )}
  </Box>
);

export default DownloadProgress;
