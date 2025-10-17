// services/driver.ts

import {
  Driver,
  DateTime,
  GpsData,
  Vehicle,
  Trip,
  SpeedReport,
  IdleReport,
  VehicleMaintenance,
  ActivityEvent,
  EnhancedDriver,
  DriverStatus,
  DeviceStatus,
  DocumentStatus,
  DriverPerformanceMetrics,
  DriverFilters,
  SortOption,
  BulkOperation,
  ActivityType,
} from '@/types';

import { Drivers } from '@/constants/drivers';
import { TripsMock } from '@/constants/trips';
import { GpsDataMock } from '@/constants/gps-data';
import { SpeedReportsMock } from '@/constants/speed-reports';
import { IdleReportsMock } from '@/constants/idle-reports';
import { VehicleMaintenanceMock } from '@/constants/maintenance-reports';
import { Vehicles } from '@/constants/vehicles';

// Core Driver Operations
export const getAllDrivers = (): EnhancedDriver[] => {
  return Drivers.map((driver) => enhanceDriver(driver));
};

export const getDriverById = (id: number): EnhancedDriver | undefined => {
  const driver = Drivers.find((d) => d.id === id);
  return driver ? enhanceDriver(driver) : undefined;
};

// Overview Metrics
export const getOverviewMetrics = () => {
  const enhancedDrivers = getAllDrivers();
  const now = new Date();

  return {
    totalCount: Drivers.length,
    activeCount: enhancedDrivers.filter((d) => d.status === 'on-trip').length,
    availableCount: enhancedDrivers.filter((d) => d.status === 'available')
      .length,
    offlineCount: enhancedDrivers.filter((d) => d.status === 'offline').length,
    criticalIssues: {
      lowBattery: enhancedDrivers.filter(
        (d) =>
          d.deviceInfo.batteryLevel !== undefined &&
          d.deviceInfo.batteryLevel < 20
      ).length,
      poorSignal: enhancedDrivers.filter(
        (d) =>
          d.deviceInfo.signalStrength !== undefined &&
          d.deviceInfo.signalStrength < 2
      ).length,
      offline: enhancedDrivers.filter((d) => d.deviceStatus === 'offline')
        .length,
    },
    licenseAlerts: {
      expired: enhancedDrivers.filter(
        (d) => d.license_expiry && new Date(d.license_expiry) < now
      ).length,
      expiringSoon: enhancedDrivers.filter((d) => {
        if (!d.license_expiry) return false;
        const daysUntilExpiry =
          (new Date(d.license_expiry).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      }).length,
    },
  };
};

// Performance Metrics Calculations
export const getDriverPerformanceMetrics = (
  driverId: number
): DriverPerformanceMetrics => {
  const trips = TripsMock.filter((trip) => trip.driver === driverId);
  const speedReports = SpeedReportsMock.filter((report) =>
    trips.some((trip) => trip.id === report.trip)
  );
  const idleReports = IdleReportsMock.filter((report) =>
    trips.some((trip) => trip.id === report.trip)
  );

  return {
    timeManagement: calculateTimeMetrics(trips),
    safetyMetrics: calculateSafetyMetrics(trips, speedReports),
    tripMetrics: calculateTripMetrics(trips),
    efficiencyMetrics: calculateEfficiencyMetrics(trips, idleReports),
  };
};

// Status and Device Info
const calculateDriverStatus = (
  driverId: number
): { status: DriverStatus; deviceStatus: DeviceStatus } => {
  const currentTrip = TripsMock.find(
    (trip) => trip.driver === driverId && trip.start_time && !trip.end_time
  );
  const gpsData = GpsDataMock.find((data) => data.driver === driverId);

  let status: DriverStatus = 'offline';
  let deviceStatus: DeviceStatus = 'offline';

  if (gpsData) {
    deviceStatus = calculateDeviceStatus(gpsData);
    status = calculateStatus(currentTrip, gpsData);
  }

  return { status, deviceStatus };
};

// Timeline and Activity
export const getDriverTimeline = (
  driverId: number,
  limit: number = 5
): ActivityEvent[] => {
  const activities: ActivityEvent[] = [];
  const trips = TripsMock.filter((trip) => trip.driver === driverId);

  // Add trip events
  trips.forEach((trip) => addTripEvents(activities, trip, driverId));

  // Add violation events
  const speedViolations = SpeedReportsMock.filter((report) =>
    trips.some((trip) => trip.id === report.trip)
  );
  speedViolations.forEach((violation) =>
    addViolationEvent(activities, violation, driverId)
  );

  // Add maintenance events
  const maintenanceReports = VehicleMaintenanceMock.filter((report) =>
    trips.some((trip) => trip.id === report.trip)
  );
  maintenanceReports.forEach((maintenance) =>
    addMaintenanceEvent(activities, maintenance, driverId)
  );

  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
};

// Document Management
export const getDocumentStatus = (driver: Driver): DocumentStatus => {
  if (!driver.license_expiry) return 'expired';

  const now = new Date();
  const expiryDate = new Date(driver.license_expiry);
  const daysUntilExpiry =
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'valid';
};

// Filter and Sort Operations
export const filterDrivers = (
  drivers: EnhancedDriver[],
  filters: DriverFilters
): EnhancedDriver[] => {
  return drivers.filter((driver) => {
    if (filters.status?.length && !filters.status.includes(driver.status))
      return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !driver.fullname.toLowerCase().includes(searchLower) &&
        !driver.license_number?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (filters.dateRange) {
      const createdAt = new Date(driver.created_at);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      if (createdAt < start || createdAt > end) return false;
    }

    if (filters.performanceThreshold !== undefined) {
      if (
        driver.metrics.safetyMetrics.safetyRating < filters.performanceThreshold
      )
        return false;
    }

    if (filters.regions?.length) {
      if (!driver.state || !filters.regions.includes(driver.state))
        return false;
    }

    if (filters.documentStatus) {
      if (getDocumentStatus(driver) !== filters.documentStatus) return false;
    }

    return true;
  });
};

export const sortDrivers = (
  drivers: EnhancedDriver[],
  sort: SortOption
): EnhancedDriver[] => {
  return [...drivers].sort((a, b) => {
    const aValue = getNestedValue(a, sort.field);
    const bValue = getNestedValue(b, sort.field);

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Bulk Operations
export const executeBulkOperation = async (
  operation: BulkOperation
): Promise<boolean> => {
  try {
    switch (operation.operation) {
      case 'status_update':
        return handleBulkStatusUpdate(operation);
      case 'vehicle_assign':
        return handleBulkVehicleAssign(operation);
      case 'document_update':
        return handleBulkDocumentUpdate(operation);
      case 'export':
        return handleBulkExport(operation);
      default:
        return false;
    }
  } catch (error) {
    console.error('Bulk operation failed:', error);
    return false;
  }
};

// Helper Functions
const enhanceDriver = (driver: Driver): EnhancedDriver => {
  const { status, deviceStatus } = calculateDriverStatus(driver.id);
  const currentTrip = getCurrentTrip(driver.id);
  const currentVehicle = currentTrip
    ? getVehicle(currentTrip.vehicle)
    : undefined;
  const location = getDriverLocation(driver.id);
  const metrics = getDriverPerformanceMetrics(driver.id);
  const recentActivity = getDriverTimeline(driver.id);

  return {
    ...driver,
    status,
    deviceStatus,
    currentTrip,
    currentVehicle,
    ...location,
    metrics,
    recentActivity,
  };
};

const calculateTimeMetrics = (trips: Trip[]) => {
  const completedTrips = trips.filter((t) => t.end_time && t.start_time);
  const avgDuration =
    completedTrips.length > 0
      ? completedTrips.reduce((sum, trip) => {
          const duration =
            new Date(trip.end_time!).getTime() -
            new Date(trip.start_time!).getTime();
          return sum + duration;
        }, 0) /
        completedTrips.length /
        (1000 * 60 * 60) // Convert to hours
      : 0;

  return {
    averageTripDuration: avgDuration,
    responseTime: calculateAverageResponseTime(trips),
    onDutyHours: calculateOnDutyHours(trips),
    breakTimeCompliance: calculateBreakTimeCompliance(trips),
    lastBreakTime: getLastBreakTime(trips),
  };
};

const calculateSafetyMetrics = (trips: Trip[], speedReports: SpeedReport[]) => {
  return {
    suddenBrakingCount: calculateSuddenEvents(trips, 'braking'),
    suddenAccelerationCount: calculateSuddenEvents(trips, 'acceleration'),
    speedViolationCount: speedReports.length,
    averageSpeedScore: calculateAverageSpeedScore(speedReports),
    safetyRating: calculateSafetyRating(trips, speedReports),
  };
};

const calculateTripMetrics = (trips: Trip[]) => {
  const completedTrips = trips.filter((t) => t.end_time);
  const totalDistance = trips.reduce(
    (sum, t) => sum + (t.distance_travelled || 0),
    0
  );

  return {
    totalTrips: trips.length,
    completedTrips: completedTrips.length,
    onTimeRate: calculateOnTimeRate(trips),
    totalDistance,
    averageTripsPerDay: calculateAverageTripsPerDay(trips),
  };
};

const calculateEfficiencyMetrics = (
  trips: Trip[],
  idleReports: IdleReport[]
) => {
  return {
    averageIdleTime: calculateAverageIdleTime(idleReports),
    fuelEfficiency: calculateFuelEfficiency(trips),
    routeAdherence: calculateRouteAdherence(trips),
  };
};

// First, let's add all the missing helper functions before the driverService export:

const calculateDeviceStatus = (gpsData: GpsData): DeviceStatus => {
  if (!gpsData.battery_level || !gpsData.signal_strength) return 'offline';

  if (gpsData.battery_level < 15) return 'critical';
  if (gpsData.signal_strength === 0) return 'offline';
  if (gpsData.signal_strength < 2) return 'poor';
  if (gpsData.signal_strength < 4) return 'good';
  return 'excellent';
};

const calculateStatus = (
  currentTrip: Trip | undefined,
  gpsData: GpsData
): DriverStatus => {
  if (currentTrip) return 'on-trip';
  if (gpsData.signal_strength && gpsData.signal_strength > 0)
    return 'available';
  return 'offline';
};

const getCurrentTrip = (driverId: number): Trip | undefined => {
  return TripsMock.find(
    (trip) => trip.driver === driverId && trip.start_time && !trip.end_time
  );
};

const getVehicle = (vehicleId: number): Vehicle | undefined => {
  return Vehicles.find((v) => v.id === vehicleId);
};

const getDriverLocation = (driverId: number) => {
  const gpsData = GpsDataMock.find((data) => data.driver === driverId);
  const latestTrip = getCurrentTrip(driverId);

  return {
    currentLocation:
      gpsData?.latitude && gpsData?.longitude
        ? {
            latitude: gpsData.latitude,
            longitude: gpsData.longitude,
            timestamp: gpsData.timestamp || new Date().toISOString(),
          }
        : latestTrip?.current_latitude && latestTrip?.current_longitude
          ? {
              latitude: latestTrip.current_latitude,
              longitude: latestTrip.current_longitude,
              timestamp: new Date().toISOString(),
            }
          : undefined,
    deviceInfo: {
      batteryLevel: gpsData?.battery_level,
      signalStrength: gpsData?.signal_strength,
      lastUpdated: gpsData?.timestamp || new Date().toISOString(),
      osVersion: gpsData?.os_version,
    },
  };
};

const addTripEvents = (
  activities: ActivityEvent[],
  trip: Trip,
  driverId: number
) => {
  if (trip.start_time) {
    activities.push({
      id: activities.length + 1,
      driverId,
      type: 'trip',
      timestamp: trip.start_time,
      description: `Started trip #${trip.id}`,
      metadata: {
        tripId: trip.id,
        vehicleId: trip.vehicle,
        location: {
          latitude: trip.current_latitude || 0,
          longitude: trip.current_longitude || 0,
        },
      },
    });
  }

  if (trip.end_time) {
    activities.push({
      id: activities.length + 1,
      driverId,
      type: 'trip',
      timestamp: trip.end_time,
      description: `Completed trip #${trip.id}`,
      metadata: {
        tripId: trip.id,
        vehicleId: trip.vehicle,
      },
    });
  }
};

const addViolationEvent = (
  activities: ActivityEvent[],
  violation: SpeedReport,
  driverId: number
) => {
  activities.push({
    id: activities.length + 1,
    driverId,
    type: 'violation',
    timestamp: violation.timestamp,
    description: `Speed violation recorded at ${violation.speed}km/h`,
    metadata: {
      tripId: violation.trip,
      violationType: 'speed',
      location: {
        latitude: violation.latitude,
        longitude: violation.longitude,
      },
    },
  });
};

const addMaintenanceEvent = (
  activities: ActivityEvent[],
  maintenance: VehicleMaintenance,
  driverId: number
) => {
  if (maintenance.maintenance_time) {
    activities.push({
      id: activities.length + 1,
      driverId,
      type: 'maintenance',
      timestamp: maintenance.maintenance_time,
      description: `${maintenance.service_type} maintenance performed`,
      metadata: {
        tripId: maintenance.trip,
      },
    });
  }
};

const calculateAverageResponseTime = (trips: Trip[]): number => {
  const responseTimes = trips
    .filter((trip) => trip.scheduled_start_time && trip.start_time)
    .map((trip) => {
      const scheduled = new Date(trip.scheduled_start_time!).getTime();
      const actual = new Date(trip.start_time!).getTime();
      return actual - scheduled;
    });

  return responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length /
        (1000 * 60) // Convert to minutes
    : 0;
};

const calculateOnDutyHours = (trips: Trip[]): number => {
  return trips.reduce((total, trip) => {
    if (trip.start_time && trip.end_time) {
      const duration =
        new Date(trip.end_time).getTime() - new Date(trip.start_time).getTime();
      return total + duration / (1000 * 60 * 60); // Convert to hours
    }
    return total;
  }, 0);
};

const calculateBreakTimeCompliance = (trips: Trip[]): number => {
  // Assuming 30-minute break required every 4 hours
  const requiredBreaks = Math.floor(calculateOnDutyHours(trips) / 4);
  const actualBreaks = getBreakCount(trips);
  return requiredBreaks > 0 ? (actualBreaks / requiredBreaks) * 100 : 100;
};

const getLastBreakTime = (trips: Trip[]): DateTime | undefined => {
  const sortedTrips = [...trips].sort((a, b) => {
    const bTime = b.end_time ? new Date(b.end_time).getTime() : 0;
    const aTime = a.end_time ? new Date(a.end_time).getTime() : 0;
    return bTime - aTime;
  });

  const lastTrip = sortedTrips.find((trip) => trip.end_time);
  return lastTrip?.end_time || undefined;
};

const calculateSuddenEvents = (
  trips: Trip[],
  type: 'braking' | 'acceleration'
): number => {
  // Mock implementation - in real app would analyze speed data
  return Math.floor(Math.random() * 5); // Mock random number of events
};

const calculateAverageSpeedScore = (speedReports: SpeedReport[]): number => {
  if (speedReports.length === 0) return 100;

  const violations = speedReports.filter(
    (report) => report.speed && report.speed > 0
  ).length;
  return Math.max(0, 100 - violations * 5);
};

const calculateSafetyRating = (
  trips: Trip[],
  speedReports: SpeedReport[]
): number => {
  const speedScore = calculateAverageSpeedScore(speedReports);
  const suddenEvents =
    calculateSuddenEvents(trips, 'braking') +
    calculateSuddenEvents(trips, 'acceleration');

  return Math.max(0, speedScore - suddenEvents * 2);
};

const calculateAverageIdleTime = (idleReports: IdleReport[]): number => {
  if (idleReports.length === 0) return 0;

  return (
    idleReports.reduce((total, report) => {
      if (report.start_idle_time && report.end_idle_time) {
        const duration =
          new Date(report.end_idle_time).getTime() -
          new Date(report.start_idle_time).getTime();
        return total + duration / (1000 * 60); // Convert to minutes
      }
      return total;
    }, 0) / idleReports.length
  );
};

const calculateFuelEfficiency = (trips: Trip[]): number => {
  // Mock implementation - would need actual fuel consumption data
  return 8.5; // Mock km/l value
};

const calculateRouteAdherence = (trips: Trip[]): number => {
  // Mock implementation - would need actual route tracking data
  return 92; // Mock percentage
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Bulk operation handlers
const handleBulkStatusUpdate = async (
  operation: BulkOperation
): Promise<boolean> => {
  if (!operation.payload?.status) return false;
  // Mock implementation - would need actual API calls
  return true;
};

const handleBulkVehicleAssign = async (
  operation: BulkOperation
): Promise<boolean> => {
  if (!operation.payload?.vehicleId) return false;
  // Mock implementation - would need actual API calls
  return true;
};

const handleBulkDocumentUpdate = async (
  operation: BulkOperation
): Promise<boolean> => {
  if (!operation.payload?.documentType) return false;
  // Mock implementation - would need actual API calls
  return true;
};

const handleBulkExport = async (operation: BulkOperation): Promise<boolean> => {
  if (!operation.payload?.exportFormat) return false;
  // Mock implementation - would need actual export logic
  return true;
};

const getBreakCount = (trips: Trip[]): number => {
  // Count gaps between trips as breaks
  let breaks = 0;
  for (let i = 1; i < trips.length; i++) {
    const prevTripEnd = new Date(trips[i - 1].end_time || '').getTime();
    const currentTripStart = new Date(trips[i].start_time || '').getTime();
    if (currentTripStart - prevTripEnd >= 30 * 60 * 1000) {
      // 30 minutes
      breaks++;
    }
  }
  return breaks;
};

const calculateOnTimeRate = (trips: Trip[]): number => {
  const completedTrips = trips.filter((trip) => trip.end_time);
  if (completedTrips.length === 0) return 0;

  const onTimeTrips = completedTrips.filter((trip) => {
    if (!trip.scheduled_start_time || !trip.start_time) return false;
    const scheduledStart = new Date(trip.scheduled_start_time).getTime();
    const actualStart = new Date(trip.start_time).getTime();
    // Consider 15 minutes buffer for on-time
    return actualStart - scheduledStart <= 15 * 60 * 1000;
  });

  return (onTimeTrips.length / completedTrips.length) * 100;
};

const calculateAverageTripsPerDay = (trips: Trip[]): number => {
  if (trips.length === 0) return 0;

  const dates = trips
    .filter((trip) => trip.start_time)
    .map((trip) => new Date(trip.start_time!).toDateString());

  const uniqueDates = new Set(dates);
  return uniqueDates.size > 0 ? trips.length / uniqueDates.size : 0;
};

export const driverService = {
  getAllDrivers,
  getDriverById,
  getOverviewMetrics,
  getDriverPerformanceMetrics,
  getDriverTimeline,
  getDocumentStatus,
  filterDrivers,
  sortDrivers,
  executeBulkOperation,
};
