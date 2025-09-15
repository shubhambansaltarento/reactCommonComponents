import React from "react";
import { List, ListItem, Typography, Divider } from "@mui/material";
import "./CommonListItem.css";
import { CommonListItemProps } from "./CommonListItem.interface";

const CommonListItemComponent: React.FC<CommonListItemProps> = ({ heading, items, showDivider, wrapperClassName }) => {
    return (
        <div className={`common-list-item ${wrapperClassName || ''}`}>
            {heading && (
                <Typography component="h3">{heading}</Typography>
            )}
            <List className="flex flex-wrap">
                {items.map((item, idx) => (
                    <ListItem key={idx} className={item.className || ''}>
                        <Typography component="label">{item.label}</Typography>
                        <Typography component="p">{item.value || "-"}</Typography>
                    </ListItem>
                ))}
            </List>
            {showDivider && <Divider />}
        </div>
    );
};

export const CommonListItem = React.memo(CommonListItemComponent) as typeof CommonListItemComponent;
