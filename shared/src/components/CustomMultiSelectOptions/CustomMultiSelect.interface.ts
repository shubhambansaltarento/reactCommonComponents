export interface Option {
  label: string;
  value: string;
  secondaryValue?: string; // Optional secondary value
}

export type MultiSelectProps =
  | {
      multiple?: false; // single select mode
      value?: string; // single value
      onChange?: (val: string) => void; // single string
      returnFullObject?: false | undefined; // backward compatibility
      options: Option[];
      defaultValues?: string[]; // only first will be used
      error?: boolean; // error state
      sx?: any; // Material-UI sx prop for styling
    }
  | {
      multiple?: false; // single select mode with full object
      value?: string; // single value
      onChange?: (val: Option | null) => void; // single object
      returnFullObject: true; // return full object
      options: Option[];
      defaultValues?: string[]; // only first will be used
      error?: boolean; // error state
      sx?: any; // Material-UI sx prop for styling
    }
  | {
      multiple: true; // multi select mode
      value?: string[]; // multiple values
      onChange?: (val: string[]) => void; // array of strings
      returnFullObject?: false | undefined; // backward compatibility
      options: Option[];
      defaultValues?: string[];
      error?: boolean; // error state
      sx?: any; // Material-UI sx prop for styling
    }
  | {
      multiple: true; // multi select mode with full objects
      value?: string[]; // multiple values
      onChange?: (val: Option[]) => void; // array of objects
      returnFullObject: true; // return full objects
      options: Option[];
      defaultValues?: string[];
      error?: boolean; // error state
      sx?: any; // Material-UI sx prop for styling
    };
