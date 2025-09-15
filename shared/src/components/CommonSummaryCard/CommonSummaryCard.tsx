import React from "react";
import { Typography, List, ListItem } from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material";

// -------------------- Types --------------------
interface SummaryDataItem {
  label: string;
  value: string | number;
  isHighlighted?: boolean;
}

interface CommonSummaryCardProps {
  summaryData: SummaryDataItem[];
  /** Main success message title */
  successTitle?: string;
  /**  reference/ID to display */
  uniqueRefKey?: string;
  /** Descriptive success message */
  successMessage?: string;
  /** Whether to show the success header section */
  showSuccessHeader?: boolean;
}

// Component styles - completely self-contained
const componentStyles = {
  cardContainer: {
    position: 'relative' as const,
    backgroundColor: 'transparent',
    borderRadius: '8px',
    boxShadow: '0px 2px 8px 0px #1021321F',
    margin: '16px 0',
    width: '400px',
    overflow: 'visible' as const,
  },
  successSection: {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
    zIndex: 10,
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: '0',
  },
  contentContainer: {
    padding: '0 24px 24px 24px',
    marginTop: '-16px',
  },
  summaryContainer: {
    backgroundColor: 'transparent',
  },
  successIcon: {
    fontSize: '64px',
    color: '#4CAF50',
    marginBottom: '8px',
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textAlign: 'center' as const,
    margin: 0,
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '16px',
    margin: 0,
    paddingTop: '16px',
  },
  itemList: {
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    padding: '12px 0',
  },
  itemLabel: {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 500,
  },
  itemValue: {
    color: '#333333',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '4px',
  },
};

// -------------------- CommonSummaryCard Component --------------------
const CommonSummaryCardComponent: React.FC<CommonSummaryCardProps> = ({
  summaryData,
  successTitle,
  uniqueRefKey,
  successMessage,
  showSuccessHeader = true,
}) => {
  return (
    <div>
      {showSuccessHeader && (
        <div style={componentStyles.successSection}>
          <div style={componentStyles.successContent}>
            <CheckCircleOutlineIcon style={componentStyles.successIcon} />
            {successTitle && (
              <Typography component="p" style={componentStyles.successTitle}>
                {successTitle}
              </Typography>
            )}
          </div>
        </div>
      )}
      
      <div style={componentStyles.cardContainer}>
        <div style={componentStyles.contentContainer}>
          <div style={componentStyles.summaryContainer}>
            <Typography component="h3" style={componentStyles.sectionTitle}>
              {"Warranty Details"}
            </Typography>
            <List style={componentStyles.itemList}>
              {summaryData.map((item, index) => (
                <ListItem key={index} style={componentStyles.listItem}>
                  <Typography component="label" style={componentStyles.itemLabel}>
                    {item.label}
                  </Typography>
                  <Typography component="span" style={componentStyles.itemValue}>
                    {typeof item.value === "number"
                      ? item.value.toLocaleString()
                      : item.value}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommonSummaryCard = React.memo(CommonSummaryCardComponent) as typeof CommonSummaryCardComponent;