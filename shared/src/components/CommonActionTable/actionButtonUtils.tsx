import React from 'react';
import { IconButton, Tooltip, Box, Theme } from '@mui/material';

export interface ActionButton<T = any> {
  iconComponent: React.ComponentType<any>;
  clickHandler?: (row: T) => void;
  tooltip?: string;
  hide?: (row: T) => boolean;
  fill?: (row: T) => string;
}

export interface RenderActionButtonsProps<T> {
  row: T;
  actionButtons: ActionButton<T>[];
  actionComponents?: (row: T) => React.ReactNode;
  uniqueKey: keyof T;
  styles?: any;
  containerClassName?: string;
  theme?: Theme;
}

export const renderActionButtons = <T extends Record<string, any>>({
  row,
  actionButtons,
  actionComponents,
  uniqueKey,
  styles,
  containerClassName,
  theme
}: RenderActionButtonsProps<T>) => {
  if (actionComponents) {
    return actionComponents(row);
  }

  const buttons = actionButtons
    .filter(button => !button.hide?.(row))
    .map((button, index) => {
      const IconComponent = button.iconComponent;
      const buttonKey = `${String(row[uniqueKey])}-action-${index}`;
      const buttonElement = (
        <IconButton
          key={buttonKey}
          onClick={(e) => {
            e.stopPropagation();
            button.clickHandler?.(row);
          }}
          size="small"
          className={styles?.actionButton}
          sx={{ 
            color: button.fill?.(row) ?? theme?.palette.action.active ?? 'action.active'
          }}
        >
          <IconComponent 
            className="w-[22px]" 
            style={{
              fill: button.fill ? button.fill(row) : "currentColor",
            }} 
          />
        </IconButton>
      );

      return button.tooltip ? (
        <Tooltip key={`${buttonKey}-tooltip`} title={button.tooltip}>
          {buttonElement}
        </Tooltip>
      ) : buttonElement;
    });

  return containerClassName ? (
    <Box className={containerClassName}>{buttons}</Box>
  ) : (
    <>{buttons}</>
  );
};