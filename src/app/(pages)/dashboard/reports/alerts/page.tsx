// @/app/(pages)/reports/trip-alerts.tsx
'use client';

import ReportTemplate from '@/components/views/reports/report-template';
import { useReports, reportColumns } from '@/hooks/useReports';

export default function TripAlertsReport() {
  const { tripAlertsData, dateRange, updateDateRange } = useReports();

  const transformExportData = (data: any[]) => {
    return data.map((item) => ({
      'Alert ID': item.alertId,
      'Trip ID': item.tripId,
      Type: item.type,
      Driver: item.driverName,
      Vehicle: item.vehicleNumber,
      Timestamp: item.timestamp,
      'Duration (min)': item.duration,
      Location: item.location,
    }));
  };

  return (
    <ReportTemplate
      title="Trip Alerts Report"
      sections={[
        {
          title: 'Trip Alerts',
          data: tripAlertsData,
          columns: reportColumns.tripAlerts,
        },
      ]}
      onDateRangeChange={updateDateRange}
      initialStartDate={dateRange.startDate}
      initialEndDate={dateRange.endDate}
      exportFileName="trip_alerts_report"
      transformExportData={transformExportData}
    />
  );
}
