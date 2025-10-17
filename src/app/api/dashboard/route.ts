import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Starting GET /api/dashboard');
    
    // Get counts from database
    const [ordersCount, usersCount, vehiclesCount] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.vehicle.count(),
    ]);

    // Get orders by status
    const [pendingOrders, completedOrders, inProgressOrders] = await Promise.all([
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.count({ where: { status: 'in_progress' } }),
    ]);

    // Get users by role
    const [driversCount, clientsCount] = await Promise.all([
      prisma.user.count({ where: { role: 'driver' } }),
      prisma.user.count({ where: { role: 'client' } }),
    ]);

    // Get vehicles by status
    const availableVehicles = await prisma.vehicle.count({ 
      where: { status: 'available' } 
    });

    const stats = {
      drivers: {
        total: driversCount,
        available: driversCount - inProgressOrders,
        onTrip: inProgressOrders,
        offline: 0,
      },
      vehicles: {
        total: vehiclesCount,
        available: availableVehicles,
        onTrip: inProgressOrders,
        maintenance: vehiclesCount - availableVehicles,
      },
      trips: {
        total: ordersCount,
        inProgress: inProgressOrders,
        scheduled: pendingOrders,
        completed: completedOrders,
        delayed: 0,
      },
      routes: {
        total: 0,
        active: 0,
      },
      orders: {
        total: ordersCount,
        pending: pendingOrders,
        completed: completedOrders,
        inProgress: inProgressOrders,
      },
    };

    console.log('Dashboard stats:', stats);
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'خطأ غير معروف';
      
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب إحصائيات لوحة التحكم',
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
