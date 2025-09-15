// components/CustomTextField.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { CustomTextFieldProps } from './Input.interface';
import clsx from 'clsx';
import './Input.css';

/**
 * @component CustomTextField
 * Wrapper for MUI TextField with custom styling and props.
 *
 * @param {string} [variant='outlined'] - TextField variant.
 * @param {string} [className] - Optional class name for styling.
 * @param {...any} props - Other TextField props.
 */
const CustomTextField: React.FC<CustomTextFieldProps> = ({
  variant = 'outlined',
  className,
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      className={clsx(
        className,
        `${variant}-input`,
        
      )}
      {...props}
    />
  );
};

export default CustomTextField;