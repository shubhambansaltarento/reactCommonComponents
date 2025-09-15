'use client';

import React, { CSSProperties } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PopupProps } from './Popup.interface';
import './Popup.css'

/**
 * @component Popup
 * Renders a modal dialog with title, optional icon, content, and customizable footer.
 *
 * @param {boolean} isOpen - Controls whether the popup is open.
 * @param {function} onClose - Callback for closing the popup.
 * @param {string|React.ReactNode} title - Title of the popup.
 * @param {React.ReactNode} [icon] - Optional icon to display in the title.
 * @param {React.ReactNode} children - Content of the popup.
 * @param {React.ReactNode} [footer] - Optional footer content.
 * @param {string} [className] - Optional class name for styling.
 * @param {'center'|'flex-start'|'flex-end'} [footerAlignment] - Footer alignment.
 */
export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  className = '',
  footerAlignment = 'center',
  hideCloseIcon = false,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth className={`popup ${className}`}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {icon && <span>{icon}</span>}
            <Typography variant="h6">{title}</Typography>
          </Box>
          {!hideCloseIcon && (
            <IconButton className='close-icon' onClick={onClose}>
              <CloseIcon className='text-black' />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      {footer && (
        <DialogActions className='popup-footer' sx={{
          justifyContent: footerAlignment || 'center', // default to 'center'
          pb: 2,
        }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};
