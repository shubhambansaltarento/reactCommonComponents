// Utility functions for rendering content - shared between CommonActionTable and CommonActionList

export const renderContentWithSupport = <T extends Record<string, any>>(
  row: T, 
  column: { 
    key: keyof T;
    renderComponent?: (row: T, value: any) => React.ReactNode;
    transformFn?: (value: any, row: T) => any;
  },
  customComponents?: {
    [key: string]: (row: T, column: any) => React.ReactNode;
  }
) => {
  const value = row[column.key];
  
  if (column.renderComponent) {
    return column.renderComponent(row, value);
  }
  
  if (customComponents?.[String(column.key)]) {
    return customComponents[String(column.key)](row, column);
  }
  
  if (column.transformFn) {
    return column.transformFn(value, row);
  }
  
  return value ?? "-";
};