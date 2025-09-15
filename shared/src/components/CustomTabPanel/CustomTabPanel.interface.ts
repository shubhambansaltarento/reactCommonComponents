import { JSX } from "react";

export interface CustomTabPanelInterface {
    tabClassName?: string; 
    children: JSX.Element; 
    value: number; 
    index: number;
    persist?: boolean;
}