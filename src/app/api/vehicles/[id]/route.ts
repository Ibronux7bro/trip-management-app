import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { VehicleFormData } from '@/types/vehicle';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: true,
        trips: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Error in GET /api/vehicles/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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
    const data = await request.json();
    
    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    });
    
    if (!existingVehicle) {
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
    if (data.plateNumber !== existingVehicle.plateNumber) {
      const duplicateVehicle = await prisma.vehicle.findUnique({
        where: { plateNumber: data.plateNumber }
      });
      
      if (duplicateVehicle) {
        return NextResponse.json(
          { success: false, message: 'Vehicle with this plate number already exists' },
          { status: 400 }
        );
      }
    }

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber: data.plateNumber,
        vehicleType: data.vehicleType,
        model: data.model,
        year: data.year,
        status: data.status,
        capacity: data.capacity,
        fuelType: data.fuelType,
        mileage: data.mileage,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/vehicles/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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
    
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        trips: {
          where: {
            status: { in: ['scheduled', 'in_progress'] }
          }
        }
      }
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Check if vehicle has active trips
    if (vehicle.trips && vehicle.trips.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete vehicle with active trips' },
        { status: 400 }
      );
    }

    // Delete the vehicle
    await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/vehicles/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
