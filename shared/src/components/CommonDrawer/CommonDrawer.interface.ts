import React from "react";
import { DrawerProps } from "@mui/material"

export interface CommonDrawerInterface extends DrawerProps {
    open: boolean;
    onClose?: () => void;
    anchor?: 'left' | 'top' | 'right' | 'bottom';
    className?: string;
    variant?: 'permanent' | 'persistent' | 'temporary';

    headerTitle?: string;
    showCloseButton?: boolean;
    headerClassName?: string;

    // Body props
    body: React.ReactNode;
    bodyClassName?: string;

    // Footer props
    footer?: React.ReactNode;
    footerClassName?: string;

    // Responsive props
    isMobile: boolean;
    mobileAnchor?: 'left' | 'top' | 'right' | 'bottom';

    // Additional Material-UI Drawer props
    keepMounted?: boolean;
    disableScrollLock?: boolean;
}
