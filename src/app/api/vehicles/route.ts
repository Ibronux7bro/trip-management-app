import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const plateNumber = searchParams.get('plateNumber');
    const status = searchParams.get('status');
    const type = searchParams.get('vehicleType');

    // Build where clause
    const where: any = {};
    if (plateNumber) {
      where.plateNumber = { contains: plateNumber };
    }
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    // Get total count
    const total = await prisma.vehicle.count({ where });

    // Get paginated vehicles
    const vehicles = await prisma.vehicle.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: vehicles,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error in GET /api/vehicles:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch vehicles',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.plateNumber || !data.type || !data.model || !data.year || !data.status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if plate number already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: data.plateNumber }
    });
    
    if (existingVehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle with this plate number already exists' },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        plateNumber: data.plateNumber,
        type: data.type,
        model: data.model,
        year: data.year,
        status: data.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/vehicles:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
