import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type InputVariant = 'outlined' | 'filled' | 'standard';

export type CustomTextFieldProps = MuiTextFieldProps & {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: InputVariant;
  className?: string;
  placeholder?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

