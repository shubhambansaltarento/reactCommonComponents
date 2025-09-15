import React from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
} from "@mui/material";

interface Option {
  label: string;
  value: string | number;
}
interface Group {
  label: string;
  options: Option[];
}

type Props = {
  label?: string;
  options: (Option | Group)[];
  value: Option[]; // still simple options in parent
  disabled?: boolean;
  className?: string;
  size?: "small" | "medium";
  onChange: (val: Option[]) => void;
};

 const GroupedSelect: React.FC<Props> = ({
  label,
  options,
  value,
  disabled,
  className,
  size = "small",
  onChange,
}) => {
  // Flatten with group markers + "All" items
  const flatOptions: (Option & { group?: string; isAll?: boolean })[] =
    React.useMemo(() => {
      return options.flatMap((opt) => {
        if ("options" in opt) {
          const allItem: Option & { group: string; isAll: boolean } = {
            label: "All",
            value: `all-${opt.label}`,
            group: opt.label,
            isAll: true,
          };
          return [
            allItem,
            ...opt.options.map((o) => ({ ...o, group: opt.label })),
          ];
        }
        return [opt];
      });
    }, [options]);

  // map parent `value` (Option[]) to the actual flatOptions references
const normalizedValue = React.useMemo(() => {
  if (!Array.isArray(value)) return []; // if value is undefined/null/single, return empty array

  const map = new Map(flatOptions?.map((o) => [o.value, o]) ?? []);
  return value
    .map((v) => map.get(v.value))
    .filter(Boolean); // remove any missing references
}, [value, flatOptions]);


  const applyAllLogic = (vals: (Option & { group?: string; isAll?: boolean })[]) => {
    const grouped: Record<string, (Option & { group?: string })[]> = {};

    flatOptions.forEach((opt) => {
      if (opt.group) {
        grouped[opt.group] = grouped[opt.group] || [];
        grouped[opt.group].push(opt);
      }
    });

    const set = new Set(vals.map((v) => v.value));
    const next: (Option & { group?: string; isAll?: boolean })[] = [];

    for (const opt of flatOptions) {
      if (opt.isAll) {
        const group = opt.group!;
        const groupMembers = grouped[group].filter((o: any) => !o.isAll);
        const allSelected = groupMembers.every((m) => set.has(m.value));
        if (set.has(opt.value) || allSelected) {
          next.push(opt, ...groupMembers);
        }
      } else if (set.has(opt.value)) {
        next.push(opt);
      }
    }

    // De-dupe
    const map = new Map(next.map((o) => [o.value, o]));
    return Array.from(map.values());
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={flatOptions}
      groupBy={(option: any) => option.group || ""}
      getOptionLabel={(option) => option.label}
      value={normalizedValue}
      onChange={(_, newValue) => {
        const normalized = applyAllLogic(newValue);
        // Strip out "All" when passing back up
        onChange(normalized.filter((o) => !o.isAll));
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            style={{ marginRight: 8 }}
            checked={selected} // ✅ checkboxes now sync perfectly
          />
          {option.label}
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected
          .filter((opt) => !opt.isAll) // don’t show "All" chips
          .map((opt, index) => (
            <Chip {...getTagProps({ index })} key={opt.value} label={opt.label} />
          ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} />
      )}
    />
  );
};

export default GroupedSelect;
