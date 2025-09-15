export interface CommonPaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  costLabel?: string;
  costAmount?: number | string;
  onDownloadClick?: () => void;
  onUploadClick?: () => void;
  selectedCount?: number;
}