import type { GpsData, Trip, VehicleMaintenance } from '../types/index';

import { Drivers } from '@/constants/drivers';
import { GpsDataMock } from '@/constants/gps-data';
import { VehicleMaintenanceMock as Maintenance } from '@/constants/maintenance-reports';
import { RoutesMock as Routes } from '@/constants/routes';
import { TripsMock as Trips } from '@/constants/trips';
import { Vehicles } from '@/constants/vehicles';

export const getDashboardStats = () => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    drivers: {
      total: Drivers.length,
      available: Drivers.length - Trips.filter((t: Trip) => !t.end_time).length,
      onTrip: Trips.filter((t: Trip) => !t.end_time).length,
      offline: GpsDataMock.filter((g: GpsData) => g.signal_strength === 0)
        .length,
    },
    vehicles: {
      total: Vehicles.length,
      available:
        Vehicles.length - Trips.filter((t: Trip) => !t.end_time).length,
      onTrip: Trips.filter((t: Trip) => !t.end_time).length,
      maintenance: Maintenance.filter(
        (m: VehicleMaintenance) =>
          m.maintenance_time && new Date(m.maintenance_time) >= lastWeek
      ).length,
    },
    trips: {
      total: Trips.length,
      inProgress: Trips.filter((t: Trip) => t.start_time && !t.end_time).length,
      scheduled: Trips.filter((t: Trip) => !t.start_time).length,
      completed: Trips.filter((t: Trip) => t.end_time).length,
      delayed: Trips.filter((t: Trip) => {
        if (!t.scheduled_start_time || !t.start_time) {
          return false;
        }
        const diff =
          new Date(t.start_time).getTime() -
          new Date(t.scheduled_start_time).getTime();
        return diff > 15 * 60 * 1000; // 15 minutes delay
      }).length,
    },
    routes: {
      total: Routes.length,
      active: new Set(
        Trips.filter((t: Trip) => !t.end_time).map((t: Trip) => t.route)
      ).size,
    },
  };
};
