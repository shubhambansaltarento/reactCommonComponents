import React from "react";
import { CustomTabPanelInterface } from "./CustomTabPanel.interface";
import { Box } from "@mui/material"

export const CustomTabPanel: React.FC<CustomTabPanelInterface> = (props) => {
    const { tabClassName, children, value, index, persist, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            style={{
                display: persist ? (value === index ? "block" : "none") : "block"
            }}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className={tabClassName || ''}
            {...other}
        >
            {persist ? children : value === index && <Box className="pt-6">{children}</Box>}
        </div>
    );
}