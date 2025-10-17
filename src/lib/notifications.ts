// Notification service for email and SMS
export interface NotificationData {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface SMSTemplate {
  message: string;
}

// Email templates for different order statuses
const emailTemplates: Record<string, (data: NotificationData) => EmailTemplate> = {
  received: (data) => ({
    subject: `Order Confirmation - ${data.orderId}`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>Order Confirmed!</h1>
          <p>Your shipment is now in our system</p>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${data.customerName},</h2>
          <p>We've received your order and it's being processed.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
          </div>
          
          <p>You can track your order anytime at: <a href="https://nukhbat-naql.sa/tracking">Track Your Order</a></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Thank you for choosing Nukhbat Al-Naql<br>
              For support: support@nukhbat-naql.sa | +966 50 123 4567
            </p>
          </div>
        </div>
      </div>
    `,
    textBody: `
Order Confirmed - ${data.orderId}

Hello ${data.customerName},

We've received your order and it's being processed.

Order Details:
- Order ID: ${data.orderId}
- Status: ${data.status}
${data.estimatedDelivery ? `- Estimated Delivery: ${data.estimatedDelivery}` : ''}

Track your order: https://nukhbat-naql.sa/tracking

Thank you for choosing Nukhbat Al-Naql
Support: support@nukhbat-naql.sa | +966 50 123 4567
    `
  }),

  in_transit: (data) => ({
    subject: `Your Order is On the Way - ${data.orderId}`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; text-align: center;">
          <h1>📦 On the Way!</h1>
          <p>Your package is being delivered</p>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${data.customerName},</h2>
          <p>Great news! Your order is now on the way to you.</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Delivery Information:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Status:</strong> In Transit</p>
            ${data.currentLocation ? `<p><strong>Current Location:</strong> ${data.currentLocation}</p>` : ''}
            ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
          </div>
          
          ${data.driverName ? `
          <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Driver:</h3>
            <p><strong>Name:</strong> ${data.driverName}</p>
            ${data.driverPhone ? `<p><strong>Phone:</strong> ${data.driverPhone}</p>` : ''}
          </div>
          ` : ''}
          
          <p>Track your order in real-time: <a href="https://nukhbat-naql.sa/tracking">Live Tracking</a></p>
        </div>
      </div>
    `,
    textBody: `
Your Order is On the Way - ${data.orderId}

Hello ${data.customerName},

Great news! Your order is now on the way to you.

Delivery Information:
- Order ID: ${data.orderId}
- Status: In Transit
${data.currentLocation ? `- Current Location: ${data.currentLocation}` : ''}
${data.estimatedDelivery ? `- Estimated Delivery: ${data.estimatedDelivery}` : ''}

${data.driverName ? `Your Driver: ${data.driverName}${data.driverPhone ? ` (${data.driverPhone})` : ''}` : ''}

Track live: https://nukhbat-naql.sa/tracking
    `
  }),

  delivered: (data) => ({
    subject: `Package Delivered Successfully - ${data.orderId}`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center;">
          <h1>✅ Delivered!</h1>
          <p>Your package has been successfully delivered</p>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${data.customerName},</h2>
          <p>Your order has been successfully delivered!</p>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Delivery Confirmation:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Status:</strong> Delivered</p>
            <p><strong>Delivered at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>We hope you're satisfied with our service. Please rate your experience!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nukhbat-naql.sa/feedback" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Rate Our Service</a>
          </div>
        </div>
      </div>
    `,
    textBody: `
Package Delivered Successfully - ${data.orderId}

Hello ${data.customerName},

Your order has been successfully delivered!

Delivery Confirmation:
- Order ID: ${data.orderId}
- Status: Delivered
- Delivered at: ${new Date().toLocaleString()}

Please rate our service: https://nukhbat-naql.sa/feedback

Thank you for choosing Nukhbat Al-Naql!
    `
  })
};

// SMS templates for different order statuses
const smsTemplates: Record<string, (data: NotificationData) => SMSTemplate> = {
  received: (data) => ({
    message: `Nukhbat Al-Naql: Order ${data.orderId} confirmed! Track at nukhbat-naql.sa/tracking. Support: +966501234567`
  }),

  in_transit: (data) => ({
    message: `Nukhbat Al-Naql: Your order ${data.orderId} is on the way! ${data.estimatedDelivery ? `ETA: ${data.estimatedDelivery}` : ''} Track live: nukhbat-naql.sa/tracking`
  }),

  delivered: (data) => ({
    message: `Nukhbat Al-Naql: Order ${data.orderId} delivered successfully! Rate us: nukhbat-naql.sa/feedback. Thank you!`
  }),

  delayed: (data) => ({
    message: `Nukhbat Al-Naql: Order ${data.orderId} is delayed. ${data.estimatedDelivery ? `New ETA: ${data.estimatedDelivery}` : ''} Sorry for inconvenience. Support: +966501234567`
  })
};

// Mock email service
export class EmailService {
  static async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with services like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Postmark
      
      console.log('📧 Sending Email:', {
        to,
        subject: template.subject,
        htmlBody: template.htmlBody.substring(0, 100) + '...',
        textBody: template.textBody.substring(0, 100) + '...'
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (success) {
        console.log('✅ Email sent successfully to:', to);
        return true;
      } else {
        console.log('❌ Email failed to send to:', to);
        return false;
      }
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

// Mock SMS service
export class SMSService {
  static async sendSMS(to: string, template: SMSTemplate): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with services like:
      // - Twilio
      // - AWS SNS
      // - Unifonic (Saudi Arabia)
      // - Taqnyat (Saudi Arabia)
      
      console.log('📱 Sending SMS:', {
        to,
        message: template.message
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate 98% success rate for SMS
      const success = Math.random() > 0.02;
      
      if (success) {
        console.log('✅ SMS sent successfully to:', to);
        return true;
      } else {
        console.log('❌ SMS failed to send to:', to);
        return false;
      }
    } catch (error) {
      console.error('SMS service error:', error);
      return false;
    }
  }
}

// Main notification service
export class NotificationService {
  static async sendOrderNotification(data: NotificationData): Promise<{
    emailSent: boolean;
    smsSent: boolean;
  }> {
    const results = {
      emailSent: false,
      smsSent: false
    };

    // Send email notification
    if (data.customerEmail && emailTemplates[data.status]) {
      const emailTemplate = emailTemplates[data.status](data);
      results.emailSent = await EmailService.sendEmail(data.customerEmail, emailTemplate);
    }

    // Send SMS notification
    if (data.customerPhone && smsTemplates[data.status]) {
      const smsTemplate = smsTemplates[data.status](data);
      results.smsSent = await SMSService.sendSMS(data.customerPhone, smsTemplate);
    }

    return results;
  }

  // Send bulk notifications for multiple orders
  static async sendBulkNotifications(notifications: NotificationData[]): Promise<{
    totalSent: number;
    emailsSent: number;
    smsSent: number;
    failed: number;
  }> {
    const results = {
      totalSent: 0,
      emailsSent: 0,
      smsSent: 0,
      failed: 0
    };

    for (const notification of notifications) {
      try {
        const result = await this.sendOrderNotification(notification);
        
        if (result.emailSent) results.emailsSent++;
        if (result.smsSent) results.smsSent++;
        if (result.emailSent || result.smsSent) results.totalSent++;
        if (!result.emailSent && !result.smsSent) results.failed++;
        
      } catch (error) {
        console.error('Bulk notification error:', error);
        results.failed++;
      }
    }

    return results;
  }

  // Send notification when order status changes
  static async notifyStatusChange(
    orderId: string,
    newStatus: string,
    customerEmail?: string,
    customerPhone?: string,
    additionalData?: Partial<NotificationData>
  ): Promise<boolean> {
    const notificationData: NotificationData = {
      orderId,
      customerName: additionalData?.customerName || 'Valued Customer',
      customerEmail,
      customerPhone,
      status: newStatus,
      currentLocation: additionalData?.currentLocation,
      estimatedDelivery: additionalData?.estimatedDelivery,
      driverName: additionalData?.driverName,
      driverPhone: additionalData?.driverPhone
    };

    const result = await this.sendOrderNotification(notificationData);
    return result.emailSent || result.smsSent;
  }
}

// Utility functions for testing
export const testNotifications = {
  async testEmail(customerEmail: string) {
    const testData: NotificationData = {
      orderId: 'TEST-001',
      customerName: 'Test Customer',
      customerEmail,
      status: 'in_transit',
      currentLocation: 'Riyadh, King Fahd Road',
      estimatedDelivery: '2024-01-20 14:30',
      driverName: 'Ahmed Al-Rashid',
      driverPhone: '+966501234567'
    };

    return await NotificationService.sendOrderNotification(testData);
  },

  async testSMS(customerPhone: string) {
    const testData: NotificationData = {
      orderId: 'TEST-002',
      customerName: 'Test Customer',
      customerPhone,
      status: 'delivered'
    };

    return await NotificationService.sendOrderNotification(testData);
  }
};
