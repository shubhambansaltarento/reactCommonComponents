import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { CustomOption, PickerType } from "./types";

interface CustomSelectRendererProps {
  type: PickerType;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customOptions?: CustomOption[];
  Label?: string;
  error: boolean;
  helperText?: string;
  getCustomSelectSx: () => any;
  formControlClassName: string;
  styles: any;
}

const CustomSelectRenderer: React.FC<CustomSelectRendererProps> = ({
  type,
  customValue,
  onCustomChange,
  customOptions,
  Label,
  error,
  helperText,
  getCustomSelectSx,
  formControlClassName,
  styles
}) => {
  if (type !== 'custom' || !onCustomChange || !customOptions) return null;

  return (
    <FormControl
      size="small"
      fullWidth
      className={`${styles.form_control} ${formControlClassName}`}
      sx={getCustomSelectSx()}
      error={error}
    >
      <InputLabel className={styles.custom_select_label}>
        {Label || "Select Item"}
      </InputLabel>
      <Select
        value={customValue}
        label={Label || "Enter Name"}
        onChange={e => onCustomChange(e.target.value)}
        className={styles.custom_select_input}
        error={error}
      >
        {customOptions.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && helperText && (
        <div className={`${styles.helper_text} ${styles.error_text}`} style={{ fontSize: '0.75rem', marginTop: '3px', color: '#d32f2f' }}>
          {helperText}
        </div>
      )}
    </FormControl>
  );
};

export default CustomSelectRenderer;
