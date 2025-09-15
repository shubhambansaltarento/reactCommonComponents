export interface Option {
  label: string;
  value: string;
}

export interface PriorityColor {
  bg: string;
  text: string;
}

export type MultiSelectProps =
  | {
      multiple?: false; // single select mode
      value?: string; // single value
      onChange?: (val: string) => void; // single string
      options: Option[];
      defaultValues?: string[]; // only first will be used
      disabled?: boolean;
      toggleLabelCls?: string;
      priorityColors?: Record<string, PriorityColor>;
    }
  | {
      multiple: true; // multi select mode
      value?: string[]; // multiple values
      onChange?: (val: string[]) => void; // array of strings
      options: Option[];
      defaultValues?: string[];
      disabled?: boolean;
      toggleLabelCls?: string;
      priorityColors?: Record<string, PriorityColor>;
    };
