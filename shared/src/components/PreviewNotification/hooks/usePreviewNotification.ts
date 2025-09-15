import { useCallback, useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MediaItem, UploadedFile, NotificationItem, PreviewNotificationConfig } from "../PreviewNotification.interface";
import { DEFAULT_PRIORITY_COLORS,ERROR_MESSAGES} from "../utils/constants";
import { getYouTubeEmbedUrl, formatUrl } from "../utils/urlUtils";
import { isVideoFile } from "../utils/fileUtils";

interface UsePreviewNotificationProps {
  previewData: NotificationItem;
  media: MediaItem[];
  droppedImages?: UploadedFile[];
  isTrainingPreview?: boolean;
  onVideoClick?: (url: string, title: string) => void;
  config: PreviewNotificationConfig;
  priorityColors?: Record<string, { bg: string; text: string }>;
  onError?: (message: string) => void;
}

interface UsePreviewNotificationReturn {
  tab: number;
  previewImage: string;
  videoDialogOpen: boolean;
  videoEmbedUrl: string;
  imageArray: MediaItem[];
  docsArray: MediaItem[];
  priorityStyle: { bg: string; text: string } | null;
  tabList: Array<{ label: string; value: number }>;
  handleError: (message: string, error?: unknown) => void;
  handlePreviewClick: (url: string) => void;
  handleTabChange: (_event: React.SyntheticEvent, newValue: string | number) => void;
  setTab: (value: number) => void;
  setVideoDialogOpen: (value: boolean) => void;
  setVideoEmbedUrl: (value: string) => void;
  setPreviewImage: (value: string) => void;
  getVideoFiles: () => MediaItem[];
  getNonVideoDocuments: () => MediaItem[];
}

export const usePreviewNotification = ({
  previewData,
  media,
  droppedImages,
  isTrainingPreview = false,
  onVideoClick,
  priorityColors = DEFAULT_PRIORITY_COLORS,
  onError,
}: UsePreviewNotificationProps): UsePreviewNotificationReturn => {
  const [tab, setTab] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState<string>("");

  const { t } = useTranslation("translations");

  // Error handling
  const handleError = useCallback((message: string, error?: unknown) => {
    console.error(message, error);
    onError?.(message);
  }, [onError]);

  // Handle preview click - YouTube or external link
  const handlePreviewClick = useCallback((url: string) => {
    try {
      if (!url) {
        handleError(ERROR_MESSAGES.INVALID_URL);
        return;
      }

      const formattedUrl = formatUrl(url);
      if (!formattedUrl) {
        handleError(ERROR_MESSAGES.INVALID_URL);
        return;
      }

      const embed = getYouTubeEmbedUrl(formattedUrl);

      if (embed) {
        setVideoEmbedUrl(embed);
        setVideoDialogOpen(true);
      } else {
        window.open(formattedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      handleError(ERROR_MESSAGES.GENERIC_ERROR, error);
    }
  }, [handleError]);

  // Tab change handler
  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string | number) => {
      setTab(Number(newValue));
    },
    []
  );

  // Filter images from media
  const imageArray = useMemo(
    () => media.filter((item) => item.mediaType === "IMAGE"),
    [media]
  );

  // Filter documents from media
  const docsArray = useMemo(
    () => media.filter((item) => item.mediaType === "DOC"),
    [media]
  );

  // Get priority colors
  const priorityStyle = useMemo(
    () => previewData && priorityColors[previewData.criticality],
    [previewData, priorityColors]
  );

  // Tab labels
  const tabList = useMemo(() => [
    { label: t("NOTIFICATIONS.ANNOUNCEMENTS.ON_HOME_PAGE"), value: 0 },
    { label: t("NOTIFICATIONS.ANNOUNCEMENTS.IN_DETAIL"), value: 1 },
  ], [t]);

  // Get video files from docs
  const getVideoFiles = useCallback(() => {
    if (!isTrainingPreview || !onVideoClick) return [];

    return docsArray.filter(file => {
      const fileWithContentType = file as MediaItem & { contentType?: string };
      return isVideoFile(file.fileName, fileWithContentType.contentType);
    });
  }, [docsArray, isTrainingPreview, onVideoClick]);

  // Get non-video documents
  const getNonVideoDocuments = useCallback(() => {
    if (isTrainingPreview && onVideoClick) {
      return docsArray.filter(file => {
        const fileWithContentType = file as MediaItem & { contentType?: string };
        return !isVideoFile(file.fileName, fileWithContentType.contentType);
      });
    }
    return docsArray;
  }, [docsArray, isTrainingPreview, onVideoClick]);

  // Handle dropped images effect
  useEffect(() => {
    if (droppedImages?.length) {
      const objectUrl = URL.createObjectURL(droppedImages[0].file);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage("");
    }
  }, [droppedImages]);

  return {
    tab,
    previewImage,
    videoDialogOpen,
    videoEmbedUrl,
    imageArray,
    docsArray,
    priorityStyle,
    tabList,
    handleError,
    handlePreviewClick,
    handleTabChange,
    setTab,
    setVideoDialogOpen,
    setVideoEmbedUrl,
    setPreviewImage,
    getVideoFiles,
    getNonVideoDocuments,
  };
};
