'use client';

// hooks/useReports.ts
import { useState, useMemo } from 'react';
import { ReportsService } from '@/services/reports';

// Column definitions for ReportTemplate
export const reportColumns = {
  tripActivity: [
    {
      header: 'Trip ID',
      accessorKey: 'tripId',
    },
    {
      header: 'Driver',
      accessorKey: 'driverName',
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicleNumber',
    },
    {
      header: 'Start Time',
      accessorKey: 'startTime',
    },
    {
      header: 'End Time',
      accessorKey: 'endTime',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Distance (km)',
      accessorKey: 'distanceTravelled',
    },
    {
      header: 'Idle Time (min)',
      accessorKey: 'totalIdleTime',
    },
  ],

  tripAlerts: [
    {
      header: 'Alert ID',
      accessorKey: 'alertId',
    },
    {
      header: 'Trip ID',
      accessorKey: 'tripId',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Driver',
      accessorKey: 'driverName',
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicleNumber',
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
    },
    {
      header: 'Duration (min)',
      accessorKey: 'duration',
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
  ],

  fuelMaintenance: [
    {
      header: 'Report ID',
      accessorKey: 'reportId',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Trip ID',
      accessorKey: 'tripId',
    },
    {
      header: 'Driver',
      accessorKey: 'driverName',
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicleNumber',
    },
    {
      header: 'Amount (₹)',
      accessorKey: 'amount',
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
    },
    {
      header: 'Bill Number',
      accessorKey: 'billNumber',
    },
  ],
};

export const useReports = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });

  const tripActivityData = useMemo(
    () =>
      ReportsService.getTripActivityData(
        dateRange.startDate,
        dateRange.endDate
      ),
    [dateRange]
  );

  const tripAlertsData = useMemo(
    () =>
      ReportsService.getTripAlertsData(dateRange.startDate, dateRange.endDate),
    [dateRange]
  );

  const fuelMaintenanceData = useMemo(
    () =>
      ReportsService.getFuelMaintenanceData(
        dateRange.startDate,
        dateRange.endDate
      ),
    [dateRange]
  );

  const updateDateRange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  return {
    tripActivityData,
    tripAlertsData,
    fuelMaintenanceData,
    dateRange,
    updateDateRange,
  };
};
