import type { GpsData } from '@/types';

export const GpsDataMock: GpsData[] = [
  {
    id: 1,
    driver: 1,
    latitude: 17.385,
    longitude: 78.4867,
    speed: 0,
    timestamp: '2024-11-30T09:15:00Z',
    os_version: 'Android 13',
    battery_level: 15, // Low battery
    signal_strength: 1, // Poor signal
  },
  {
    id: 2,
    driver: 2,
    latitude: 23.0225,
    longitude: 72.5714,
    speed: 45.5,
    timestamp: '2024-11-30T09:20:00Z',
    os_version: 'Android 12',
    battery_level: 85, // Good battery
    signal_strength: 4, // Strong signal, active trip
  },
  {
    id: 3,
    driver: 3,
    latitude: 13.0827,
    longitude: 80.2707,
    speed: 0,
    timestamp: '2024-11-30T09:25:00Z',
    os_version: 'iOS 17.1',
    battery_level: 5, // Critical battery
    signal_strength: 0, // No signal, offline
  },
  {
    id: 4,
    driver: 4,
    latitude: 12.9716,
    longitude: 77.5946,
    speed: 32.8,
    timestamp: '2024-11-30T09:30:00Z',
    os_version: 'Android 14',
    battery_level: 45, // Medium battery
    signal_strength: 3, // Good signal, active trip
  },
  {
    id: 5,
    driver: 5,
    latitude: null, // Device powered off
    longitude: null,
    speed: 0,
    timestamp: '2024-11-30T09:35:00Z',
    os_version: 'Android 13',
    battery_level: 0, // Dead battery
    signal_strength: 0, // No signal
  },
  {
    id: 6,
    driver: 6,
    latitude: 18.5204,
    longitude: 73.8567,
    speed: 55.7,
    timestamp: '2024-11-30T09:40:00Z',
    os_version: 'iOS 16.5',
    battery_level: 73, // Good battery
    signal_strength: 4, // Strong signal, active trip
  },
  {
    id: 7,
    driver: 7,
    latitude: 8.5241,
    longitude: 76.9366,
    speed: 0,
    timestamp: '2024-11-30T09:45:00Z',
    os_version: 'Android 12',
    battery_level: 62, // Good battery
    signal_strength: 5, // Excellent signal, stationary
  },
  {
    id: 8,
    driver: 8,
    latitude: 17.385,
    longitude: 78.4867,
    speed: 25.9,
    timestamp: '2024-11-30T09:50:00Z',
    os_version: 'iOS 17.2',
    battery_level: 88, // Excellent battery
    signal_strength: 5, // Excellent signal, active trip
  },
  {
    id: 9,
    driver: 9,
    latitude: 22.5726,
    longitude: 88.3639,
    speed: 0,
    timestamp: '2024-11-30T08:55:00Z', // Old timestamp, not updated recently
    os_version: 'Android 13',
    battery_level: 35, // Low battery
    signal_strength: 2, // Poor signal
  },
  {
    id: 10,
    driver: 10,
    latitude: 18.5236,
    longitude: 73.8478,
    speed: 42.1,
    timestamp: '2024-11-30T10:00:00Z',
    os_version: 'Android 14',
    battery_level: 95, // Excellent battery
    signal_strength: 4, // Strong signal, active trip
  },
  {
    id: 11,
    driver: 11,
    latitude: null, // Device malfunction
    longitude: null,
    speed: null,
    timestamp: '2024-11-30T08:05:00Z', // Old timestamp
    os_version: 'iOS 16.5',
    battery_level: 28, // Low battery
    signal_strength: 0, // No signal
  },
  {
    id: 12,
    driver: 12,
    latitude: 13.0827,
    longitude: 80.2707,
    speed: 0,
    timestamp: '2024-11-30T10:10:00Z',
    os_version: 'Android 13',
    battery_level: 32, // Low battery
    signal_strength: 2, // Poor signal
  },
];

/* GPS Data Distribution:
Status Overview:
- Active & Strong Signal (4-5): 5 drivers
- Active & Weak Signal (2-3): 2 drivers
- Poor/No Signal (0-1): 3 drivers
- Device Issues (null location): 2 drivers

Battery Levels:
- Excellent (80-100%): 3
- Good (60-79%): 2
- Medium (40-59%): 1
- Low (20-39%): 3
- Critical (<20%): 2
- Dead (0%): 1

Speed States:
- Moving (>0): 5
- Stationary (0): 5
- No Data (null): 2

Device Types:
- Android: 8 (Various versions)
- iOS: 4 (Various versions)
*/
