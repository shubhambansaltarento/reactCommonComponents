import React from "react";
import { Box, Typography } from "@mui/material";
import "./SubHeaderSearch.css";
import { useHeader } from "../../hooks/useHeader";
import { SubHeaderSearchProps } from "./SubHeaderSearch.interface";

export const SubHeaderSearch: React.FC<SubHeaderSearchProps> = ({
  subHeaderBackArrow,
  subHeaderTitle,
  subHeaderEnd,
  subHeaderSubTitle,
}) => {

  const {showAppBar} = useHeader()

  return (
    <>
      <Box
        className="search_outer flex items-center justify-between gap-2"
        sx={{
          position: "sticky",
          zIndex: 1099, // Lower than AppBar
          top: showAppBar ? "72px" : "0px",
          transition: "top 0.3s ease-in-out",
        }}
      >
        <div className="search_left_section flex-1 min-w-0">
          {/* Slot 1 */}
          {subHeaderBackArrow && <div>{subHeaderBackArrow}</div>}
          {/* Slot 2 */}
          <div className="page_title w-full pr-4">
            <div className="flex max-md:flex-col items-center max-md:items-start w-full">
              {subHeaderTitle && (
                <Typography className="page_text truncate" component="h2">
                  {subHeaderTitle}
                </Typography>
              )}
              {/* Slot 3 */}
              {subHeaderSubTitle && (
                <Typography className="page_text_sub truncate" component="span">
                  {subHeaderSubTitle}
                </Typography>
              )}
            </div>
          </div>
        </div>
        {/* Slot 4 */}
        {subHeaderEnd && <>{subHeaderEnd}</>}
      </Box>
    </>
  );
};
