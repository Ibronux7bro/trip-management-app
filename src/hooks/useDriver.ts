import { useState, useCallback, useMemo } from 'react';
import {
  DriverFilters,
  SortOption,
  BulkOperation,
  EnhancedDriver,
  OverviewMetrics,
  ActivityEvent,
} from '@/types';
import { driverService } from '@/services/driver';

interface UseDriverOptions {
  initialFilters?: DriverFilters;
  initialSort?: SortOption;
}

interface UseDriverReturn {
  // Data
  drivers: EnhancedDriver[]; // Changed from Driver[] to EnhancedDriver[]
  selectedDrivers: number[];
  overviewMetrics: OverviewMetrics;
  isLoading: boolean;
  error: string | null;
  filters: DriverFilters;
  sortOption: SortOption;
  // Actions
  selectDriver: (driverId: number) => void;
  selectMultipleDrivers: (driverIds: number[]) => void;
  clearSelection: () => void;
  updateFilters: (newFilters: Partial<DriverFilters>) => void;
  updateSort: (newSort: SortOption) => void;
  executeBulkOperation: (operation: BulkOperation) => Promise<boolean>;
  getDriverDetails: (driverId: number) => Promise<EnhancedDriver | null>; // Updated return type
  getDriverTimeline: (
    driverId: number,
    limit?: number
  ) => Promise<ActivityEvent[]>; // Specified return type
}

export const useDriver = (options: UseDriverOptions = {}): UseDriverReturn => {
  // States
  const [filters, setFilters] = useState<DriverFilters>(
    options.initialFilters || {}
  );
  const [sortOption, setSortOption] = useState<SortOption>(
    options.initialSort || { field: 'fullname', direction: 'asc' }
  );
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all drivers with filters and sorting applied
  const drivers = useMemo(() => {
    try {
      let result = driverService.getAllDrivers();
      if (Object.keys(filters).length) {
        result = driverService.filterDrivers(result, filters);
      }
      if (sortOption) {
        result = driverService.sortDrivers(result, sortOption);
      }
      return result;
    } catch (err) {
      setError('Failed to fetch drivers');
      return [] as EnhancedDriver[]; // Explicitly type the empty array
    }
  }, [filters, sortOption]);

  // Get overview metrics with calculated total
  const overviewMetrics = useMemo(() => {
    const metrics = driverService.getOverviewMetrics();

    // Calculate total critical issues
    const total =
      metrics.criticalIssues.lowBattery +
      metrics.criticalIssues.poorSignal +
      metrics.criticalIssues.offline;

    // Return metrics with calculated total
    return {
      ...metrics,
      criticalIssues: {
        ...metrics.criticalIssues,
        total,
      },
    };
  }, [drivers]);

  // Selection handlers
  const selectDriver = useCallback((driverId: number) => {
    setSelectedDrivers([driverId]);
  }, []);

  const selectMultipleDrivers = useCallback((driverIds: number[]) => {
    setSelectedDrivers(driverIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDrivers([]);
  }, []);

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<DriverFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Sort handlers
  const updateSort = useCallback((newSort: SortOption) => {
    setSortOption(newSort);
  }, []);

  // Bulk operations handler
  const executeBulkOperation = useCallback(async (operation: BulkOperation) => {
    setIsLoading(true);
    try {
      const result = await driverService.executeBulkOperation(operation);
      if (!result) {
        setError('Bulk operation failed');
      }
      return result;
    } catch (err) {
      setError('Failed to execute bulk operation');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get driver details
  const getDriverDetails = useCallback(
    async (driverId: number): Promise<EnhancedDriver | null> => {
      try {
        const driver = await driverService.getDriverById(driverId);
        return driver || null;
      } catch (err) {
        setError('Failed to fetch driver details');
        return null;
      }
    },
    []
  );

  // Get driver timeline
  const getDriverTimeline = useCallback(
    async (driverId: number, limit?: number): Promise<ActivityEvent[]> => {
      try {
        return await driverService.getDriverTimeline(driverId, limit);
      } catch (err) {
        setError('Failed to fetch driver timeline');
        return [];
      }
    },
    []
  );

  return {
    // Data
    drivers,
    selectedDrivers,
    overviewMetrics,
    isLoading,
    error,
    filters,
    sortOption,
    // Actions
    selectDriver,
    selectMultipleDrivers,
    clearSelection,
    updateFilters,
    updateSort,
    executeBulkOperation,
    getDriverDetails,
    getDriverTimeline,
  };
};
