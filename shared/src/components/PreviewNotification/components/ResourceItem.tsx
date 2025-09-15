import React, { useCallback, useMemo } from "react";
import { Box, Link, IconButton, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { MediaItem, PreviewNotificationConfig } from "../PreviewNotification.interface";
import { isVideoFile, isPdfFile } from "../utils/fileUtils";
import { getDirectUrlIfAbsolute, buildApiFileUrl } from "../utils/urlUtils";

interface ResourceItemProps {
  file: MediaItem;
  onDownload: (url: string) => void;
  isTrainingPreview?: boolean;
  onVideoClick?: (url: string, title: string) => void;
  onPdfClick?: (url: string, title: string) => void;
  config: PreviewNotificationConfig;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ 
  file, 
  onDownload, 
  isTrainingPreview = false,
  onVideoClick,
  onPdfClick,
  config
}) => {
  const fileWithContentType = file as MediaItem & { contentType?: string };
  const isVideo = isVideoFile(file.fileName, fileWithContentType.contentType);
  const isPdf = isPdfFile(file.fileName, fileWithContentType.contentType);

  // Compute URLs based on isTrainingPreview - using separate utility functions
  const viewUrl = useMemo(() => {
    if (isTrainingPreview) {
      return getDirectUrlIfAbsolute(file.url) ?? buildApiFileUrl(file.url, config.apiBaseUrl, config.viewFileApi);
    }
    return buildApiFileUrl(file.url, config.apiBaseUrl, config.viewFileApi);
  }, [file.url, isTrainingPreview, config]);

  const downloadUrl = useMemo(() => {
    if (isTrainingPreview) {
      return getDirectUrlIfAbsolute(file.url) ?? `${config.apiBaseUrl}${config.downloadFileApi}${file.url}`;
    }
    return `${config.apiBaseUrl}${config.downloadFileApi}${file.url}`;
  }, [file.url, isTrainingPreview, config]);

  const proxyViewUrl = useMemo(() => {
    return `${config.basePath}/api/file?file=${config.viewFileApi}${file.url}&view=true`;
  }, [file.url, config]);

  const shouldHideDownload = isTrainingPreview;

  const handleLinkClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (isVideo && onVideoClick) {
        onVideoClick(viewUrl, file.fileName);
        return;
      }

      if (isPdf && onPdfClick) {
        onPdfClick(viewUrl, file.fileName);
        return;
      }

      if (isTrainingPreview && getDirectUrlIfAbsolute(file.url)) {
        window.open(file.url, "_blank", "noopener,noreferrer");
      } else {
        window.open(proxyViewUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error('Error opening file link:', error);
    }
  }, [file.url, file.fileName, isVideo, isPdf, onVideoClick, onPdfClick, isTrainingPreview, viewUrl, proxyViewUrl]);

  const handleVideoPlayClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (onVideoClick) {
      onVideoClick(viewUrl, file.fileName);
    }
  }, [file.fileName, onVideoClick, viewUrl]);

  const handleDownloadClick = useCallback(() => {
    try {
      onDownload(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }, [downloadUrl, onDownload]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Link
          component="button"
          variant="body1"
          fontWeight={500}
          underline="hover"
          onClick={handleLinkClick}
          sx={{
            textAlign: "left",
            cursor: "pointer",
            color: "var(--primary-700)",
            "&:hover": {
              color: "var(--primary-800)",
            },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          disabled={!viewUrl}
        >
          {file.fileName || 'Unnamed file'}
          {isVideo && (
            <PlayCircleOutlineIcon 
              sx={{ 
                fontSize: 20, 
                ml: 0.5 
              }} 
            />
          )}
        </Link>
        {isVideo && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Video file
          </Typography>
        )}
        {isPdf && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            PDF document
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isVideo && onVideoClick && (
          <IconButton
            aria-label={`Play video ${file.fileName || 'file'}`}
            onClick={handleVideoPlayClick}
            sx={{
              color: "var(--primary-700)",
              "&:hover": {
                color: "var(--primary-800)",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            <PlayCircleOutlineIcon />
          </IconButton>
        )}
        
        {!shouldHideDownload && (
          <IconButton
            aria-label={`Download ${file.fileName || 'file'}`}
            onClick={handleDownloadClick}
            disabled={!downloadUrl}
          >
            <FileDownloadOutlinedIcon className="cursor-pointer text-black text-[18px]" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ResourceItem;
