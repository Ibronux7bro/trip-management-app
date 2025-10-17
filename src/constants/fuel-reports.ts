import type { FuelInfo } from '@/types';

export const FuelInfoMock: FuelInfo[] = [
  {
    id: 1,
    trip: 1, // Rajesh Kumar - Toyota Innova
    odometer: 55580.5,
    fuel_filled: 35.8,
    bill_number: 'HP/HYD/2024/1156',
    fuel_cost: 3723.2, // Rs 104/liter
    fuel_filled_time: '2024-11-30T07:45:00Z', // Before trip start
  },
  {
    id: 2,
    trip: 3, // Mohammed Ishaq - Heavy Truck
    odometer: 89725.7,
    fuel_filled: 85.5,
    bill_number: 'IOC/JDM/2024/3421',
    fuel_cost: 7695.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T08:45:00Z',
  },
  {
    id: 3,
    trip: 5, // Karthik Sundaram - Bus
    odometer: 125435.8,
    fuel_filled: 92.3,
    bill_number: 'BP/SEC/2024/4532',
    fuel_cost: 8307.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T09:45:00Z',
  },
  {
    id: 4,
    trip: 8, // Ravi Krishnan - Medium Truck
    odometer: 102200.4,
    fuel_filled: 75.5,
    bill_number: 'HP/KOM/2024/5643',
    fuel_cost: 6795.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T11:15:00Z',
  },
  {
    id: 5,
    trip: 2, // Priya Patel - Hyundai Alcazar
    odometer: 35830.2,
    fuel_filled: 42.5,
    bill_number: 'IOC/GCB/2024/6754',
    fuel_cost: 4420.0, // Rs 104/liter
    fuel_filled_time: '2024-11-30T08:15:00Z',
  },
  {
    id: 6,
    trip: 7, // Anjali Deshmukh - Mini Bus
    odometer: 78925.8,
    fuel_filled: 65.8,
    bill_number: 'BP/UPL/2024/7865',
    fuel_cost: 5922.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T11:00:00Z',
  },
  {
    id: 7,
    trip: 9, // Meera Singh - Mahindra XUV700
    odometer: 45785.7,
    fuel_filled: 45.2,
    bill_number: 'HP/KUK/2024/8976',
    fuel_cost: 4700.8, // Rs 104/liter
    fuel_filled_time: '2024-11-30T11:45:00Z',
  },
  {
    id: 8,
    trip: 6, // Arun Prakash - Tanker
    odometer: 143455.4,
    fuel_filled: 120.5,
    bill_number: 'IOC/SHA/2024/9087',
    fuel_cost: 10845.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T10:15:00Z',
  },
  {
    id: 9,
    trip: 10, // Suresh Kumar - Heavy Truck
    odometer: 167895.6,
    fuel_filled: 110.8,
    bill_number: 'BP/PAT/2024/1098',
    fuel_cost: 9972.0, // Rs 90/liter - Diesel
    fuel_filled_time: '2024-11-30T12:15:00Z',
  },
  {
    id: 10,
    trip: 4, // Deepa Reddy - Kia Carens
    odometer: 28380.5,
    fuel_filled: 38.5,
    bill_number: 'HP/MAD/2024/2109',
    fuel_cost: 4004.0, // Rs 104/liter
    fuel_filled_time: '2024-11-30T09:15:00Z',
  },
];

/* Fuel Report Distribution:
Total Reports: 10

Fuel Types & Costs:
- Petrol (₹104/liter): 4 vehicles (Cars & SUVs)
- Diesel (₹90/liter): 6 vehicles (Trucks, Buses, Tanker)

Fill Quantities:
- Large (>100L): 2 (Heavy vehicles)
- Medium (50-100L): 4 (Buses, Medium trucks)
- Small (<50L): 4 (Cars, SUVs)

Timing:
- All within current operational day
- Filled before trip starts
- Logical filling sequence

Cost Categories:
- High (>8000): 2 reports
- Medium (5000-8000): 3 reports
- Low (<5000): 5 reports

Vendors:
- HP: 4 stations
- Indian Oil: 3 stations
- BP: 3 stations

Odometer Readings:
- Consistent with maintenance reports
- Shows logical progression
*/
