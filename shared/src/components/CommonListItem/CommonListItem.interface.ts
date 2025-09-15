export interface ListItemData {
    label: string;
    value?: string;
    className?: string;
}

export interface CommonListItemProps {
    heading?: string;
    items: ListItemData[];
    showDivider?: boolean;
    wrapperClassName?: string;
}