'use client';
import "./CustomMultiSelect.css";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Checkbox, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Option } from "./CustomMultiSelect.interface";
import CustomTextField from "../Input/Input";

const ALL_OPTION: Option = { label: "All", value: "__ALL__" };

type MultiSelectProps = {
  value?: string[] | string;
  options: Option[];
  onChange?: ((vals: string[]) => void) | ((val: string) => void) | ((vals: Option[]) => void) | ((val: Option | null) => void);
  defaultValues?: string[];
  multiple: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  size?: "small" | "medium";
  error?: boolean;
  sx?: any;
  returnFullObject?: boolean;
};

export const CustomMultiSelect: React.FC<MultiSelectProps> = (props) => {
  const {
    value,
    options,
    onChange,
    defaultValues = [],
    multiple,
    label,
    className,
    disabled,
    size = "small",
    error = false,
    sx,
    returnFullObject = false,
  } = props;

  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? defaultValues : defaultValues.slice(0, 1)
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(multiple ? (value as string[]) : [value as string]);
    }
  }, [value, multiple]);

  const isAllSelected = multiple && selectedValues.length === options.length;

  const handleToggleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    const updated = newValue ? [newValue] : [];
    setSelectedValues(updated);

    if (returnFullObject) {
      const selectedOptions = updated.map(val => options.find(opt => opt.value === val)).filter(Boolean) as Option[];
      (onChange as (vals: Option[]) => void)?.(selectedOptions);
    } else {
      (onChange as (vals: string[]) => void)?.(updated);
    }
  };

  const handleAutoCompleteChange = (_: any, newValues: Option[]) => {
    const allOptionClicked = newValues.find(opt => opt.value === ALL_OPTION.value);
    const previouslyHadAll = options.filter((opt: any) => selectedValues.includes(opt.value)).length === options.length;

    if (allOptionClicked) {
      if (isAllSelected || previouslyHadAll) {
        setSelectedValues([]);
        if (returnFullObject) {
          (onChange as (vals: Option[]) => void)?.([]);
        } else {
          (onChange as (vals: string[]) => void)?.([]);
        }
      } else {
        const allValues = options.map((opt) => opt.value);
        setSelectedValues(allValues);
        if (returnFullObject) {
          (onChange as (vals: Option[]) => void)?.(options);
        } else {
          (onChange as (vals: string[]) => void)?.(allValues);
        }
      }
      return;
    }

    const filteredValues = newValues.filter(opt => opt.value !== ALL_OPTION.value);
    const updatedValues: any = filteredValues.map((opt) => opt.value);
    setSelectedValues(updatedValues);
    
    if (returnFullObject) {
      (onChange as (vals: Option[]) => void)?.(filteredValues);
    } else {
      (onChange as (vals: string[]) => void)?.(updatedValues);
    }
  };

  const handleSingleSelectChange = (_: any, newValue: Option | null) => {
    const updatedValue = newValue ? newValue.value : "";
    setSelectedValues([updatedValue]);
    
    if (returnFullObject) {
      (onChange as (val: Option | null) => void)?.(newValue);
    } else {
      (onChange as (val: string) => void)?.(updatedValue);
    }
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const hasSelectedData = selectedValues.length > 0 && selectedValues.some(v => v !== "");

  return multiple ? (
    <Autocomplete
      multiple
      options={options.length > 1 ? [ALL_OPTION, ...options] : options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      disabled={disabled}
      value={options.filter((opt: any) => selectedValues.includes(opt.value))}
      onChange={handleAutoCompleteChange}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        const isSelected = option.value === ALL_OPTION.value 
          ? isAllSelected 
          : selectedValues.includes(option.value);
        
        return (
          <li key={option.value} {...rest}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={isSelected}
            />
            {option.label}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        const numTags = tagValue.length;
        const limitTags = 10;

        return (
          <>
            {tagValue.slice(0, limitTags).map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  {...tagProps}
                  variant="outlined"
                  label={option.label}
                  size={size === "small" ? "small" : "medium"}
                  sx={{
                    '& .MuiChip-deleteIcon': {
                      color: 'var(--color-black)',
                 /*      '&:hover': {
                        color: 'var(--primary-700)'
                      } */
                    }
                  }}
                />
              );
            })}
            {numTags > limitTags && (
              <Chip
                variant="filled"
                label={`+${numTags - limitTags}`}
                size={size === "small" ? "small" : "medium"}
                style={{ 
                  backgroundColor: '#f0f0f0', 
                  color: '#666',
                  fontWeight: 'bold'
                }}
              />
            )}
          </>
        );
      }}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          variant="outlined" 
          label={label}
          placeholder={selectedValues.length === 0 ? "Select options" : undefined}
          error={error}
          sx={sx}
          className={clsx({ "custom-multiselect-label": selectedValues.length === 0 })}
        />
      )}
      className={clsx(className, { 'custom-multiselect-outlined': hasSelectedData })}
      size={size || "small"}
      sx={sx}
    />
  ) : (
    <Autocomplete
    disabled={disabled}
      value={options.find((opt) => opt.value === selectedValues[0]) || null}
      onChange={(event, newValue) => {
        handleSingleSelectChange(event, newValue);
      }}
      options={options}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={label} 
          variant="outlined" 
          placeholder={selectedValues.length === 0 || !selectedValues[0] ? "Select option" : undefined}
          error={error}
          sx={sx}
          className={clsx({ "custom-multiselect-label": selectedValues.length === 0 || !selectedValues[0] })}
        />
      )}
      className={clsx(className, { 'custom-multiselect-outlined': hasSelectedData })}
      size={size || "small"}
      sx={sx}
    />
  );
};

