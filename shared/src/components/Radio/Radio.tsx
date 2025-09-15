import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { CustomRadioGroupProps } from "./Radio.interface";
import './Radio.css'

/**
 * @component CustomRadioGroup
 * Renders a group of radio buttons with optional label and horizontal/vertical layout.
 *
 * @param {string} [label] - Label for the radio group.
 * @param {string|number} value - Selected radio value.
 * @param {Array} options - Array of radio options with label and value.
 * @param {function} onChange - Callback for radio value change.
 * @param {boolean} [row=false] - Layout radios horizontally if true.
 * @param {boolean} [disabled=false] - Disable the radio group if true.
 */
export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  label,
  value,
  options,
  onChange,
  row = false,
  disabled = false,
  className = ''
}) => {
  return (
    <FormControl component="fieldset" disabled={disabled} className={`custom-radio-group ${className}`}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};