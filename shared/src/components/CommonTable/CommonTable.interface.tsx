
import { JSX } from "react";
export interface ActionColumn<T> {
    iconComponent: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    hide?: (row: T) => boolean;
    fill?: (row: T) => string;
    clickHandler?: (row: T) => void
}
export interface Column<T> {
    key: keyof T;
    label: string;
    className?: string;
    hide?: boolean;
    transformFn?: (value: any, row?: T) => string | number | JSX.Element;
    icon?: ActionColumn<T>
}
export interface TableWithPaginationProps<T> {
    columns: Column<T>[];
    data: T[];
    uniqueKey?: keyof T;
    page: number;
    rowsPerPage: number;
    totalRows: number;
    allowSelection?: boolean;
    minColWidth?: number;
    onPageChange: (page: number) => void;
    selected?: string[];
    onSelectRow?: (rows: T[]) => void;
    getRowClassName?: (row: T) => string;
    isMobile?: boolean;
    styles?: any;
    stickyColumns?: boolean;
    costLabel?: string;
    costAmount?: number | string;
    wrapperClassName?: string;
    allowSticky?: boolean;
    actionButtons?: ActionColumn<T>[];
    hidePagination?: boolean;
    rowActionIndexOnClick?: number;
    onDownloadClick?: () => void;
    onUploadClick?: () => void;
}