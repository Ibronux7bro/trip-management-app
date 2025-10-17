import type { IdleReport } from '@/types';

export const IdleReportsMock: IdleReport[] = [
  {
    id: 1,
    trip: 1, // Rajesh Kumar - IT Express Route
    start_idle_time: '2024-11-30T08:25:00Z',
    end_idle_time: '2024-11-30T08:40:00Z', // 15 mins - Traffic signal
    timestamp: '2024-11-30T08:40:00Z',
    latitude: 17.4147,
    longitude: 78.3816,
  },
  {
    id: 2,
    trip: 2, // Priya Patel - CBD Connector
    start_idle_time: '2024-11-30T09:15:00Z',
    end_idle_time: '2024-11-30T09:50:00Z', // 35 mins - Loading/unloading
    timestamp: '2024-11-30T09:50:00Z',
    latitude: 17.4319,
    longitude: 78.4073,
  },
  {
    id: 3,
    trip: 3, // Mohammed Ishaq - Industrial Corridor
    start_idle_time: '2024-11-30T09:30:00Z',
    end_idle_time: '2024-11-30T09:45:00Z', // 15 mins - Security check
    timestamp: '2024-11-30T09:45:00Z',
    latitude: 17.5326,
    longitude: 78.2646,
  },
  {
    id: 4,
    trip: 5, // Karthik Sundaram - Airport Express
    start_idle_time: '2024-11-30T10:20:00Z',
    end_idle_time: '2024-11-30T10:35:00Z', // 15 mins - Passenger pickup
    timestamp: '2024-11-30T10:35:00Z',
    latitude: 17.2403,
    longitude: 78.4294,
  },
  {
    id: 5,
    trip: 7, // Anjali Deshmukh - Educational Zone
    start_idle_time: '2024-11-30T11:40:00Z',
    end_idle_time: '2024-11-30T11:55:00Z', // 15 mins - School zone waiting
    timestamp: '2024-11-30T11:55:00Z',
    latitude: 17.5453,
    longitude: 78.5738,
  },
  {
    id: 6,
    trip: 8, // Ravi Krishnan - ORR Express
    start_idle_time: '2024-11-30T11:45:00Z',
    end_idle_time: '2024-11-30T12:00:00Z', // 15 mins - Toll plaza
    timestamp: '2024-11-30T12:00:00Z',
    latitude: 17.6252,
    longitude: 78.4801,
  },
  {
    id: 7,
    trip: 9, // Meera Singh - Ring Road Circuit
    start_idle_time: '2024-11-30T12:15:00Z',
    end_idle_time: '2024-11-30T12:25:00Z', // 10 mins - Quick stop
    timestamp: '2024-11-30T12:25:00Z',
    latitude: 17.44,
    longitude: 78.3489,
  },
  {
    id: 8,
    trip: 2, // Priya Patel - Second idle period
    start_idle_time: '2024-11-30T10:15:00Z',
    end_idle_time: '2024-11-30T10:25:00Z', // 10 mins - Traffic congestion
    timestamp: '2024-11-30T10:25:00Z',
    latitude: 17.4325,
    longitude: 78.408,
  },
  {
    id: 9,
    trip: 5, // Karthik Sundaram - Second idle period
    start_idle_time: '2024-11-30T11:10:00Z',
    end_idle_time: '2024-11-30T11:20:00Z', // 10 mins - Security check
    timestamp: '2024-11-30T11:20:00Z',
    latitude: 17.241,
    longitude: 78.43,
  },
  {
    id: 10,
    trip: 8, // Ravi Krishnan - Second idle period
    start_idle_time: '2024-11-30T12:30:00Z',
    end_idle_time: '2024-11-30T12:35:00Z', // 5 mins - Quick check
    timestamp: '2024-11-30T12:35:00Z',
    latitude: 17.626,
    longitude: 78.481,
  },
];

/* Idle Report Distribution:
Total Reports: 10

Idle Duration Categories:
- Long (30+ mins): 1 report
- Medium (15-30 mins): 5 reports
- Short (5-15 mins): 4 reports

Reasons for Idle Time:
- Traffic/Signals: 2
- Loading/Unloading: 1
- Security Checks: 2
- Passenger Operations: 2
- Toll/Checkpoints: 1
- School Zone: 1
- Quick Stops: 1

Coverage:
- 7 unique trips have idle reports
- 3 trips have multiple idle periods
- All idle periods align with trip timelines
- Locations match route coordinates
*/
