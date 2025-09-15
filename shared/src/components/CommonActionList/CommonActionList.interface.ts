import { ReactNode } from "react";

export interface CommonActionListColumn<T> {
  key: keyof T;
  label: string;
  className?: string;
  transformFn?: (value: any, row: T) => string | number | ReactNode;
  icon?: {
    iconComponent: React.ComponentType<any>;
    hide?: (row: T) => boolean;
    fill?: (row: T) => string;
  };
  // Support for custom component rendering
  renderComponent?: (row: T, value: any) => ReactNode;
}

export interface CommonActionListButton<T> {
  iconComponent: React.ComponentType<any>;
  clickHandler?: (row: T) => void;
  hide?: (row: T) => boolean;
  fill?: (row: T) => string;
  tooltip?: string;
  label?: string;
}

// Custom component props for flexible rendering
export interface CommonActionListCustomProps<T> {
  // For custom components in card fields
  customComponents?: {
    [key: string]: (row: T, column: CommonActionListColumn<T>) => ReactNode;
  };
  // For action area components
  actionComponents?: (row: T) => ReactNode;
  // For header custom components
  headerComponents?: (row: T) => ReactNode;
  // For footer custom components
  footerComponents?: (row: T) => ReactNode;
}

export interface CommonActionListSelectionProps<T> {
  allowSelection?: boolean;
  selectedRows?: Set<string>;
  onRowSelectionChange?: (selectedRows: Set<string>) => void;
  onSelectRow?: (selectedRows: T[]) => void;
}

export interface CommonActionListPaginationProps {
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  costLabel?: string;
  costAmount?: string | number;
  enablePagination?: boolean;
}

export interface CommonActionListStyleProps {
  getCardClassName?: (row: any) => string;
  wrapperClassName?: string;
}

// Generic component props for any type of custom components
export interface CommonActionListGenericProps<T> {
  // Any generic props that might be needed for custom components
  componentProps?: Record<string, any>;
  onComponentChange?: (key: string, value: any, row?: T | T[]) => void;
}

export interface CommonActionListProps<T> extends 
  CommonActionListCustomProps<T>,
  CommonActionListSelectionProps<T>, 
  CommonActionListPaginationProps, 
  CommonActionListStyleProps,
  CommonActionListGenericProps<T> {
  columns: CommonActionListColumn<T>[];
  data: T[];
  actionButtons?: CommonActionListButton<T>[];
  uniqueKey?: keyof T;
  
  // Card interaction props
  onCardClick?: (row: T) => void;
  onCardDoubleClick?: (row: T) => void;
  
  // Loading and empty states
  loading?: boolean;
  emptyMessage?: string;
  emptyComponent?: ReactNode;
  
  // Button props (for single action button like CardList)
  buttonLabel?: string;
  buttonAction?: (row: T) => void;
}