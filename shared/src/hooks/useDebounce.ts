// shared/src/hooks/useDebounce.ts
"use client"; 
import { useEffect, useState } from "react";

/**
 * @hook useDebounce
 * Returns a debounced value after a specified delay.
 *
 * @param {T} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {T} Debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
