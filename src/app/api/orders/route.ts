import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listOrders } from '@/lib/orders-store';

export async function GET() {
  try {
    console.log('Starting GET /api/orders');
    
    // استخدام orders-store بدلاً من Prisma
    const orders = listOrders();

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
    const session = await getServerSession(authOptions);
    const isDevelopment = process.env.NODE_ENV === 'development';

    // In development, allow requests without authentication for testing
    if (!session && !isDevelopment) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login to create orders' },
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

    // Validate required fields
    const missingFields = [];
    if (!carType) missingFields.push('carType');
    if (!carModel) missingFields.push('carModel');
    if (!plateNumber) missingFields.push('plateNumber');
    if (!fromCity) missingFields.push('fromCity');
    if (!toCity) missingFields.push('toCity');
    if (!paymentMethod) missingFields.push('paymentMethod');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'card', 'mada', 'apple_pay'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // استخدام orders-store لإنشاء طلب جديد
    const { createOrder } = await import('@/lib/orders-store');
    const order = createOrder({
      carType,
      carModel,
      plateNumber,
      fromCity,
      toCity,
      paymentMethod,
      price: Number(price) || 0,
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
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
