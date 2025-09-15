import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import './Button.css';
 
interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  label?: string;
  loading?: boolean;
  className?: string;
  clicked?: boolean;
  variant?: 'text' | 'outlined' | 'contained' | 'option';
  clickedIcon?: React.ReactNode;
  textColor?: string;
}
 
// CustomButton: A wrapper for MUI Button supporting loading state and custom styling.
export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  loading = false,
  disabled,
  children,
  className = '',
  variant = 'contained',
  clicked = false,
  clickedIcon,
  textColor,
  startIcon,
  endIcon,
  ...rest
}) => {
  // Custom class per variant
  const variantClass = {
    text: 'text-button',
    contained: 'contained-button',
    outlined: 'outlined-button',
    option: 'option-button',
  }[variant] || '';
 
  return (
    <Button
      variant={variant === 'option' ? 'contained' : variant}
      className={`${variantClass} ${className} !text-sm`}
      disabled={disabled || loading}
      sx={{
        ...(textColor && { 
          color: `${textColor} !important`,
          '&.MuiButton-root': {
            color: `${textColor} !important`
          }
        }),
        ...rest.sx
      }}
      style={rest.style}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      {...rest}
    >
      {loading? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        label || children
      )}
      {clicked && clickedIcon}
    </Button>
  );
};