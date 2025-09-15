
'use client';

import React from 'react';
import { CustomButton } from '../../Button';
import Excel from '../../../generated-icon/Excel';
const styles = require('./Upload.module.css');
export interface UploadConfig {
  title?: string;
  chooseFileText?: string;
  selectedText?: string;
  sizeText?: string;
  errorText?: string;
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

export interface UploadResult {
  status: 'SUCCESS' | 'ERROR';
  errors?: Array<{ code: string }>;
  data?: {
    summary?: {
      errorCount: number;
    };
    headers?: string[];
    parsedLines?: Record<string, unknown>[];
  };
}

export interface UploadProps {
  endPoint: string;
  uploadFile: (endPoint: string, formData: FormData) => Promise<UploadResult>;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  additionalFormData: Record<string, string>;
  downloadErrorSheet: (result: UploadResult) => void;
  onFileSelect?: (file: File | null) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  config?: UploadConfig;
}

const Upload: React.FC<UploadProps> = ({
  uploadFile,
  onUploadSuccess,
  onUploadError,
  additionalFormData,
  endPoint,
  downloadErrorSheet,
  onFileSelect,
  onUploadingChange,
  config
}) => {
  // Default configuration
  const defaultConfig: UploadConfig = {
    title: 'Upload Excel',
    chooseFileText: 'Choose File',
    selectedText: 'Selected',
    sizeText: 'Size',
    errorText: 'Error',
    acceptedFileTypes: '.csv,.xlsx,.xls',
    maxFileSize: '25 MB',
    supportedFormatsText: 'Supported file types: CSV, XLSX',
    maxSizeText: 'Maximum size: 25 MB',
    successMessage: 'File uploaded successfully!',
    errorMessages: {
      upload: 'Upload failed',
      partialError: 'There are some errors with your upload. Please download the error sheet to check.',
      unknown: 'Unknown error occurred'
    },
    downloadButtonLabel: 'Download Excel'
  };

  const finalConfig = { ...defaultConfig, ...config };
  const [result, setResult] = React.useState<UploadResult | null>(null);
  const [isError, setIsError] = React.useState<string | null>(null);
  const [downloadErrorSheetCTA, setDownloadErrorSheetCTA] = React.useState<boolean | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (file: File) => {
    onUploadingChange?.(true);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
      Object.entries(additionalFormData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const result = await uploadFile(endPoint, formData);
      
      if (result.status === 'SUCCESS') {
        // Pure success case - no errors, just show success
        setIsError('');
        setDownloadErrorSheetCTA(false);
        onUploadSuccess?.(result);
        setResult(result);
      } else if (result.status === 'ERROR') {
        // Check if there's downloadable error data (for validation errors)
        const hasDownloadableErrors = (result.data?.summary?.errorCount && result.data?.summary?.errorCount > 0) || 
                                     (result.data?.headers && result.data?.parsedLines && result.data?.summary?.errorCount);
        
        if (hasDownloadableErrors) {
          // Show error with download button when there's downloadable error data
          const customError = result.errors?.[0]?.code || finalConfig.errorMessages?.partialError || 'There are some errors with your upload. Please download the error sheet to check.';
          setIsError(customError);
          setResult(result);
          setDownloadErrorSheetCTA(true);
        } else {
          // Show error without download button for other errors
          const customError = result.errors?.[0]?.code;  
          setIsError(customError || 'There is some error in your file');
          setResult(result);
          setDownloadErrorSheetCTA(false);
        }
      } else {
        const customError = result.errors?.[0]?.code;
        setIsError(customError || finalConfig.errorMessages?.unknown || 'Unknown error occurred');
        setDownloadErrorSheetCTA(false);
      }
    } catch (error) {
      setIsError(finalConfig.errorMessages?.upload || 'Upload failed');
      setDownloadErrorSheetCTA(false);
      onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  React.useEffect(() => {
    onFileSelect?.(selectedFile);
  }, [selectedFile, onFileSelect]);

  const handleDownloadErrorSheet = () => {
    if(result){
      downloadErrorSheet?.(result);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsError(null);
      setDownloadErrorSheetCTA(null);
      setResult(null);
      setSelectedFile(file);
    }
    event.target.value = '';
  };

  const triggerUpload = React.useCallback(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile]);

  React.useEffect(() => {
    (window as any).uploadComponent = { triggerUpload };
  }, [triggerUpload]);

  return (
    <div className={styles.container}>
      <div className={styles.uploadArea}>
        <input 
          type="file" 
          accept={finalConfig.acceptedFileTypes}
          onChange={handleFileChange}
          className={styles.hiddenInput}
          id="file-input"
        />
        
        <div className={styles.uploadContent}>
          <Excel className={styles.excelIcon} />
          <CustomButton 
            variant="outlined" 
            label={finalConfig.chooseFileText || 'Choose File'} 
            onClick={() => document.getElementById('file-input')?.click()}
            size="small"
          />
        </div>
        
        {selectedFile && (
          <p className={styles.selectedFileName}>
            {finalConfig.selectedText}: {selectedFile.name}
          </p>
        )}
      </div>

       <div className={styles.fileInfo}>
        <span>{finalConfig.supportedFormatsText}</span>
        <span>{finalConfig.maxSizeText}</span>
      </div>

      {selectedFile && (
        <div className={styles.selectedFileContainer}>
          <p className={styles.selectedFileName}>
            {finalConfig.sizeText}: {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {isError && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            {finalConfig.errorText}: {isError}
          </p>
          {downloadErrorSheetCTA && (
            <CustomButton
              label={finalConfig.downloadButtonLabel || 'Download'}
              onClick={handleDownloadErrorSheet}
              variant="outlined"
              size="small"
            />
          )}
        </div>
      )}

      {result && result.status === 'SUCCESS' && (
        <div className={styles.successContainer}>
          <p className={styles.successMessage}>
            {finalConfig.successMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;



