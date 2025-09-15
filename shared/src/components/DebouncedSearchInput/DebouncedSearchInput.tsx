"use client";

import React, { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";

interface DebouncedSearchInputProps {
  delay?: number;
  onDebouncedChange: (value: string) => void;
  placeholderText?: string;
  value?: string;
}

/**
 * @component DebouncedSearchInput
 * Input field that debounces user input and triggers a callback after a delay.
 *
 * @param {number} [delay=500] - Debounce delay in milliseconds.
 * @param {function} onDebouncedChange - Callback fired with debounced input value.
 */
export const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  delay = 500,
  onDebouncedChange,
  placeholderText,
  value
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Fire callback when debouncedValue updates
  React.useEffect(() => {
    onDebouncedChange(debouncedValue);
  }, [debouncedValue, onDebouncedChange]);

  return (
    <input
      type="text"
      placeholder={placeholderText || "Search..."}
      className="border rounded px-3 py-2"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};
