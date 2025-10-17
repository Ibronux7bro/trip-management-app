export type VehicleType = 'Car' | 'Truck' | 'Bus';
export type VehicleStatus = 'Available' | 'Maintenance' | 'Out of Service';

export interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  model: string;
  year: number;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
  maintenanceLogs?: MaintenanceLog[];
  accidentLogs?: AccidentLog[];
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  nextDue?: string;
  createdAt: string;
}

export interface AccidentLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
  createdAt: string;
}

export interface VehicleFormData {
  plateNumber: string;
  vehicleType: VehicleType;
  model: string;
  year: number;
  status: VehicleStatus;
}

export interface VehicleFilters {
  plateNumber?: string;
  status?: VehicleStatus;
  vehicleType?: VehicleType;
}

export interface VehiclesResponse {
  success: boolean;
  data: Vehicle[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface VehicleResponse {
  success: boolean;
  data: Vehicle;
  message?: string;
}
