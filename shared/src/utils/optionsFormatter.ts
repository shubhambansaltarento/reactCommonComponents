type Option = {
  label: string;
  value: string;
  secondaryValue?: string;
};

export const optionsFormatter = <
  T,
  LabelKey extends {
    [K in keyof T]: T[K] extends string ? K : never;
  }[keyof T],
  ValueKey extends {
    [K in keyof T]: T[K] extends string | number ? K : never;
  }[keyof T],
  SecondaryValueKey extends {
    [K in keyof T]: T[K] extends string | number ? K : never;
  }[keyof T] = never
>(
  data: T[],
  labelKey: LabelKey,
  valueKey: ValueKey,
  secondaryValueKey?: SecondaryValueKey
): Option[] => {
  return data.map((item) => {
    const option: Option = {
      label: item[labelKey] as string,        // safely cast to string
      value: String(item[valueKey]), // safely cast to string
    };
    
    if (secondaryValueKey !== undefined && item[secondaryValueKey] !== undefined) {
      option.secondaryValue = String(item[secondaryValueKey]);
    }
    
    return option;
  }).sort((a, b) => a.label.localeCompare(b.label));
};
