'use client';

import React from 'react';
import { CustomButton } from '../../Button';
const styles = require('./DownloadTemplate.module.css');
export interface DownloadTemplateConfig {
  templateSectionTitle?: string;
  templateDescription?: string;
  downloadButtonLabel?: string;
}

export interface DownloadProps {
  onCTAClick?: () => void;
  config?: DownloadTemplateConfig;
}

const DownloadTemplate: React.FC<DownloadProps> = ({ onCTAClick, config }) => {
  const defaultConfig: DownloadTemplateConfig = {
    templateSectionTitle: 'Template',
    templateDescription: 'You can download the template to upload data in the correct format',
    downloadButtonLabel: 'Download Template'
  };

  const finalConfig = { ...defaultConfig, ...config };
  const handleDownloadClick = () => {
    if (onCTAClick) {
      onCTAClick();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.templateSection}>
        <h3 className={styles.templateTitle}>
          {finalConfig.templateSectionTitle}
        </h3>
        <p className={styles.templateDescription}>
          {finalConfig.templateDescription}
        </p>
        <CustomButton
          label={finalConfig.downloadButtonLabel || 'Download'}
          onClick={handleDownloadClick}
          variant="outlined"
          size="small"
        />
      </div>
    </div>
  );
};

export default DownloadTemplate;
