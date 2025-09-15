# UploadSheet Component Usage Examples

## Basic Usage

```tsx
import { UploadSheet } from '@shared/components/UploadSheet';

// Basic usage with minimal configuration
<UploadSheet
  endPoint="/api/upload"
  uploadFile={uploadFunction}
  onUploadSuccess={handleSuccess}
  onUploadError={handleError}
  onDownloadCTA={handleDownloadTemplate}
  onClose={handleClose}
  additionalFormData={{ purpose: 'parts' }}
  downloadErrorSheet={handleDownloadError}
  uploadButtonLabel="Upload Excel"
/>
```

## Customized Usage

```tsx
import { UploadSheet } from '@shared/components/UploadSheet';

const customUploadConfig = {
  title: 'Import Vehicle Data',
  chooseFileText: 'Select Vehicle File',
  acceptedFileTypes: '.csv,.xlsx',
  maxFileSize: '50 MB',
  supportedFormatsText: 'Supported: CSV, Excel files',
  maxSizeText: 'Max size: 50 MB',
  successMessage: 'Vehicle data imported successfully!',
  errorMessages: {
    upload: 'Vehicle import failed',
    partialError: 'Some vehicles could not be imported. Download error report.',
    unknown: 'Unexpected error during import'
  },
  downloadButtonLabel: 'Download Error Report'
};

const customDownloadConfig = {
  templateSectionTitle: 'Vehicle Template',
  templateDescription: 'Download the vehicle template with the required format',
  downloadButtonLabel: 'Get Vehicle Template'
};

<UploadSheet
  endPoint="/api/vehicles/import"
  uploadFile={uploadFunction}
  onUploadSuccess={handleSuccess}
  onUploadError={handleError}
  onDownloadCTA={handleDownloadTemplate}
  onClose={handleClose}
  additionalFormData={{ 
    purpose: 'vehicles',
    tenant: 'norton-uk'
  }}
  downloadErrorSheet={handleDownloadError}
  uploadConfig={customUploadConfig}
  downloadConfig={customDownloadConfig}
  uploadButtonLabel="Import Vehicles"
/>
```

## Configuration Options

### UploadConfig Interface
```tsx
interface UploadConfig {
  title?: string;                    // Header title (default: 'Upload Excel')
  chooseFileText?: string;           // File selection text (default: 'Choose File')
  acceptedFileTypes?: string;        // File input accept attribute (default: '.csv,.xlsx,.xls')
  maxFileSize?: string;              // Display text for max size (default: '25 MB')
  supportedFormatsText?: string;     // Supported formats info (default: 'Supported file types: CSV, XLSX')
  maxSizeText?: string;              // Max size info (default: 'Maximum size: 25 MB')
  successMessage?: string;           // Success message (default: 'File uploaded successfully!')
  errorMessages?: {
    upload?: string;                 // Upload error (default: 'Upload failed')
    partialError?: string;           // Partial error message
    unknown?: string;                // Unknown error message
  };
  downloadButtonLabel?: string;      // Error sheet download button (default: 'Download Excel')
}
```

### DownloadTemplateConfig Interface
```tsx
interface DownloadTemplateConfig {
  templateSectionTitle?: string;     // Template section title (default: 'Template')
  templateDescription?: string;      // Template description text
  downloadButtonLabel?: string;      // Download template button (default: 'Download Template')
}
```

### UploadSheetProps Interface
```tsx
interface UploadSheetProps {
  endPoint: string;                  // API endpoint for file upload
  uploadFile: (endPoint: string, formData: any) => Promise<any>;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: Error) => void;
  onDownloadCTA?: () => void;        // Template download handler
  onClose?: () => void;              // Modal close handler
  additionalFormData: Record<string, string>;
  downloadErrorSheet: (result: any) => void;
  uploadConfig?: UploadConfig;       // Upload component configuration
  downloadConfig?: DownloadTemplateConfig; // Template section configuration
  uploadButtonLabel?: string;        // Upload button text (default: 'Upload Excel')
}
```

## Styling Customization

The components use CSS modules for styling. You can override styles by:

1. **CSS Custom Properties**: Override CSS variables in your global styles
2. **CSS Modules Override**: Create your own CSS module with the same class names
3. **Component Wrapper**: Wrap the component and apply custom styles

### Example CSS Override
```css
/* In your global CSS or component-specific CSS */
.upload-sheet-override .overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.upload-sheet-override .sheet {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## Different Use Cases

### Parts Upload
```tsx
const partsConfig = {
  title: 'Import Parts',
  chooseFileText: 'Select Parts File',
  successMessage: 'Parts imported successfully!'
};

<UploadSheet
  endPoint="/api/parts/bulk-upload"
  additionalFormData={{ purpose: 'parts' }}
  uploadConfig={partsConfig}
  uploadButtonLabel="Import Parts"
  // ... other props
/>
```

### Vehicle Upload
```tsx
const vehicleConfig = {
  title: 'Import Vehicles',
  chooseFileText: 'Select Vehicle File',
  acceptedFileTypes: '.xlsx,.csv',
  successMessage: 'Vehicles imported successfully!'
};

<UploadSheet
  endPoint="/api/vehicles/bulk-upload"
  additionalFormData={{ purpose: 'vehicles' }}
  uploadConfig={vehicleConfig}
  uploadButtonLabel="Import Vehicles"
  // ... other props
/>
```

### Customer Data Upload
```tsx
const customerConfig = {
  title: 'Import Customer Data',
  chooseFileText: 'Select Customer File',
  maxFileSize: '10 MB',
  supportedFormatsText: 'Supported: CSV files only',
  acceptedFileTypes: '.csv'
};

<UploadSheet
  endPoint="/api/customers/import"
  additionalFormData={{ purpose: 'customers' }}
  uploadConfig={customerConfig}
  uploadButtonLabel="Import Customers"
  // ... other props
/>
```

## Upload Button Positioning

The upload button is now positioned at the bottom of the modal with consistent styling and behavior:

- **Always Visible**: Upload button is always at the bottom, regardless of template section
- **Disabled State**: Automatically disabled when no file is selected or during upload
- **Customizable Label**: Button text can be customized via `uploadButtonLabel` prop
- **Clean Separation**: Visual separator between content and action button

## Features

✅ **Zero Hardcoded Content**: All text, labels, and messages are configurable
✅ **CSS Modules**: Scoped styling with customization options
✅ **TypeScript**: Fully typed interfaces for configuration
✅ **Responsive**: Mobile and tablet-friendly design
✅ **Accessible**: ARIA labels and keyboard navigation support
✅ **File Validation**: Configurable file types and size limits
✅ **Error Handling**: Comprehensive error states and messages
✅ **Progress States**: Loading, success, and error indicators
✅ **Drag & Drop**: File drag and drop support
✅ **File Preview**: Selected file information display
✅ **Flexible Upload Button**: Positioned at bottom with customizable label