// pages/reports/trip-activity.tsx
'use client';
import ReportTemplate from '@/components/views/reports/report-template';
import { useReports, reportColumns } from '@/hooks/useReports';

export default function TripActivityReport() {
  const { tripActivityData, dateRange, updateDateRange } = useReports();

  const transformExportData = (data: any[]) => {
    return data.map((item) => ({
      'Trip ID': item.tripId,
      Driver: item.driverName,
      Vehicle: item.vehicleNumber,
      'Start Time': item.startTime,
      'End Time': item.endTime,
      Status: item.status,
      'Distance (km)': item.distanceTravelled,
      'Idle Time (min)': item.totalIdleTime,
    }));
  };

  return (
    <ReportTemplate
      title="Trip Activity Report"
      sections={[
        {
          title: 'Trip Activities',
          data: tripActivityData,
          columns: reportColumns.tripActivity,
        },
      ]}
      onDateRangeChange={updateDateRange}
      initialStartDate={dateRange.startDate}
      initialEndDate={dateRange.endDate}
      exportFileName="trip_activity_report"
      transformExportData={transformExportData}
    />
  );
}
