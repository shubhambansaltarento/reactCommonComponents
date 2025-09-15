'use client';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomCheckbox } from "../Checkbox";
import { CommonPagination } from "../CommonPagination/CommonPagination";
import { NoDataFound } from "../NoDataFound/NoDataFound";
import "./CommonTable.css";
import { TableWithPaginationProps } from "./CommonTable.interface";

/**
 * @component CommonTableComponent
 * Renders a table with pagination, row selection, sticky columns, and custom actions.
 *
 * @template T - Type of row data.
 * @param {Object} props - TableWithPaginationProps
 * @param {Array} props.columns - Table columns configuration.
 * @param {Array} props.data - Table row data.
 * @param {number} props.page - Current page number.
 * @param {number} props.rowsPerPage - Number of rows per page.
 * @param {number} props.totalRows - Total number of rows.
 * @param {boolean} [props.allowSelection] - Enable row selection.
 * @param {number} [props.minColWidth] - Minimum column width.
 * @param {function} [props.getRowClassName] - Function to get row class name.
 * @param {Object} [props.styles] - Custom styles object.
 * @param {string} [props.wrapperClassName] - Wrapper class name.
 * @param {function} props.onPageChange - Callback for page change.
 * @param {function} [props.onSelectRow] - Callback for row selection.
 * @param {Array} [props.actionButtons] - Action buttons for last column.
 * @param {string} [props.costLabel] - Optional cost label.
 * @param {string|number} [props.costAmount] - Optional cost amount.
 * @param {boolean} [props.allowSticky] - Enable sticky columns.
 * @param {keyof T} [props.uniqueKey] - Unique key for rows, defaults to 'id'.
 */
