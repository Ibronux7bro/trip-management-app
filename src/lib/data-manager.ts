/**
 * Data Manager - Advanced data management with React Query integration
 * Provides centralized data access, caching, and synchronization
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database, type DatabaseStats } from './database';
import { Order, OrderStatus } from '@/types/order';
import { Vehicle, VehicleType, VehicleStatus } from '@/types/vehicle';
import { Driver, DriverStatus } from '@/types';
import { notificationService } from './notification-service';

// Query keys for React Query
export const QUERY_KEYS = {
  ORDERS: 'orders',
  VEHICLES: 'vehicles',
  DRIVERS: 'drivers',
  STATS: 'stats',
  ORDER: (id: string) => ['order', id],
  VEHICLE: (id: string) => ['vehicle', id],
  DRIVER: (id: number) => ['driver', id],
} as const;

// Data Manager Class
class DataManager {
  private queryClient = null as any; // Will be set by the hook

  // Initialize with query client
  initialize(queryClient: any) {
    this.queryClient = queryClient;
  }

  // Orders API
  async getOrders(): Promise<Order[]> {
    return database.getOrders();
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    return orders.find(order => order.id === id);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...orderData,
    };

    database.addOrder(order);
    
    // Invalidate and refetch orders
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    }

    // Send notification
    notificationService.onOrderStatusChange(order, 'pending' as OrderStatus, 'pending' as OrderStatus);

    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const success = database.updateOrder(id, updates);
    
    if (success) {
      // Invalidate and refetch
      if (this.queryClient) {
        this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER(id)] });
      }

      // Get updated order and send notifications
      const updatedOrder = await this.getOrder(id);
      if (updatedOrder && updates.status) {
        const oldOrder = await this.getOrder(id);
        if (oldOrder) {
          notificationService.onOrderStatusChange(updatedOrder, oldOrder.status, updates.status);
        }
      }

      return updatedOrder;
    }

    return undefined;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const success = database.deleteOrder(id);
    
    if (success && this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      this.queryClient.removeQueries({ queryKey: [QUERY_KEYS.ORDER(id)] });
    }

    return success;
  }

  // Vehicles API
  async getVehicles(): Promise<Vehicle[]> {
    return database.getVehicles();
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const vehicles = await this.getVehicles();
    return vehicles.find(vehicle => vehicle.id === id);
  }

  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vehicleData,
    };

    database.addVehicle(vehicle);
    
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
    }

    return vehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const success = database.updateVehicle(id, updates);
    
    if (success && this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE(id)] });
    }

    return success ? await this.getVehicle(id) : undefined;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const success = database.deleteVehicle(id);
    
    if (success && this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      this.queryClient.removeQueries({ queryKey: [QUERY_KEYS.VEHICLE(id)] });
    }

    return success;
  }

  // Drivers API
  async getDrivers(): Promise<Driver[]> {
    return database.getDrivers();
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    const drivers = await this.getDrivers();
    return drivers.find(driver => driver.id === id);
  }

  async createDriver(driverData: Omit<Driver, 'id' | 'created_at'>): Promise<Driver> {
    const driver: Driver = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      ...driverData,
    };

    database.addDriver(driver);
    
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
    }

    return driver;
  }

  async updateDriver(id: number, updates: Partial<Driver>): Promise<Driver | undefined> {
    const success = database.updateDriver(id, updates);
    
    if (success && this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVER(id)] });
    }

    return success ? await this.getDriver(id) : undefined;
  }

  async deleteDriver(id: number): Promise<boolean> {
    const success = database.deleteDriver(id);
    
    if (success && this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
      this.queryClient.removeQueries({ queryKey: [QUERY_KEYS.DRIVER(id)] });
    }

    return success;
  }

  // Statistics API
  async getStats(): Promise<DatabaseStats> {
    return database.getStats();
  }

  // Database management
  async createBackup(): Promise<void> {
    return database.createBackup();
  }

  async restoreFromBackup(): Promise<boolean> {
    const success = await database.restoreFromBackup();
    
    if (success && this.queryClient) {
      // Invalidate all queries to refresh data
      this.queryClient.invalidateQueries();
    }

    return success;
  }

  async exportData(): Promise<string> {
    return database.exportData();
  }

  async importData(jsonData: string): Promise<boolean> {
    const success = database.importData(jsonData);
    
    if (success && this.queryClient) {
      // Invalidate all queries to refresh data
      this.queryClient.invalidateQueries();
    }

    return success;
  }

  async clearAllData(): Promise<void> {
    database.clearAllData();
    
    if (this.queryClient) {
      // Clear all cached data
      this.queryClient.clear();
    }
  }
}

// Export singleton instance
export const dataManager = new DataManager();

// React Query Hooks
export function useOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: () => dataManager.getOrders(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER(id)],
    queryFn: () => dataManager.getOrder(id),
    enabled: !!id,
  });
}

export function useVehicles() {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLES],
    queryFn: () => dataManager.getVehicles(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLE(id)],
    queryFn: () => dataManager.getVehicle(id),
    enabled: !!id,
  });
}

export function useDrivers() {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVERS],
    queryFn: () => dataManager.getDrivers(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useDriver(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER(id)],
    queryFn: () => dataManager.getDriver(id),
    enabled: !!id,
  });
}

export function useStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: () => dataManager.getStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

// Mutation Hooks
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => 
      dataManager.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Order> }) => 
      dataManager.updateOrder(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER(variables.id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dataManager.deleteOrder(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.ORDER(id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => 
      dataManager.createVehicle(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Vehicle> }) => 
      dataManager.updateVehicle(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE(variables.id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dataManager.deleteVehicle(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.VEHICLE(id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (driverData: Omit<Driver, 'id' | 'created_at'>) => 
      dataManager.createDriver(driverData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Driver> }) => 
      dataManager.updateDriver(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVER(variables.id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => dataManager.deleteDriver(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVERS] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.DRIVER(id)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
    },
  });
}

// Database management hooks
export function useBackup() {
  return useMutation({
    mutationFn: () => dataManager.createBackup(),
  });
}

export function useRestore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => dataManager.restoreFromBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useExport() {
  return useMutation({
    mutationFn: () => dataManager.exportData(),
  });
}

export function useImport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jsonData: string) => dataManager.importData(jsonData),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useClearData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => dataManager.clearAllData(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// Initialize data manager with query client
export function initializeDataManager(queryClient: any) {
  dataManager.initialize(queryClient);
}
