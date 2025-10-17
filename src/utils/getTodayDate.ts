/**
 * Utility function to get today's date in a specified format.
 *
 * @param format - The desired date format. Defaults to 'YYYY-MM-DD'.
 * @returns The formatted date string.
 */
export const getTodayDate = (format: string = 'YYYY-MM-DD'): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day);
};

// Example usage:
const today = getTodayDate(); // Default: 'YYYY-MM-DD'
const customFormat = getTodayDate('MM/DD/YYYY'); // Example: '12/11/2024'
console.log({ today, customFormat });
