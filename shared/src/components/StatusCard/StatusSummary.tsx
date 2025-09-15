import React from "react";

interface StatusSummaryProps {
  title: string;
  data: { [key: string]: string | number | boolean };
  className?: string;
  summaryLayout?: 'row' | 'column';
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ 
  title,
  data, 
  className = '',
  summaryLayout = 'row'
}) => {
  const entries = Object.entries(data);
  
  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      <div className="p-4 border-b border-gray-300 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="p-4">
        <div className={
          summaryLayout === 'column' 
            ? "grid grid-cols-1 gap-4" 
            : "grid grid-cols-2 gap-4"
        }>
          {entries.map(([key, value]) => (
            <div key={key} className="flex flex-col md:pl-15">
              <span className="text-sm font-medium text-gray-600">{key}</span>
              <span className="text-base text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusSummary;