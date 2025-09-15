'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomAccordionProps } from './Accordion.interface';
import './Accordion.css';

// CustomAccordion: A reusable accordion component with optional icon and custom styling.
export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  defaultExpanded = false,
  children,
  className = '',
  icon,
  scrollOnExpand = true, // ✅ new prop
  onChange, // ✅ custom onChange callback
  ...rest
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
    setHasUserInteracted(true);
    // ✅ Call the custom onChange callback if provided
    // Support both function signatures by checking the function length
    if (onChange) {
      if (onChange.length === 2) {
        // Function expects 2 parameters (event, expanded)
        (onChange as (event: React.SyntheticEvent, expanded: boolean) => void)(event, isExpanded);
      } else {
        // Function expects 1 parameter (expanded)
        (onChange as (expanded: boolean) => void)(isExpanded);
      }
    }
  };

  useEffect(() => {
    if (!scrollOnExpand) return; // ✅ skip scrolling if disabled
    if (expanded && hasUserInteracted && summaryRef.current) {
      setTimeout(() => {
        const rect = summaryRef.current!.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 170;
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [expanded, hasUserInteracted, scrollOnExpand]);

  return (
    <Accordion
      className={className}
      expanded={expanded}
      onChange={handleChange}
      {...rest}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} ref={summaryRef}>
        <Typography
          component="span"
          className="flex items-center !font-medium !text-base gap-2"
        >
          {icon && <span className="icon-wrapper">{icon}</span>}
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

