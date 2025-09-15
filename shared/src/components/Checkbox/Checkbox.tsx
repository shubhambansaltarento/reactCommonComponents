import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { CustomCheckboxProps } from './Checkbox.interface';
import './Checkbox.css';

// CustomCheckbox: A styled MUI Checkbox supporting label, indeterminate state, and custom icons.
export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
  disabled = false,
  color = 'primary',
  size = 'medium',
  indeterminate = false,
  onClick,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox className='checkbox-outer'
            checked={checked}
            onChange={onChange}
            indeterminate={indeterminate} 
            onClick={onClick}
            name={name}
            disabled={disabled}
            color={color}
            size={size}
            icon={<span className="custom-checkbox-icon" />}
            checkedIcon={<span className={`custom-checkbox-icon checked checked-${color}`} />}
            />
      }
      label={label}
    />
  );
};
