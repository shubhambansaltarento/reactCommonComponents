import React from "react";
import { SxProps, Theme } from "@mui/material";
import DatePickerRenderer from "./DatePickerRenderer";
import CustomSelectRenderer from "./CustomSelectRenderer";
import { CustomOption, PickerType } from "./types";
const styles = require('./Picker.module.css') as any;

interface DateCustomPickerProps {
  // Core props
  date?: Date | null;
  Label?: string;
  onDateChange?: (date: Date | null) => void;
  customValue?: string;
  onCustomChange?: (custom: string) => void;
  customOptions?: CustomOption[];
  type?: PickerType;
  
  // Styling props - all optional, no hardcoded values
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  formControlClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  
  // Layout props - fully customizable
  title?: string;
  height?: number | string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  borderRadius?: string | number;
  
  // Date constraints
  includeTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  
  // Format customization
  dateFormat?: string;
  dateTimeFormat?: string;
  
  // Style objects - complete control
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  formControlStyle?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  customSx?: SxProps<Theme>;
  
  // Behavior props
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  
  // Size and variant
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  
  // Additional customization
  disablePadding?: boolean;
  disableDefaultStyles?: boolean;
}

const DateCustomPicker: React.FC<DateCustomPickerProps> = ({
  // Core props
  date,
  onDateChange,
  customValue,
  onCustomChange,
  customOptions,
  type = 'date',
  
  // Styling props
  className = '',
  containerClassName = '',
  titleClassName = '',
  formControlClassName = '',
  inputClassName = '',
  labelClassName = '',
  
  // Layout props
  title,
  height,
  width,
  minWidth,
  maxWidth,
  borderRadius,
  
  // Date constraints
  includeTime = false,
  minDate,
  maxDate,
  
  // Format customization
  dateFormat,
  dateTimeFormat,
  
  // Style objects
  containerStyle = {},
  titleStyle = {},
  formControlStyle = {},
  inputSx = {},
  customSx = {},
  
  // Behavior props
  disabled = false,
  readOnly = false,
  placeholder,
  error = false,
  helperText,
  
  // Size and variant
  size = 'small',
  variant = 'outlined',
  
  // Additional customization
  disablePadding = false,
  disableDefaultStyles = false,
  Label
}) => {
  const getFormControlSx = () => ({
    ...(height && {
      '& .MuiInputBase-root': {
        height: typeof height === 'number' ? `${height}px` : height,
      },
    }),
    ...(borderRadius && {
      '& .MuiInputBase-root': {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      },
    }),
    ...formControlStyle,
  });

  const getTextFieldSx = () => ({
    ...(height && {
      height: typeof height === 'number' ? `${height}px` : height,
      '& .MuiInputBase-root': {
        height: typeof height === 'number' ? `${height}px` : height,
      },
    }),
    ...(borderRadius && {
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      '& .MuiInputBase-root': {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      },
      '& fieldset': {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      },
    }),
    ...inputSx,
  });

  const getCustomSelectSx = () => ({
    ...(height && {
      height: typeof height === 'number' ? `${height}px` : height,
      '& .MuiOutlinedInput-root': {
        height: typeof height === 'number' ? `${height}px` : height,
      },
    }),
    ...(borderRadius && {
      '& .MuiOutlinedInput-root': {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      },
      '& fieldset': {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      },
    }),
    ...formControlStyle,
  });

  const getContainerStyle = (): React.CSSProperties => ({
    ...(width && { '--picker-width': typeof width === 'number' ? `${width}px` : width } as any),
    ...(height && { '--picker-height': typeof height === 'number' ? `${height}px` : height } as any),
    ...containerStyle,
  });

  return (
    <div 
      className={`${styles.picker_container} ${containerClassName || ''} ${className || ''}`}
      style={getContainerStyle()}
    >
      {title && (
        <div 
          className={`${styles.picker_title} ${titleClassName || 'mb-2'}`}
          style={titleStyle}
        >
          {title}
        </div>
      )}
      <DatePickerRenderer
        type={type}
        date={date}
        onDateChange={onDateChange}
        Label={Label}
        includeTime={includeTime}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat={dateFormat}
        dateTimeFormat={dateTimeFormat}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        getFormControlSx={getFormControlSx}
        getTextFieldSx={getTextFieldSx}
        formControlClassName={formControlClassName || ''}
        styles={styles}
      />
      
      <CustomSelectRenderer
        type={type}
        customValue={customValue}
        onCustomChange={onCustomChange}
        customOptions={customOptions}
        Label={Label}
        error={error}
        helperText={helperText}
        getCustomSelectSx={getCustomSelectSx}
        formControlClassName={formControlClassName || ''}
        styles={styles}
      />
    </div>
  );
};

export default DateCustomPicker;