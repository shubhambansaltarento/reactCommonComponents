import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { CustomCheckbox } from "../Checkbox";
import { 
  CommonActionTableProps, 
  CommonActionTableColumn,
  CommonActionButton,
} from './CommonActionTable.interface';
import { NoDataFound } from '../NoDataFound/NoDataFound';
import { CommonPagination } from '../CommonPagination/CommonPagination';
import { renderActionButtons } from './actionButtonUtils';
import { renderContentWithSupport } from './renderUtils';

const styles = require('./CommonActionTable.module.css');

// Internal TableHeader component
const TableHeader = <T extends Record<string, any>>({
  allowSelection,
  selectedRows,
  data,
  columns,
  minColWidth,
  actionButtons,
  actionComponents,
  headerComponents,
  hasRightShadow,
  handleSelectAll
}: {
  allowSelection: boolean;
  selectedRows: Set<string>;
  data: T[];
  columns: CommonActionTableColumn<T>[];
  minColWidth: number;
  actionButtons: CommonActionButton<T>[];
  actionComponents?: (row: T) => React.ReactNode;
  headerComponents?: {
    [columnKey: string]: React.ReactNode;
  };
  hasRightShadow: boolean;
  handleSelectAll: (isSelected: boolean) => void;
}) => (
  <TableHead>
    <TableRow sx={{ height: '60px' }}>
      {allowSelection && (
        <TableCell sx={{ 
          width: 60, 
          minWidth: 60, 
          maxWidth: 60,
          p: "1rem",
          verticalAlign: 'middle',
        }}>
          <CustomCheckbox
            indeterminate={
              selectedRows.size > 0 && selectedRows.size < data.length
            }
            checked={data.length > 0 && selectedRows.size === data.length}
            onChange={(e: any) => handleSelectAll(e.target.checked)}
          />
        </TableCell>
      )}
      {columns.map((column) => {
        return (
          <TableCell
            key={String(column.key)}
            sx={{
              minWidth: column.width ?? minColWidth,
              width: column.width ?? minColWidth,
              position: "static",
              zIndex: 1,
              p: "1rem",
              whiteSpace: 'nowrap',
              verticalAlign: 'middle',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 'inherit' }}>
                {column.label}
              </Typography>
              {headerComponents?.[String(column.key)]}
            </Box>
          </TableCell>
        );
      })}
      {(actionButtons.length > 0 || actionComponents) && (
        <TableCell
          sx={{
            minWidth: 120,
            width: 120,
            position: "sticky",
            right: 0,
            zIndex: 3,
            p: "1rem",
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            boxShadow: hasRightShadow ? "-2px 0 5px -2px rgba(0,0,0,0.2)" : "none",
          }}
        >
        </TableCell>
      )}
    </TableRow>
  </TableHead>
);

