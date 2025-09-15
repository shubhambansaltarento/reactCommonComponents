import * as React from 'react';
import Box from '@mui/material/Box';

export interface CommonTabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
    tabClassName?: string;
}

export const CommonTabPanel: React.FC<CommonTabPanelProps> = ({  children, value, index,tabClassName, ...other}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={tabClassName}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

// Reusable a11yProps function
export const a11yProps = (index: number) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};
