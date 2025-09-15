import React from "react";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { PaginationArrowLeft, PaginationArrowRight } from "../../generated-icon";
import "./CommonPagination.css";
import { CommonPaginationProps } from "./CommonPagination.interface";
import CostDisplay from "../CostDisplay/CostDisplay";
import { CustomButton } from "../Button";
import { Popup } from "../Popup";
import { useTranslation } from "react-i18next";

/**
 * @component CommonPagination
 * Renders a pagination control with optional cost display.
 *
 * @param {number} page - Current page number.
 * @param {number} rowsPerPage - Number of rows per page.
 * @param {number} totalRows - Total number of items.
 * @param {function} onPageChange - Callback for page change.
 * @param {string} [costLabel] - Optional label for cost display.
 * @param {string|number} [costAmount] - Optional amount for cost display.
 */
export const CommonPagination: React.FC<CommonPaginationProps> = ({
    page,
    rowsPerPage,
    totalRows,
    onPageChange,
    costLabel,
    costAmount,
    onDownloadClick,
    onUploadClick
}) => {
    const { t } = useTranslation("translations")
    const [isDownloadOpen, setIsDownloadOpen] = React.useState(false);
    return (
        <>
        <Box className="pagination_outer">
            <Pagination
                className="pagination"
                count={Math.ceil(totalRows / rowsPerPage)}
                page={page}
                size="small"
                onChange={(_, value) => onPageChange(value)}
                boundaryCount={1}
                renderItem={item => (
                    <PaginationItem
                        {...item}
                        slots={{
                            previous: () =>
                                PaginationArrowLeft ? (
                                    <span className="pagination_icon">
                                        <PaginationArrowLeft className="w-[11px] mr-2" />
                                        <span className="pagination_icon_left">Previous</span>
                                    </span>
                                ) : null,
                            next: () =>
                                PaginationArrowRight ? (
                                    <span className="pagination_icon">
                                        <span className="pagination_icon_right">Next</span>
                                        <PaginationArrowRight className="w-[11px] ml-2" />
                                    </span>
                                ) : null,
                        }}
                        sx={{
                            "&.Mui-selected": { borderRadius: "4px" },
                            "&:hover": { borderRadius: "4px" },
                        }}
                    />
                )}
            />
            <Box className="pagination_container">
            {(onDownloadClick || onUploadClick) && (
                <div className="download_excel" style={{ display: 'flex', gap: '8px' }}>
                    {onUploadClick && (
                        <CustomButton className="max-sm:w-full" onClick={onUploadClick}
                            label={t("COMMON.UPLOAD")}
                            variant="outlined"
                        />
                    )}
                    {onDownloadClick && (
                        <CustomButton className="max-sm:w-full" onClick={() => setIsDownloadOpen(true)}
                            label={t("COMMON.DOWNLOAD")}
                            variant="outlined"
                        />
                    )}
                </div>
            )}
                {!costLabel && (
                    <Box className="pagination_count">
                        <Typography component="span">
                            {totalRows === 0 
                                ? '0-0'
                                : `${(page - 1) * rowsPerPage + 1}-${Math.min(
                                    page * rowsPerPage,
                                    totalRows
                                )}`
                            }
                        </Typography>
                        <Typography component="span">
                            {`of ${totalRows} items`}
                        </Typography>
                    </Box>
                )}
                {costLabel && (
                    <CostDisplay
                        label={costLabel}
                        amount={costAmount ?? ''}
                    />
                )}
            </Box>
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
    );
};
