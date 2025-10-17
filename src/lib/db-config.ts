/**
 * Database Configuration
 * Centralized configuration for database operations
 */

export interface DatabaseConfig {
  name: string;
  version: number;
  storage: {
    type: 'localStorage' | 'indexedDB' | 'remote';
    prefix: string;
    encryption: boolean;
    compression: boolean;
  };
  backup: {
    enabled: boolean;
    interval: number; // in milliseconds
    maxBackups: number;
    autoCleanup: boolean;
  };
  cache: {
    enabled: boolean;
    ttl: number; // time to live in milliseconds
    maxSize: number; // maximum cache size in bytes
  };
  sync: {
    enabled: boolean;
    interval: number; // sync interval in milliseconds
    conflictResolution: 'local' | 'remote' | 'manual';
  };
}

export const DB_CONFIG: DatabaseConfig = {
  name: 'trip-planner-database',
  version: 1,
  storage: {
    type: 'localStorage',
    prefix: 'trip-planner-',
    encryption: false, // Enable for production
    compression: false, // Enable for large datasets
  },
  backup: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000, // 24 hours
    maxBackups: 7, // Keep 7 days of backups
    autoCleanup: true,
  },
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  sync: {
    enabled: false, // Enable when implementing remote sync
    interval: 30 * 1000, // 30 seconds
    conflictResolution: 'local',
  },
};

// Environment-specific configurations
export const getEnvironmentConfig = (): Partial<DatabaseConfig> => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isDevelopment) {
    return {
      backup: {
        enabled: false, // Disable auto-backup in development
        interval: 0,
        maxBackups: 3,
        autoCleanup: true,
      },
      cache: {
        enabled: false, // Disable cache in development for easier debugging
        ttl: 0,
        maxSize: 0,
      },
    };
  }

  if (isProduction) {
    return {
      storage: {
        type: 'localStorage',
        prefix: 'trip-planner-',
        encryption: true, // Enable encryption in production
        compression: true, // Enable compression in production
      },
      backup: {
        enabled: true,
        interval: 6 * 60 * 60 * 1000, // 6 hours in production
        maxBackups: 30, // Keep 30 days of backups
        autoCleanup: true,
      },
      cache: {
        enabled: true,
        ttl: 15 * 60 * 1000, // 15 minutes in production
        maxSize: 50 * 1024 * 1024, // 50MB in production
      },
    };
  }

  return {};
};

// Merge environment config with base config
export const getConfig = (): DatabaseConfig => {
  const envConfig = getEnvironmentConfig();
  return {
    ...DB_CONFIG,
    ...envConfig,
    storage: {
      ...DB_CONFIG.storage,
      ...envConfig.storage,
    },
    backup: {
      ...DB_CONFIG.backup,
      ...envConfig.backup,
    },
    cache: {
      ...DB_CONFIG.cache,
      ...envConfig.cache,
    },
    sync: {
      ...DB_CONFIG.sync,
      ...envConfig.sync,
    },
  };
};

// Validation functions
export const validateConfig = (config: DatabaseConfig): string[] => {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length === 0) {
    errors.push('Database name is required');
  }

  if (config.version < 1) {
    errors.push('Database version must be at least 1');
  }

  if (config.backup.interval < 0) {
    errors.push('Backup interval must be non-negative');
  }

  if (config.backup.maxBackups < 1) {
    errors.push('Maximum backups must be at least 1');
  }

  if (config.cache.ttl < 0) {
    errors.push('Cache TTL must be non-negative');
  }

  if (config.cache.maxSize < 0) {
    errors.push('Cache max size must be non-negative');
  }

  if (config.sync.interval < 0) {
    errors.push('Sync interval must be non-negative');
  }

  return errors;
};

// Migration utilities
export const getMigrationVersion = (): number => {
  if (typeof window === 'undefined') return 1;
  
  try {
    const version = localStorage.getItem(`${DB_CONFIG.storage.prefix}db-version`);
    return version ? parseInt(version, 10) : 1;
  } catch {
    return 1;
  }
};

export const setMigrationVersion = (version: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${DB_CONFIG.storage.prefix}db-version`, version.toString());
  } catch (error) {
    console.error('Failed to set migration version:', error);
  }
};

// Schema versioning
export const SCHEMA_VERSIONS = {
  1: {
    orders: ['id', 'carType', 'carModel', 'plateNumber', 'fromCity', 'toCity', 'paymentMethod', 'price', 'status', 'createdAt'],
    vehicles: ['id', 'plateNumber', 'vehicleType', 'model', 'year', 'status', 'createdAt', 'updatedAt'],
    drivers: ['id', 'fullname', 'gender', 'dob', 'contact', 'address', 'state', 'zipcode', 'license_number', 'license_expiry', 'created_at'],
  },
  // Add future schema versions here
} as const;

export const getCurrentSchema = (version: number = DB_CONFIG.version) => {
  return SCHEMA_VERSIONS[version as keyof typeof SCHEMA_VERSIONS] || SCHEMA_VERSIONS[1];
};

export const validateSchema = (data: any[], schema: string[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return true;
  
  const sampleItem = data[0];
  return schema.every(field => field in sampleItem);
};

// Performance monitoring
export const performanceMetrics = {
  operations: {
    read: 0,
    write: 0,
    delete: 0,
  },
  errors: {
    read: 0,
    write: 0,
    delete: 0,
  },
  lastOperation: null as string | null,
  lastError: null as string | null,
};

export const trackOperation = (operation: 'read' | 'write' | 'delete', success: boolean, error?: string) => {
  if (success) {
    performanceMetrics.operations[operation]++;
    performanceMetrics.lastOperation = operation;
  } else {
    performanceMetrics.errors[operation]++;
    performanceMetrics.lastError = error || 'Unknown error';
  }
};

export const getPerformanceStats = () => {
  const totalOperations = Object.values(performanceMetrics.operations).reduce((sum, count) => sum + count, 0);
  const totalErrors = Object.values(performanceMetrics.errors).reduce((sum, count) => sum + count, 0);
  
  return {
    ...performanceMetrics,
    successRate: totalOperations > 0 ? ((totalOperations - totalErrors) / totalOperations) * 100 : 100,
    totalOperations,
    totalErrors,
  };
};

export const resetPerformanceMetrics = () => {
  performanceMetrics.operations = { read: 0, write: 0, delete: 0 };
  performanceMetrics.errors = { read: 0, write: 0, delete: 0 };
  performanceMetrics.lastOperation = null;
  performanceMetrics.lastError = null;
};
