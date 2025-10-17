import type { SpeedReport } from '@/types';

export const SpeedReportsMock: SpeedReport[] = [
  {
    id: 1,
    trip: 7, // Anjali Deshmukh - Mini Bus in Educational Zone
    speed: 45.2, // Speed limit: 40
    start_speed_time: '2024-11-30T11:35:00Z',
    end_speed_time: '2024-11-30T11:45:00Z',
    timestamp: '2024-11-30T11:45:00Z',
    latitude: 17.5453,
    longitude: 78.5738,
  },
  {
    id: 2,
    trip: 8, // Ravi Krishnan - ORR Express
    speed: 95.5, // Within limit: 100
    start_speed_time: '2024-11-30T11:45:00Z',
    end_speed_time: '2024-11-30T12:00:00Z',
    timestamp: '2024-11-30T12:00:00Z',
    latitude: 17.6252,
    longitude: 78.4801,
  },
  {
    id: 3,
    trip: 5, // Karthik Sundaram - Airport Express
    speed: 85.2, // Speed limit: 80
    start_speed_time: '2024-11-30T10:40:00Z',
    end_speed_time: '2024-11-30T10:50:00Z',
    timestamp: '2024-11-30T10:50:00Z',
    latitude: 17.2403,
    longitude: 78.4294,
  },
  {
    id: 4,
    trip: 2, // Priya Patel - CBD Connector
    speed: 42.5, // Speed limit: 40
    start_speed_time: '2024-11-30T09:20:00Z',
    end_speed_time: '2024-11-30T09:30:00Z',
    timestamp: '2024-11-30T09:30:00Z',
    latitude: 17.4319,
    longitude: 78.4073,
  },
  {
    id: 5,
    trip: 3, // Mohammed Ishaq - Industrial Corridor
    speed: 58.5, // Within limit: 60
    start_speed_time: '2024-11-30T09:15:00Z',
    end_speed_time: '2024-11-30T09:25:00Z',
    timestamp: '2024-11-30T09:25:00Z',
    latitude: 17.5326,
    longitude: 78.2646,
  },
  {
    id: 6,
    trip: 9, // Meera Singh - Ring Road Circuit
    speed: 82.3, // Speed limit: 80
    start_speed_time: '2024-11-30T12:20:00Z',
    end_speed_time: '2024-11-30T12:30:00Z',
    timestamp: '2024-11-30T12:30:00Z',
    latitude: 17.44,
    longitude: 78.3489,
  },
  {
    id: 7,
    trip: 6, // Arun Prakash - Tanker in Warehouse Link
    speed: 65.4, // Speed limit: 60
    start_speed_time: '2024-11-30T10:40:00Z',
    end_speed_time: '2024-11-30T10:50:00Z',
    timestamp: '2024-11-30T10:50:00Z',
    latitude: 17.6387,
    longitude: 78.5622,
  },
  {
    id: 8,
    trip: 1, // Rajesh Kumar - IT Express Route
    speed: 58.8, // Within limit: 60
    start_speed_time: '2024-11-30T08:30:00Z',
    end_speed_time: '2024-11-30T08:40:00Z',
    timestamp: '2024-11-30T08:40:00Z',
    latitude: 17.4147,
    longitude: 78.3816,
  },
  {
    id: 9,
    trip: 5, // Karthik Sundaram - Second Report
    speed: 82.5, // Speed limit: 80
    start_speed_time: '2024-11-30T11:00:00Z',
    end_speed_time: '2024-11-30T11:10:00Z',
    timestamp: '2024-11-30T11:10:00Z',
    latitude: 17.241,
    longitude: 78.43,
  },
  {
    id: 10,
    trip: 8, // Ravi Krishnan - Second Report
    speed: 98.5, // Within limit: 100
    start_speed_time: '2024-11-30T12:15:00Z',
    end_speed_time: '2024-11-30T12:25:00Z',
    timestamp: '2024-11-30T12:25:00Z',
    latitude: 17.626,
    longitude: 78.481,
  },
];

/* Speed Report Distribution:
Total Reports: 10

Speed Violations:
- Minor Violations (0-5 km/h over): 3
- Moderate Violations (5-10 km/h over): 2
- Compliant Speeds: 5

Route Types:
- Highway/Express: 3 reports
- Urban Roads: 4 reports
- Industrial/Commercial: 3 reports

Time Distribution:
- Morning (8-10 AM): 3
- Mid-Day (10-12 PM): 4
- Afternoon (12-2 PM): 3

Monitoring Duration:
- All reports cover 10-15 minute periods
- Multiple reports for some trips
*/
