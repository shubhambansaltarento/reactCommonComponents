'use client';
import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, FormControlLabel, FormGroup, ListItem, Tab, Tabs, Typography, useMediaQuery, useTheme, Radio } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DatePicker } from '@mui/x-date-pickers';
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomButton } from "../Button";
import { CustomCheckbox } from "../Checkbox";
import { CheckBoxFilterState, CheckboxTab, CommonFilterProps, DateFieldErrors, DateFilterState, DateTab, DateValidationState, RadioFilterState, RadioTab } from "./CommonFilter.interface";
import "./CommonFilter.css";
import { useTranslation } from "react-i18next";
import CustomSelect from "../Select/Select";
import { DateRangeType, getDateRange, getDayRangeFilterOptions } from "../../utils/baseUtils";

// CommonFilter: Drawer-based filter component supporting checkbox and date tabs, with apply and clear actions.
type DrawerAnchor = "left" | "right" | "top" | "bottom";

const CommonFilterComponent: React.FC<CommonFilterProps & { anchor?: DrawerAnchor }> = ({
    open,
    onClose,
    tabs,
    onApply,
    onClear,
    anchor = "right",
    wrapperClassName = "",
    timezone,
    initialCheckboxState,
    initialRadioState,
    initialIndex,
    initialDateState,
    shouldValidateDateRange = false, // Renamed prop with default false
    customDateValidation,
    enableSixMonthRange = false, // Optional parameter with default false
    autoSwitchToErrorTab = false, // Auto-switch to error tab, default false
}) => {
    const [tabIndex, setTabIndex] = useState(0);
    const { t } = useTranslation("translations");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(767));
    const dateRangeOptions = useMemo(() => getDayRangeFilterOptions(t), [t]);

    // State for each tab
    const [checkboxState, setCheckboxState] = useState<CheckBoxFilterState>(initialCheckboxState || {});
    const [radioState, setRadioState] = useState<RadioFilterState>(initialRadioState || {});
    const [dateState, setDateState] = useState<DateFilterState>(initialDateState || {});
    const [validationErrors, setValidationErrors] = useState<DateValidationState>({});

    useEffect(() => {
        if (initialCheckboxState) {
            setCheckboxState(initialCheckboxState);
        }
    }, [initialCheckboxState, onClose]);

    useEffect(() => {
        if (initialRadioState) {
            setRadioState(initialRadioState);
        }
    }, [initialRadioState, onClose]);

    useEffect(() => {
        if (initialDateState) {
            setDateState(initialDateState);
        }
    }, [initialDateState, onClose]);

    useEffect(() => {
        setTabIndex(initialIndex || 0);
    }, [initialIndex]);

    // Helper function to extract per-field errors from validation result
    const getFieldErrors = useCallback((tabKey: string): DateFieldErrors => {
        const error = validationErrors[tabKey];
        if (!error) return {};
        
        // If it's a string (legacy format), treat as general error
        if (typeof error === 'string') {
            return { generalError: error };
        }
        
        // If it's an object with per-field errors
        return error as DateFieldErrors;
    }, [validationErrors]);

    // Simple validation function without Zod dependency
    const validateDateRangeForTab = useCallback((tabKey: string, dateData: any) => {
        if (!shouldValidateDateRange) return null;

        if (customDateValidation) {
            return customDateValidation(dateData, tabKey);
        }

        const currentTab = tabs.find(tab => tab.key === tabKey && tab.type === 'date') as DateTab;
        if (!currentTab?.requireBothDates && !currentTab?.toDate) return null;

        const hasFromDate = dateData.from && dateData.from !== null;
        const hasToDate = dateData.to && dateData.to !== null;

        // If requireBothDates is true, both dates must be selected
        if (currentTab.requireBothDates && (!hasFromDate || !hasToDate)) {
            return t("COMMON.VALIDATION.BOTH_DATES_REQUIRED");
        }

        // If both dates are present, validate the date range
        if (hasFromDate && hasToDate) {
            const fromDate = dayjs(dateData.from);
            const toDate = dayjs(dateData.to);

            // From date should be before or equal to To date
            if (fromDate.isAfter(toDate, 'day')) {
                return t("COMMON.VALIDATION.FROM_DATE_AFTER_TO_DATE");
            }
        }

        // If both dates are empty and not required, validation passes
        if (!hasFromDate && !hasToDate && !currentTab.requireBothDates) {
            return null;
        }

        return null;
    }, [shouldValidateDateRange, customDateValidation, tabs, t]);

    // Handle checkbox change
    const handleCheckboxChange = useCallback((tabKey: string, value: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckboxState((prev) => {
            const arr = prev[tabKey] || [];
            if (event.target.checked) {
                return { ...prev, [tabKey]: [...arr, value] };
            } else {
                return { ...prev, [tabKey]: arr.filter((v) => v !== value) };
            }
        });
    }, []);

    // Handle radio change
    const handleRadioChange = useCallback((tabKey: string, value: string) => () => {
        setRadioState((prev) => ({
            ...prev,
            [tabKey]: value
        }));
    }, []);

    const handleDateRangeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, tabKey: string) => {
        const value = event.target.value as DateRangeType;
        let fromDate: PickerValue;
        let toDate: PickerValue;

        if (value === "Custom") {
            fromDate = null;
            toDate = null;
        } else {
            const dateValue = getDateRange(value, timezone || "UTC", true);
            fromDate = dateValue.from as PickerValue;
            toDate = dateValue.to as PickerValue;
        }

        const newDateData = {
            ...dateState[tabKey],
            dateRange: value,
            from: fromDate,
            to: toDate,
        };

        setDateState((prev) => ({
            ...prev,
            [tabKey]: newDateData,
        }));

        // Clear validation error when any date range option is selected (including Custom)
        setValidationErrors(prev => ({
            ...prev,
            [tabKey]: null
        }));
    }, [timezone, dateState]);

    // Handle date change
    const handleDateChange = useCallback((newValue: PickerValue, tabKey: string, valKey: string) => {
        if (!newValue) {
            setDateState((prev) => ({
                ...prev,
                [tabKey]: {
                    ...prev[tabKey],
                    [valKey]: null,
                },
            }));
            return;
        }

        let processedDate;
        if (valKey === "from") {
            // Set to start of day (00:00:00.000)
            processedDate = dayjs(newValue).startOf('day')
        } else if (valKey === "to") {
            // Set to end of day (23:59:59.999)
            processedDate = dayjs(newValue).endOf('day')
        } else {
            processedDate = dayjs(newValue)
        }

        const updatedDateData = {
            ...dateState[tabKey],
            [valKey]: processedDate,
        };

        setDateState((prev) => ({
            ...prev,
            [tabKey]: updatedDateData,
        }));

        // Validate after date change
        const error = validateDateRangeForTab(tabKey, updatedDateData);
        setValidationErrors(prev => ({
            ...prev,
            [tabKey]: error
        }));
    }, [dateState, validateDateRangeForTab]);

    // Handle Apply
    const handleApply = useCallback(() => {
        // Validate all date tabs if validation is enabled
        if (shouldValidateDateRange) {
            const newValidationErrors: DateValidationState = {};
            let hasErrors = false;
            let firstErrorTabIndex: number | null = null;

            tabs.forEach((tab, index) => {
                if (tab.type === "date" && (tab as DateTab).requireBothDates) {
                    const error = validateDateRangeForTab(tab.key, dateState[tab.key] || {});
                    if (error) {
                        newValidationErrors[tab.key] = error;
                        hasErrors = true;
                        // Track the first tab with an error
                        if (firstErrorTabIndex === null) {
                            firstErrorTabIndex = index;
                        }
                    }
                }
            });

            setValidationErrors(newValidationErrors);

            if (hasErrors) {
                // Switch to the first tab with validation error (only if enabled)
                if (autoSwitchToErrorTab && firstErrorTabIndex !== null) {
                    setTabIndex(firstErrorTabIndex);
                }
                return; // Don't apply if there are validation errors
            }
        }

        const output: any = {};
        tabs.forEach((tab) => {
            if (tab.type === "checkbox" && checkboxState[tab.key] && checkboxState[tab.key].length > 0) {
                output[tab.key] = checkboxState[tab.key] || [];
            } else if (tab.type === "radio" && radioState[tab.key]) {
                output[tab.key] = radioState[tab.key];
            } else if (tab.type === "date" && dateState[tab.key] && (dateState[tab.key].from || dateState[tab.key].to || dateState[tab.key].dateRange)) {
                output[tab.key] = { from: dateState[tab.key].from || null, to: dateState[tab.key].to || null, dateRange: dateState[tab.key].dateRange || null };
            }
        });
        onApply(output);
        onClose();
    }, [tabs, checkboxState, radioState, dateState, onApply, onClose, shouldValidateDateRange, validateDateRangeForTab]);

    // Handle Clear All
    const handleClear = useCallback(() => {
        setCheckboxState({});
        setRadioState({});
        setDateState({});
        setValidationErrors({});
        onClear();
        onClose();
    }, [onClear, onClose]);

    const calculateMaxDate = (date: dayjs.Dayjs | null): dayjs.Dayjs => {
        if (!date) {
            return dayjs();
        }
        const sixMonthLater = date.add(6, 'month');
        const currentDate = dayjs();
        return sixMonthLater.isAfter(currentDate) ? currentDate : sixMonthLater;
    };

    return (
        <Drawer
            className={`drawer_outer ${wrapperClassName}`}
            anchor={isMobile ? 'bottom' : 'right'}
            open={open}
            onClose={onClose}
            variant="temporary"
            slotProps={{
                paper: {
                    sx: {
                        height: '100%',
                        width: isMobile ? '100%' : '589px',
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
            {/* Header */}
            <Box className="drawer_header">
                <Typography variant="h1">{t("COMMON.FILTERS")}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon className="w-[14px] h-[14px]" />
                </IconButton>
            </Box>

            {/* Body: vertical tabs + content */}
            <Box className="drawer_content">
                <Tabs
                    className="tabs_outer"
                    orientation="vertical"
                    variant="scrollable"
                    value={tabIndex}
                    onChange={(_, idx) => setTabIndex(idx)}
                    slotProps={{
                        indicator: {
                            style: {
                                height: '0',
                            },
                        },
                    }}
                >
                    {tabs.map((tab, idx) => {
                        const hasCheckboxSelection = tab.type === "checkbox" && checkboxState[tab.key] && checkboxState[tab.key].length > 0;
                        const hasRadioSelection = tab.type === "radio" && radioState[tab.key];
                        const hasDateSelection = tab.type === "date" && dateState[tab.key] && (dateState[tab.key].from || dateState[tab.key].to || dateState[tab.key].dateRange);
                        const hasActiveFilter = hasCheckboxSelection || hasRadioSelection || hasDateSelection;

                        return (
                            <Tab
                                className={`tab ${tabIndex === idx ? 'tab_selected' : ''}`}
                                key={tab.label}
                                label={
                                    <Box display="flex" alignItems="center" position="relative" width="100%">
                                        {tab.label}
                                        {hasActiveFilter && (
                                            <Box
                                                component="span"
                                                className="filter-indicator"
                                            />
                                        )}
                                    </Box>
                                }
                                sx={{
                                    textTransform: 'none',
                                    display: tab.hidden ? "none" : "inherit",
                                    scrollButtons: 'none',
                                    color: tabIndex === idx ? 'primary.main' : 'text.primary',
                                    fontWeight: tabIndex === idx ? 'bold' : 'normal',
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: tabIndex === idx ? 'white' : 'text.white',
                                    }
                                }}
                            />
                        );
                    })}
                </Tabs>

                <Box className="tab_section_content">
                    {/* Tab Content - Only render if tabIndex is valid */}
                    {tabs[tabIndex] && tabs[tabIndex].type === "checkbox" && (
                        <FormGroup className="filter_checkbox_outer">
                            {(tabs[tabIndex] as CheckboxTab).tabValues.map((cb, index) => (
                                <FormControlLabel
                                    key={`${tabs[tabIndex].key}-${cb.value ?? index}`}
                                    control={
                                        <CustomCheckbox
                                            checked={(checkboxState[tabs[tabIndex].key] || []).includes(cb.value)}
                                            onChange={handleCheckboxChange(tabs[tabIndex].key, cb.value)}
                                        />
                                    }
                                    label={cb.label}
                                    className="mr-0"
                                />
                            ))}
                        </FormGroup>
                    )}
                    {tabs[tabIndex] && tabs[tabIndex].type === "radio" && (
                        <FormGroup className="filter_checkbox_outer">
                            {(tabs[tabIndex] as RadioTab).tabValues.map((radio, index) => (
                                <FormControlLabel
                                    key={`${tabs[tabIndex].key}-${radio.value ?? index}`}
                                    control={
                                        <Radio
                                            name={tabs[tabIndex].key}
                                            value={radio.value}
                                            checked={radioState[tabs[tabIndex].key] === radio.value}
                                            onChange={handleRadioChange(tabs[tabIndex].key, radio.value)}
                                        />
                                    }
                                    label={radio.label}
                                    className="mr-0"
                                />
                            ))}
                        </FormGroup>
                    )}
                    {tabs[tabIndex] && tabs[tabIndex].type === "date" && (
                        <Box display={tabs[tabIndex].hidden ? "none" : "flex"} flexDirection="column" gap={2} className="filter_checkbox_outer">
                            {tabs[tabIndex].dateRange && <Box className="!py-0">
                                <ListItem className="day-filter !px-0 !pb-0">
                                    <CustomSelect
                                        label={t("COMMON.DURATION")}
                                        variant="outlined"
                                        size="medium"
                                        value={dateState[tabs[tabIndex].key]?.dateRange || ""}
                                        onChange={(e) => handleDateRangeChange(e, tabs[tabIndex].key)}
                                        options={dateRangeOptions} />
                                </ListItem>
                                {/* General/Duration Error Message */}
                                {getFieldErrors(tabs[tabIndex].key).generalError && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ pl: 0.5, fontSize: '12px', mt: 0.5 }}
                                    >
                                        {getFieldErrors(tabs[tabIndex].key).generalError}
                                    </Typography>
                                )}
                            </Box>}
                            {(!tabs[tabIndex].dateRange || (dateState[tabs[tabIndex].key]?.dateRange === "Custom")) && <>
                                <Box>
                                    <DatePicker
                                        label="From Date"
                                        value={dateState[tabs[tabIndex].key]?.from || null}
                                        onChange={(newValue) => handleDateChange(newValue, tabs[tabIndex].key, "from")}
                                        slotProps={{ textField: { size: "small" } }}
                                        timezone={timezone}
                                    />
                                    {/* From Date Error Message */}
                                    {getFieldErrors(tabs[tabIndex].key).fromError && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                            sx={{ pl: 0.5, fontSize: '12px', display: 'block', mt: 0.5 }}
                                        >
                                            {getFieldErrors(tabs[tabIndex].key).fromError}
                                        </Typography>
                                    )}
                                </Box>
                                {(tabs[tabIndex] as DateTab).toDate && (
                                    <Box>
                                        <DatePicker
                                            label="To Date"
                                            maxDate={enableSixMonthRange && dateState[tabs[tabIndex].key]?.from ? calculateMaxDate(dateState[tabs[tabIndex].key].from) : undefined}
                                            minDate={dateState[tabs[tabIndex].key]?.from ?? undefined}
                                            value={dateState[tabs[tabIndex].key]?.to || null}
                                            onChange={(newValue) => handleDateChange(newValue, tabs[tabIndex].key, "to")}
                                            slotProps={{ textField: { size: "small" } }}
                                            timezone={timezone}
                                        />
                                        {/* To Date Error Message */}
                                        {getFieldErrors(tabs[tabIndex].key).toError && (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                                sx={{ pl: 0.5, fontSize: '12px', display: 'block', mt: 0.5 }}
                                            >
                                                {getFieldErrors(tabs[tabIndex].key).toError}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>}
                            {/* General Error Message (for cases without dateRange dropdown or legacy string errors) */}
                            {!tabs[tabIndex].dateRange && getFieldErrors(tabs[tabIndex].key).generalError && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ pl: 0.5, fontSize: '12px' }}
                                >
                                    {getFieldErrors(tabs[tabIndex].key).generalError}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer */}
            <Box className="drawer_footer">
                <CustomButton
                    label={t("COMMON.CLEAR_ALL")}
                    variant="outlined"
                    onClick={handleClear}
                />
                <CustomButton
                    label={t("COMMON.APPLY")}
                    variant="contained"
                    onClick={handleApply}
                />
            </Box>
        </Drawer >
    );
};

export const CommonFilter = React.memo(CommonFilterComponent) as typeof CommonFilterComponent;
