import { Dayjs } from "dayjs";

export interface UploadedFile {
  file: File;
  fileName: string;
}

export interface MediaItem {
  announcementMediaId: string;
  announcementId: string;
  fileName: string;
  url: string;
  mediaType: "IMAGE" | "DOC";
  fileSize?: number;
  uploadedAt?: string;
  contentType?: string;
}

export interface UserAction {
  name: string;
  link?: string;
}

export interface NotificationItem {
  id?: string;
  announcementId?: string;
  title: string;
  description: string;
  criticality: string;
  templateType?: "IMAGE" | "TEXT" | string;
  validTo?: string | Dayjs | null;
  validFrom?: string | Dayjs | null;
  externalLinks?: string[];
  userAction?: UserAction[];
  type?: string | { label: string; value: string };
}

export interface PreviewNotificationConfig {
  basePath: string;
  apiBaseUrl: string;
  viewFileApi: string;
  downloadFileApi: string;
}

export interface PreviewNotificationProps {
  previewData: NotificationItem;
  media: MediaItem[];
  droppedImages?: UploadedFile[];
  isEditMode: boolean;
  onOpenPreviewNotificationClose: (value: boolean) => void;
  isTrainingPreview?: boolean;
  onVideoClick?: (url: string, title: string) => void;
  onPdfClick?: (url: string, title: string) => void;
  config: PreviewNotificationConfig;
  priorityColors?: Record<string, { bg: string; text: string }>;
}
