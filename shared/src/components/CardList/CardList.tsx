'use client';
import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { CustomButton } from "../Button";
import { CustomCheckbox } from "../Checkbox";
import { CommonPagination } from "../CommonPagination/CommonPagination";
import "./CardList.css";
import { CardListProps } from "./CardList.interface";
import { NoDataFound } from "../NoDataFound";
import { useTranslation } from "react-i18next";
import { Popup } from "../Popup";

/**
 * CardListComponent
 * Generic component to render a paginated, selectable list of cards.
 * Supports custom header, footer, actions, and selection logic.
 * There can be two action buttons per card. If only one is needed, use buttonAction and buttonLabel props.
 * If more button is needed, consider changing to array of actions which can be icon buttons
 */
function CardListComponent<T>({
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
    selectedRows,
    onSelectRow,
    buttonAction,
    styles,
    buttonLabel,
    uniqueKey = 'id' as keyof T, // Default to 'id' if not provided
    onDownloadClick,
    onUploadClick,
    buttonAction2,
    buttonLabel2
}: CardListProps<T>) {
    // Use controlled selection if provided, otherwise use internal state
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<Array<any>>([]);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const { t } = useTranslation("translations");
    
    // Determine which selection mechanism to use
    const useControlledSelection = selectedRows !== undefined && onSelectRow !== undefined;
    const selectedKeys = useControlledSelection 
        ? selectedRows?.map(row => row[uniqueKey]) || []
        : internalSelectedKeys;
        
    const notifySelectionChange = useCallback((newSelectedRows: T[]) => {
        if (useControlledSelection) {
            onSelectRow?.(newSelectedRows);
        } else {
            onSelectionChange?.(newSelectedRows);
        }
    }, [useControlledSelection, onSelectRow, onSelectionChange]);
    const handleSelect = useCallback((row: T) => {
        const key = row[uniqueKey];
        let newSelectedKeys: Array<any>;
        
        if (selectedKeys.includes(key)) {
            newSelectedKeys = selectedKeys.filter((k) => k !== key);
        } else {
            newSelectedKeys = [...selectedKeys, key];
        }
        
        const newSelectedRows = data.filter((r) => newSelectedKeys.includes(r[uniqueKey]));
        
        if (!useControlledSelection) {
            setInternalSelectedKeys(newSelectedKeys);
        }
        
        notifySelectionChange(newSelectedRows);
    }, [data, selectedKeys, uniqueKey, useControlledSelection, notifySelectionChange]);

    const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newSelectedRows: T[];
        
        if (e.target.checked) {
            const allKeys = data.map((row) => row[uniqueKey]);
            newSelectedRows = data;
            
            if (!useControlledSelection) {
                setInternalSelectedKeys(allKeys);
            }
        } else {
            newSelectedRows = [];
            
            if (!useControlledSelection) {
                setInternalSelectedKeys([]);
            }
        }
        
        notifySelectionChange(newSelectedRows);
    }, [data, uniqueKey, useControlledSelection, notifySelectionChange]);

    return (
        <Box className={`${wrapperClassName && styles?.[wrapperClassName]} p-4`}>
            {data.length > 0 && allowSelection ? <Box className="mb-4 flex items-center select-all">
                <CustomCheckbox checked={selectedKeys.length === data.length}
                    indeterminate={
                        selectedKeys.length > 0 && selectedKeys.length < data.length
                    }
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
                        cursor: selectedKeys.length === 0 ? 'not-allowed' : 'pointer',
                        color: selectedKeys.length === 0 ? 'grey.400' : 'var(--color-black)',
                        opacity: selectedKeys.length === 0 ? 0.5 : 1,
                        pointerEvents: selectedKeys.length === 0 ? 'none' : 'auto',
                        userSelect: 'none'
                    }}
                    onClick={() => {
                        if (selectedKeys.length > 0) {
                            if (useControlledSelection) {
                                onSelectRow?.([]);
                            } else {
                                setInternalSelectedKeys([]);
                            }
                        }
                        if (onSelectionChange) onSelectionChange([]);
                    }}
                >
                    {t("COMMON.CLEAR_ALL")}
                </Typography>
            </Box> : null}
            {data.length > 0 ? (
              <Box className="cards-container">
                {data.map((row) => {
                  const key = row[uniqueKey] as string | number;
                  const checked = selectedKeys.includes(key);
                  return (
                    <Card
                      key={key}
                      variant="outlined"
                      className={`card_outer_common ${
                        getCardClassName && styles
                          ? styles[getCardClassName(row)]
                          : ""
                      }`}
                    >
                      <CardContent className="card_content">
                        <Box className="card_header_common">
                          {allowSelection && CustomCheckbox ? (
                            <CustomCheckbox
                              checked={checked}
                              onChange={() => handleSelect(row)}
                            />
                          ) : null}
                          {renderHeader && (
                            <Box className="flex items-center word_break gap-2 w-full">
                              {renderHeader(row)}
                            </Box>
                          )}
                        </Box>
                        {columns.map((col) => !col.hide && (
                          <Box key={String(col.key)} className="card_body_label">
                            <label>{col.label}</label>
                            <Typography component="p">
                              {col.transformFn
                                ? col.transformFn(row[col.key], row)
                                : (row[col.key] as React.ReactNode) || "-"}
                            </Typography>
                          </Box>
                        ))}                        
                        {renderFooter && (
                          <Box className="card_footer">
                            {renderFooter(row)}
                          </Box>
                        )}
                        {buttonAction && buttonLabel ? (
                          <Box className="card_button_common">
                            <CustomButton
                              label={buttonLabel}
                              variant="contained"
                              className="mt-4 w-full"
                              onClick={() => buttonAction(row)}
                            />
                            {buttonAction2 && buttonLabel2 ? (
                              <CustomButton
                                label={buttonLabel2}
                                variant="outlined"
                                className="mt-4 w-full secondary_button"
                                onClick={() => buttonAction2(row)}
                              />
                            ) : null}
                          </Box>
                        ) : null}
                      
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <NoDataFound />
            )}
            {totalRows > 10 ? (
                <CommonPagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    onPageChange={onPageChange}
                    onDownloadClick={onDownloadClick}
                    onUploadClick={onUploadClick}></CommonPagination>
            ) : (onDownloadClick || onUploadClick) ? (
                <>
                    <Box className="pagination_container">
                        <div className="download_excel" style={{ display: 'flex', gap: '8px' }}>
                            {onUploadClick && (
                                <CustomButton 
                                    className="max-sm:w-full" 
                                    onClick={onUploadClick}
                                    label={t("COMMON.UPLOAD")}
                                    variant="outlined"
                                />
                            )}
                            {onDownloadClick && (
                                <CustomButton 
                                    className="max-sm:w-full" 
                                    onClick={() => setIsDownloadOpen(true)}
                                    label={t("COMMON.DOWNLOAD")}
                                    variant="outlined"
                                />
                            )}
                        </div>
                    </Box>
                    {onDownloadClick && (
                        <Popup 
                            isOpen={isDownloadOpen}
                            onClose={() => setIsDownloadOpen(false)}
                            title={t("COMMON.DOWNLOAD")}
                        >
                            <Box className="w-full mx-auto text-center">
                                <Typography id="modal-modal-description">
                                    {t("COMMON.DOWNLOAD_TEXT")}
                                </Typography>
                                <div className="download_excel_buttons">
                                    <CustomButton variant="outlined" onClick={() => setIsDownloadOpen(false)} label={t("COMMON.CANCEL")}></CustomButton>
                                    <CustomButton label={t("COMMON.DOWNLOAD")} onClick={() => { onDownloadClick && onDownloadClick(); setIsDownloadOpen(false); }}></CustomButton>
                                </div>
                            </Box>
                        </Popup>
                    )}
                </>
            ) : null}
        </Box>
    );
}

export const CardList = React.memo(CardListComponent) as typeof CardListComponent;
