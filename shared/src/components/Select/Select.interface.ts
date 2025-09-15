export interface Option {
    label: string;
    value: string | number;
    secondaryValue?: string | number;
}

export interface CustomSelectProps {
    label?: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement> ) => void
    options: Option[];
    variant?: "outlined" | "filled" | "standard";
    size?: "small" | "medium";
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    readonly?:  boolean;
}
  