import { ReactNode } from "react";

export interface CommonActionTableColumn<T> {
  key: keyof T;
  label: string;
  className?: string;
  transformFn?: (value: any, row: T) => string | number | ReactNode;
  icon?: {
    iconComponent: React.ComponentType<any>;
    hide?: (row: T) => boolean;
    fill?: (row: T) => string;
  };
  // New: Support for custom component rendering
  renderComponent?: (row: T, value: any) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface CommonActionButton<T> {
  iconComponent: React.ComponentType<any>;
  clickHandler?: (row: T) => void;
  hide?: (row: T) => boolean;
  fill?: (row: T) => string;
  tooltip?: string;
}

// New: Custom component props for flexible rendering
export interface CustomComponentProps<T> {
  // For custom components in cells (like date picker, counter, etc.)
  customComponents?: {
    [key: string]: (row: T, column: CommonActionTableColumn<T>) => ReactNode;
  };
  // For action area components
  actionComponents?: (row: T) => ReactNode;
  // For header custom components
  headerComponents?: {
    [columnKey: string]: ReactNode;
  };
}

export interface SelectionProps<T> {
  allowSelection?: boolean;
  selectedRows?: Set<string>;
  onRowSelectionChange?: (selectedRows: Set<string>) => void;
  onSelectRow?: (selectedRows: T[]) => void;
}

export interface StickyProps {
  allowSticky?: boolean;
  minColWidth?: number;
}

export interface PaginationProps {
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  costLabel?: string;
  costAmount?: string | number;
  enablePagination?: boolean;
}

export interface StyleProps {
  getRowClassName?: (row: any) => string;
  wrapperClassName?: string;
}

export interface CommonActionTableProps<T> extends 
  CustomComponentProps<T>,
  SelectionProps<T>, 
  StickyProps, 
  PaginationProps, 
  StyleProps {
  columns: CommonActionTableColumn<T>[];
  data: T[];
  actionButtons?: CommonActionButton<T>[];
  uniqueKey?: keyof T;
  // New: Row interaction props
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  rowActionIndexOnClick?: number;
  // New: Loading and empty states
  loading?: boolean;
  emptyMessage?: string;
  emptyComponent?: ReactNode;
}