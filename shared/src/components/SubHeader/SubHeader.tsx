import React from "react";
import { Box, Typography } from "@mui/material";
import { useHeader } from "../../hooks/useHeader";
import "./SubHeader.css";
import { SubHeaderProps } from "./SubHeader.interface";

export const SubHeader: React.FC<SubHeaderProps> = ({
  subHeaderBackArrow,
  subHeaderTitle,
  subHeaderEnd,
  subHeaderSubTitle,
}) => {
  const {showAppBar} = useHeader()
  return (
    <>
      <Box
        className="go_back_sub_head subheader_gradient"
        sx={{
          position: "sticky",
          zIndex: 1099, // Lower than AppBar
          top: showAppBar ? "72px" : "0px",
          transition: "top 0.3s ease-in-out",
        }}
      >
        <div className="page_title w-full overflow-hidden">
          {/* Slot 1 */}
          {subHeaderBackArrow && <div>{subHeaderBackArrow}</div>}
          {/* Slot 2 */}
          <div className="sub_header_title flex max-md:flex-col items-center max-md:items-start w-full overflow-hidden">
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
        {/* Slot 4 */}
        {subHeaderEnd && <>{subHeaderEnd}</>}
      </Box>
    </>
  );
};
