'use client';

import React, { useCallback, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  CommonActionListProps, 
  CommonActionListColumn, 
} from './CommonActionList.interface';
import { NoDataFound } from '../NoDataFound/NoDataFound';
import { CommonPagination } from '../CommonPagination/CommonPagination';
import { CustomCheckbox } from '../Checkbox';
import { CustomButton } from '../Button';
import { useTranslation } from 'react-i18next';
import './CommonActionList.module.css';
import { renderActionButtons } from '../CommonActionTable/actionButtonUtils';
import { renderContentWithSupport } from '../CommonActionTable/renderUtils';

const styles = require('./CommonActionList.module.css');

// External CardItem component to reduce cognitive complexity
const CardItem = <T extends Record<string, any>>({
  row,
  uniqueKey,
  checked,
  allowSelection,
  columns,
  headerComponents,
  footerComponents,
  actionButtons,
  actionComponents,
  buttonAction,
  buttonLabel,
  getCardClassName,
  onCardClick,
  onCardDoubleClick,
  handleSelect,
  renderFieldContent,
  renderActionButtons,
  styles
}: {
  row: T;
  uniqueKey: keyof T;
  checked: boolean;
  allowSelection: boolean;
  columns: CommonActionListColumn<T>[];
  headerComponents?: any;
  footerComponents?: any;
  actionButtons: any[];
  actionComponents?: any;
  buttonAction?: any;
  buttonLabel?: string;
  getCardClassName?: (row: T) => string;
  onCardClick?: (row: T) => void;
  onCardDoubleClick?: (row: T) => void;
  handleSelect: (row: T) => void;
  renderFieldContent: (row: T, column: CommonActionListColumn<T>) => any;
  renderActionButtons: (row: T) => any;
  styles: any;
}) => (
  <Card
    key={String(row[uniqueKey])}
    variant="outlined"
    className={`card_outer ${getCardClassName ? getCardClassName(row) : ''}`}
    onClick={() => onCardClick?.(row)}
    onDoubleClick={() => onCardDoubleClick?.(row)}
  >
    <CardContent className="card_content">
      {/* Card Header */}
      <Box 
        className="card_header"
        sx={{
          borderBottom: headerComponents ? '1px solid #e0e0e0' : 'none',
          paddingBottom: headerComponents ? '12px' : '0',
          marginBottom: headerComponents ? '12px' : '0'
        }}
      >
        {allowSelection && (
          <CustomCheckbox
            checked={checked}
            onClick={(e) => e.stopPropagation()}
            onChange={() => handleSelect(row)}
          />
        )}
        {headerComponents && (
          <Box className="flex items-center gap-2">
            {headerComponents(row)}
          </Box>
        )}
      </Box>

      {columns.map((col) => (
        <Box key={String(col.key)} className="card_body_label">
          <label>{col.label}</label>
          <Typography component="p" className="responsive-text">
            {col.icon?.iconComponent &&
              !col.icon?.hide?.(row) && (
                <col.icon.iconComponent
                  className="w-[22px] inline mr-2"
                  style={{
                    fill: col.icon.fill
                      ? col.icon.fill(row)
                      : "currentColor",
                  }}
                />
              )}
            {renderFieldContent(row, col)}
          </Typography>
        </Box>
      ))}

      {/* Card Footer */}
      <Box 
        className={styles.cardFooter}
        sx={{
          borderTop: footerComponents ? '1px solid #e0e0e0' : 'none',
          paddingTop: footerComponents ? '12px' : '0',
          marginTop: footerComponents ? '12px' : '0'
        }}
      >
        {footerComponents && footerComponents(row)}
      </Box>

      {/* Actions */}
      {(actionButtons.length > 0 || actionComponents) && (
        <Box 
          className={`${styles.cardActions} mt-4`}
          sx={{
            borderTop: '1px solid #e0e0e0',
            paddingTop: '12px',
            marginTop: '12px'
          }}
        >
          {renderActionButtons(row)}
        </Box>
      )}

      {buttonAction && buttonLabel && (
        <Box 
          className="card_button"
          sx={{
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <CustomButton
            label={buttonLabel}
            variant="contained"
            className="mt-4 w-full"
            onClick={() => buttonAction(row)}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

// Helper function to handle clear all functionality
const useClearAllHandler = <T extends Record<string, any>>(
  onRowSelectionChange?: (rows: Set<string>) => void,
  setLocalSelectedRows?: React.Dispatch<React.SetStateAction<Set<string>>>,
  onSelectRow?: (rows: T[]) => void
) => {
  return useCallback(() => {
    const emptySet = new Set<string>();
    if (onRowSelectionChange) {
      onRowSelectionChange(emptySet);
    } else if (setLocalSelectedRows) {
      setLocalSelectedRows(emptySet);
    }
    if (onSelectRow) onSelectRow([]);
  }, [onRowSelectionChange, setLocalSelectedRows, onSelectRow]);
};

// Helper function to determine scroll container styles
const getScrollContainerStyles = (enablePagination: boolean, dataLength: number) => {
  const shouldScroll = !enablePagination && dataLength > 10;
  return {
    maxHeight: shouldScroll ? '600px' : 'auto',
    overflowY: shouldScroll ? 'auto' : 'visible',
    paddingRight: shouldScroll ? '8px' : '0'
  };
};

const CommonActionListComponent = <T extends Record<string, any>>({
  columns,
  data,
  actionButtons = [],
  uniqueKey = 'id' as keyof T,
  // Custom component support
  customComponents,
  actionComponents,
  headerComponents,
  footerComponents,
  // Selection props
  allowSelection = false,
  selectedRows = new Set(),
  onRowSelectionChange,
  onSelectRow,
  // Pagination props
  page = 1,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  costLabel,
  costAmount,
  enablePagination = true,
  // Style props
  getCardClassName,
  wrapperClassName = '',
  // Card interaction props
  onCardClick,
  onCardDoubleClick,
  // Loading and empty states
  loading = false,
  emptyComponent,
  // Button props
  buttonLabel,
  buttonAction,
  // Generic component props
  componentProps,
  onComponentChange
}: CommonActionListProps<T>) => {
  const theme = useTheme();
  const { t } = useTranslation("translations");
  const [localSelectedRows, setLocalSelectedRows] = useState<Set<string>>(new Set());
  
  // Use external selectedRows if provided, otherwise use local state
  const currentSelectedRows = selectedRows.size > 0 ? selectedRows : localSelectedRows;

  // Helper function to update selection state
  const updateSelection = useCallback((newSelectedRows: Set<string>, selectedData: T[], action: string, actionValue: boolean, componentValue: T | T[] | undefined) => {
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRows);
    } else {
      setLocalSelectedRows(newSelectedRows);
    }
    
    if (onSelectRow) {
      onSelectRow(selectedData);
    }
    
    if (onComponentChange) {
      onComponentChange(action, actionValue, componentValue);
    }
  }, [onRowSelectionChange, onSelectRow, onComponentChange]);

  // Handle row selection (following CardList pattern)
  const handleSelect = useCallback((row: T) => {
    const key = String(row[uniqueKey]);
    const isCurrentlySelected = currentSelectedRows.has(key);
    const newSelectedRows = new Set(currentSelectedRows);
    
    if (isCurrentlySelected) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }
    
    const selectedData = data.filter(row => 
      newSelectedRows.has(String(row[uniqueKey]))
    );
    
    updateSelection(newSelectedRows, selectedData, 'selection', !isCurrentlySelected, row);
  }, [currentSelectedRows, data, uniqueKey, updateSelection]);

  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedRows = e.target.checked 
      ? new Set(data.map((row) => String(row[uniqueKey])))
      : new Set<string>();
    const selectedData = e.target.checked ? data : [];
    updateSelection(newSelectedRows, selectedData, 'selectAll', e.target.checked, selectedData);
  }, [data, uniqueKey, updateSelection]);

  const handleClearAll = useClearAllHandler(onRowSelectionChange, setLocalSelectedRows, onSelectRow);



  // Render field content with custom component support
  const renderFieldContent = (row: T, column: CommonActionListColumn<T>) => {
    return renderContentWithSupport(row, column, customComponents);
  };

  // Render action buttons using shared utility
  const handleRenderActionButtons = (row: T) => {
    return renderActionButtons({
      row,
      actionButtons,
      actionComponents,
      uniqueKey,
      styles,
      containerClassName: "flex gap-1",
      theme
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return (
      <div className={styles.empty}>
        <NoDataFound />
      </div>
    );
  }

  const selectedKeysArray = Array.from(currentSelectedRows);
  const isAllSelected = data.length > 0 && currentSelectedRows.size === data.length;
  const isIndeterminate = currentSelectedRows.size > 0 && currentSelectedRows.size < data.length;
  const hasSelection = selectedKeysArray.length > 0;

  return (
    <Box className={`${wrapperClassName ?? ''} p-4`}>
      {data.length > 0 && allowSelection && (
        <Box className={`mb-4 flex items-center ${styles.selectAll}`}>
          <CustomCheckbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
          />
          <Typography variant="subtitle1" className="text-base font-medium ml-2">
            {t("COMMON.SELECT_ALL")}
          </Typography>
          <Typography
            sx={{
              ml: '1rem',
              borderLeft: '1px solid var(--primary-400)',
              paddingLeft: '1rem',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              color: hasSelection ? 'var(--color-black)' : 'grey.400',
              opacity: hasSelection ? 1 : 0.5,
              pointerEvents: hasSelection ? 'auto' : 'none',
              userSelect: 'none'
            }}
            onClick={hasSelection ? handleClearAll : undefined}
          >
            {t("COMMON.CLEAR_ALL")}
          </Typography>
        </Box>
      )}

      <Box sx={getScrollContainerStyles(enablePagination, data.length)}>
        {data.map((row) => {
          const key = String(row[uniqueKey]);
          const checked = currentSelectedRows.has(key);
          
          return (
            <CardItem
              key={key}
              row={row}
              uniqueKey={uniqueKey}
              checked={checked}
              allowSelection={allowSelection}
              columns={columns}
              headerComponents={headerComponents}
              footerComponents={footerComponents}
              actionButtons={actionButtons}
              actionComponents={actionComponents}
              buttonAction={buttonAction}
              buttonLabel={buttonLabel}
              getCardClassName={getCardClassName}
              onCardClick={onCardClick}
              onCardDoubleClick={onCardDoubleClick}
              handleSelect={handleSelect}
              renderFieldContent={renderFieldContent}
              renderActionButtons={handleRenderActionButtons}
              styles={styles}
            />
          );
        })}
      </Box>

      {/* Pagination  */}
      {enablePagination && totalRows > 10 && onPageChange && (
        <CommonPagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={onPageChange}
          costLabel={costLabel}
          costAmount={costAmount}
        />
      )}
    </Box>
  );
};

export const CommonActionList = React.memo(CommonActionListComponent) as typeof CommonActionListComponent;