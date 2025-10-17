import { NextResponse } from 'next/server';
import { updateOrder } from '@/lib/orders-store';
import type { OrderStatus } from '@/types/order';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, currentLocation, path } = body;

    if (!status || !['pending', 'received', 'in_transit', 'delivered', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = updateOrder(params.id, {
      status: status as OrderStatus,
      currentLocation,
      path
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Invalid request' }, { status: 400 });
  }
}
