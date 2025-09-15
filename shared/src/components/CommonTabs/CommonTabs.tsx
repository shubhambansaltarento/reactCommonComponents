import React from "react";
import { Tabs, Tab } from "@mui/material";
import './CommonTabs.css'
import { CommonTabInterface } from "./CommonTabs.interface";

/**
 * @component CommonTabs
 * Renders a tab bar with custom indicator color, variant, and tab styling.
 *
 * @param {number|string} value - The currently selected tab value.
 * @param {function} onChange - Callback for tab change.
 * @param {Array} tabList - List of tab objects with label, value, and optional className.
 * @param {string} [className] - Optional class name for the tabs container.
 * @param {string} [indicatorColor] - Color for the tab indicator.
 * @param {string} [variant='standard'] - Tab variant: 'standard', 'scrollable', or 'fullWidth'.
 * @param {string|boolean} [scrollButtons=false] - Show scroll buttons: 'auto' or false.
 */
export const CommonTabs: React.FC<CommonTabInterface> = ({
  value,
  onChange,
  tabList,
  className,
  indicatorColor = "var(--color-black)",
  variant = "standard",
  scrollButtons = false,
}) => {
  return (
    <Tabs
      className={`tabs ${className}`}
      value={value}
      onChange={onChange}
      variant={variant}
      scrollButtons={scrollButtons}
      aria-label="tabs"
      slotProps={{
        indicator: {
          style: {
            backgroundColor: indicatorColor,
            height: "3px",
          },
        },
      }}
    >
      {tabList.map((tab, idx) => (
        <Tab
          key={tab.label ?? idx}
          className={`tab ${tab.className} ${value === tab.value ? "tab_selected" : ""
            }`}
          disabled={typeof tab.disabled === "function" ? tab.disabled(value) : tab.disabled}
          value={tab.value}
          label={
            <span className="flex items-center gap-2">
              <span className="text-[15px] max-md:text-sm">{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="rounded-full text-xs font-medium">
                  ( {tab.count} )
                </span>
              )}
              {
                tab.iconComponent
              }
            </span>
          }
        />
      ))}
    </Tabs>
  );
};

