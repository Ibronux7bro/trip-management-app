export type DateTime = string; // Assuming DateTime is represented as an ISO string in TypeScript

// Core Entities
export interface Driver {
  id: number;
  fullname: string;
  gender?: string;
  dob?: DateTime;
  contact: string;
  address?: string;
  state?: string;
  zipcode?: string;
  license_number?: string;
  license_expiry?: DateTime;
  created_at: DateTime;
}

export interface Vehicle {
  id: number;
  vehicle_number?: string;
  vehicle_capacity?: number;
  vehicle_chassis_number?: string | null;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  registration_number?: string;
  rc_expiry?: DateTime | null;
  insurance_number?: string | null;
  insurance_expiry?: DateTime | null;
  pollution_number?: string | null;
  pollution_expiry?: DateTime | null;
  owner_name?: string;
  owner_contact?: string;
  speed_limit?: number;
  created_at: DateTime;
}

export interface Route {
  id: number;
  route_name?: string;
  start_location?: string;
  end_location?: string;
  start_location_latitude?: number;
  start_location_longitude?: number;
  end_location_latitude?: number;
  end_location_longitude?: number;
  idle_time?: number;
  speed_limit?: number;
  created_at: DateTime;
}

export interface Trip {
  id: number;
  driver: number;
  vehicle: number;
  route: number;
  scheduled_start_time?: DateTime;
  start_time?: DateTime | null;
  end_time?: DateTime | null;
  distance_travelled?: number;
  current_latitude?: number;
  current_longitude?: number;
  total_idle_time?: number;
  current_idle_time?: number;
  current_speed?: number;
  is_speeding?: boolean;
  created_at: DateTime;
}

// Reports and Metrics
export interface IdleReport {
  id: number;
  trip: number;
  start_idle_time: DateTime;
  end_idle_time?: DateTime | null;
  timestamp: DateTime;
  latitude?: number;
  longitude?: number;
}

export interface SpeedReport {
  id: number;
  trip: number;
  speed?: number;
  start_speed_time?: DateTime | null;
  end_speed_time?: DateTime | null;
  timestamp: DateTime;
  latitude: number;
  longitude: number;
}

export interface FuelInfo {
  id: number;
  trip: number;
  odometer?: number;
  fuel_filled?: number;
  bill_number?: string;
  fuel_cost?: number;
  fuel_filled_time?: DateTime | null;
}

export interface VehicleMaintenance {
  id: number;
  trip: number;
  odometer?: number;
  service_type?: string;
  service_center_name?: string;
  bill_number?: string;
  bill_amount?: number;
  maintenance_time?: DateTime | null;
}

export interface DriverPerformanceMetrics {
  timeManagement: {
    averageTripDuration: number;
    responseTime: number;
    onDutyHours: number;
    breakTimeCompliance: number;
    lastBreakTime?: DateTime;
  };
  safetyMetrics: {
    suddenBrakingCount: number;
    suddenAccelerationCount: number;
    speedViolationCount: number;
    averageSpeedScore: number;
    safetyRating: number;
  };
  tripMetrics: {
    totalTrips: number;
    completedTrips: number;
    onTimeRate: number;
    totalDistance: number;
    averageTripsPerDay: number;
  };
  efficiencyMetrics: {
    averageIdleTime: number;
    fuelEfficiency: number;
    routeAdherence: number;
  };
}

// Additional Data Structures
export interface GpsData {
  id: number;
  driver: number;
  latitude?: number | null;
  longitude?: number | null;
  speed?: number | null;
  timestamp?: DateTime;
  os_version?: string;
  battery_level?: number;
  signal_strength?: number;
}

export interface RelatedTripData {
  trip: Trip;
  speedReports: SpeedReport[];
  idleReports: IdleReport[];
  fuelReports: FuelInfo[];
  maintenanceReports: VehicleMaintenance[];
}

export interface RelatedDriverData {
  driver: Driver;
  trips: Trip[];
  vehicles?: Vehicle[];
  gpsData: GpsData[];
}

// Enhanced Entities and Status
export type DriverStatus = 'active' | 'available' | 'offline' | 'on-trip';
export type DeviceStatus =
  | 'excellent'
  | 'good'
  | 'poor'
  | 'critical'
  | 'offline';
export type DocumentStatus = 'valid' | 'expiring' | 'expired';

export interface EnhancedDriver extends Driver {
  status: DriverStatus;
  deviceStatus: DeviceStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: DateTime;
  };
  currentTrip?: Trip;
  currentVehicle?: Vehicle;
  deviceInfo: {
    batteryLevel?: number;
    signalStrength?: number;
    lastUpdated: DateTime;
    osVersion?: string;
  };
  metrics: DriverPerformanceMetrics;
  recentActivity: ActivityEvent[];
}

export interface OverviewMetrics {
  totalCount: number;
  activeCount: number;
  availableCount: number;
  offlineCount: number;
  criticalIssues: {
    lowBattery: number;
    poorSignal: number;
    offline: number;
    total: number;
  };
  licenseAlerts: {
    expired: number;
    expiringSoon: number;
  };
}

// Activity Timeline
export type ActivityType =
  | 'trip'
  | 'violation'
  | 'maintenance'
  | 'status_change'
  | 'document_update'
  | 'break';

export interface ActivityEvent {
  id: number;
  driverId: number;
  type: ActivityType;
  timestamp: DateTime;
  description: string;
  metadata: {
    tripId?: number;
    vehicleId?: number;
    location?: { latitude: number; longitude: number };
    status?: DriverStatus;
    documentType?: string;
    violationType?: string;
  };
}

// UI Components and Error Handling
import { type ReactNode } from 'react';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface MainLayoutProps {
  children: ReactNode;
  initialPinned?: boolean;
}

export interface SidebarProps {
  isPinned: boolean;
  onPinChange: () => void;
}

// Filter and Sort Options
export interface DriverFilters {
  status?: DriverStatus[];
  search?: string;
  dateRange?: {
    start: DateTime;
    end: DateTime;
  };
  performanceThreshold?: number;
  vehicleTypes?: string[];
  regions?: string[];
  documentStatus?: DocumentStatus;
}

export interface SortOption {
  field: keyof EnhancedDriver | keyof DriverPerformanceMetrics;
  direction: 'asc' | 'desc';
}

// Bulk Operations
export interface BulkOperation {
  driverIds: number[];
  operation: 'status_update' | 'vehicle_assign' | 'document_update' | 'export';
  payload?: {
    status?: DriverStatus;
    vehicleId?: number;
    documentType?: string;
    exportFormat?: 'csv' | 'xlsx' | 'pdf';
  };
}
