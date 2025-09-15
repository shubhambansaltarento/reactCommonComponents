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
import { CustomButton } from "../Button/Button";
import { CommonPagination } from "../CommonPagination/CommonPagination";
import "./ActionTable.css";
import { ActionTableWithPaginationProps } from "./ActionTable.interface";
import ItemCounter from "../ProductCard/ItemCounter";
import { NoDataFound } from "../NoDataFound";
import { CartIcon } from "../../generated-icon";

/**
 * @component ActionTableComponent
 * Renders a table with pagination, row selection, sticky columns, and custom actions.
 *
 * @template T - Type of row data.
 * @param {Object} props - ActionTableWithPaginationProps
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
 * @param {string} [props.costCurrencySymbol] - Optional cost currency symbol.
 * @param {boolean} [props.allowSticky] - Enable sticky columns.
 * @param {keyof T} [props.uniqueKey] - Unique key for rows, defaults to 'id'.
 */
function ActionTableComponent<T>({
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
    actionButtons,
    costLabel,
    costAmount,
    costCurrencySymbol,
    allowSticky = false,
    uniqueKey = 'id' as keyof T, // Default to 'id' if not provided
    showItemCounter = false,
    quantityUpdate,
    getMinOrderQuantity,
    getProductCatalogId,
    debounce=true,
    disableAllSelection=false,
    rowActionIndexOnClick
}: ActionTableWithPaginationProps<T>) {

    const [selectedId, setSelectedId] = useState<any[]>([]);
    const [hasLeftShadow, setHasLeftShadow] = useState(false);
    const [hasRightShadow, setHasRightShadow] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setHasLeftShadow(scrollLeft > 0);
        setHasRightShadow(scrollLeft + clientWidth < scrollWidth);
    }, []);

    // Set initial quantities directly in the quantities state when available
    useEffect(() => {
        const initialQtys: Record<string, number> = {};
        const initialSelectedIds: any[] = [];

        data.forEach((row: any) => {
            const key = String(row[uniqueKey]);
            const initialQty = row.cartQuantity;
            if (initialQty > 0) {
                initialQtys[key] = initialQty;
                
                // Track rows that should be selected due to initial quantity
                if (!initialSelectedIds.includes(row[uniqueKey])) {
                    initialSelectedIds.push(row[uniqueKey]);
                }
            }
        });
        
        // Update quantities
        setQuantities(prev => ({ ...prev, ...initialQtys }));
        
        // Set initial selections only when component mounts or data changes
        if (initialSelectedIds.length > 0) {
            setSelectedId(initialSelectedIds);
        }
        
    }, [data, uniqueKey]);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (!allowSelection) return;
        const selectedIds = checked ? data.map(row => row[uniqueKey]) : [];
        
        if (checked) {
            setSelectedId(selectedIds);
            
            // Handle cart quantity logic if showItemCounter is enabled
            if (showItemCounter) {
                const newQuantities: Record<string, number> = {};
                data.forEach(row => {
                    const rowId = String(row[uniqueKey]);
                    const currentQty = quantities[rowId] || 0;
                    
                    if (currentQty === 0) {
                        // Set to minimum order quantity if current quantity is 0
                        const minQty = getMinOrderQuantity ? getMinOrderQuantity(row) : 1;
                        newQuantities[rowId] = minQty;
                        // Notify parent about the quantity change
                        quantityUpdate?.({
                            quantity: minQty,
                            rowData: row
                        });
                    } else {
                        // Keep existing quantity if it's already set
                        newQuantities[rowId] = currentQty;
                    }
                });
                
                setQuantities(prev => ({ ...prev, ...newQuantities }));
            }
        } else {
            setSelectedId([]);
            // Handle deselect all - reset quantities to 0 if showItemCounter is enabled
            if (showItemCounter) {
                data.forEach(row => {
                    const rowId = String(row[uniqueKey]);
                    if (quantities[rowId] > 0) {
                        // Notify parent about quantity reset to 0
                        quantityUpdate?.({
                            quantity: 0,
                            rowData: row
                        });
                    }
                });
                setQuantities({});
            }
        }
    }, [data,  showItemCounter, quantities, getMinOrderQuantity, uniqueKey, allowSelection, quantityUpdate]);

    const handleSelectRow = useCallback((id: any, event?: React.ChangeEvent<HTMLInputElement>, currentRow:any = {}) => {
        if(event && !event.target.checked){
            currentRow.cartQuantity = 0
        }
        if (!allowSelection) return;
        const currentSelectedIds = isSelected(id) ? selectedId.filter(r => r !== id) : [...selectedId, id];
        
        // Handle cart quantity logic if showItemCounter is enabled
        if (showItemCounter) {
            const rowId = String(id);
            const row = data.find(r => r[uniqueKey] === id);
            
            if (!isSelected(id)) {
                // Row is being selected - set to minimum order quantity if current quantity is 0
                const currentQty = quantities[rowId] || 0;
                if (currentQty === 0) {
                    const minQty = getMinOrderQuantity ? getMinOrderQuantity(row!) : 1;
                    setQuantities(prev => ({ ...prev, [rowId]: minQty }));
                    if(event && event.target.checked){
                        currentRow.cartQuantity = minQty
                    }
                    // Notify parent about the quantity change
                    quantityUpdate?.({
                        quantity: minQty,
                        rowData: row!
                    });
                  
                }
            } else {
                // Row is being deselected - reset quantity to 0
                setQuantities(prev => {
                    const { [rowId]: _, ...rest } = prev;
                    return rest;
                });
                // Notify parent about quantity reset to 0
                quantityUpdate?.({
                    quantity: 0,
                    rowData: row!
                });
            }
        }

        setSelectedId(currentSelectedIds);
        

    }, [data, selectedId, showItemCounter, quantities, getMinOrderQuantity, uniqueKey, allowSelection, quantityUpdate]);

    const isSelected = (id: any) => {
        return selectedId.includes(id);
    }

    const handleRowClick = useCallback((row: T, rowIndex: number) => {
        if(rowActionIndexOnClick !== undefined && actionButtons && actionButtons[rowActionIndexOnClick]) {
            actionButtons[rowActionIndexOnClick].clickHandler?.(row);
        }else{
            handleSelectRow(row[uniqueKey]);
        }
    }, [actionButtons, handleSelectRow, rowActionIndexOnClick, uniqueKey]);

    // Handle quantity changes from ItemCounter
    const handleQuantityChange = useCallback((row: T, newQuantity: number) => {
        console.log('handleQuantityChange called with:', { row: row[uniqueKey], newQuantity });
        const rowId = String(row[uniqueKey]);
        
        // Update local quantity state first
        setQuantities(prev => {
            if (newQuantity === 0) {
                const { [rowId]: _, ...rest } = prev;
                console.log('Updated quantities (removed):', rest);
                return rest;
            } else {
                const newState = { ...prev, [rowId]: newQuantity };
                console.log('Updated quantities (added):', newState);
                return newState;
            }
        });
        
        // Handle selection logic
        if (newQuantity === 0) {
            // Auto-deselect when quantity becomes 0
            if (isSelected(row[uniqueKey])) {
                const newSelectedIds = selectedId.filter(id => id !== row[uniqueKey]);
                setSelectedId(newSelectedIds);
            }
        } else {
            // Auto-select when quantity becomes positive and row isn't already selected
            if (!isSelected(row[uniqueKey])) {
                setSelectedId(prev => [...prev, row[uniqueKey]]);
            }
        }
        
        // Notify parent about quantity change
        quantityUpdate?.({
            quantity: newQuantity,
            rowData: row
        });
    }, [quantities, uniqueKey, isSelected, selectedId, data, quantityUpdate]);


    // useEffect(() => {
    //     setSelectedId([]);
    //     // setQuantities({});
    // }, [page, data]);

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
                                        checked={selectedId.length === data.length}
                                        onChange={(e: any) => handleSelectAll(e.target.checked)}
                                        disabled={disableAllSelection}
                                    />
                                </TableCell>}
                                {columns.map((col, idx) => {
                                    const isFirst = idx === 0;
                                    const isLast = idx === columns.length - 1;
                                    return (
                                        <TableCell
                                            key={idx}
                                            sx={{
                                                minWidth: minColWidth,
                                                position: allowSticky && (isFirst || isLast) ? "sticky" : "static",
                                                left: allowSticky && (isFirst && allowSelection) ? 60 : undefined,
                                                right: allowSticky && isLast ? 0 : undefined,
                                                zIndex: allowSticky && (isFirst || isLast) ? 3 : 1,
                                                p: "1rem",
                                                boxShadow: allowSticky && isFirst && hasLeftShadow
                                                    ? "2px 0 5px -2px rgba(0,0,0,0.2)"
                                                    : allowSticky && isLast && hasRightShadow
                                                        ? "-2px 0 5px -2px rgba(0,0,0,0.2)"
                                                        : "none",
                                            }}
                                        >
                                            {col.label}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row: any, rIdx) =>
                            (
                                <TableRow
                                    key={row[uniqueKey] as React.Key}
                                    hover={true}
                                    className={getRowClassName && styles ? styles[getRowClassName(row)] : ''}
                                    selected={allowSelection && (isSelected(row[uniqueKey]) || (quantities[String(row[uniqueKey])] || 0) > 0)}
                                    onClick={() => handleRowClick(row, rIdx)}
                                    sx={{
                                        backgroundColor: (isSelected(row[uniqueKey]) || (quantities[String(row[uniqueKey])] || 0) > 0)
                                            ? "#E2EDF5"
                                            : "inherit",
                                    }}
                                >
                                    {allowSelection && <TableCell
                                        sx={{
                                            backgroundColor: (isSelected(row[uniqueKey]) || (quantities[String(row[uniqueKey])] || 0) > 0)
                                                ? "#E2EDF5"
                                                : "#ffffff",
                                            position: "sticky",
                                            left: 0,
                                            zIndex: 2,
                                            p: "5px 10px"
                                        }}
                                    >
                                        <CustomCheckbox
                                            checked={isSelected(row[uniqueKey]) || (quantities[String(row[uniqueKey])] || 0) > 0}
                                            onClick={e => e.stopPropagation()}
                                            onChange={(e) => handleSelectRow(row[uniqueKey], e, row)}
                                        />
                                    </TableCell>}
                                    {columns.map((col, idx) => {
                                        const isFirst = idx === 0;
                                        const isLast = idx === columns.length - 1;
                                        return (
                                            <TableCell
                                                key={col.key as React.Key}
                                                sx={{
                                                    minWidth: minColWidth,
                                                    backgroundColor: (isSelected(row[uniqueKey]) || (quantities[String(row[uniqueKey])] || 0) > 0)
                                                        ? "#E2EDF5"
                                                        : "#ffffff",
                                                    position: allowSticky && (isFirst || isLast) ? "sticky" : "static",
                                                    left: allowSticky && isFirst && allowSelection ? 60 : undefined,
                                                    right: allowSticky && isLast ? 0 : undefined,
                                                    zIndex: allowSticky && (isFirst || isLast) ? 2 : 1,
                                                    color: "#000000",
                                                    boxShadow: allowSticky && isFirst && hasLeftShadow
                                                        ? "2px 0 5px -2px rgba(0,0,0,0.2)"
                                                        : allowSticky && isLast && hasRightShadow
                                                            ? "-2px 0 5px -2px rgba(0,0,0,0.2)"
                                                            : "none",
                                                }}
                                            >
                                                <Box className="flex justify-between gap-2 arrow-icon status_container">
                                                    
                                                    <Typography
                                                        component="span"
                                                        className={col.className && styles[col.className]}
                                                    >
                                                        {
                                                            col.icon && !(col.icon.hide && col.icon.hide(row)) && col.icon.iconComponent && (
                                                                <col.icon.iconComponent className="w-[22px] absolute left-[-15px] mt-1"
                                                                    style={{
                                                                        fill: col.icon.fill ? col.icon.fill(row) : 'currentColor',
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                        {col.transformFn ? col.transformFn(row[col.key], row) as string | number | React.ReactNode : row[col.key] as string | number | React.ReactNode}
                                                    </Typography>

                                                    <Box className="flex items-center gap-2">
                                                        {/* ItemCounter for cart operations */}
                                                        {isLast && showItemCounter && debounce && (
                                                            <div 
                                                                onClick={(e) => e.stopPropagation()}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                            >
                                                                <ItemCounter
                                                                    count={quantities[String(row[uniqueKey])] || 0}
                                                                    onChange={(newCount: number) => handleQuantityChange(row, newCount)}
                                                                    min={0}
                                                                    max={100000}
                                                                    {...(debounce ? {} : { debounceDelay: 0})}
                                                                    className="mr-2"
                                                                    counterUpdateValue={getMinOrderQuantity ? getMinOrderQuantity(row) : 1}
                                                                    id={getProductCatalogId ? getProductCatalogId(row) : String(row[uniqueKey])}
                                                                />
                                                            </div>
                                                        )}
                                                        {!debounce && isLast && showItemCounter && (
                                                            <div 
                                                                onClick={(e) => e.stopPropagation()}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Typography 
                                                                    variant="body2" 
                                                                    sx={{ 
                                                                        minWidth: '60px', 
                                                                        textAlign: 'center',
                                                                        fontWeight: 500,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    {/* <CartIcon style={{ width: '16px', height: '16px' }} />  */}
                                                                    {quantities[String(row[uniqueKey])] || "-"}
                                                                </Typography>
                                                                
                                                                <CustomButton
                                                                    variant="contained"
                                                                    label="Add"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const currentQty = quantities[String(row[uniqueKey])] || 0;
                                                                        const minQty = getMinOrderQuantity ? getMinOrderQuantity(row) : 1;
                                                                        const newQuantity = currentQty + minQty;
                                                                        
                                                                        quantityUpdate?.({
                                                                            quantity: newQuantity,
                                                                            rowData: row
                                                                        });
                                                                    }}
                                                                    className="text-xs px-3 py-1 h-[30px]"
                                                                    style={{height:'30px'}}

                                                                />
                                                            </div>
                                                        )}

                                                        {/* Action buttons */}
                                                        {isLast && actionButtons && actionButtons.length > 0 && actionButtons.map((action, aIdx) => {
                                                            return !(action.hide && action.hide(row)) && (
                                                                <IconButton key={aIdx}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        action.clickHandler?.(row);
                                                                    }}
                                                                >
                                                                    <action.iconComponent className="w-[25px] h-[15px]"
                                                                        style={{
                                                                            fill: action.fill ? action.fill(row) : 'currentColor',
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            )
                                                        })}
                                                    </Box>

                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                    {data.length === 0 && (
                        <Box className="flex min-h-[400px] justify-center items-center">
                            <NoDataFound />
                        </Box>
                    )}
                </TableContainer>
            </Box>
            <CommonPagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={totalRows}
                onPageChange={onPageChange}
                costLabel={costLabel}
                costAmount={costAmount}
            />
        </Box>
    );

}

export const ActionTable = React.memo(ActionTableComponent) as typeof ActionTableComponent;
