import React from 'react';
import { Close } from '@mui/icons-material';
import Upload from './components/Upload';
import DownloadTemplate from './components/DownloadTemplate';
import { CustomButton } from '../Button';
const styles = require('./UploadSheet.module.css');
export interface UploadConfig {
  title?: string;
  chooseFileText?: string;
  acceptedFileTypes?: string;
  maxFileSize?: string;
  supportedFormatsText?: string;
  maxSizeText?: string;
  successMessage?: string;
  errorMessages?: {
    upload?: string;
    partialError?: string;
    unknown?: string;
  };
  downloadButtonLabel?: string;
}

export interface DownloadTemplateConfig {
  templateSectionTitle?: string;
  templateDescription?: string;
  downloadButtonLabel?: string;
  uploadButtonLabel?: string;
}

export interface UploadSheetProps {
  endPoint: string;
  uploadFile: (endPoint: string, formData: any) => Promise<any>;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: Error) => void;
  onDownloadCTA?: () => void;
  onClose?: () => void;
  additionalFormData: Record<string, string>;
  downloadErrorSheet: (result: any) => void;
  uploadConfig?: UploadConfig;
  downloadConfig?: DownloadTemplateConfig;
  uploadButtonLabel?: string;
}

export const UploadSheet: React.FC<UploadSheetProps> = ({
  endPoint,
  onUploadSuccess,
  onUploadError,
  onDownloadCTA,
  onClose,
  additionalFormData,
  uploadFile,
  downloadErrorSheet,
  uploadConfig,
  downloadConfig,
  uploadButtonLabel = 'Upload Excel'
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  React.useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.focus();
    }
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close overlay if clicked outside the content area
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Close overlay on Escape key
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (selectedFile && (window as any).uploadComponent?.triggerUpload) {
      (window as any).uploadComponent.triggerUpload();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-sheet-title"
      tabIndex={-1}
    >
      <div className={styles.sheet}>
        <div className={styles.sheetHeader}>
          <div className={styles.headerLeft}>
            <h2 id="upload-sheet-title" className={styles.headerTitle}>
              {uploadConfig?.title || 'Upload Excel'}
            </h2>
          </div>
          <button
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            <Close className={styles.closeIcon} />
          </button>
        </div>

        <Upload
          endPoint={endPoint}
          uploadFile={uploadFile}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
          additionalFormData={additionalFormData}
          downloadErrorSheet={downloadErrorSheet}
          onFileSelect={handleFileSelect}
          onUploadingChange={setIsUploading}
          config={uploadConfig}
        />
        <DownloadTemplate 
          onCTAClick={onDownloadCTA}
          config={downloadConfig}
        />
        
        <div className={styles.uploadButtonContainer}>
          <CustomButton
            label={uploadButtonLabel}
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading}
            variant="contained"
            size="small"
          />
        </div>
      </div>
    </div>
  );
};
