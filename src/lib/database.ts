/**
 * Database Configuration and Management
 * This file provides a centralized database management system for the trip planner application
 */

import { Order, OrderStatus, PaymentMethod } from '@/types/order';
import { Vehicle, VehicleType, VehicleStatus } from '@/types/vehicle';
import { Driver, DriverStatus } from '@/types';

// Database interfaces
export interface DatabaseConfig {
  type: 'mock' | 'local' | 'remote';
  name: string;
  version: number;
  autoBackup: boolean;
  backupInterval: number; // in milliseconds
}

export interface DatabaseStats {
  orders: number;
  vehicles: number;
  drivers: number;
  users: number;
  lastBackup?: string;
  size?: string;
}

// Database configuration
const DB_CONFIG: DatabaseConfig = {
  type: 'local',
  name: 'trip-planner-db',
  version: 1,
  autoBackup: true,
  backupInterval: 24 * 60 * 60 * 1000, // 24 hours
};

// Local storage keys
const STORAGE_KEYS = {
  ORDERS: 'trip-planner-orders',
  VEHICLES: 'trip-planner-vehicles',
  DRIVERS: 'trip-planner-drivers',
  USERS: 'trip-planner-users',
  SETTINGS: 'trip-planner-settings',
  BACKUP: 'trip-planner-backup',
} as const;

// Database class
class Database {
  private config: DatabaseConfig;
  private isInitialized = false;

  constructor(config: DatabaseConfig = DB_CONFIG) {
    this.config = config;
  }

  // Initialize database
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if data exists in localStorage
      const hasData = this.hasData();
      
      if (!hasData) {
        // Initialize with seed data
        await this.seedDatabase();
      }

      // Set up auto-backup if enabled
      if (this.config.autoBackup) {
        this.setupAutoBackup();
      }

      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Check if database has data
  private hasData(): boolean {
    try {
      const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const vehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const drivers = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      return !!(orders && vehicles && drivers);
    } catch {
      return false;
    }
  }

  // Seed database with initial data
  private async seedDatabase(): Promise<void> {
    try {
      // Seed orders
      const orders: Order[] = [
        {
          id: "ORD-1001",
          carType: "Sedan",
          carModel: "Toyota Camry",
          plateNumber: "ABC-1234",
          fromCity: "Riyadh",
          toCity: "Jeddah",
          paymentMethod: "mada" as PaymentMethod,
          price: 250.0,
          status: "in_transit" as OrderStatus,
          createdAt: new Date().toISOString(),
          currentLocation: { lat: 24.774265, lng: 46.738586 },
          path: [
            { lat: 24.774265, lng: 46.738586 },
            { lat: 24.5, lng: 46.2 },
            { lat: 24.0, lng: 45.8 },
          ],
        },
        {
          id: "ORD-1002",
          carType: "SUV",
          carModel: "Hyundai Tucson",
          plateNumber: "XYZ-5678",
          fromCity: "Dammam",
          toCity: "Riyadh",
          paymentMethod: "card",
          price: 180.0,
          status: "received",
          createdAt: new Date().toISOString(),
        },
      ];

      // Seed vehicles
      const vehicles: Vehicle[] = [
        {
          id: '1',
          plateNumber: 'ABC-1234',
          vehicleType: 'Truck',
          model: 'Toyota Hiace',
          year: 2022,
          status: 'Available',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-15T08:00:00Z',
        },
        {
          id: '2',
          plateNumber: 'XYZ-5678',
          vehicleType: 'Car',
          model: 'Honda Civic',
          year: 2021,
          status: 'Maintenance',
          createdAt: '2024-01-10T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
        },
      ];

      // Seed drivers
      const drivers: Driver[] = [
        {
          id: 1,
          fullname: 'محمد أحمد السعد',
          gender: 'Male',
          dob: '1988-05-15T00:00:00Z',
          contact: '+966501234567',
          address: 'الرياض، المملكة العربية السعودية',
          state: 'الرياض',
          zipcode: '12345',
          license_number: 'SA1234567890',
          license_expiry: '2025-05-14T00:00:00Z',
          created_at: '2023-01-10T08:30:00Z',
        },
        {
          id: 2,
          fullname: 'فاطمة عبدالله العلي',
          gender: 'Female',
          dob: '1992-07-22T00:00:00Z',
          contact: '+966509876543',
          address: 'جدة، المملكة العربية السعودية',
          state: 'مكة المكرمة',
          zipcode: '54321',
          license_number: 'SA0987654321',
          license_expiry: '2024-12-31T00:00:00Z',
          created_at: '2023-02-01T09:15:00Z',
        },
      ];

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Failed to seed database:', error);
      throw error;
    }
  }

