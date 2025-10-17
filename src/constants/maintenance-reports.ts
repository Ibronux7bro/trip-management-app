import type { VehicleMaintenance } from '@/types';

export const VehicleMaintenanceMock: VehicleMaintenance[] = [
  {
    id: 1,
    trip: 3, // Mohammed Ishaq - Heavy Truck
    odometer: 89720.3,
    service_type: 'Brake System Maintenance',
    service_center_name: 'Tata Authorized Service Center - Jeedimetla',
    bill_number: 'TASC/HYD/2024/1156',
    bill_amount: 12500.0,
    maintenance_time: '2024-11-15T07:30:00Z', // Preventive maintenance
  },
  {
    id: 2,
    trip: 5, // Karthik Sundaram - Bus
    odometer: 125430.8,
    service_type: 'Engine Oil Change',
    service_center_name: 'Ashok Leyland Workshop - Medchal',
    bill_number: 'ALW/MED/2024/3421',
    bill_amount: 8500.0,
    maintenance_time: '2024-11-20T09:00:00Z', // Regular service
  },
  {
    id: 3,
    trip: 7, // Anjali Deshmukh - Mini Bus
    odometer: 78920.4,
    service_type: 'Air Conditioning Service',
    service_center_name: 'Force Motors Service - Uppal',
    bill_number: 'FMS/UPL/2024/4532',
    bill_amount: 6500.0,
    maintenance_time: '2024-11-22T10:30:00Z', // AC issue
  },
  {
    id: 4,
    trip: 8, // Ravi Krishnan - Medium Truck
    odometer: 102195.6,
    service_type: 'Tire Replacement',
    service_center_name: 'Eicher Service Hub - Kompally',
    bill_number: 'ESH/KOM/2024/5643',
    bill_amount: 32000.0,
    maintenance_time: '2024-11-23T11:15:00Z', // Wear and tear
  },
  {
    id: 5,
    trip: 9, // Meera Singh - SUV
    odometer: 45780.2,
    service_type: 'Regular Service',
    service_center_name: 'Mahindra Service Center - Kukatpally',
    bill_number: 'MSC/KUK/2024/6754',
    bill_amount: 7500.0,
    maintenance_time: '2024-11-25T12:00:00Z', // Scheduled maintenance
  },
  {
    id: 6,
    trip: 2, // Priya Patel - SUV
    odometer: 35825.4,
    service_type: 'Battery Replacement',
    service_center_name: 'Hyundai Service Center - Gachibowli',
    bill_number: 'HSC/GAC/2024/7865',
    bill_amount: 8500.0,
    maintenance_time: '2024-11-26T12:45:00Z', // Battery failure
  },
  {
    id: 7,
    trip: 1, // Rajesh Kumar - Sedan
    odometer: 55575.9,
    service_type: 'Clutch Repair',
    service_center_name: 'Toyota Service - Secunderabad',
    bill_number: 'TSS/SEC/2024/8976',
    bill_amount: 15500.0,
    maintenance_time: '2024-11-27T13:30:00Z', // Clutch issue
  },
  {
    id: 8,
    trip: 6, // Arun Prakash - Tanker
    odometer: 143450.6,
    service_type: 'Suspension Service',
    service_center_name: 'Bharat Benz Workshop - Shamshabad',
    bill_number: 'BBW/SHA/2024/9087',
    bill_amount: 18900.0,
    maintenance_time: '2024-11-28T14:15:00Z', // Heavy usage wear
  },
  {
    id: 9,
    trip: 10, // Suresh Kumar - Heavy Truck
    odometer: 167890.5,
    service_type: 'Complete Engine Overhaul',
    service_center_name: 'Volvo Truck Center - Patancheru',
    bill_number: 'VTC/PAT/2024/1098',
    bill_amount: 95000.0,
    maintenance_time: '2024-11-29T15:00:00Z', // Major repair
  },
  {
    id: 10,
    trip: 4, // Deepa Reddy - MPV
    odometer: 28375.8,
    service_type: 'Wheel Alignment & Balancing',
    service_center_name: 'Kia Service - Madhapur',
    bill_number: 'KSM/MAD/2024/2109',
    bill_amount: 2500.0,
    maintenance_time: '2024-11-30T08:00:00Z', // Minor service
  },
];

/* Maintenance Report Distribution:
Total Reports: 10

Service Types:
- Major Repairs: 2 (Engine Overhaul, Clutch)
- Regular Services: 3 (Oil Change, Scheduled Maintenance)
- Component Replacements: 3 (Battery, Tires, Suspension)
- Minor Services: 2 (Wheel Alignment, AC Service)

Cost Categories:
- High (>30000): 2 reports
- Medium (10000-30000): 3 reports
- Low (<10000): 5 reports

Vehicle Types Covered:
- Heavy Vehicles: 4 (Trucks, Bus, Tanker)
- Light Vehicles: 6 (Cars, SUVs, MPV)

Timing:
- All within last 15 days
- Spread across different times
- Realistic service durations

Odometer Readings:
- High Mileage (>100k): 4 vehicles
- Medium Mileage (50k-100k): 3 vehicles
- Low Mileage (<50k): 3 vehicles
*/
