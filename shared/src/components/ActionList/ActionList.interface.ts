import { TableColumn, ActionTableColumn } from "../ActionTable";
import { BaseListProps } from "../CardList/CardList.interface";

export interface ActionListProps<T> extends BaseListProps<T> {
    actionButtons?: ActionTableColumn<T>[];

    // Cart functionality properties
    showItemCounter?: boolean;
    quantityUpdate?: (event: { quantity: number; rowData: T }) => void;
    getMinOrderQuantity?: (row: T) => number;
    getProductCatalogId?: (row: T) => string;
    onRowSelectionChange?: (selectedRows: Set<string>) => void;
    onCartQuantityChange?: (row: T, quantity: number) => void;
    debounce?: boolean;
    disableAllSelection?: boolean;
    quantityLabel?: string;
}