# Available Web Components Reference

This document lists all shared React components converted to Web Components with their tag names.

**Prefix:** `tvs` (configurable)

## Component List

| React Component | Custom Element Tag | Use Case |
|-----------------|-------------------|----------|
| `CustomButton` | `<tvs-custom-button>` | Primary action button with variants |
| `Input` | `<tvs-input>` | Text input field |
| `Select` | `<tvs-select>` | Dropdown selection |
| `Checkbox` | `<tvs-checkbox>` | Boolean toggle |
| `Radio` | `<tvs-radio>` | Single selection from group |
| `Footer` | `<tvs-footer>` | App footer component |
| `Unauthorized` | `<tvs-unauthorized>` | 403/permission error page |
| `DebouncedSearchInput` | `<tvs-debounced-search-input>` | Optimized search input |
| `Accordion` | `<tvs-accordion>` | Expandable sections |
| `Popup` | `<tvs-popup>` | Modal dialog |
| `CommonTable` | `<tvs-common-table>` | Data table with sorting/filtering |
| `CommonActionTable` | `<tvs-common-action-table>` | Table with row actions |
| `CommonActionList` | `<tvs-common-action-list>` | List with row actions |
| `CommonTabs` | `<tvs-common-tabs>` | Tab navigation |
| `CommonMenu` | `<tvs-common-menu>` | Dropdown menu |
| `CommonDrawer` | `<tvs-common-drawer>` | Side drawer/sidebar |
| `CardList` | `<tvs-card-list>` | List of cards |
| `CommonPagination` | `<tvs-common-pagination>` | Page navigation |
| `CostDisplay` | `<tvs-cost-display>` | Display prices/costs |
| `CommonFilter` | `<tvs-common-filter>` | Advanced filtering UI |
| `Image` | `<tvs-image>` | Optimized image display |
| `ProductCard` | `<tvs-product-card>` | Product display card |
| `StatusCard` | `<tvs-status-card>` | Status/status display |
| `InfoGridSection` | `<tvs-info-grid-section>` | Information grid layout |
| `NoticeCard` | `<tvs-notice-card>` | Alert/notice card |
| `CommonListItem` | `<tvs-common-list-item>` | Single list item |
| `CustomTabPanel` | `<tvs-custom-tab-panel>` | Tab panel content |
| `SubHeader` | `<tvs-sub-header>` | Secondary header |
| `SubHeaderSearch` | `<tvs-sub-header-search>` | Header search component |
| `ActionTable` | `<tvs-action-table>` | Table focused on actions |
| `ActionList` | `<tvs-action-list>` | List of actionable items |
| `CommonSort` | `<tvs-common-sort>` | Sort controls |
| `CustomMultiSelectOptions` | `<tvs-custom-multi-select-options>` | Multi-select dropdown |
| `CustomMultiSelectPill` | `<tvs-custom-multi-select-pill>` | Multi-select with pills |
| `CustomDocumentUploader` | `<tvs-custom-document-uploader>` | File upload component |
| `SelectableCards` | `<tvs-selectable-cards>` | Selectable card grid |
| `CommonDatePicker` | `<tvs-common-date-picker>` | Date selection |
| `CommonTimePicker` | `<tvs-common-time-picker>` | Time selection |
| `CommonTabPanel` | `<tvs-common-tab-panel>` | Tab panel container |
| `CustomImageCard` | `<tvs-custom-image-card>` | Card with image |
| `CommonCarousel` | `<tvs-common-carousel>` | Image/content carousel |
| `SegmentedButtonForMobile` | `<tvs-segmented-button-for-mobile>` | Mobile-optimized buttons |
| `NoDataFound` | `<tvs-no-data-found>` | Empty state display |
| `ToastMessage` | `<tvs-toast-message>` | Pop-up notification |
| `Stepper` | `<tvs-stepper>` | Step-by-step wizard |
| `CommonSummaryCard` | `<tvs-common-summary-card>` | Summary/stats card |
| `UploadSheet` | `<tvs-upload-sheet>` | Bulk upload component |
| `CustomAudioRecorder` | `<tvs-custom-audio-recorder>` | Audio recording |
| `DownloadProgress` | `<tvs-download-progress>` | Download progress indicator |
| `PreviewNotification` | `<tvs-preview-notification>` | Notification preview |

## Usage Examples

### Simple Props Example
```html
<!-- Button -->
<tvs-custom-button label="Save" variant="contained"></tvs-custom-button>

<!-- Input -->
<tvs-input placeholder="Enter text" type="text"></tvs-input>

<!-- Checkbox -->
<tvs-checkbox label="I agree" checked></tvs-checkbox>
```

