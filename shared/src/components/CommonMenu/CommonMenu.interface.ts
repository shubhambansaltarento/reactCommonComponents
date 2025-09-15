export interface CommonMenuItemInterface {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface CommonMenuInterface {
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
  menuItems: CommonMenuItemInterface[];
  className?: string;
  id?: string;
  disableScrollLock?: boolean;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  paperProps?: object;
}
