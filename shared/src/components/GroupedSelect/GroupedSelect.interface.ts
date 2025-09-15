export interface Option {
  label: string;
  value: string | number;
}

export interface OptionGroup {
  label: string; // Dealer label
  options: Option[]; // Branches under this dealer
};

export interface CustomSelectProps {
  label?: string;
  variant?: "outlined" | "filled" | "standard";
  options: (Option | OptionGroup)[];
  value: Option | Option[] | null;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  onChange: (value: any) => void;
}
