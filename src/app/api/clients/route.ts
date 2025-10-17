import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'قائمة العملاء' });
}

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: معالجة بيانات العميل الجديد
  return NextResponse.json({ 
    success: true,
    data: {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
  });
}