### Complex Props Example
```ts
// Table with data
const table = document.querySelector('tvs-common-table');
table.props = {
  rows: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ],
  columns: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ],
  onRowClick: (row) => console.log('Selected:', row),
};

// Multi-select
const multiSelect = document.querySelector('tvs-custom-multi-select-options');
multiSelect.props = {
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: ['Option 1'],
  onChange: (selected) => console.log('Selected:', selected),
};

// Date picker
const datePicker = document.querySelector('tvs-common-date-picker');
datePicker.props = {
  value: new Date('2024-03-15'),
  onChange: (date) => console.log('Date:', date),
};
```

### Event Handling Example
```html
<!-- Button -->
<tvs-custom-button label="Save" on-click="handleSave"></tvs-custom-button>

<!-- Input (typically used with input event) -->
<tvs-input placeholder="Search" on-change="handleSearch"></tvs-input>

<!-- Tab selection -->
<tvs-common-tabs on-change="handleTabChange"></tvs-common-tabs>

<script>
  // Listen for events
  document.querySelector('tvs-custom-button')
    .addEventListener('handleSave', (e) => {
      console.log('Save clicked!');
    });

  document.querySelector('tvs-input')
    .addEventListener('handleSearch', (e) => {
      console.log('Search query:', e.detail);
    });
</script>
```

## Grouped by Category

### Input Components
- `<tvs-input>` - Text input
- `<tvs-select>` - Dropdown select
- `<tvs-custom-multi-select-options>` - Multi-select dropdown
- `<tvs-custom-multi-select-pill>` - Multi-select with pill tags
- `<tvs-checkbox>` - Checkbox
- `<tvs-radio>` - Radio button
- `<tvs-debounced-search-input>` - Search with debounce
- `<tvs-common-date-picker>` - Date picker
- `<tvs-common-time-picker>` - Time picker

### Display Components
- `<tvs-custom-button>` - Button
- `<tvs-product-card>` - Product display
- `<tvs-status-card>` - Status display
- `<tvs-notice-card>` - Notice/alert
- `<tvs-cost-display>` - Price/cost display
- `<tvs-custom-image-card>` - Image card
- `<tvs-no-data-found>` - Empty state
- `<tvs-toast-message>` - Toast notification
- `<tvs-preview-notification>` - Notification preview

### Data Table Components
- `<tvs-common-table>` - Standard table
- `<tvs-common-action-table>` - Table with actions
- `<tvs-action-table>` - Action-focused table
- `<tvs-common-pagination>` - Pagination
- `<tvs-common-sort>` - Sort controls
- `<tvs-common-filter>` - Filter controls

### Navigation Components
- `<tvs-common-tabs>` - Tab navigation
- `<tvs-common-menu>` - Dropdown menu
- `<tvs-common-drawer>` - Side drawer
- `<tvs-sub-header>` - Secondary header
- `<tvs-sub-header-search>` - Header search
- `<tvs-footer>` - Footer
- `<tvs-stepper>` - Step navigator

### Container/Container Components
- `<tvs-popup>` - Modal dialog
- `<tvs-accordion>` - Expandable sections
- `<tvs-common-carousel>` - Image carousel
- `<tvs-card-list>` - Card list
- `<tvs-common-list-item>` - List item
- `<tvs-info-grid-section>` - Info grid

### File/Upload Components
- `<tvs-custom-document-uploader>` - Document upload
- `<tvs-upload-sheet>` - Bulk upload
- `<tvs-custom-audio-recorder>` - Audio recording
- `<tvs-download-progress>` - Download progress

### Utility/Layout Components
- `<tvs-image>` - Optimized image
- `<tvs-custom-tab-panel>` - Tab panel
- `<tvs-common-tab-panel>` - Tab panel variant
- `<tvs-selectable-cards>` - Selectable cards
- `<tvs-segmented-button-for-mobile>` - Mobile buttons
- `<tvs-unauthorized>` - Error page
- `<tvs-common-action-list>` - Action list
- `<tvs-action-list>` - Action list variant
- `<tvs-common-summary-card>` - Summary card

## Registration

### Register All
```ts
import { registerAllWebComponents } from '@shared/components';

const tags = registerAllWebComponents({ prefix: 'tvs' });
console.log(tags); // All tag names
```

### Register Specific
```ts
import { registerWebComponent } from '@shared/components';

registerWebComponent('CustomButton', { prefix: 'tvs' });
registerWebComponent('CommonTable', { prefix: 'tvs' });
```

### Register with Exclusions
```ts
registerAllWebComponents({
  prefix: 'tvs',
  exclude: ['ToastMessage', 'PreviewNotification'],
});
```

## Notes

- All component names follow React naming conventions (PascalCase)
- Custom element tags use kebab-case: `ComponentName` → `component-name`
- Prefix is configurable: default is `tvs` (TVS components)
- Not all components may have complete Web Components support yet
- For complex props, use the `.props` property instead of HTML attributes

## Support

For each component:
1. Check React component documentation in `shared/src/components/[ComponentName]/`
2. Props match the React component interface
3. Events fire as CustomEvent with component callback parameters as detail

See [WEB_COMPONENTS_USAGE.md](./WEB_COMPONENTS_USAGE.md) for full API reference.
