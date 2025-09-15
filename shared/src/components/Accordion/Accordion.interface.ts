import { AccordionProps } from '@mui/material';
export interface CustomAccordionProps extends Omit<AccordionProps, 'onChange'> {
  title: string;
  defaultExpanded?: boolean;
  className?: string;
  icon?: React.ReactNode;
  scrollOnExpand?: boolean;
  onChange?: ((expanded: boolean) => void) | ((event: React.SyntheticEvent, expanded: boolean) => void);
}
