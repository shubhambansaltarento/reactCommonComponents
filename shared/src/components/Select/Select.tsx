// components/CustomSelect.tsx
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import './Select.css';
import { CustomSelectProps } from './Select.interface';

/**
 * @component CustomSelect
 * Wrapper for MUI Select with custom styling, label, and options.
 *
 * @param {string} [label] - Label for the select input.
 * @param {string} [variant='outlined'] - Select variant.
 * @param {Array} options - Array of select options with label and value.
 * @param {string} [size='medium'] - Size of the select input.
 * @param {string} [className] - Optional class name for styling.
 */
const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  variant = 'outlined',
  options,
  size = 'medium',
  className,
  value,
  readonly,
  onChange,
  error,
  helperText
}) => {
  const selectId = `custom-select-${label?.toLowerCase().replace(/\s/g, '-') || 'input'}`;

  const selectRef = useRef<HTMLDivElement>(null);

  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (selectRef.current) {
      setMenuWidth(selectRef.current.offsetWidth);
    }
  }, []);


  return (
    <FormControl fullWidth variant={variant} className={clsx(`${variant}-select`, className)} error={error}>
      {label && <InputLabel id={`${selectId}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${selectId}-label`}
        id={selectId}
        variant={variant}
        label={label}
        size={size}
        value={value}
        readOnly={readonly}
        onChange={(event) => onChange(event as React.ChangeEvent<HTMLInputElement>)}
        className="w-full abc"
        MenuProps={{
          className: 'custom-select-menu',
          PaperProps: {
            sx: {
              maxHeight: 250,
              overflowY: 'auto',
              width: menuWidth ? `${menuWidth}px` : 'min-content',
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} className="option-wrap">
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;