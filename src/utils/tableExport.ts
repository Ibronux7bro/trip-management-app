import ExcelJS from 'exceljs';

type ExportFormat = 'xlsx' | 'csv';

interface ExportOptions<T> {
  data: T[];
  filename?: string;
  sheetName?: string;
  format?: ExportFormat;
  columnMapping?: {
    [K in keyof Partial<T>]: string;
  };
  includeColumns?: (keyof T)[];
  excludeColumns?: (keyof T)[];
  transformData?: (row: T) => any;
  dateFormat?: string;
}

export const exportTableData = async <T extends object>({
  data,
  filename = 'export',
  sheetName = 'Sheet1',
  format = 'xlsx',
  columnMapping = {} as { [K in keyof Partial<T>]: string },
  includeColumns,
  excludeColumns = [],
  transformData,
  dateFormat = 'yyyy-mm-dd',
}: ExportOptions<T>) => {
  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Determine which columns to export
    const allColumns = Object.keys(data[0]) as (keyof T)[];
    let columnsToExport = includeColumns || allColumns;

    // Remove excluded columns
    columnsToExport = columnsToExport.filter(
      (col) => !excludeColumns.includes(col)
    );

    // Set up column headers
    const headers = columnsToExport.map((col) => ({
      header: columnMapping[col] || String(col),
      key: String(col),
    }));
    worksheet.columns = headers;

    // Transform and add data
    const rows = data.map((row) => {
      const transformedRow = transformData ? transformData(row) : row;

      const exportRow: { [key: string]: any } = {};
      columnsToExport.forEach((col) => {
        let value = transformedRow[col];

        // Format dates if the value is a Date object
        if (value instanceof Date) {
          value = formatDate(value, dateFormat);
        }

        exportRow[String(col)] = value;
      });

      return exportRow;
    });

    // Add rows to worksheet
    worksheet.addRows(rows);

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      if (!column) return;
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(maxLength + 2, 30);
    });

    // Generate buffer based on format
    let buffer: ArrayBuffer;
    if (format === 'csv') {
      buffer = (await workbook.csv.writeBuffer()) as ArrayBuffer;
      filename = `${filename}.csv`;
    } else {
      buffer = (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
      filename = `${filename}.xlsx`;
    }

    // Create blob with correct MIME type
    const blob = new Blob([buffer], {
      type:
        format === 'csv'
          ? 'text/csv;charset=utf-8;'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export data: ${error}`);
  }
};

const formatDate = (date: Date, format: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format
    .replace('yyyy', year.toString())
    .replace('mm', month)
    .replace('dd', day);
};
