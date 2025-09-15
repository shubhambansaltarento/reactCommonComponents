// CommonDatePicker.tsx
import React from "react";
import { DatePicker } from "@mui/x-date-pickers";

interface CommonDatePickerProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  minDate?: any;
  maxDate?: any;
  className?: string;
}

export const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  className,
}) => {
  return (
    <div className={className}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{ textField: { fullWidth: true, size: "small" } }}
      />
    </div>
  );
};

