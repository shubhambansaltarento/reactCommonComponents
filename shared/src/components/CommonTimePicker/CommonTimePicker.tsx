// CommonTimePicker.tsx
import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

interface CommonTimePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  ampmInClock?: boolean;
  className?: string;
  slotProps?: any;
  minTime?: Dayjs | null;
}

export const CommonTimePicker: React.FC<CommonTimePickerProps> = ({
  label,
  value,
  onChange,
  ampmInClock,
  className,
  slotProps,
  minTime = null,
}) => {
  return (
    <div className={className}>
      {/* If you have a global LocalizationProvider at app root, remove this wrapper */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={label}
          value={value}
          onChange={(v) => onChange(v)}
          ampmInClock={ampmInClock}
          minTime={minTime ?? undefined}
          slotProps={{
            popper: {
              // avoid forcing container by default — leave commented unless needed
              // container: document.body,
            },
            ...slotProps,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
