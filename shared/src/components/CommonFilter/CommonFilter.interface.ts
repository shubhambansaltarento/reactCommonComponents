import { DateRangeType } from "../../utils/baseUtils";
import { PickerValue } from "@mui/x-date-pickers/internals";

export type CheckboxTab = {
  label: string;
  key: string;
  type: "checkbox";
  tabValues: Array<{ label: string; value: string }>;
  hidden?: boolean;
};

export type RadioTab = {
  label: string;
  key: string;
  type: "radio";
  tabValues: Array<{ label: string; value: string }>;
  hidden?: boolean;
};

export type DateTab = {
  label: string;
  key: string;
  type: "date";
  toDate?: boolean;
  dateRange?: boolean;
  hidden?: boolean;
  requireBothDates?: boolean; // New prop for validation
};

export interface CheckBoxFilterState {
  [key: string]: string[];
}

export interface RadioFilterState {
  [key: string]: string;
}

export interface DateFilterState {
  [key: string]: { from: PickerValue; to: PickerValue, dateRange: DateRangeType | null };
}

// Per-field validation errors for date tabs
export interface DateFieldErrors {
  fromError?: string | null;
  toError?: string | null;
  generalError?: string | null; // For duration or other general errors
}

export interface DateValidationState {
  [key: string]: DateFieldErrors | string | null; // Support both old string format and new per-field format
}

export type FilterTabConfig = CheckboxTab | RadioTab | DateTab;

export interface CommonFilterProps {
  wrapperClassName?: string;
  open: boolean;
  onClose: () => void;
  tabs: FilterTabConfig[];
  onApply: (filters: any) => void;
  onClear: () => void;
  anchor?: "right" | "bottom";
  isMobile?: boolean;
  styles?: any;
  clearButtonText?: string;
  submitButtonText?: string;
  timezone?: string;
  initialCheckboxState?: CheckBoxFilterState;
  initialRadioState?: RadioFilterState;
  initialDateState?: DateFilterState;
  initialIndex?: number;
  shouldValidateDateRange?: boolean; // Renamed from validateDateRange
  customDateValidation?: (dateData: any, tabKey: string) => string | DateFieldErrors | null;
  enableSixMonthRange?: boolean; // Optional parameter to enable 6-month date range restriction
  autoSwitchToErrorTab?: boolean; // Auto-switch to tab with validation error on Apply
}