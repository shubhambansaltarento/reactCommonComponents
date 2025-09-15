import React from "react";

type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedToggleProps<T extends string> = {
  /** List of options to render */
  options: Option<T>[];
  /** Currently selected value */
  value: T;
  /** Called when user clicks an option */
  onChange: (value: T) => void;
  /** Optional: custom className for outer wrapper */
  className?: string;
};

export function SegmentedButtonForMobile<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedToggleProps<T>) {
  return (
    <div className={`flex w-full rounded-full border overflow-hidden ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-2 text-center font-medium transition-colors
            ${value === option.value ? "bg-black text-white" : "bg-gray-200 text-black"}
          `}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
