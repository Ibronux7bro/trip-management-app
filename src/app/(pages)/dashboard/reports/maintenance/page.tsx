// pages/reports/fuel-maintenance.tsx
'use client';

import ReportTemplate from '@/components/views/reports/report-template';
import { useReports, reportColumns } from '@/hooks/useReports';

export default function FuelMaintenanceReport() {
  const { fuelMaintenanceData, dateRange, updateDateRange } = useReports();

  const combinedData = [
    ...fuelMaintenanceData.fuelReports,
    ...fuelMaintenanceData.maintenanceReports,
  ];

  const transformExportData = (data: any[]) => {
    return data.map((item) => ({
      'Report ID': item.reportId,
      Type: item.type,
      'Trip ID': item.tripId,
      Driver: item.driverName,
      Vehicle: item.vehicleNumber,
      'Amount (₹)': item.amount,
      Timestamp: item.timestamp,
      'Bill Number': item.billNumber,
    }));
  };

  return (
    <ReportTemplate
      title="Fuel & Maintenance Report"
      sections={[
        {
          title: 'Fuel & Maintenance Records',
          data: combinedData,
          columns: reportColumns.fuelMaintenance,
        },
      ]}
      onDateRangeChange={updateDateRange}
      initialStartDate={dateRange.startDate}
      initialEndDate={dateRange.endDate}
      exportFileName="fuel_maintenance_report"
      transformExportData={transformExportData}
    />
  );
}
