import type { CheckboxProps } from '@mui/material/Checkbox';

export interface CustomCheckboxProps {
  label?: React.ReactNode; // Optional if used as "select all" without label
  checked: boolean;
  onChange: CheckboxProps['onChange'];
  indeterminate?: boolean; 
  onClick?: CheckboxProps['onClick']; 
  name?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
}