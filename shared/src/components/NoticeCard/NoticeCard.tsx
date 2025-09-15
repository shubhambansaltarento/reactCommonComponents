"use client";

import * as React from "react";
import "./NoticeCard.css";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import type { NoticeCardProps } from "./NoticeCard.interface";


const NoticeCard: React.FC<NoticeCardProps> = ({
  title = "Notice",
  onBack,

  headerLabel,
  headerValue,
  description,

  items,
  primaryActionLabel = "View Details",
  onPrimaryAction,
  className,
}) => {
  // const router = useRouter();

  return (
    <Box className={`notice-card ${className ?? ""}`}>

      <hr className="notice-card__rule" />

      {(headerLabel || headerValue || description) && (
        <Box className="notice-card__lead">
          {(headerLabel || headerValue) && (
            <Typography className="kv" variant="body2">
              {headerLabel ? `${headerLabel}: ` : null}
              {headerValue}
            </Typography>
          )}
          {description && (
            <Typography className="notice-card__desc" variant="body2">
              {description}
            </Typography>
          )}
        </Box>
      )}

      <Box className="notice-card__grid">
        {items.map((it, idx) => (
          <Box key={idx} className="notice-card__cell">
            <span className="label">{it.label}</span>
            <div className={`value ${it.bold ? "bold" : ""}`}>{it.value}
                <hr className="text-gray-200 mt-4"/>
            </div>
          </Box>
        ))}
      </Box>

      {onPrimaryAction && (
        <Box className="notice-card__footer">
          <button className="notice-card__cta" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </button>
        </Box>
      )}
    </Box>
  );
};

export default NoticeCard;
