import type { Driver } from '@/types';

export const Drivers: Driver[] = [
  {
    id: 1,
    fullname: 'Rajesh Kumar Sharma',
    gender: 'Male',
    dob: '1988-05-15T00:00:00Z',
    contact: '+91-9876543210',
    address: '42/A, Nehru Street, Andheri East',
    state: 'Maharashtra',
    zipcode: '400069',
    license_number: 'MH0220180012345',
    license_expiry: '2025-05-14T00:00:00Z', // Valid license
    created_at: '2023-01-10T08:30:00Z',
  },
  {
    id: 2,
    fullname: 'Priya Patel',
    gender: 'Female',
    dob: '1992-07-22T00:00:00Z',
    contact: '+91-9876543211',
    address: '15, Gandhi Road, Navrangpura',
    state: 'Gujarat',
    zipcode: '380009',
    license_number: 'GJ0120190054321',
    license_expiry: '2024-12-31T00:00:00Z', // License expiring soon
    created_at: '2023-02-01T09:15:00Z',
  },
  {
    id: 3,
    fullname: 'Mohammed Ishaq',
    gender: 'Male',
    dob: '1990-03-18T00:00:00Z',
    contact: '+91-9876543212',
    address: '28/4, Tank Bund Road',
    state: 'Telangana',
    zipcode: '500001',
    license_number: 'TS0720200078901',
    license_expiry: '2025-08-20T00:00:00Z',
    created_at: '2023-03-15T10:45:00Z',
  },
  {
    id: 4,
    fullname: 'Deepa Reddy',
    gender: 'Female',
    dob: '1989-11-30T00:00:00Z',
    contact: '+91-9876543213',
    address: 'Plot 123, KPHB Colony',
    state: 'Telangana',
    zipcode: '500072',
    license_number: 'TS0520170065432',
    license_expiry: '2025-06-30T00:00:00Z',
    created_at: '2023-04-01T11:20:00Z',
  },
  {
    id: 5,
    fullname: 'Karthik Sundaram',
    gender: 'Male',
    dob: '1991-04-18T00:00:00Z',
    contact: '+91-9876543214',
    address: '45/2, Anna Nagar',
    state: 'Tamil Nadu',
    zipcode: '600040',
    license_number: 'TN0720180089012',
    license_expiry: '2024-09-15T00:00:00Z', // License expiring soon
    created_at: '2023-05-01T12:30:00Z',
  },
  {
    id: 6,
    fullname: 'Arun Prakash',
    gender: 'Male',
    dob: '1987-09-05T00:00:00Z',
    contact: '+91-9876543215',
    address: '67, MG Road, Bangalore South',
    state: 'Karnataka',
    zipcode: '560001',
    license_number: 'KA0120180089012',
    license_expiry: '2025-08-20T00:00:00Z',
    created_at: '2023-06-15T13:10:00Z',
  },
  {
    id: 7,
    fullname: 'Anjali Deshmukh',
    gender: 'Female',
    dob: '1993-12-12T00:00:00Z',
    contact: '+91-9876543216',
    address: '78, FC Road, Pune',
    state: 'Maharashtra',
    zipcode: '411005',
    license_number: 'MH1220190090123',
    license_expiry: '2024-11-30T00:00:00Z',
    created_at: '2023-07-01T14:25:00Z',
  },
  {
    id: 8,
    fullname: 'Ravi Krishnan',
    gender: 'Male',
    dob: '1989-02-28T00:00:00Z',
    contact: '+91-9876543217',
    address: '32/1, Marine Drive',
    state: 'Kerala',
    zipcode: '682001',
    license_number: 'KL0320180012345',
    license_expiry: '2025-04-10T00:00:00Z',
    created_at: '2023-07-15T15:40:00Z',
  },
  {
    id: 9,
    fullname: 'Meera Singh',
    gender: 'Female',
    dob: '1991-06-15T00:00:00Z',
    contact: '+91-9876543218',
    address: 'Plot 56, Sector 18',
    state: 'Uttar Pradesh',
    zipcode: '201301',
    license_number: 'UP1620200078901',
    license_expiry: '2024-10-25T00:00:00Z',
    created_at: '2023-08-01T16:55:00Z',
  },
  {
    id: 10,
    fullname: 'Suresh Kumar',
    gender: 'Male',
    dob: '1986-08-20T00:00:00Z',
    contact: '+91-9876543219',
    address: 'Plot 78, Electronic City',
    state: 'Karnataka',
    zipcode: '560100',
    license_number: 'KA0220190034567',
    license_expiry: '2025-07-15T00:00:00Z',
    created_at: '2023-08-15T17:30:00Z',
  },
  {
    id: 11,
    fullname: 'Kavita Joshi',
    gender: 'Female',
    dob: '1994-03-25T00:00:00Z',
    contact: '+91-9876543220',
    address: '89/B, Shivaji Nagar',
    state: 'Maharashtra',
    zipcode: '411004',
    license_number: 'MH0420200045678',
    license_expiry: '2025-02-28T00:00:00Z',
    created_at: '2023-09-01T18:45:00Z',
  },
  {
    id: 12,
    fullname: 'Abdul Rahman',
    gender: 'Male',
    dob: '1990-08-10T00:00:00Z',
    contact: '+91-9876543221',
    address: '23/C, Abids Road',
    state: 'Telangana',
    zipcode: '500001',
    license_number: 'TS0520180056789',
    license_expiry: '2025-09-30T00:00:00Z',
    created_at: '2023-09-15T19:20:00Z',
  },
];

/* Driver Distribution:
Total Drivers: 12
Gender Distribution: 8 Male (67%), 4 Female (33%)
License Status:
- Valid (expires 2025+): 8
- Expiring Soon (within 6 months): 4

State Distribution:
- Maharashtra: 3
- Telangana: 3
- Karnataka: 2
- Others: 4 (Gujarat, Tamil Nadu, Kerala, Uttar Pradesh)

Creation Date Range: Jan 2023 - Sep 2023
*/
