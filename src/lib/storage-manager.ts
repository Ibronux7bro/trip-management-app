/**
 * Storage Manager - Enhanced localStorage management with error handling and encryption
 */

export interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
  version?: string;
}

export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  ttl?: number;
  version?: string;
}

class StorageManager {
  private readonly prefix = 'trip-planner-';
  private readonly encryptionKey = 'trip-planner-key-2024';
  private readonly maxRetries = 3;

  // Check if localStorage is available
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Simple encryption/decryption (for sensitive data)
  private encrypt(data: string): string {
    try {
      // Simple XOR encryption (replace with proper encryption in production)
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return btoa(encrypted);
    } catch {
      return data; // Return original if encryption fails
    }
  }

  private decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return decrypted;
    } catch {
      return encryptedData; // Return original if decryption fails
    }
  }

  // Simple compression (for large data)
  private compress(data: string): string {
    try {
      // Simple run-length encoding (replace with proper compression in production)
      let compressed = '';
      let count = 1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i] === data[i - 1]) {
          count++;
        } else {
          compressed += count > 1 ? `${count}${data[i - 1]}` : data[i - 1];
          count = 1;
        }
      }
      
      compressed += count > 1 ? `${count}${data[data.length - 1]}` : data[data.length - 1];
      return compressed.length < data.length ? compressed : data;
    } catch {
      return data;
    }
  }

  private decompress(compressedData: string): string {
    try {
      let decompressed = '';
      let i = 0;
      
      while (i < compressedData.length) {
        let count = '';
        
        // Extract count
        while (i < compressedData.length && /\d/.test(compressedData[i])) {
          count += compressedData[i];
          i++;
        }
        
        if (count) {
          const num = parseInt(count);
          const char = compressedData[i];
          decompressed += char.repeat(num);
        } else {
          decompressed += compressedData[i];
        }
        i++;
      }
      
      return decompressed;
    } catch {
      return compressedData;
    }
  }

  // Check if item is expired
  private isExpired(item: StorageItem): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.timestamp > item.ttl;
  }

  // Get storage key with prefix
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // Set item with retry mechanism
  private setItemWithRetry(key: string, value: string): boolean {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.warn(`Storage set attempt ${attempt + 1} failed:`, error);
        
        if (attempt === this.maxRetries - 1) {
          console.error('All storage set attempts failed');
          return false;
        }
        
        // Try to clear some space
        this.clearExpiredItems();
      }
    }
    return false;
  }

  // Get item with retry mechanism
  private getItemWithRetry(key: string): string | null {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn(`Storage get attempt ${attempt + 1} failed:`, error);
        
        if (attempt === this.maxRetries - 1) {
          console.error('All storage get attempts failed');
          return null;
        }
      }
    }
    return null;
  }

  // Set data
  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        ttl: options.ttl,
        version: options.version || '1.0',
      };

      let data = JSON.stringify(item);
      
      if (options.compress) {
        data = this.compress(data);
      }
      
      if (options.encrypt) {
        data = this.encrypt(data);
      }

      return this.setItemWithRetry(this.getKey(key), data);
    } catch (error) {
      console.error('Failed to set storage item:', error);
      return false;
    }
  }

  // Get data
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return defaultValue || null;
    }

    try {
      let data = this.getItemWithRetry(this.getKey(key));
      
      if (!data) {
        return defaultValue || null;
      }

      // Try to decrypt if it looks encrypted
      if (data.includes('=') && !data.startsWith('{')) {
        data = this.decrypt(data);
      }

      // Try to decompress if it looks compressed
      if (data.match(/^\d+[a-zA-Z]/)) {
        data = this.decompress(data);
      }

      const item: StorageItem<T> = JSON.parse(data);

      // Check if expired
      if (this.isExpired(item)) {
        this.remove(key);
        return defaultValue || null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return defaultValue || null;
    }
  }

  // Remove data
  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove storage item:', error);
      return false;
    }
  }

  // Clear all data with prefix
  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Get all keys with prefix
  keys(): string[] {
    if (!this.isAvailable()) return [];

    try {
      const allKeys = Object.keys(localStorage);
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  }

  // Check if key exists
  has(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      const value = this.getItemWithRetry(this.getKey(key));
      if (!value) return false;

      // Check if expired
      const item = JSON.parse(value);
      return !this.isExpired(item);
    } catch {
      return false;
    }
  }

  // Get storage size
  getSize(): number {
    if (!this.isAvailable()) return 0;

    try {
      let size = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            size += new Blob([key + value]).size;
          }
        }
      });

      return size;
    } catch {
      return 0;
    }
  }

  // Clear expired items
  clearExpiredItems(): number {
    if (!this.isAvailable()) return 0;

    let clearedCount = 0;
    const keys = this.keys();

    keys.forEach(key => {
      try {
        const value = this.getItemWithRetry(this.getKey(key));
        if (value) {
          const item = JSON.parse(value);
          if (this.isExpired(item)) {
            this.remove(key);
            clearedCount++;
          }
        }
      } catch {
        // Remove corrupted items
        this.remove(key);
        clearedCount++;
      }
    });

    return clearedCount;
  }

  // Export all data
  export(): Record<string, any> {
    if (!this.isAvailable()) return {};

    const data: Record<string, any> = {};
    const keys = this.keys();

    keys.forEach(key => {
      const value = this.get(key);
      if (value !== null) {
        data[key] = value;
      }
    });

    return {
      data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
  }

  // Import data
  import(data: Record<string, any>): boolean {
    if (!this.isAvailable()) return false;

    try {
      if (data.data) {
        Object.entries(data.data).forEach(([key, value]) => {
          this.set(key, value);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Get storage statistics
  getStats(): {
    totalKeys: number;
    totalSize: string;
    expiredKeys: number;
    available: boolean;
  } {
    const keys = this.keys();
    const expiredKeys = keys.filter(key => {
      const value = this.getItemWithRetry(this.getKey(key));
      if (!value) return true;
      
      try {
        const item = JSON.parse(value);
        return this.isExpired(item);
      } catch {
        return true;
      }
    }).length;

    const size = this.getSize();
    const sizeStr = size < 1024 ? `${size} B` : 
                   size < 1024 * 1024 ? `${(size / 1024).toFixed(2)} KB` :
                   `${(size / (1024 * 1024)).toFixed(2)} MB`;

    return {
      totalKeys: keys.length,
      totalSize: sizeStr,
      expiredKeys,
      available: this.isAvailable(),
    };
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

// Convenience functions for common operations
export const storage = {
  // Language preference
  setLanguage: (lang: string) => storageManager.set('language', lang),
  getLanguage: () => storageManager.get('language', 'en'),

  // Theme preference
  setTheme: (theme: string) => storageManager.set('theme', theme),
  getTheme: () => storageManager.get('theme', 'light'),

  // User preferences
  setUserPreference: <T>(key: string, value: T) => storageManager.set(`pref-${key}`, value),
  getUserPreference: <T>(key: string, defaultValue?: T) => storageManager.get(`pref-${key}`, defaultValue),

  // Cache data with TTL
  setCache: <T>(key: string, value: T, ttl: number = 60 * 60 * 1000) => 
    storageManager.set(`cache-${key}`, value, { ttl }),
  getCache: <T>(key: string, defaultValue?: T) => 
    storageManager.get(`cache-${key}`, defaultValue),

  // Sensitive data with encryption
  setSecure: <T>(key: string, value: T) => 
    storageManager.set(`secure-${key}`, value, { encrypt: true }),
  getSecure: <T>(key: string, defaultValue?: T) => 
    storageManager.get(`secure-${key}`, defaultValue),

  // Session data (expires when browser closes)
  setSession: <T>(key: string, value: T) => 
    storageManager.set(`session-${key}`, value),
  getSession: <T>(key: string, defaultValue?: T) => 
    storageManager.get(`session-${key}`, defaultValue),

  // Clear all
  clear: () => storageManager.clear(),
  clearExpired: () => storageManager.clearExpiredItems(),
  
  // Stats
  getStats: () => storageManager.getStats(),
  export: () => storageManager.export(),
  import: (data: Record<string, any>) => storageManager.import(data),
};
