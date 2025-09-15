'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { CustomButton } from '../Button';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: React.ReactNode;
  heading: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * @component PopupModal
 * Renders a confirmation modal dialog with heading, description, icon, and customizable confirm/cancel actions.
 *
 * @param {boolean} isOpen - Controls whether the modal is open.
 * @param {function} onClose - Callback for closing the modal.
 * @param {function} onConfirm - Callback for confirming the action.
 * @param {React.ReactNode} [icon] - Optional icon to display in the heading.
 * @param {string} heading - Heading text for the modal.
 * @param {string} [description] - Optional description text.
 * @param {string} [confirmLabel] - Label for the confirm button.
 * @param {string} [cancelLabel] - Label for the cancel button.
 */
export const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  heading,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="h6">{heading}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography
          align="left"
          color="textSecondary"
          className='mt-1 mb-3'
        >
          {description}
        </Typography>
      </DialogContent>

      <DialogActions className='justify-center mb-4'>
        <CustomButton
          variant="outlined"
          onClick={onClose}
          className='outlined-button'
        >
          {cancelLabel}
        </CustomButton>
        <CustomButton
          variant="contained"
          color="primary"
          onClick={onConfirm}
        >
          {confirmLabel}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
