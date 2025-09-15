
export interface RadioOption {
  label: string;
  value: string;
}

export interface CustomRadioGroupProps {
  label?: string;
  value: string;
  options: RadioOption[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  row?: boolean; // Horizontal if true
  disabled?: boolean;
  className?: string;
}
