import React from "react";
import { Box, Chip } from "@mui/material";
import styles from "../PreviewNotification.module.css";
import { TRAINING_TAG_COLORS } from "../utils/constants";

interface PriorityChipProps {
  criticality: string;
  priorityStyle: {
    bg: string;
    text: string;
  } | null;
}

const PriorityChip: React.FC<PriorityChipProps> = ({ criticality, priorityStyle }) => {
  const isTrainingTags = criticality.includes(',') || criticality === 'Training';

  if (isTrainingTags) {
    const tags = criticality.split(',').map(tag => tag.trim()).filter(Boolean);

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {tags.map((tag, index) => {
          const colorSet = TRAINING_TAG_COLORS[index % TRAINING_TAG_COLORS.length];
          
          return (
            <Chip
              key={`${tag}-${index}`}
              label={tag}
              size="small"
              className={`text-xs font-medium ${styles.training_tag_chip}`}
              style={{
                color: colorSet.text,
                borderColor: colorSet.border,
                backgroundColor: colorSet.bg,
              }}
            />
          );
        })}
      </Box>
    );
  }

  return (
    <Chip
      label={
        <span className="flex items-center p-2">
          {criticality.charAt(0).toUpperCase() + criticality.slice(1).toLowerCase()}
        </span>
      }
      size="small"
      className="pl-1.5 text-xs font-medium"
      sx={{
        backgroundColor: ` ${priorityStyle?.text} !important`,
        borderRadius: '4px',
      }}
    />
  );
};

export default PriorityChip;
