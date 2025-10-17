import { NextRequest, NextResponse } from 'next/server';
import type { Vehicle, VehicleFormData, MaintenanceLog, AccidentLog } from '@/types/vehicle';

// Mock data - in real app, this would be in a database
const vehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'ABC-1234',
    vehicleType: 'Truck',
    model: 'Toyota Hiace',
    year: 2022,
    status: 'Available',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    plateNumber: 'XYZ-5678',
    vehicleType: 'Car',
    model: 'Honda Civic',
    year: 2021,
    status: 'Maintenance',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    plateNumber: 'DEF-9012',
    vehicleType: 'Bus',
    model: 'Mercedes Sprinter',
    year: 2023,
    status: 'Available',
    createdAt: '2024-01-12T12:15:00Z',
    updatedAt: '2024-01-12T12:15:00Z',
  },
];

const maintenanceLogs: MaintenanceLog[] = [
  {
    id: '1',
    vehicleId: '1',
    date: '2024-01-10T10:00:00Z',
    description: 'Oil change and filter replacement',
    cost: 250,
    nextDue: '2024-04-10T10:00:00Z',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    vehicleId: '2',
    date: '2024-01-16T14:00:00Z',
    description: 'Brake pad replacement',
    cost: 450,
    nextDue: '2024-07-16T14:00:00Z',
    createdAt: '2024-01-16T14:00:00Z',
  },
];

const accidentLogs: AccidentLog[] = [
  {
    id: '1',
    vehicleId: '2',
    date: '2024-01-05T16:30:00Z',
    description: 'Minor collision with parking barrier',
    severity: 'Minor',
    createdAt: '2024-01-05T16:30:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Add maintenance and accident logs
    const vehicleWithLogs = {
      ...vehicle,
      maintenanceLogs: maintenanceLogs.filter(log => log.vehicleId === id),
      accidentLogs: accidentLogs.filter(log => log.vehicleId === id),
    };

    return NextResponse.json({
      success: true,
      data: vehicleWithLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: VehicleFormData = await request.json();
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!data.plateNumber || !data.vehicleType || !data.model || !data.year || !data.status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if plate number already exists (excluding current vehicle)
    const existingVehicle = vehicles.find(v => v.plateNumber === data.plateNumber && v.id !== id);
    if (existingVehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle with this plate number already exists' },
        { status: 400 }
      );
    }

    // Update vehicle
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: 'Vehicle updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Instead of deleting, mark as archived (change status to "Out of Service")
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: 'Out of Service',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Vehicle archived successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to archive vehicle' },
      { status: 500 }
    );
  }
}
