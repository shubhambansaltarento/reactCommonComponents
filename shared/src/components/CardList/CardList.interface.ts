import { Column } from "../CommonTable";

export interface BaseListProps<T> {
    data: T[];
    columns: Column<T>[];
    renderHeader?: (row: T) => React.ReactNode;
    renderFooter?: (row: T) => React.ReactNode;
    getCardClassName?: (row: T) => string;
    allowSelection?: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    selectedRows?: T[];
    onSelectRow?: (selectedRows: T[]) => void;
    buttonLabel?: string;
    buttonAction?: (row: T) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    totalRows: number;
    styles?: any;
    wrapperClassName?: string;
    uniqueKey?: keyof T;
    onDownloadClick?: () => void;
    onUploadClick?: () => void;
    buttonLabel2?: string;
    buttonAction2?: (row: T) => void;
}

export interface CardListProps<T> extends BaseListProps<T> {}