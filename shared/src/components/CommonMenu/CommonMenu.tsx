import React from "react";
import { List, Menu, MenuItem, Typography } from "@mui/material";
import { CommonMenuInterface, CommonMenuItemInterface } from "./CommonMenu.interface";
import './CommonMenu.css';

/**
 * @component CommonMenu
 * Renders a Material-UI Menu with customizable menu items and styling.
 *
 * @param {Element | null} anchorEl - The anchor element for the menu position.
 * @param {boolean} open - Whether the menu is open.
 * @param {function} onClose - Callback for menu close.
 * @param {Array} menuItems - List of menu item objects with label and onClick.
 * @param {string} [className] - Optional class name for the menu.
 * @param {string} [id] - Optional id for the menu.
 * @param {boolean} [disableScrollLock] - Whether to disable scroll lock.
 * @param {object} [anchorOrigin] - Position of the menu relative to anchor.
 * @param {object} [transformOrigin] - Transform origin of the menu.
 * @param {object} [paperProps] - Additional props for the menu paper.
 */
export const CommonMenu: React.FC<CommonMenuInterface> = ({
    anchorEl,
    open,
    onClose,
    menuItems,
    className,
    id,
    disableScrollLock = true,
    anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
    },

}) => {
    const handleMenuItemClick = (item: CommonMenuItemInterface) => {
        if (item.onClick) {
            item.onClick();
        }
        onClose();
    };

    return (
        <Menu
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            disableScrollLock={disableScrollLock}
            className={`common-menu ${className || ''}`}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
              slotProps={{
                paper: {
                    className: "common-menu-paper"
                }
            }}
        >
            <List className="common-menu-list">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={`${item.label}-${index}`}
                        onClick={() => handleMenuItemClick(item)}
                        disabled={item.disabled}
                        className={`common-menu-item ${item.className || ''}`}
                    >
                        <Typography>{item.label}</Typography>
                    </MenuItem>
                ))}
            </List>
        </Menu>
    );
};
