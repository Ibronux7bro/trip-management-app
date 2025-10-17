'use client';

import React from 'react';
import { useDriver } from '@/hooks/useDriver';
import { Users, UserCheck, AlertTriangle, Clock } from 'lucide-react';
import { DriverTableContainer } from './components/driver-table';
import DriverDetailsPanel from './components/driver-panel';
import MetricCard from './components/metric-card';
import { StatusCards } from './components/status-card';

// Main DriverManagement Component
const DriverManagement = () => {
  const {
    drivers,
    selectedDrivers,
    overviewMetrics,
    selectDriver,
    isLoading,
    error,
  } = useDriver();

  React.useEffect(() => {
    if (drivers.length > 0 && selectedDrivers.length === 0) {
      selectDriver(drivers[0].id);
    }
  }, [drivers, selectedDrivers, selectDriver]);

  const selectedDriver =
    drivers.find((d) => d.id === selectedDrivers[0]) || drivers[0];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const metricsData = [
    {
      title: 'Total Drivers',
      value: overviewMetrics?.totalCount || 0,
      subtitle: 'Registered drivers',
      icon: Users,
      trend: 5,
      color: 'primary',
    },
    {
      title: 'Active Drivers',
      value: overviewMetrics.activeCount,
      subtitle: 'Currently on trip',
      icon: UserCheck,
      trend: 2,
      color: 'success',
    },
    {
      title: 'Available Drivers',
      value: overviewMetrics.availableCount,
      subtitle: 'Ready for dispatch',
      icon: Clock,
      trend: -3,
      color: 'warning',
    },
    {
      title: 'Critical Issues',
      value: overviewMetrics.criticalIssues.total,
      subtitle: 'Require attention',
      icon: AlertTriangle,
      color: 'destructive',
    },
  ];

  return (
    <div className="md:max-w-[86rem] max-w-[100dvw] overflow-x-auto overflow-y-auto p-4">
      <div className="h-full relative">
        <div className="grid grid-cols-1 md:grid-cols-[380px,1fr] gap-4 h-full">
          {/* Left Sidebar */}
          <div className="space-y-4 p-4 overflow-y-auto bg-card rounded-md shadow-md">
            <DriverDetailsPanel selectedDriver={selectedDriver} />
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metricsData.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>

            {/* Secondary Metrics */}
            <StatusCards overviewMetrics={overviewMetrics} drivers={drivers} />

            {/* Actions and Table Section */}
            <div className="min-h-[400px]">
              <DriverTableContainer
                data={drivers}
                onDriverSelect={selectDriver}
                statusFilters={[]}
                searchTerm={''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
