'use client';
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Option, PriorityColor } from "./CustomMultiSelectPill.interface";
import "./CustomMultiSelectPill.css";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { Check } from "@mui/icons-material";

// Extended interface to support icons with proper Material-UI typing
interface OptionWithIcon extends Option {
  icon?: React.ComponentType<SvgIconProps>;
}

interface Props {
  value?: string | Option[]; // string for single, Option[] for multiple
  options: (Option | OptionWithIcon)[];
  onChange?: (val: string | Option[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  toggleLabelCls?: string;
  priorityColors?: Record<string, PriorityColor>;
}

const ALL_OPTION: Option = { label: "All", value: "__ALL__" };

export const CustomSelectPill: React.FC<Props> = ({
  value,
  options,
  onChange,
  multiple = false,
  disabled,
  toggleLabelCls,
  priorityColors,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Sync with parent
  useEffect(() => {
    if (value !== undefined) {
      if (multiple) {
        // value is Option[]
        setSelectedValues((value as Option[]).map((v) => v.value));
      } else {
        // value is string
        setSelectedValues(value ? [value as string] : []);
      }
    }
  }, [value, multiple]);

  const isAllSelected = selectedValues.length === options.length;

  const handleAutoCompleteChange = (
    _: any,
    newValues: Option[],
    _reason: string,
    details?: { option: Option }
  ) => {
    const clicked = details?.option;

    if (clicked?.value === ALL_OPTION.value) {
      if (isAllSelected) {
        setSelectedValues([]);
        onChange?.([]); // return []
      } else {
        setSelectedValues(options.map((o) => o.value));
        onChange?.(options); // return all Option[]
      }
      return;
    }

    const valuesOnly = newValues.filter(
      (opt) => opt.value !== ALL_OPTION.value
    );
    setSelectedValues(valuesOnly.map((v) => v.value));
    onChange?.(valuesOnly); // return Option[]
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return multiple ? (
    <Autocomplete
      multiple
      options={[ALL_OPTION, ...options]}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      value={options.filter((opt) => selectedValues.includes(opt.value))}
      onChange={handleAutoCompleteChange}
      renderOption={(props, option) => {
        const isSelected =
          option.value === ALL_OPTION.value
            ? isAllSelected
            : selectedValues.includes(option.value);
        const IconComponent = (option as OptionWithIcon).icon;
        return (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={isSelected}
            />
            {IconComponent && (
              <IconComponent sx={{ marginRight: 1, fontSize: '1.2rem' }} />
            )}
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          variant="outlined" 
          label="Select options"
          placeholder={selectedValues.length === 0 ? "Please select dealers" : undefined}
        />
      )}
      className="w-full"
    />
  ) : (
    <ToggleButtonGroup
      value={selectedValues[0] ?? ""}
      exclusive
      onChange={(_, newValue) => {
        if (!newValue) return; // prevent deselect
        setSelectedValues([newValue]);
        onChange?.(newValue); // return string
      }}
      className="flex flex-wrap w-full"
    >
      {options.map((opt) => {
        const isSelected = selectedValues[0] === opt.value;
        const priorityColor = priorityColors?.[opt.value];
        const IconComponent = (opt as OptionWithIcon).icon;
        
        const toggleButtonStyle = priorityColor ? {
          '--priority-text-color': priorityColor.text,
          '--priority-bg-color': priorityColor.bg,
        } as React.CSSProperties : {};
        
        return (
          <Box
            key={opt.value}
            sx={{ position: "relative", display: "inline-block"}}
          >
            {isSelected && (
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <Check sx={{ color: "#fff", fontSize: 12 }} />
              </Box>
            )}
            <ToggleButton
              value={opt.value}
              disabled={disabled}
              className={`flex-1 ${
                priorityColor ? "toggle-button-priority" : ""
              }`}
              style={toggleButtonStyle}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                  "&::after": { display: "none" },
                },
                position: "relative",
              }}
            >
              <span className={`${toggleLabelCls} flex items-center gap-2`}>
                {IconComponent && <IconComponent sx={{ fontSize: "1.2rem" }} />}
                {opt.label}
              </span>
            </ToggleButton>
          </Box>
        );
      })}
    </ToggleButtonGroup>
  );
};
