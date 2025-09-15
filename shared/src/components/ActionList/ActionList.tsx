'use client';
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { CustomButton } from "../Button";
import { CustomCheckbox } from "../Checkbox";
import { CommonPagination } from "../CommonPagination/CommonPagination";
import ItemCounter from "../ProductCard/ItemCounter";
import "./ActionList.css";
import { ActionListProps } from "./ActionList.interface";

/**
 * CardListComponent
 * Generic component to render a paginated, selectable list of cards.
 * Supports custom header, footer, actions, and selection logic.
 */
function ActionListComponent<T>({
    page,
    rowsPerPage,
    totalRows,
    onPageChange,
    data,
    columns,
    renderHeader,
    wrapperClassName,
    renderFooter,
    allowSelection = true,
    getCardClassName,
    onSelectionChange,
    buttonAction,
    styles,
    buttonLabel,
    actionButtons,
    uniqueKey = 'id' as keyof T,
    showItemCounter = false,
    quantityUpdate,
    getMinOrderQuantity,
    getProductCatalogId,
    selectedRows: externalSelectedRows,
    onRowSelectionChange,
    debounce=true,
    disableAllSelection = false,
    quantityLabel
}: ActionListProps<T>) {
    const [selectedKeys, setSelectedKeys] = useState<Array<any>>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [selectedId, setSelectedId] = useState<any[]>([]);
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
                        
                        // Notify parent about the initial quantity
                        // quantityUpdate?.({
                        //     quantity: initialQty,
                        //     rowData: row
                        // });
                    }
                }
            });
            
            // Update quantities
            setQuantities(prev => ({ ...prev, ...initialQtys }));
            
            // Set initial selections only when component mounts or data changes
            if (initialSelectedIds.length > 0) {
                setSelectedId(initialSelectedIds);
                // onSelectRow?.(data.filter(r => initialSelectedIds.includes(r[uniqueKey])));
                onRowSelectionChange?.(new Set(initialSelectedIds.map(String)));
            }
            
            // Sync selectedKeys with initialSelectedIds
            setSelectedKeys(initialSelectedIds.map(String));
    
        }, [data, uniqueKey, quantityUpdate, onRowSelectionChange]);
    
        const handleSelectAll = useCallback((checked: boolean) => {
            if (!allowSelection) return;
            const selectedIds = checked ? data.map(row => row[uniqueKey]) : [];
            
            if (checked) {
                setSelectedId(selectedIds);
                // onSelectRow?.(data);
                
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
        }, [data, showItemCounter, quantities, getMinOrderQuantity, uniqueKey, allowSelection, quantityUpdate]);
    
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
                    quantityUpdate?.({
                        quantity: 0,
                        rowData: row!
                    });
                }
            }
    
            setSelectedId(currentSelectedIds);
            
            
            // Sync with external selected rows state
            onRowSelectionChange?.(new Set(currentSelectedIds.map(String)));
        }, [data, selectedId, showItemCounter, quantities, getMinOrderQuantity, uniqueKey, onRowSelectionChange, allowSelection, quantityUpdate]);
    
        const isSelected = (id: any) => {
            return selectedId.includes(id);
        }
    
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
        }, [quantities, uniqueKey, isSelected, handleSelectRow, selectedId, data, onRowSelectionChange]);
    
        // Sync with external selected rows
        useEffect(() => {
            if (externalSelectedRows) {
                const externalIds = Array.from(externalSelectedRows);
                setSelectedId(externalIds);
            }
        }, [externalSelectedRows]);
    
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
        <Box className={`${wrapperClassName && styles?.[wrapperClassName]} p-4`}>
            {allowSelection ? <Box sx={{marginLeft: "-7px"}} className="mb-4 flex items-center select-all">
                <CustomCheckbox
                    indeterminate={
                        selectedId.length > 0 && selectedId.length < data.length
                    }
                    checked={selectedId.length === data.length}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                    disabled={disableAllSelection}
                />
                <Typography variant="subtitle1" className="text-base font-medium ml-2">
                    Select All
                </Typography>
            </Box> : null}
            {data.map((row:any) => {
                const key = row[uniqueKey] as string | number;
                const checked = selectedKeys.includes(key);
                return (
                    <Card
                        key={key}
                        variant="outlined"
                        className={`card_outer ${getCardClassName && styles ? styles[getCardClassName(row)] : ''}`}
                    >
                        <CardContent className="card_content">
                            <Box className="card_header">
                                {allowSelection && CustomCheckbox ? (
                                    <CustomCheckbox
                                        checked={ row.cartQuantity>0}
                                        onClick={e => e.stopPropagation()}
                                        onChange={(e) => handleSelectRow(row[uniqueKey], e, row)}
                                    />
                                ) : null}
                                {renderHeader && (
                                    <Box className="flex items-center gap-2 responsive-text">
                                        {renderHeader(row)}
                                    </Box>
                                )}
                            </Box>
                            {columns.map((col) => (
                                <Box key={String(col.key)} className="card_body_label">
                                    <Typography component="span" className="card-label">{col.label}</Typography>
                                    <Typography component="p" className="responsive-text">
                                        {row[col.key] as React.ReactNode}
                                    </Typography>
                                </Box>
                            ))}
                            {showItemCounter && (
                                <Box className="card_body_label mt-2">
                                    <Typography component="span" className="card-label">{quantityLabel}</Typography>
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
                                </Box>
                            )}
                            {actionButtons ? (
                                <Box className="flex gap-2 mt-4">
                                    {actionButtons.map((action, index) => (
                                        <IconButton
                                            key={index}
                                            onClick={() => action.clickHandler && action.clickHandler(row)}
                                        >
                                            {action.iconComponent && (
                                                <action.iconComponent />
                                            )}
                                        </IconButton>
                                    ))}
                                </Box>
                            ) : buttonAction && buttonLabel ? (
                                <Box className='card_button'>
                                    <CustomButton
                                        label={buttonLabel}
                                        variant="contained"
                                        className="mt-4 w-full"
                                        onClick={() => buttonAction(row)}
                                    />
                                </Box>
                            ) : null}
                        </CardContent>
                    </Card>
                );
            })}
            <CommonPagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={totalRows}
                onPageChange={onPageChange}></CommonPagination>
        </Box>
    );
}

export const ActionList = React.memo(ActionListComponent) as typeof ActionListComponent;