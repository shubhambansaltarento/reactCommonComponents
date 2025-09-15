import React from "react";
import StatusSummary from "./StatusSummary";
import Status from "./Status";

interface StatusCardData {
  [key: string]: string | number | boolean;
}

interface StatusCardProps {
  title: string;
  statusText?: string;
  status: "success" | "error" | "pending" | "warning";
  data?: StatusCardData;
  className?: string;
  statusSubtext?: string;
  summaryLayout?: 'row' | 'column';
  showIcon?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  status, 
  data, 
  className = '',
  statusText = '',
  statusSubtext = '',
  summaryLayout = 'row',
  showIcon = true
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showIcon && <div className="flex items-center justify-center gap-3">
          <Status status={status} text={statusText} statusSubtext={statusSubtext} size="xl" />
        </div>}

      {data && <StatusSummary data={data} title={title} summaryLayout={summaryLayout} />}
    </div>
  );
};

export default StatusCard;
