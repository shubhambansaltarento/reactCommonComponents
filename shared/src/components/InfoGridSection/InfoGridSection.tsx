import React from "react";
import { InfoGridSectionProps } from "./InfoGridSection.interface";
import "./InfoGridSection.css";

export const InfoGridSection: React.FC<InfoGridSectionProps> = ({
  sections,
  className,
}) => {
  if (!sections || sections.length === 0) return null;

  // Row 0 is the header row shown OUTSIDE the box
  const headerRow = sections[0];
  const bodyRows = sections.slice(1); // typically: [partsRow, deliveriesRow]

  const renderValueAndLabel = (
    cell: any,
    { isHeader = false, rootAlertClass = "" }: { isHeader?: boolean; rootAlertClass?: string } = {}
  ) => {
    const colorClass = cell.colorClass || "";
    const showIcon = colorClass?.includes("show-icon");

    return (
      <div
        className={`infoGridCell ${isHeader ? "sectionTitleCell" : ""} ${rootAlertClass}`}
        style={cell.colorStyle}
      >
        <div className={`cellValue ${isHeader ? "sectionTitleValue" : ""} ${colorClass}`}>
          <span className="valueWrap">
            {cell.value}
          </span>
        </div>
        <div className={`cellLabel ${isHeader ? "sectionTitleLabel" : ""}`}>{cell.label}</div>
      </div>
    );
  };

  const renderStatCell = (cell: any) => {
    const colorClass = cell.colorClass || "";
    const rootAlertClass = colorClass.includes("is-danger")
      ? "is-danger"
      : colorClass.includes("is-warning")
      ? "is-warning"
      : "";
    return renderValueAndLabel(cell, { rootAlertClass });
  };

  // keys that act as section headers
  const TITLE_KEYS = new Set(["totalpartsordered", "totaldeliveries"]);

  return (
    <div className={`infoGridRootWrapper ${className || ""}`}>
      {/* ===== Header row OUTSIDE the box ===== */}
      <div className="infoGridHeader">
        <div className="infoGridRow headerGrid">
          {headerRow.columns.map((cell: any, idx: number) => (
            <div key={idx} className="infoGridCell headerCell">
              <div className="cellValue headerValue">{cell.value}</div>
              <div className="cellLabel headerLabel">{cell.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Boxed sections (Parts + Deliveries) ===== */}
      <div className="infoGridPanel">
        {bodyRows.map((row, idx) => {
          // find the section title cell for this block
          const titleIndex = row.columns.findIndex((c: any) =>
            TITLE_KEYS.has(String(c.key || "").toLowerCase())
          );
          const titleCell = titleIndex >= 0 ? row.columns[titleIndex] : null;
          const rest = titleIndex >= 0 ? row.columns.filter((_: any, i: number) => i !== titleIndex) : row.columns;

          return (
            <React.Fragment key={idx}>
              {/* block header line */}
              <div className="flex flex-row justify-between items-center gap-2 w-full border border-[#E0E1E2] p-6 mt-4 rounded-sm">
              

              {/* stats grid for the rest */}
              <div className="infoGridRow bodyGrid">
                {titleCell && renderValueAndLabel(titleCell, { isHeader: true })}
                {rest.map((cell: any, i: number) => (
                  <React.Fragment key={i}>{renderStatCell(cell)}</React.Fragment>
                ))}
              </div>
              </div>

              {/* {idx < bodyRows.length - 1 && <hr className="sectionDivider" />} */}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
