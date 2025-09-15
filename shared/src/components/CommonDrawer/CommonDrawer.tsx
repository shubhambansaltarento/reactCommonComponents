'use client'
import React from "react";
import { Box, Drawer, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CloseIcon } from "../../generated-icon";
import { CommonDrawerInterface } from "./CommonDrawer.interface";
import './CommonDrawer.css';

/**
 * @component CommonDrawer
 * Renders a Material-UI Drawer with customizable header, body, and footer sections.
 * Supports responsive behavior and flexible styling options.
 *
 * @param {boolean} open - Whether the drawer is open.
 * @param {function} onClose - Callback for drawer close.
 * @param {string} [anchor='right'] - The side from which the drawer slides in.
 * @param {string} [className] - Optional class name for the drawer.
 * @param {string} [variant='temporary'] - The variant of drawer.
 * @param {React.ReactNode} [header] - Custom header content.
 * @param {string} [headerTitle] - Title to display in header (if header not provided).
 * @param {boolean} [showCloseButton=true] - Whether to show close button in header.
 * @param {string} [headerClassName] - Optional class name for header.
 * @param {React.ReactNode} body - Content for the drawer body.
 * @param {string} [bodyClassName] - Optional class name for body.
 * @param {React.CSSProperties} [bodyStyle] - Optional inline styles for body.
 * @param {React.ReactNode} [footer] - Content for the drawer footer.
 * @param {string} [footerClassName] - Optional class name for footer.
 * @param {number} [mobileBreakpoint=767] - Breakpoint for mobile responsive behavior.
 * @param {string} [mobileAnchor] - Anchor position for mobile (defaults to anchor prop).
 * @param {object} [paperProps] - Additional props for the drawer paper.
 * @param {boolean} [keepMounted=true] - Whether to keep the drawer mounted.
 * @param {boolean} [disableScrollLock=false] - Whether to disable scroll lock.
 */
export const CommonDrawer: React.FC<CommonDrawerInterface> = ({
    open,
    onClose,
    anchor = 'right',
    className = '',
    variant = 'temporary',
    headerTitle,
    showCloseButton = true,
    headerClassName = '',

    // Body props
    body,
    bodyClassName = '',
    // Footer props
    footer,
    footerClassName = '',

    mobileAnchor,
    isMobile,
    // Additional props
    keepMounted = false,
    disableScrollLock = false,
    ...rest
}) => {
    // Determine the actual anchor based on mobile state
    const actualAnchor = isMobile && mobileAnchor ? mobileAnchor : anchor;

    // Render default header if no custom header provided
    
    return (
      <Drawer
        className={`common-drawer ${className}`}
        anchor={actualAnchor}
        open={open}
        onClose={onClose}
        variant={variant}
        keepMounted={keepMounted}
        disableScrollLock={disableScrollLock}
        slotProps={{
          paper: {
            sx: {
              height: isMobile ? "90%" : "100%",
              width: isMobile
                ? "100%"
                : actualAnchor === "top" || actualAnchor === "bottom"
                ? "100%"
                : "600px",
              display: "flex",
              flexDirection: "column" as const,
              background: "transparent",
              boxShadow: "none",
              justifyContent: "flex-end",
              borderRadius: { xs: "5px", sm: "0" },
            },
          },
        }}
        {...rest}
      >
        {/* Header */}
        {
          <Box className={`common-drawer-header ${headerClassName}`}>
            {headerTitle && <Typography variant="h1">{headerTitle}</Typography>}
            {showCloseButton && (
              <IconButton onClick={onClose}>
                <CloseIcon className="w-[14px] h-[14px]" />
              </IconButton>
            )}
          </Box>
        }

        {/* Body */}
        <Box className={`common-drawer-content ${bodyClassName}`}>
          <Box className="common-drawer-content-inner">{body}</Box>
        </Box>

        {/* Footer */}
        {footer && (
          <Box className={`common-drawer-footer ${footerClassName}`}>
            {footer}
          </Box>
        )}
      </Drawer>
    );
};
