export interface SortListConfig {
    value: string;
    label: string;
}

export interface CommonSortProps {
      wrapperClassName?: string;
      open: boolean;
      onClose: () => void;
      sortList: SortListConfig[];
      onApply: (sortItem: SortListConfig) => void;
      anchor?: "right" | "bottom";
      isMobile?: boolean;
      selectedValue?: string;
}