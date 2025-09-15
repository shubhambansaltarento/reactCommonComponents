import { CSSProperties } from "react";

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode; // Pass custom action buttons
  className?: string;
  footerAlignment?: CSSProperties['justifyContent'],
  hideCloseIcon?: boolean;
}