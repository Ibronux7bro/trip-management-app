import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authConfig } from '@/lib/auth-config';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    
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
        userId: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
