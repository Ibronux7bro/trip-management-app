import { NextResponse } from 'next/server';
import { getOrder, updateOrder } from '@/lib/orders-store';
import type { OrderStatus } from '@/types/order';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, price, currentLocation, path } = body as {
      status?: OrderStatus;
      price?: number;
      currentLocation?: { lat: number; lng: number };
      path?: Array<{ lat: number; lng: number }>;
    };

    const updated = updateOrder(params.id, { status, price, currentLocation, path });
    if (!updated) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Invalid JSON' }, { status: 400 });
  }
}
