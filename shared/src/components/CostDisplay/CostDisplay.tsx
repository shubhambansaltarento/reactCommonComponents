'use client'
import React from "react";
import { Box, Typography } from "@mui/material";
import { formatCurrency } from "../../utils/formatCurrency";
interface CostDisplayProps {
    label: string;
    amount: number | string;
    labelVariant?: "body2" | "caption";
    amountVariant?: "body2" | "caption";
    amountColor?: string;
}

/**
 * @component CostDisplay
 * Displays a label and a formatted cost amount with optional currency symbol and styling.
 *
 * @param {string} label - The label to display.
 * @param {number|string} amount - The cost amount to display.
 * @param {"body2"|"caption"} [labelVariant] - Typography variant for label.
 * @param {"body2"|"caption"} [amountVariant] - Typography variant for amount.
 * @param {string} [amountColor] - Color for the amount text.
 */
const CostDisplay: React.FC<CostDisplayProps> = ({
    label,
    amount,
    labelVariant = "body2",
    amountVariant = "body2",
    amountColor = "text.primary",
}) => {
    return (
        <Box className="flex items-center gap-3">
            <Typography className="text-black" textAlign="center" variant={labelVariant}>
                {label}
            </Typography>
            <Typography className="text-black !text-base" textAlign="right" variant={amountVariant} fontWeight="bold" color={amountColor}>
                {formatCurrency(amount)}
            </Typography>
        </Box>
    );
};

export default CostDisplay;
