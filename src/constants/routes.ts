import type { Route } from '@/types';

export const RoutesMock: Route[] = [
  {
    id: 1,
    route_name: 'Hyderabad Ring Road Circuit',
    start_location: 'Shamshabad RGIA',
    start_location_latitude: 17.2315,
    start_location_longitude: 78.4299,
    end_location: 'Gachibowli IT Park',
    end_location_latitude: 17.44,
    end_location_longitude: 78.3489,
    idle_time: 30, // Standard traffic route
    speed_limit: 80,
    created_at: '2024-11-30T08:00:00Z',
  },
  {
    id: 2,
    route_name: 'Secunderabad Depot Connect',
    start_location: 'Paradise Circle',
    start_location_latitude: 17.4417,
    start_location_longitude: 78.4879,
    end_location: 'Secunderabad Railway Station',
    end_location_latitude: 17.4344,
    end_location_longitude: 78.5013,
    idle_time: 45, // High traffic zone
    speed_limit: 60,
    created_at: '2024-11-30T08:15:00Z',
  },
  {
    id: 3,
    route_name: 'Industrial Corridor',
    start_location: 'Jeedimetla',
    start_location_latitude: 17.5084,
    start_location_longitude: 78.4524,
    end_location: 'Patancheru',
    end_location_latitude: 17.5326,
    end_location_longitude: 78.2646,
    idle_time: 25, // Industrial area
    speed_limit: 60,
    created_at: '2024-11-30T08:30:00Z',
  },
  {
    id: 4,
    route_name: 'IT Express Route',
    start_location: 'HITEC City',
    start_location_latitude: 17.4435,
    start_location_longitude: 78.3772,
    end_location: 'Financial District',
    end_location_latitude: 17.4147,
    end_location_longitude: 78.3816,
    idle_time: 35, // IT corridor
    speed_limit: 60,
    created_at: '2024-11-30T08:45:00Z',
  },
  {
    id: 5,
    route_name: 'Old City Heritage Route',
    start_location: 'Charminar',
    start_location_latitude: 17.3616,
    start_location_longitude: 78.4747,
    end_location: 'Golconda Fort',
    end_location_latitude: 17.3833,
    end_location_longitude: 78.4011,
    idle_time: 40, // Tourist area
    speed_limit: 40,
    created_at: '2024-11-30T09:00:00Z',
  },
  {
    id: 6,
    route_name: 'Outer Ring Road Express',
    start_location: 'Shamshabad',
    start_location_latitude: 17.2329,
    start_location_longitude: 78.429,
    end_location: 'Medchal',
    end_location_latitude: 17.6252,
    end_location_longitude: 78.4801,
    idle_time: 20, // Highway route
    speed_limit: 100,
    created_at: '2024-11-30T09:15:00Z',
  },
  {
    id: 7,
    route_name: 'Warehouse Link',
    start_location: 'Kompally',
    start_location_latitude: 17.5449,
    start_location_longitude: 78.4849,
    end_location: 'Shamirpet',
    end_location_latitude: 17.6387,
    end_location_longitude: 78.5622,
    idle_time: 30, // Industrial route
    speed_limit: 60,
    created_at: '2024-11-30T09:30:00Z',
  },
  {
    id: 8,
    route_name: 'CBD Connector',
    start_location: 'Banjara Hills',
    start_location_latitude: 17.4156,
    start_location_longitude: 78.4347,
    end_location: 'Jubilee Hills',
    end_location_latitude: 17.4319,
    end_location_longitude: 78.4073,
    idle_time: 45, // Urban area
    speed_limit: 40,
    created_at: '2024-11-30T09:45:00Z',
  },
  {
    id: 9,
    route_name: 'Airport Express',
    start_location: 'Begumpet',
    start_location_latitude: 17.4449,
    start_location_longitude: 78.4977,
    end_location: 'RGIA Terminal',
    end_location_latitude: 17.2403,
    end_location_longitude: 78.4294,
    idle_time: 25, // Airport route
    speed_limit: 80,
    created_at: '2024-11-30T10:00:00Z',
  },
  {
    id: 10,
    route_name: 'Educational Zone Route',
    start_location: 'Osmania University',
    start_location_latitude: 17.4143,
    start_location_longitude: 78.5284,
    end_location: 'BITS Pilani Hyderabad',
    end_location_latitude: 17.5453,
    end_location_longitude: 78.5738,
    idle_time: 35, // Educational zone
    speed_limit: 40,
    created_at: '2024-11-30T10:15:00Z',
  },
];

/* Route Distribution:
Total Routes: 10

Speed Limits:
- 100 km/h: 1 (Express Highway)
- 80 km/h: 2 (Main Arterial Roads)
- 60 km/h: 4 (Urban Main Roads)
- 40 km/h: 3 (Urban Internal Roads)

Idle Times:
- Low (20-25 mins): 3 routes
- Medium (30-35 mins): 4 routes
- High (40-45 mins): 3 routes

Route Types:
- Highway/Express: 2
- Industrial: 2
- Urban/City: 3
- Commercial: 2
- Tourist/Educational: 1

All coordinates are within Hyderabad metropolitan area
All routes have strategic start/end points
*/