// Internal TableRowComponent
const TableRowComponent = <T extends Record<string, any>>({
  row,
  index,
  uniqueKey,
  selectedRows,
  allowSelection,
  columns,
  minColWidth,
  actionButtons,
  actionComponents,
  hasRightShadow,
  renderCellContent,
  renderActionButtons,
  handleRowSelect,
  onRowClick,
  onRowDoubleClick,
  handleRowClick,
  getRowClassName,
  styles
}: {
  row: T;
  index: number;
  uniqueKey: keyof T;
  selectedRows: Set<string>;
  allowSelection: boolean;
  columns: CommonActionTableColumn<T>[];
  minColWidth: number;
  actionButtons: CommonActionButton<T>[];
  actionComponents?: (row: T) => React.ReactNode;
  hasRightShadow: boolean;
  renderCellContent: (row: T, column: CommonActionTableColumn<T>) => any;
  renderActionButtons: (row: T) => any;
  handleRowSelect: (rowId: string, isSelected: boolean) => void;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  handleRowClick?: (row: T) => void;
  getRowClassName?: (row: T) => string;
  styles: any;
}) => {
  const rowId = String(row[uniqueKey]);
  const isSelected = selectedRows.has(rowId);
  
  return (
    <TableRow
      key={rowId}
      className={getRowClassName ? getRowClassName(row) : ''}
      selected={allowSelection && isSelected}
      onClick={() => {
        if (handleRowClick) {
          handleRowClick(row);
        } else {
          onRowClick?.(row);
        }
      }}
      onDoubleClick={() => onRowDoubleClick?.(row)}
      sx={{
        backgroundColor: isSelected ? "#E2EDF5" : "inherit",
      }}
    >
      {allowSelection && (
        <TableCell
          sx={{
            width: 60,
            minWidth: 60,
            maxWidth: 60,
            backgroundColor: isSelected ? "#E2EDF5" : "#ffffff",
            p: "8px 12px"
          }}
        >
          <CustomCheckbox
            checked={isSelected}
            onClick={(e: any) => e.stopPropagation()}
            onChange={() => handleRowSelect(rowId, !isSelected)}
          />
        </TableCell>
      )}
      {columns.map((column) => {
        return (
          <TableCell
            key={String(column.key)}
            sx={{
              minWidth: column.width ?? minColWidth,
              width: column.width ?? minColWidth,
              backgroundColor: isSelected ? "#E2EDF5" : "#ffffff",
              position: "static",
              zIndex: 1,
              color: "#000000",
            }}
          >
            <Box className={`flex justify-between gap-2 ${styles.arrowIcon} status_container`}>
              <Typography
                component="span"
                className={column.className ?? ''}
              >
                {column.icon?.iconComponent &&
                  !column.icon?.hide?.(row) && (
                    <column.icon.iconComponent
                      className="w-[22px] absolute left-[-15px] mt-1"
                      style={{
                        fill: column.icon.fill
                          ? column.icon.fill(row)
                          : "currentColor",
                      }}
                    />
                  )}
                {renderCellContent(row, column)}
              </Typography>
            </Box>
          </TableCell>
        );
      })}
      {(actionButtons.length > 0 || actionComponents) && (
        <TableCell
          sx={{
            minWidth: 120,
            width: 120,
            backgroundColor: isSelected ? "#E2EDF5" : "#ffffff",
            position: "sticky",
            right: 0,
            zIndex: 2,
            color: "#000000",
            boxShadow: hasRightShadow ? "-2px 0 5px -2px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <Box className={styles.actions}>
            {renderActionButtons(row)}
          </Box>
        </TableCell>
      )}
    </TableRow>
  );
};

const CommonActionTable = <T extends Record<string, any>>({
  columns,
  data,
  actionButtons = [],
  uniqueKey = 'id' as keyof T,
  // Custom component support
  customComponents,
  actionComponents,
  headerComponents,
  // Selection props
  allowSelection = false,
  selectedRows = new Set(),
  onRowSelectionChange,
  onSelectRow,
  // Sticky props
  allowSticky = false,
  minColWidth = 100,
  // Pagination props
  page = 1,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  costLabel,
  costAmount,
  enablePagination = true,
  // Style props
  getRowClassName,
  wrapperClassName = '',
  // Row interaction props
  onRowClick,
  onRowDoubleClick,
  rowActionIndexOnClick,
  // Loading and empty states
  loading = false,
  emptyComponent
}: CommonActionTableProps<T>) => {
  const theme = useTheme();
  const [hasLeftShadow, setHasLeftShadow] = useState(false);
  const [hasRightShadow, setHasRightShadow] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setHasLeftShadow(scrollLeft > 0);
    setHasRightShadow(scrollLeft + clientWidth < scrollWidth);
  }, []);

  useEffect(() => {
    handleScroll(); // check shadows on mount and data change
  }, [data, columns, handleScroll]);

  // Re-check shadows on screen resize
  useEffect(() => {
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  // Handle row selection
  const handleRowSelect = (rowId: string, isSelected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    onRowSelectionChange?.(newSelectedRows as Set<string>);
    
    if (onSelectRow) {
      const selectedData = data.filter(row => 
        newSelectedRows.has(String(row[uniqueKey]))
      );
      onSelectRow(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedRows = isSelected 
      ? new Set(data.map(row => String(row[uniqueKey])))
      : new Set<string>();
    
    onRowSelectionChange?.(newSelectedRows);
    
    if (onSelectRow) {
      const selectedData = isSelected ? data : [];
      onSelectRow(selectedData);
    }
  };

  const handleRowClick = useCallback((row: T) => {
    if(rowActionIndexOnClick !== undefined && actionButtons && actionButtons[rowActionIndexOnClick]) {
      actionButtons[rowActionIndexOnClick].clickHandler?.(row);
    }
    onRowClick?.(row);
  }, [actionButtons, onRowClick, rowActionIndexOnClick]);

  // Render cell content with custom component support
  const renderCellContent = (row: T, column: CommonActionTableColumn<T>) => {
    return renderContentWithSupport(row, column, customComponents);
  };

  // Render action buttons using local utility
  const handleRenderActionButtons = (row: T) => {
    return renderActionButtons({
      row,
      actionButtons,
      actionComponents,
      uniqueKey,
      styles,
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



  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box className={`${wrapperClassName ?? ''} ${styles.tableOuter}`}>
        <TableContainer 
          ref={containerRef}
          onScroll={handleScroll}
          sx={{ 
            overflowX: 'auto', 
            overflowY: 'auto',
            width: '100%'
          }}
        >
          <Table 
            className="whitespace-nowrap"
            sx={{ 
              minWidth: 'max-content',
              width: '100%'
            }}
          >
            <TableHeader
              allowSelection={allowSelection}
              selectedRows={selectedRows}
              data={data}
              columns={columns}
              minColWidth={minColWidth}
              actionButtons={actionButtons}
              actionComponents={actionComponents}
              headerComponents={headerComponents}
              hasRightShadow={hasRightShadow}
              handleSelectAll={handleSelectAll}
            />
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRowComponent 
                    key={String(row[uniqueKey])} 
                    row={row} 
                    index={index}
                    uniqueKey={uniqueKey}
                    selectedRows={selectedRows}
                    allowSelection={allowSelection}
                    columns={columns}
                    minColWidth={minColWidth}
                    actionButtons={actionButtons}
                    actionComponents={actionComponents}
                    hasRightShadow={hasRightShadow}
                    renderCellContent={renderCellContent}
                    renderActionButtons={handleRenderActionButtons}
                    handleRowSelect={handleRowSelect}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onRowDoubleClick}
                    handleRowClick={handleRowClick}
                    getRowClassName={getRowClassName}
                    styles={styles}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={
                      columns.length + 
                      (allowSelection ? 1 : 0) + 
                      (actionButtons.length > 0 || actionComponents ? 1 : 0)
                    }
                    sx={{ 
                      border: 0, 
                      padding: 0,
                      textAlign: 'center'
                    }}
                  >
                    <Box className="flex min-h-[400px] justify-center items-center">
                      {emptyComponent ?? <NoDataFound />}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Pagination */}
      {enablePagination && onPageChange && (
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

export default CommonActionTable;