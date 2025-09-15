import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import dayjs from 'dayjs';
import { PickerType } from "./types";

interface DatePickerRendererProps {
  type: PickerType;
  date?: Date | null;
  onDateChange?: (date: Date | null) => void;
  Label?: string;
  includeTime: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  dateTimeFormat?: string;
  placeholder?: string;
  error: boolean;
  helperText?: string;
  getFormControlSx: () => any;
  getTextFieldSx: () => any;
  formControlClassName: string;
  styles: any;
}

const DatePickerRenderer: React.FC<DatePickerRendererProps> = ({
  type,
  date,
  onDateChange,
  Label,
  includeTime,
  minDate,
  maxDate,
  dateFormat,
  dateTimeFormat,
  placeholder,
  error,
  helperText,
  getFormControlSx,
  getTextFieldSx,
  formControlClassName,
  styles
}) => {
  if (type !== 'date' && type !== 'datetime') return null;
  if (!onDateChange) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl 
        size="small" 
        fullWidth
        className={`${styles.form_control} ${formControlClassName}`}
        sx={getFormControlSx()}
      >
        {includeTime || type === 'datetime' ? (
          <DateTimePicker
            label={Label || "Select Date & Time"}
            value={date ? dayjs(date) : null}
            minDateTime={minDate ? dayjs(minDate) : undefined}
            maxDateTime={maxDate ? dayjs(maxDate) : undefined}
            onChange={(newValue) => {
              const dateValue = newValue ? newValue.toDate() : null;
              onDateChange?.(dateValue);
            }}
            format={dateTimeFormat || "MMM DD, YYYY hh:mm A"}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                className: styles.date_picker_input,
                sx: getTextFieldSx(),
                placeholder: placeholder,
                error: error,
                helperText: error ? helperText : undefined
              }
            }}
          />
        ) : (
          <DatePicker
            label={Label || "Select Date"}
            value={date ? dayjs(date) : null}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            onChange={(newValue) => {
              const dateValue = newValue ? newValue.toDate() : null;
              onDateChange?.(dateValue);
            }}
            format={dateFormat || "MMM DD, YYYY"}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                className: styles.date_picker_input,
                sx: getTextFieldSx(),
                placeholder: placeholder,
                error: error,
                helperText: error ? helperText : undefined
              }
            }}
          />
        )}
      </FormControl>
    </LocalizationProvider>
  );
};

export default DatePickerRenderer;
