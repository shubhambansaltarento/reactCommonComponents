// InfoGridSection.interface.ts

export type InfoGridCell = {
  key?: string;                     // <-- NEW: stable identifier for FE mapping
  label: string;                    // shown on top (bold + colored)
  value: string | number;           // shown below (plain, dark)
  colorClass?: string;              // optional FE override (e.g., "text-green")
  colorStyle?: React.CSSProperties; // optional FE inline color
};

export type InfoGridRow = {
  columns: InfoGridCell[];
};

export interface InfoGridSectionProps {
  sections: InfoGridRow[];
  className?: string;
}