function CommonTableComponent<T>({
  columns,
  data,
  page,
  rowsPerPage,
  totalRows,
  allowSelection = true,
  minColWidth = 150,
  getRowClassName,
  styles,
  wrapperClassName,
  onPageChange,
  onSelectRow,
  actionButtons,
  costLabel,
  costAmount,
  allowSticky = false,
  hidePagination = false,
  rowActionIndexOnClick,
  uniqueKey = 'id' as keyof T, // Default to 'id' if not provided
  onDownloadClick,
  onUploadClick,
  selected
}: TableWithPaginationProps<T>) {

  const [selectedId, setSelectedId] = useState<any[]>(selected ?? []);
  // const [selectedId, setSelectedId] = useState<any[]>([]);
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

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!allowSelection) return;
    const selectedIds = checked ? data.map(row => row[uniqueKey]) : [];
    if (checked) {
      setSelectedId(selectedIds);
      onSelectRow?.(data);
    } else {
      setSelectedId([]);
      onSelectRow?.([]);
    }
  }, [data, onSelectRow]);

  const handleSelectRow = useCallback((id: any) => {
    if (!allowSelection) return;
    const currentSelectedIds = isSelected(id) ? selectedId.filter(r => r !== id) : [...selectedId, id];
    setSelectedId(currentSelectedIds);
    onSelectRow?.(data.filter(r => currentSelectedIds.includes(r[uniqueKey])));
  }, [data, onSelectRow, selectedId]);

  const handleRowClick = useCallback((row: T, rowIndex: number) => {
    if(rowActionIndexOnClick !== undefined && actionButtons && actionButtons[rowActionIndexOnClick]) {
      actionButtons[rowActionIndexOnClick].clickHandler?.(row);
    }else{
      handleSelectRow(row[uniqueKey]);
    }
  }, [actionButtons, handleSelectRow, rowActionIndexOnClick, uniqueKey]);

  const isSelected = useCallback((id: any) => {
    return selectedId.includes(id);
  }, [selectedId]);

  useEffect(() => {
    setSelectedId([]);
  }, [page, data]);

  // Update selectedId when selected prop changes
  useEffect(() => {
    if(!!selected){
      setSelectedId(selected);
    }
  }, [selected]);

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

  // Helper functions to reduce complexity in style calculations
  const getStickyPosition = useCallback((isFirst: boolean, isLast: boolean) => {
    if (!allowSticky) return "static";
    return (isFirst || isLast) ? "sticky" : "static";
  }, [allowSticky]);

  const getStickyOffsets = useCallback((isFirst: boolean, isLast: boolean) => {
    const offsets: { left?: number; right?: number } = {};
    
    if (allowSticky && isFirst) {
      offsets.left = allowSelection ? 62 : 0;
    }
    
    if (allowSticky && isLast) {
      offsets.right = 0;
    }
    
    return offsets;
  }, [allowSticky, allowSelection]);

  const getBoxShadow = useCallback((isFirst: boolean, isLast: boolean) => {
    if (!allowSticky) return "none";
    
    if (isFirst && hasLeftShadow) {
      return "2px 0 5px -2px rgba(0,0,0,0.2)";
    }
    
    if (isLast && hasRightShadow) {
      return "-2px 0 5px -2px rgba(0,0,0,0.2)";
    }
    
    return "none";
  }, [allowSticky, hasLeftShadow, hasRightShadow]);

  const getZIndex = useCallback((isFirst: boolean, isLast: boolean, isHeader = false) => {
    if (!allowSticky || (!isFirst && !isLast)) {
      return 1;
    }
    return isHeader ? 3 : 2;
  }, [allowSticky]);

  const getHeaderSxProps = useCallback((isFirst: boolean, isLast: boolean) => {
    const baseProps = {
      minWidth: minColWidth,
      position: getStickyPosition(isFirst, isLast),
      zIndex: getZIndex(isFirst, isLast, true),
      p: "1rem",
      boxShadow: getBoxShadow(isFirst, isLast),
      ...getStickyOffsets(isFirst, isLast),
    };
    
    return !allowSelection ? { ...baseProps, height: '60px' } : baseProps;
  }, [minColWidth, allowSelection, getStickyPosition, getZIndex, getBoxShadow, getStickyOffsets]);

  const getCellSxProps = useCallback((isFirst: boolean, isLast: boolean, row: T) => {
    return {
      minWidth: minColWidth,
      backgroundColor: isSelected?.(row[uniqueKey]) ? "#E2EDF5" : "#ffffff",
      position: getStickyPosition(isFirst, isLast),
      zIndex: getZIndex(isFirst, isLast, false),
      color: "#000000",
      boxShadow: getBoxShadow(isFirst, isLast),
      ...getStickyOffsets(isFirst, isLast),
    };
  }, [minColWidth, isSelected, uniqueKey, getStickyPosition, getZIndex, getBoxShadow, getStickyOffsets]);

  return (
    <Box>
      <Box className={`${wrapperClassName && styles?.[wrapperClassName]} table_outer`}>
        <TableContainer ref={containerRef} onScroll={handleScroll} className="overflow-x-auto">
          <Table stickyHeader className="whitespace-nowrap">
            <TableHead>
              <TableRow>
                {allowSelection && <TableCell sx={{ position: "sticky", left: 0 }}>
                  <CustomCheckbox
                    indeterminate={
                      selectedId.length > 0 && selectedId.length < data.length
                    }
                    checked={data.length > 0 && selectedId.length === data.length}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>}
                {columns.map((col, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === columns.length - 1;
                  return !col.hide && (
                    <TableCell
                      key={idx}
                      sx={getHeaderSxProps(isFirst, isLast)}
                    >
                      {col.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? data.map((row, rIdx) =>
              (
                <TableRow
                  key={row[uniqueKey] as React.Key}
                  hover={true}
                  className={getRowClassName && styles ? styles[getRowClassName(row)] : ''}
                  selected={allowSelection && isSelected?.(row[uniqueKey])}
                  onClick={() => handleRowClick(row, rIdx)}
                  sx={{
                    backgroundColor: isSelected?.(row[uniqueKey])
                      ? "#E2EDF5"
                      : "inherit",
                  }}
                >
                  {allowSelection && <TableCell
                    sx={{
                      backgroundColor: isSelected?.(row[uniqueKey])
                        ? "#E2EDF5"
                        : "#ffffff",
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      p: "5px 10px"
                    }}
                  >
                    <CustomCheckbox
                      checked={isSelected?.(row[uniqueKey])}
                      onClick={e => e.stopPropagation()}
                      onChange={() => handleSelectRow(row[uniqueKey])}
                    />
                  </TableCell>}
                  {columns.map((col, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === columns.length - 1;
                    return !col.hide && (
                      <TableCell
                        key={col.key as React.Key}
                        sx={getCellSxProps(isFirst, isLast, row)}
                      >
                        <Box className="flex items-center justify-between gap-2 arrow-icon status_container">
                          <Typography
                            component="span"
                            className={
                              col.className &&
                              styles[col.className]
                            }
                          >
                            {col.icon &&
                              !(
                                col.icon.hide &&
                                col.icon.hide(row)
                              ) &&
                              col.icon.iconComponent && (
                                <col.icon.iconComponent
                                  className="w-[22px] absolute left-[-15px] mt-1"
                                  style={{
                                    fill: col.icon.fill
                                      ? col.icon.fill(row)
                                      : "currentColor",
                                  }}
                                />
                              )}
                            {col.transformFn
                              ? (col.transformFn(
                                row[col.key],
                                row
                              ) as
                                | string
                                | number
                                | React.ReactNode)
                              : (row[col.key] as
                                | string
                                | number
                                | React.ReactNode) || "-"}
                          </Typography>
                          {isLast &&
                            actionButtons &&
                            actionButtons.length > 0 && (
                              <Box
                                sx={{
                                  marginLeft: "auto",
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                {actionButtons.map(
                                  (action, aIdx) => {
                                    return (
                                      !(
                                        action.hide &&
                                        action.hide(row)
                                      ) && (
                                        <IconButton
                                          key={aIdx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            action.clickHandler?.(
                                              row
                                            );
                                          }}
                                        >
                                          <action.iconComponent
                                            className="w-[22px]"
                                            style={{
                                              fill: action.fill
                                                ? action.fill(
                                                  row
                                                )
                                                : "currentColor",
                                            }}
                                          />
                                        </IconButton>
                                      )
                                    );
                                  }
                                )}
                              </Box>
                            )}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              )
              ) : null}
            </TableBody>
          </Table>
          {data.length === 0 && (
            <Box className="flex min-h-[400px] justify-center items-center">
              <NoDataFound />
            </Box>
          )}
        </TableContainer>
      </Box>
      {!hidePagination && <CommonPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        costLabel={costLabel}
        costAmount={costAmount}
        onDownloadClick={onDownloadClick}
        onUploadClick={onUploadClick}
      />}
    </Box>
  );

}

export const CommonTable = React.memo(CommonTableComponent) as typeof CommonTableComponent;