import React from "react";

interface ItemCounterProps {
  count: number;
  onChange: (newCount: number) => void;
  min?: number;
  max?: number;
  className?: string;
  counterUpdateValue?: number;
  id: string;
  onQuantityChange?: (id: string, newQuantity: number) => void;
  color?: string;
  debounceDelay?: number;
  emptyInputDelay?: number;
}

const ItemCounter: React.FC<ItemCounterProps> = ({
  count,
  onChange,
  min = 0,
  max = 100000,
  className = "",
  id,
  counterUpdateValue = 1,
  onQuantityChange,
  color,
  debounceDelay = 500,
  emptyInputDelay = 2000,
}) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const emptyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearAllTimeouts = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (emptyTimeoutRef.current) {
      clearTimeout(emptyTimeoutRef.current);
      emptyTimeoutRef.current = null;
    }
  }, []);

  const debouncedQuantityChange = React.useCallback(
    (newCount: number) => {
      clearAllTimeouts();
      timeoutRef.current = setTimeout(() => {
        if (onQuantityChange) {
          onQuantityChange(id, newCount);
        }
      }, debounceDelay);
    },
    [clearAllTimeouts, onQuantityChange, id, debounceDelay]
  );

  const handleDecrement = () => {
    const newCount = count - counterUpdateValue;
    if (newCount >= min) {
      onChange(newCount);
      debouncedQuantityChange(newCount);
    }
  };

  const handleIncrement = () => {
    const newCount = count + counterUpdateValue;
    if (newCount <= max) {
      onChange(newCount);
      debouncedQuantityChange(newCount);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");

    clearAllTimeouts();

    if (val === "") {
      onChange(0);
      emptyTimeoutRef.current = setTimeout(() => {
        onChange(min);
        if (onQuantityChange) {
          onQuantityChange(id, min);
        }
      }, emptyInputDelay);
    } else {
      let num = Number(val);
      if (!isNaN(num)) {
        if (num < min) num = min;
        if (num > max) num = max;

        onChange(num);

        timeoutRef.current = setTimeout(() => {
          let adjusted = num;
          if (counterUpdateValue > 1 && num % counterUpdateValue !== 0) {
            adjusted = Math.ceil(num / counterUpdateValue) * counterUpdateValue;
            if (adjusted > max) {
              adjusted =
                Math.floor(num / counterUpdateValue) * counterUpdateValue;
            }
            if (adjusted < min) {
              adjusted = min;
            }
          }

          if (adjusted !== num) {
            onChange(adjusted);
          }

          if (onQuantityChange) {
            onQuantityChange(id, adjusted);
          }
        }, debounceDelay);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Dynamic styles based on color prop
  const containerStyle = color
    ? {
        borderColor: color,
        color: color,
      }
    : {};

  const buttonStyle = color
    ? {
        color: color,
      }
    : {};

  const inputStyle = color
    ? {
        borderColor: color,
        color: color,
      }
    : {};

  return (
    <div
      className={`flex flex-row items-center border rounded ${className}`}
      style={containerStyle}
    >
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center"
        style={buttonStyle}
        onClick={handleDecrement}
        aria-label="Decrement"
        disabled={count - counterUpdateValue < min}
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-12 h-8 text-center border border-y-0 font-medium not-italic text-[13px] leading-none tracking-normal appearance-none font-[Beausite_Classic]"
        style={inputStyle}
        value={count}
        onChange={handleInputChange}
        aria-label="Count"
      />
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center"
        style={buttonStyle}
        onClick={handleIncrement}
        aria-label="Increment"
        disabled={count + counterUpdateValue > max}
      >
        +
      </button>
    </div>
  );
};

export default ItemCounter;
