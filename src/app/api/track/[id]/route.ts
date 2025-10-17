import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/orders-store';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  const payload = {
    id: order.id,
    status: order.status,
    currentLocation: order.currentLocation || { lat: 24.7136, lng: 46.6753 },
    path: order.path || [],
    fromCity: order.fromCity,
    toCity: order.toCity,
  };

  return NextResponse.json(payload);
}
