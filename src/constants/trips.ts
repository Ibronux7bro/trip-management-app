import type { Trip } from '@/types';

export const TripsMock: Trip[] = [
  {
    id: 1,
    driver: 1, // Rajesh Kumar Sharma
    vehicle: 1, // Toyota Innova
    route: 4, // IT Express Route
    scheduled_start_time: '2024-11-30T08:00:00Z',
    start_time: '2024-11-30T08:05:00Z',
    end_time: '2024-11-30T09:30:00Z', // Completed on time
    distance_travelled: 45.2,
    current_latitude: 17.4147,
    current_longitude: 78.3816,
    total_idle_time: 25,
    current_idle_time: 0,
    current_speed: 0,
    is_speeding: false,
    created_at: '2024-11-30T07:45:00Z',
  },
  {
    id: 2,
    driver: 2, // Priya Patel
    vehicle: 5, // Hyundai Alcazar
    route: 8, // CBD Connector
    scheduled_start_time: '2024-11-30T08:30:00Z',
    start_time: '2024-11-30T08:48:00Z', // Started late
    end_time: null,
    distance_travelled: 28.7,
    current_latitude: 17.4319,
    current_longitude: 78.4073,
    total_idle_time: 35,
    current_idle_time: 5,
    current_speed: 35.5,
    is_speeding: false,
    created_at: '2024-11-30T08:15:00Z',
  },
  {
    id: 3,
    driver: 3, // Mohammed Ishaq
    vehicle: 2, // Tata Heavy Truck
    route: 3, // Industrial Corridor
    scheduled_start_time: '2024-11-30T09:00:00Z',
    start_time: '2024-11-30T09:00:00Z',
    end_time: '2024-11-30T10:15:00Z', // Completed on time
    distance_travelled: 52.3,
    current_latitude: 17.5326,
    current_longitude: 78.2646,
    total_idle_time: 20,
    current_idle_time: 0,
    current_speed: 0,
    is_speeding: false,
    created_at: '2024-11-30T08:45:00Z',
  },
  {
    id: 4,
    driver: 4, // Deepa Reddy
    vehicle: 7, // Kia Carens
    route: 5, // Old City Heritage Route
    scheduled_start_time: '2024-11-30T09:30:00Z',
    start_time: null, // Not started yet
    end_time: null,
    distance_travelled: 0,
    current_latitude: 17.3833,
    current_longitude: 78.4011,
    total_idle_time: 0,
    current_idle_time: 0,
    current_speed: 0,
    is_speeding: false,
    created_at: '2024-11-30T09:15:00Z',
  },
  {
    id: 5,
    driver: 5, // Karthik Sundaram
    vehicle: 3, // Ashok Leyland Bus
    route: 9, // Airport Express
    scheduled_start_time: '2024-11-30T10:00:00Z',
    start_time: '2024-11-30T10:05:00Z',
    end_time: null,
    distance_travelled: 32.4,
    current_latitude: 17.2403,
    current_longitude: 78.4294,
    total_idle_time: 25,
    current_idle_time: 0,
    current_speed: 65.2,
    is_speeding: false,
    created_at: '2024-11-30T09:45:00Z',
  },
  {
    id: 6,
    driver: 6, // Arun Prakash
    vehicle: 4, // Bharat Benz Tanker
    route: 7, // Warehouse Link
    scheduled_start_time: '2024-11-30T10:30:00Z',
    start_time: null, // Not started yet
    end_time: null,
    distance_travelled: 0,
    current_latitude: 17.6387,
    current_longitude: 78.5622,
    total_idle_time: 0,
    current_idle_time: 0,
    current_speed: 0,
    is_speeding: false,
    created_at: '2024-11-30T10:15:00Z',
  },
  {
    id: 7,
    driver: 7, // Anjali Deshmukh
    vehicle: 8, // Force Mini Bus
    route: 10, // Educational Zone Route
    scheduled_start_time: '2024-11-30T11:00:00Z',
    start_time: '2024-11-30T11:25:00Z', // Started late
    end_time: null,
    distance_travelled: 18.7,
    current_latitude: 17.5453,
    current_longitude: 78.5738,
    total_idle_time: 30,
    current_idle_time: 5,
    current_speed: 42.8,
    is_speeding: true, // Speeding in school zone
    created_at: '2024-11-30T10:45:00Z',
  },
  {
    id: 8,
    driver: 8, // Ravi Krishnan
    vehicle: 6, // Eicher Medium Truck
    route: 6, // Outer Ring Road Express
    scheduled_start_time: '2024-11-30T11:30:00Z',
    start_time: '2024-11-30T11:35:00Z',
    end_time: null,
    distance_travelled: 48.9,
    current_latitude: 17.6252,
    current_longitude: 78.4801,
    total_idle_time: 15,
    current_idle_time: 0,
    current_speed: 82.5,
    is_speeding: false,
    created_at: '2024-11-30T11:15:00Z',
  },
  {
    id: 9,
    driver: 9, // Meera Singh
    vehicle: 9, // Mahindra XUV700
    route: 1, // Hyderabad Ring Road Circuit
    scheduled_start_time: '2024-11-30T12:00:00Z',
    start_time: '2024-11-30T12:05:00Z',
    end_time: null,
    distance_travelled: 34.2,
    current_latitude: 17.44,
    current_longitude: 78.3489,
    total_idle_time: 20,
    current_idle_time: 0,
    current_speed: 55.6,
    is_speeding: false,
    created_at: '2024-11-30T11:45:00Z',
  },
  {
    id: 10,
    driver: 10, // Suresh Kumar
    vehicle: 10, // Volvo Heavy Truck
    route: 2, // Secunderabad Depot Connect
    scheduled_start_time: '2024-11-30T12:30:00Z',
    start_time: null, // Not started yet
    end_time: null,
    distance_travelled: 0,
    current_latitude: 17.4344,
    current_longitude: 78.5013,
    total_idle_time: 0,
    current_idle_time: 0,
    current_speed: 0,
    is_speeding: false,
    created_at: '2024-11-30T12:15:00Z',
  },
];

/* Trip Distribution:
Total Trips: 10

Status:
- Completed: 2
- In Progress: 5
- Scheduled (Not Started): 3

Trip Types:
- Passenger Transport: 4
- Goods Transport: 4
- Special Transport (Tanker/School): 2

Performance:
- On Time: 6
- Delayed Start: 2
- Speed Violations: 1
- Within Speed Limit: 9

Vehicle Usage:
- Each vehicle assigned to one trip
- Appropriate vehicle-route matching

Time Distribution:
- Morning Trips (8-10 AM): 4
- Mid-Day Trips (10-12 PM): 4
- Afternoon Trips (12-2 PM): 2
*/
