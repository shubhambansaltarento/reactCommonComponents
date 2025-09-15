import { JSX } from "react";

export interface TabListInterface {
  label: string;
  value: string | number;
  className?: string;
  count?: number;
  disabled?: boolean | ((value: string | number) => boolean);
  iconComponent?: JSX.Element
}

export interface CommonTabInterface {
  value: string | number;
  onChange: (event: React.SyntheticEvent, newValue: string | number) => void;
  tabList: TabListInterface[];
  className?: string;
  indicatorColor?: string;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  scrollButtons?: 'auto' | false;
}
