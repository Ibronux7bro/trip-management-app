import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to verify API functionality
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  const testResults = {
    timestamp: new Date().toISOString(),
    endpoints: {
      booking: {
        post: '/api/clients/booking',
        get: '/api/clients/booking?clientId=CLIENT-001',
        description: 'إنشاء وجلب الحجوزات'
      },
      tracking: {
        get: '/api/clients/tracking/BK-1234567890',
        patch: '/api/clients/tracking/BK-1234567890',
        description: 'تتبع الشحنات وتحديث الحالة'
      },
      support: {
        post: '/api/clients/support',
        get: '/api/clients/support?clientId=CLIENT-001',
        description: 'إنشاء وجلب تذاكر الدعم'
      },
      supportReply: {
        post: '/api/clients/support/TKT-1234567890/reply',
        get: '/api/clients/support/TKT-1234567890/reply?clientId=CLIENT-001',
        description: 'إضافة وجلب ردود الدعم'
      }
    },
    sampleRequests: {
      booking: {
        method: 'POST',
        url: '/api/clients/booking',
        body: {
          fromCity: 'الرياض',
          toCity: 'جدة',
          vehicleType: 'medium',
          clientId: 'CLIENT-001',
          senderName: 'أحمد محمد',
          senderPhone: '0501234567',
          receiverName: 'فاطمة علي',
          receiverPhone: '0507654321',
          receiverAddress: 'شارع الملك فهد، جدة',
          notes: 'يرجى التعامل بحذر'
        }
      },
      support: {
        method: 'POST',
        url: '/api/clients/support',
        body: {
          subject: 'استفسار عن الشحنة',
          message: 'أريد معرفة موعد وصول شحنتي',
          clientId: 'CLIENT-001',
          category: 'tracking',
          priority: 'medium'
        }
      }
    }
  };

  if (endpoint) {
    return NextResponse.json({
      success: true,
      message: `معلومات اختبار نقطة النهاية: ${endpoint}`,
      data: testResults.endpoints[endpoint] || 'نقطة نهاية غير موجودة'
    });
  }

  return NextResponse.json({
    success: true,
    message: 'جميع نقاط النهاية جاهزة للاختبار',
    data: testResults
  });
}

// Test endpoint with sample data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (testType === 'booking') {
      // Test booking endpoint
      const bookingResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/clients/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: 'الرياض',
          toCity: 'جدة',
          vehicleType: 'medium',
          clientId: 'TEST-CLIENT',
          senderName: 'اختبار المرسل',
          senderPhone: '0501234567',
          receiverName: 'اختبار المستقبل',
          receiverPhone: '0507654321',
          receiverAddress: 'عنوان اختبار',
          notes: 'هذا اختبار'
        })
      });

      const result = await bookingResponse.json();
      return NextResponse.json({
        success: true,
        message: 'تم اختبار نقطة نهاية الحجز',
        data: result
      });
    }

    if (testType === 'support') {
      // Test support endpoint
      const supportResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/clients/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'تذكرة اختبار',
          message: 'هذه رسالة اختبار للدعم الفني',
          clientId: 'TEST-CLIENT',
          category: 'general',
          priority: 'low'
        })
      });

      const result = await supportResponse.json();
      return NextResponse.json({
        success: true,
        message: 'تم اختبار نقطة نهاية الدعم',
        data: result
      });
    }

    return NextResponse.json({
      success: false,
      message: 'نوع اختبار غير صحيح. استخدم: booking أو support'
    }, { status: 400 });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ أثناء الاختبار'
    }, { status: 500 });
  }
}
