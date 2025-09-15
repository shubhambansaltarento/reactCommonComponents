import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Card, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Image from "next/image";
import { CommonTabs } from "../CommonTabs";
import { CustomButton } from "../Button";
import { CommonTabPanel } from "../CommonTabPanel/CommonTabPanel";
import { ImageCard } from "../CustomImageCard/CustomImageCard";
import styles from "./PreviewNotification.module.css";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

// Import components
import ActionButton from "./components/ActionButton";
import VideoPlayer from "./components/VideoPlayer";
import PriorityChip from "./components/PriorityChip";
import ResourceItem from "./components/ResourceItem";

// Import hook with all business logic
import { usePreviewNotification } from "./hooks/usePreviewNotification";

// Import utilities
import { getDirectUrlIfAbsolute, buildApiFileUrl } from "./utils/urlUtils";

// Import interfaces
import { 
  PreviewNotificationProps, 
  UploadedFile, 
  MediaItem, 
  NotificationItem,
  PreviewNotificationConfig 
} from "./PreviewNotification.interface";

// Re-export interfaces for consumers
export type { 
  UploadedFile, 
  MediaItem, 
  NotificationItem, 
  PreviewNotificationConfig,
  PreviewNotificationProps 
};

// Helper to get file URL - keeps boolean logic at component level
const getFileUrl = (url: string, apiBaseUrl: string, viewFileApi: string, useDirectUrl: boolean): string => {
  if (useDirectUrl) {
    return getDirectUrlIfAbsolute(url) ?? buildApiFileUrl(url, apiBaseUrl, viewFileApi);
  }
  return buildApiFileUrl(url, apiBaseUrl, viewFileApi);
};

