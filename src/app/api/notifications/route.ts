import { NextRequest, NextResponse } from 'next/server';
import { NotificationService, testNotifications } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'order_status_change':
        const result = await NotificationService.notifyStatusChange(
          data.orderId,
          data.status,
          data.customerEmail,
          data.customerPhone,
          data.additionalData
        );
        
        return NextResponse.json({
          success: true,
          message: 'Notification sent successfully',
          sent: result
        });

      case 'bulk_notifications':
        const bulkResult = await NotificationService.sendBulkNotifications(data.notifications);
        
        return NextResponse.json({
          success: true,
          message: 'Bulk notifications processed',
          results: bulkResult
        });

      case 'test_email':
        const emailResult = await testNotifications.testEmail(data.email);
        
        return NextResponse.json({
          success: true,
          message: 'Test email sent',
          results: emailResult
        });

      case 'test_sms':
        const smsResult = await testNotifications.testSMS(data.phone);
        
        return NextResponse.json({
          success: true,
          message: 'Test SMS sent',
          results: smsResult
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid notification type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'test') {
    // Send test notifications
    try {
      const testEmail = await testNotifications.testEmail('test@example.com');
      const testSMS = await testNotifications.testSMS('+966501234567');

      return NextResponse.json({
        success: true,
        message: 'Test notifications sent',
        results: {
          email: testEmail,
          sms: testSMS
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Test failed', error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Notification API is running',
    endpoints: {
      'POST /api/notifications': 'Send notifications',
      'GET /api/notifications?action=test': 'Test notifications'
    }
  });
}
