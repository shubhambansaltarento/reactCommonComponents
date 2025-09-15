
import { JSX } from "react";
export interface ActionTableColumn<T> {
    iconComponent: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    hide?: (row: T) => boolean;
    fill?: (row: T) => string;
    clickHandler?: (row: T) => void
}
export interface TableColumn<T> {
    key: keyof T;
    label: string;
    className?: string;
    transformFn?: (value: any, row?: T) => string | number | JSX.Element;
    icon?: ActionTableColumn<T>
}
export interface QuantityCounterUpdateEvent<T> {
    quantity: number;
    rowData: T;
}

export interface ActionTableWithPaginationProps<T> {
    columns: TableColumn<T>[];
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
    costCurrencySymbol?: string;
    wrapperClassName?: string;
    allowSticky?: boolean;
    actionButtons?: ActionTableColumn<T>[];
    /**
     * Optional: Show ItemCounter component alongside action buttons
     */
    showItemCounter?: boolean;
    /**
     * Optional: Called whenever the cart quantity changes for a row.
     */
    onCartQuantityChange?: (row: T, quantity: number) => void;
    /**
     * Optional: Called with detailed counter update events
     */
    quantityUpdate?: (event: QuantityCounterUpdateEvent<T>) => void;
    /**
     * Optional: Provide initial quantity for rows when cart widget is shown.
     */
    getInitialCartQuantity?: (row: T) => number;
    /**
     * Optional: Get minimum order quantity for a row (defaults to 1)
     */
    getMinOrderQuantity?: (row: T) => number;
    /**
     * Optional: Get product catalog ID for a row (for ItemCounter)
     */
    getProductCatalogId?: (row: T) => string;
    
    /**
     * Optional: Set of currently selected row IDs for external state management
     */
    selectedRows?: Set<string>;
    /**
     * Optional: Called when row selection changes to sync with external state
     */
    onRowSelectionChange?: (selectedRows: Set<string>) => void;
    debounce?: boolean;
    disableAllSelection?:boolean;
    rowActionIndexOnClick?: number;
}

export interface CounterUpdateEvent<T> {
    quantity: number;
    rowData: T;
}