  // Setup auto-backup
  private setupAutoBackup(): void {
    setInterval(() => {
      this.createBackup();
    }, this.config.backupInterval);
  }

  // Create backup
  async createBackup(): Promise<void> {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: this.config.version,
        data: {
          orders: this.getOrders(),
          vehicles: this.getVehicles(),
          drivers: this.getDrivers(),
        },
      };

      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
      console.log('Database backup created');
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  // Restore from backup
  async restoreFromBackup(): Promise<boolean> {
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backup) return false;

      const backupData = JSON.parse(backup);
      
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(backupData.data.orders));
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(backupData.data.vehicles));
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(backupData.data.drivers));

      console.log('Database restored from backup');
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  // Get database statistics
  getStats(): DatabaseStats {
    try {
      const orders = this.getOrders();
      const vehicles = this.getVehicles();
      const drivers = this.getDrivers();
      
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      const backupData = backup ? JSON.parse(backup) : null;

      return {
        orders: orders.length,
        vehicles: vehicles.length,
        drivers: drivers.length,
        users: 0, // Will be implemented with user management
        lastBackup: backupData?.timestamp,
        size: this.calculateSize(),
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        orders: 0,
        vehicles: 0,
        drivers: 0,
        users: 0,
      };
    }
  }

  // Calculate database size
  private calculateSize(): string {
    try {
      let totalSize = 0;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });

      if (totalSize < 1024) return `${totalSize} B`;
      if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(2)} KB`;
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'Unknown';
    }
  }

  // Orders operations
  getOrders(): Order[] {
    try {
      const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return orders ? JSON.parse(orders) : [];
    } catch {
      return [];
    }
  }

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save orders:', error);
      throw error;
    }
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
  }

  updateOrder(id: string, updates: Partial<Order>): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) return false;
    
    orders[index] = { ...orders[index], ...updates };
    this.saveOrders(orders);
    return true;
  }

  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) return false;
    
    this.saveOrders(filteredOrders);
    return true;
  }

  // Vehicles operations
  getVehicles(): Vehicle[] {
    try {
      const vehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return vehicles ? JSON.parse(vehicles) : [];
    } catch {
      return [];
    }
  }

  saveVehicles(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Failed to save vehicles:', error);
      throw error;
    }
  }

  addVehicle(vehicle: Vehicle): void {
    const vehicles = this.getVehicles();
    vehicles.unshift(vehicle);
    this.saveVehicles(vehicles);
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): boolean {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(vehicle => vehicle.id === id);
    
    if (index === -1) return false;
    
    vehicles[index] = { ...vehicles[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveVehicles(vehicles);
    return true;
  }

  deleteVehicle(id: string): boolean {
    const vehicles = this.getVehicles();
    const filteredVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    
    if (filteredVehicles.length === vehicles.length) return false;
    
    this.saveVehicles(filteredVehicles);
    return true;
  }

  // Drivers operations
  getDrivers(): Driver[] {
    try {
      const drivers = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      return drivers ? JSON.parse(drivers) : [];
    } catch {
      return [];
    }
  }

  saveDrivers(drivers: Driver[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    } catch (error) {
      console.error('Failed to save drivers:', error);
      throw error;
    }
  }

  addDriver(driver: Driver): void {
    const drivers = this.getDrivers();
    drivers.unshift(driver);
    this.saveDrivers(drivers);
  }

  updateDriver(id: number, updates: Partial<Driver>): boolean {
    const drivers = this.getDrivers();
    const index = drivers.findIndex(driver => driver.id === id);
    
    if (index === -1) return false;
    
    drivers[index] = { ...drivers[index], ...updates };
    this.saveDrivers(drivers);
    return true;
  }

  deleteDriver(id: number): boolean {
    const drivers = this.getDrivers();
    const filteredDrivers = drivers.filter(driver => driver.id !== id);
    
    if (filteredDrivers.length === drivers.length) return false;
    
    this.saveDrivers(filteredDrivers);
    return true;
  }

  // Clear all data
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.isInitialized = false;
      console.log('All database data cleared');
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw error;
    }
  }

  // Export data
  exportData(): string {
    try {
      const data = {
        orders: this.getOrders(),
        vehicles: this.getVehicles(),
        drivers: this.getDrivers(),
        exportedAt: new Date().toISOString(),
        version: this.config.version,
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.orders) this.saveOrders(data.orders);
      if (data.vehicles) this.saveVehicles(data.vehicles);
      if (data.drivers) this.saveDrivers(data.drivers);
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const database = new Database();

// Export types and constants
export { STORAGE_KEYS, DB_CONFIG };
export type { DatabaseConfig, DatabaseStats };
