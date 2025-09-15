import React, { useCallback } from "react";
import { Box } from "@mui/material";
import { CustomButton } from "../../Button";

interface ActionButtonProps {
  userAction: { name: string; link?: string };
  variant: "contained" | "outlined";
  onPreviewClick: (url: string) => void;
  sx?: object;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  userAction,
  variant,
  onPreviewClick,
  sx = {}
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const urlToUse = userAction.link ?? userAction.name ?? "";
    onPreviewClick(urlToUse);
  }, [userAction, onPreviewClick]);

  return (
    <Box sx={{ p: 2, ...sx }}>
      <CustomButton
        variant={variant}
        fullWidth
        onClick={handleClick}
      >
        {userAction.name}
      </CustomButton>
    </Box>
  );
};

export default ActionButton;