export default function PreviewMediaContent({
  previewData,
  media,
  droppedImages,
  onOpenPreviewNotificationClose,
  isEditMode,
  isTrainingPreview = false,
  onVideoClick,
  onPdfClick,
  config,
  priorityColors,
}: PreviewNotificationProps) {
  // Use custom hook - all business logic here
  const {
    tab,
    previewImage,
    videoDialogOpen,
    videoEmbedUrl,
    imageArray,
    priorityStyle,
    tabList,
    handlePreviewClick,
    handleTabChange,
    getVideoFiles,
    getNonVideoDocuments,
  } = usePreviewNotification({
    previewData,
    media,
    droppedImages,
    isTrainingPreview,
    onVideoClick,
    config,
    priorityColors,
  });

  const { t } = useTranslation("translations");

  // ===== RENDER FUNCTIONS (UI ONLY) =====

  const renderTrainingVideos = () => {
    if (!isTrainingPreview || !onVideoClick) return null;

    const videoFiles = getVideoFiles();
    if (videoFiles.length === 0) return null;

    return (
      <>
        <Typography className={`${styles.trainingVideosLabel}`} variant="subtitle2">
          Training Videos
        </Typography>
        <Box className={styles.trainingVideosList}>
          {videoFiles.map((file) => (
            <Box
              key={file.url || file.fileName}
              className={styles.trainingVideoItem}
              onClick={() => {
                const videoUrl = getFileUrl(file.url, config.apiBaseUrl, config.viewFileApi, isTrainingPreview);
                onVideoClick?.(videoUrl, file.fileName);
              }}
            >
              <Box className={styles.trainingVideoContent}>
                <Typography variant="body1" className={styles.trainingVideoTitle}>
                  {file.fileName || 'Training Video'}
                </Typography>
                <Typography variant="caption" color="text.secondary" className={styles.trainingVideoSubtitle}>
                  Click to play training video
                </Typography>
              </Box>

              <IconButton
                className={styles.trainingVideoIconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  const videoUrl = getFileUrl(file.url, config.apiBaseUrl, config.viewFileApi, isTrainingPreview);
                  onVideoClick?.(videoUrl, file.fileName);
                }}
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </>
    );
  };

  const renderImageContent = () => {
    return (
      <Box className="flex flex-col sm:flex-row flex-wrap gap-2 mt-1 p-1 ml-4">
        {imageArray.length > 0 && imageArray.map((item) => {
          return (
            <Box
              key={item.url}
              component="img"
              src={`${config.basePath}/api/file?file=${config.viewFileApi}${item.url}`}
              alt={
                previewData.title
                  ? `${previewData.title}-image`
                  : `preview`
              }
              className="rounded-md w-48 h-48 object-cover"
            />
          );
        })}
        
        {droppedImages?.map((item) => {
          try {
            const objectUrl = item.file ? URL.createObjectURL(item.file) : "";
            return (
              <Image
                key={item.fileName}
                src={objectUrl}
                alt={
                  previewData.title
                    ? `${previewData.title}-uploaded`
                    : "Preview"
                }
                width={200}
                height={150}
                style={{ objectFit: "cover" }}
              />
            );
          } catch (error) {
            console.error('Error creating object URL:', error);
            return (
              <Box
                key={`error-${item.fileName}`}
                className="rounded-md w-48 h-48 bg-gray-200 flex items-center justify-center"
              >
                <Typography variant="body2" color="text.secondary">
                  Preview unavailable
                </Typography>
              </Box>
            );
          }
        })}
      </Box>
    );
  };

  const renderResources = () => {
    if (previewData.templateType !== "IMAGE") return null;

    const nonVideoDocs = getNonVideoDocuments();

    if (nonVideoDocs.length === 0) return null;

    return (
      <>
        <Typography className="pl-2 pt-2" variant="subtitle2">
          {t("NOTIFICATIONS.ANNOUNCEMENTS.RESOURCES")}
        </Typography>
        <Box className={styles.resourcesContainer}>
          {nonVideoDocs.map((file) => (
            <ResourceItem
              key={file.url || file.fileName}
              file={file}
              isTrainingPreview={isTrainingPreview}
              onVideoClick={onVideoClick}
              onPdfClick={onPdfClick}
              config={config}
              onDownload={() => window.open(`${config.basePath}/api/file?file=${config.downloadFileApi}${file.url}`, "_blank", "noopener,noreferrer")}
            />
          ))}
        </Box>
      </>
    );
  };

  const renderExternalLinksButtons = () => (
    <>
      {previewData?.externalLinks && previewData.externalLinks.length > 0 && (
        <Box className={styles.externalLinksContainer}>
          {previewData.externalLinks.map((externalLink, idx) => {
            if (!externalLink) return null;

            return (
              <CustomButton
                key={externalLink}
                variant="outlined"
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePreviewClick(externalLink);
                }}
                className={styles.externalLinkButton}
              >
                External Link {idx + 1}
              </CustomButton>
            );
          })}
        </Box>
      )}
      {!isTrainingPreview && <Divider />}
    </>
  );

  const renderActionButtons = () => {
    if (isTrainingPreview) {
      return null;
    }

    return (
      <Box className={styles.actionButtonsContainer}>
        {previewData?.userAction?.[0]?.name && (
          <ActionButton
            userAction={previewData.userAction[0]}
            variant="contained"
            onPreviewClick={handlePreviewClick}
            sx={{flex:1}}
          />
        )}
        {previewData?.userAction?.[1]?.name && (
          <ActionButton
            userAction={previewData.userAction[1]}
            variant="outlined"
            onPreviewClick={handlePreviewClick}
           sx={{flex:1}}
           />
        )}
      </Box>
    );
  };

  const renderHeader = () => (
    <div className="mb-4 ml-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <Typography variant="h6">
          {previewData.title}
        </Typography>
        <PriorityChip
          criticality={previewData.criticality}
          priorityStyle={priorityStyle}
        />
      </div>
    </div>
  );

  const renderDescription = () => (
    <Box className={styles.descriptionBox}>
      <Typography variant="body2" color="text.secondary" className={styles.descriptionText}>
        {previewData.description}
      </Typography>
      {previewData.validTo && previewData.type !== "training" && (
        <Typography
          variant="body2"
          className={styles.expiryText}
          fontWeight={500}
        >
          {t("NOTIFICATIONS.ANNOUNCEMENTS.EXPIRES_ON")}{" "}
          {dayjs(previewData.validTo).format("MMMM D, YYYY")}
        </Typography>
      )}
    </Box>
  );

  // ===== MAIN RENDER =====

  const content = isEditMode ? (
    <>
     <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => onOpenPreviewNotificationClose(false)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("NOTIFICATIONS.ANNOUNCEMENTS.PREVIEW_TITLE")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Card>
        <CommonTabs value={tab} onChange={handleTabChange} tabList={tabList} />
      </Card>
      <Card>
        <CommonTabPanel tabClassName={`${styles.tabPanelHome}`} value={tab} index={0}>
          <div className={`${styles.image_preview}`}>
            {imageArray.length > 0 || previewImage ? (
              <>
                {imageArray.length > 0 && (
                  <ImageCard
                    image={`${config.basePath}/api/file?file=${config.viewFileApi}${imageArray[0]?.url}`}
                    heading={previewData.title}
                    date={dayjs(previewData.validTo).format("MMMM D, YYYY")}
                    description={previewData.description}
                    height="220px"
                    maxHeight="220"
                  />
                )}
                
                {imageArray.length === 0 && previewImage && (
                  <ImageCard
                    image={previewImage}
                    heading={previewData.title}
                    date={dayjs(previewData.validTo).format("MMMM D, YYYY")}
                    description={previewData.description}
                    height="220px"
                    maxHeight="220"
                  />
                )}
                
                {(imageArray.length > 1 || (imageArray.length > 0 && droppedImages?.length)) && (
                  <Box className="flex flex-wrap gap-2 mt-4">
                    {imageArray.slice(1).map((item) => (
                      <Box
                        key={item.url}
                        component="img"
                        src={`${config.apiBaseUrl}${config.viewFileApi}${item.url}`}
                        alt={`${previewData.title}-additional`}
                        className="rounded-md w-24 h-24 object-cover"
                      />
                    ))}
                    
                    {imageArray.length > 0 && droppedImages?.map((item) => {
                      try {
                        const objectUrl = item.file ? URL.createObjectURL(item.file) : "";
                        return (
                          <Image
                            key={item.fileName}
                            src={objectUrl}
                            alt={`${previewData.title}-uploaded`}
                            width={96}
                            height={96}
                            style={{ objectFit: "cover" }}
                            className="rounded-md"
                          />
                        );
                      } catch (error) {
                        console.error('Error creating object URL:', error);
                        return (
                          <Box
                            key={`error-${item.fileName}`}
                            className="rounded-md w-24 h-24 bg-gray-200 flex items-center justify-center"
                          >
                            <Typography variant="caption" color="text.secondary">
                              {t("NOTIFICATIONS.ANNOUNCEMENTS.NO_PREVIEW")}             
                            </Typography>
                          </Box>
                        );
                      }
                    })}
                  </Box>
                )}
              </>
            ) : (
              <div className={`${styles.preview_card}`}>
                <div className="flex-shrink-0 mb-3 sm:mb-4">
                  <Typography
                    variant="h6"
                    className="text-gray-800 font-semibold text-base sm:text-lg md:text-xl leading-tight"
                  >
                    {previewData.title}
                  </Typography>
                </div>

                <div className="flex-1"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 max-w-full sm:max-w-[70%]">
                    <Typography
                      variant="body2"
                      className="text-gray-800 text-sm sm:text-base leading-relaxed break-words line-clamp-3 sm:line-clamp-4"
                    >
                      {previewData.description}
                    </Typography>
                  </div>

                  <Typography
                    variant="body2"
                    className="text-gray-600 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
                  >
                    {dayjs(previewData.validTo).format("MMMM D, YYYY")}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </CommonTabPanel>

        <CommonTabPanel tabClassName={styles.tabPanelDetail} value={tab} index={1}>
          <Box className={styles.tabPanelDetailFlexBox}>
            <IconButton
              edge="end"
              className={styles.editIconButton}
              onClick={() => onOpenPreviewNotificationClose(false)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Box>
          <Box className={`${styles.content_render}`}>
            {renderHeader()}
            {renderImageContent()}
            {renderDescription()}
            {renderResources()}
            {renderTrainingVideos()}
            {renderExternalLinksButtons()}
            <VideoPlayer
              videoEmbedUrl={videoEmbedUrl}
              isOpen={videoDialogOpen}
            />
            {renderActionButtons()}
          </Box>
        </CommonTabPanel>
      </Card>
    </>
  ) : (
    <Box className={`${styles.content_render}`}>
      {renderHeader()}
      {renderImageContent()}
      {renderDescription()}
      {renderResources()}
      {renderTrainingVideos()}
      {renderExternalLinksButtons()}
      <VideoPlayer videoEmbedUrl={videoEmbedUrl} isOpen={videoDialogOpen} />
      {renderActionButtons()}
    </Box>
  );

  return content;
}
