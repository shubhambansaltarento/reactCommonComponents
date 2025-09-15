'use client';
import { Box, Drawer, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { CommonSortProps } from "./CommonSort.interface";
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from "../../generated-icon";
import { useState, useEffect } from "react";
import { CustomRadioGroup } from "../Radio";
import { CustomButton } from "../Button";
import { useTranslation } from "react-i18next";
import "./CommonSort.css"
import React from "react";

const CommonSortComponent: React.FC<CommonSortProps> = ({
    open,
    onClose,
    sortList,
    onApply,
    anchor = "right",
    isMobile = false,
    wrapperClassName = "",
    selectedValue: propSelectedValue = "",
}) => {
    const { t } = useTranslation("translations");
    const [selectedValue, setSelectedValue] = useState(propSelectedValue);

    // Update selected value when prop changes
    useEffect(() => {
        setSelectedValue(propSelectedValue);
    }, [propSelectedValue,onClose]);

    const handleApply = () => {
        const selectedList = sortList.find(item => item.value === selectedValue);
        if (selectedList) {
            onApply(selectedList);
        }
        onClose();
    }

    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            className={`drawer_outer ${wrapperClassName}`}
            variant="temporary"
            slotProps={{
                paper: {
                    sx: {
                        height: isMobile ? '100vh' : '100%',
                        width: isMobile ? '100%' : '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'transparent',
                        boxShadow: 'none',
                        justifyContent: 'flex-end',
                        borderRadius: { xs: '5px', sm: '0' },
                    }
                }
            }}
        >
            <Box className="drawer_header">
                <Typography variant="h1">{t('JOBCARD_LIST.SORTING')}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon className="w-[14px] h-[14px]" />
                </IconButton>
            </Box>
            <div className="drawer_content">
                <List>
                    {sortList.map((item) => (
                        <ListItem key={item.value} disablePadding>
                            <ListItemButton onClick={() => setSelectedValue(item.value)}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                >
                                    <CustomRadioGroup
                                        value={selectedValue}
                                        onChange={(event) => setSelectedValue(event.target.value)}
                                        options={[
                                            { value: item.value, label: item.label }
                                        ]}
                                    />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
            <Box className="drawer_footer">
                <CustomButton className="!w-full"
                    onClick={handleApply}
                    label={t('JOBCARD_LIST.APPLY')}
                    variant="contained" />
            </Box>
        </Drawer >)
}

export const CommonSort = React.memo(CommonSortComponent) as typeof CommonSortComponent;
