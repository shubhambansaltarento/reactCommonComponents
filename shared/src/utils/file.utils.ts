

/**
 * Utility function to download file data as CSV
 * @param headers - Array of header strings
 * @param rows - Array of row data
 * @param filename - Name of the file to download (optional)
 */

/*********************** Download file starts *********************/

export const downloadFileData = async (
  headers: any[] = [],
  rows: any[] = [],
  fileObj: any = {}
) => {
  const fileType = fileObj.type || 'csv';
  const fileName = fileObj.name || (fileType === 'csv' ? 'data.csv' : 'data.xlsx');
  const finalHeaders = headers.length ? headers : [];
  const finalRows = rows.length ? rows : [];

  let blob;
  if (fileType === 'csv') {
    // Convert data to CSV format
    const csvContent = convertToCSV(finalHeaders, finalRows);
    // Create blob and download
    blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  } else {
    // Convert data to Excel format (async)
    const excelContent = await convertToExcel(finalHeaders, finalRows);
    blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  const link = document.createElement('a');
  
  if (link.download !== undefined && blob) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Escape CSV values to handle special characters
 * @param value - Value to escape
 * @returns Escaped CSV string
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Prepare data rows from headers and row data
 * @param headers - Array of header objects with label and key properties
 * @param rows - Array of row data
 * @returns Array of CSV formatted row strings
 */
const prepareDataRows = (headers: { label: string; key: string }[], rows: any[]): string[] => {
  return rows
    .filter(row => checkRowValidity(headers, row)) // Filter out invalid rows
    .map(row => {
      return headers.map(header => {
        const value = row[header.key] || '';
        return escapeCSVValue(value);
      }).join(',');
    });
};

/**
 * Helper function to convert headers and rows to CSV format
 * @param headers - Array of header objects with label and key properties
 * @param rows - Array of row data
 * @returns CSV formatted string
 */
const convertToCSV = (headers: { label: string; key: string }[], rows: any[]): string => {
  // Create header row using labels
  const headerRow = headers.map(header => escapeCSVValue(header.label)).join(',');
  // Create data rows using keys to map data
  const dataRows = prepareDataRows(headers, rows);
  return [headerRow, ...dataRows].join('\n');
};

const convertToExcel = async (headers: { label: string; key: string }[], rows: any[]): Promise<ArrayBuffer> => {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add headers to the first row
  const headerLabels = headers.map(header => header.label);
  worksheet.addRow(headerLabels);

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data rows
  const validRows = rows.filter(row => checkRowValidity(headers, row));
  validRows.forEach(row => {
    const rowData = headers.map(header => row[header.key] || '');
    worksheet.addRow(rowData);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
    }
    column.width = Math.min(maxLength + 2, 50); // Max width of 50 characters
  });

  // Generate buffer and return as ArrayBuffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}

const checkRowValidity = (headers: { key: string; required?: boolean }[], row: any): boolean => {
  return headers.every(header => {
    if (header.required) {
      return row[header.key] !== undefined && row[header.key] !== null && row[header.key] !== '';
    }
    return true;
  });
};
