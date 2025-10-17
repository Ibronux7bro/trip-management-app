import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { authConfig } from '@/lib/auth-config';

// Helper function to get user role safely
function getUserRole(user: any): string {
  return user?.role || 'user';
}

export async function GET() {
  try {
    console.log('Starting GET /api/orders');
    
    // TEMPORARY: Skip authentication for testing
    // TODO: Re-enable authentication after fixing NextAuth issues
    
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log(`Found ${orders.length} orders`);
    
    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'خطأ غير معروف';
      
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب الطلبات',
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      carType,
      carModel,
      plateNumber,
      fromCity,
      toCity,
      paymentMethod,
      price = 0,
    } = body;

    if (!carType || !carModel || !plateNumber || !fromCity || !toCity || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        carType,
        carModel,
        plateNumber,
        fromCity,
        toCity,
        paymentMethod,
        price: Number(price) || 0,
        status: 'pending',
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
