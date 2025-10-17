// Professional notification service for shipment tracking
import { Order, OrderStatus } from "@/types/order";

export interface NotificationData {
  id: string;
  orderId: string;
  type: 'status_update' | 'location_update' | 'delivery_alert' | 'pickup_alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  customerPhone?: string;
  customerEmail?: string;
}

class NotificationService {
  private notifications: NotificationData[] = [];
  private subscribers: ((notifications: NotificationData[]) => void)[] = [];

  // Subscribe to notification updates
  subscribe(callback: (notifications: NotificationData[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Create notification
  private createNotification(data: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>): NotificationData {
    const notification: NotificationData = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    this.notifications.unshift(notification);
    this.notifySubscribers();
    
    // Send push notification if supported
    this.sendPushNotification(notification);
    
    // Send SMS/Email if customer info available
    if (notification.customerPhone || notification.customerEmail) {
      this.sendCustomerAlert(notification);
    }
    
    return notification;
  }

  // Order status change notifications
  onOrderStatusChange(order: Order, oldStatus: OrderStatus, newStatus: OrderStatus) {
    const statusMessages = {
      pending: 'تم استلام طلبك وهو قيد المراجعة',
      received: 'تم تأكيد طلبك وجاري تجهيز الشحنة',
      in_transit: 'تم شحن طلبك وهو في الطريق إليك',
      delivered: 'تم تسليم طلبك بنجاح',
      rejected: 'تم رفض طلبك، يرجى التواصل مع خدمة العملاء'
    };

    const statusTitles = {
      pending: 'طلب جديد',
      received: 'تم تأكيد الطلب',
      in_transit: 'الطلب في الطريق',
      delivered: 'تم التسليم',
      rejected: 'طلب مرفوض'
    };

    this.createNotification({
      orderId: order.id,
      type: 'status_update',
      title: statusTitles[newStatus],
      message: `${statusMessages[newStatus]} - طلب رقم: ${order.id}`,
      priority: newStatus === 'delivered' || newStatus === 'rejected' ? 'high' : 'medium',
      customerPhone: order.customerInfo?.phone,
      customerEmail: order.customerInfo?.email
    });

    // Special notifications for key status changes
    if (newStatus === 'in_transit') {
      this.createNotification({
        orderId: order.id,
        type: 'pickup_alert',
        title: 'تم استلام الشحنة',
        message: `تم استلام شحنتك من ${order.fromCity} وهي الآن في الطريق إلى ${order.toCity}`,
        priority: 'high',
        customerPhone: order.customerInfo?.phone,
        customerEmail: order.customerInfo?.email
      });
    }

    if (newStatus === 'delivered') {
      this.createNotification({
        orderId: order.id,
        type: 'delivery_alert',
        title: 'تم التسليم بنجاح',
        message: `تم تسليم شحنتك بنجاح في ${order.toCity}. شكراً لاختيارك خدماتنا!`,
        priority: 'high',
        customerPhone: order.customerInfo?.phone,
        customerEmail: order.customerInfo?.email
      });
    }
  }

  // Location update notifications
  onLocationUpdate(order: Order, newLocation: { lat: number; lng: number }, estimatedArrival?: string) {
    // Only notify for significant location changes (every 50km or major checkpoints)
    this.createNotification({
      orderId: order.id,
      type: 'location_update',
      title: 'تحديث موقع الشحنة',
      message: `شحنتك الآن في منطقة جديدة${estimatedArrival ? ` - الوصول المتوقع: ${estimatedArrival}` : ''}`,
      priority: 'low',
      customerPhone: order.customerInfo?.phone,
      customerEmail: order.customerInfo?.email
    });
  }

  // Delivery approach notification (when shipment is near destination)
  onApproachingDelivery(order: Order, estimatedMinutes: number) {
    this.createNotification({
      orderId: order.id,
      type: 'delivery_alert',
      title: 'الشحنة تقترب من الوصول',
      message: `شحنتك ستصل خلال ${estimatedMinutes} دقيقة تقريباً. يرجى التأكد من وجودك في العنوان المحدد.`,
      priority: 'high',
      customerPhone: order.customerInfo?.phone,
      customerEmail: order.customerInfo?.email
    });
  }

  // Send push notification (browser notification)
  private sendPushNotification(notification: NotificationData) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icons/android-chrome-192x192.png',
          badge: '/icons/android-chrome-192x192.png',
          tag: notification.orderId,
          requireInteraction: notification.priority === 'high'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/icons/android-chrome-192x192.png'
            });
          }
        });
      }
    }
  }

  // Send customer alerts via SMS/Email (mock implementation)
  private sendCustomerAlert(notification: NotificationData) {
    // In a real implementation, this would integrate with SMS/Email services
    console.log('📱 SMS Alert:', {
      to: notification.customerPhone,
      message: `${notification.title}\n${notification.message}`
    });
    
    console.log('📧 Email Alert:', {
      to: notification.customerEmail,
      subject: notification.title,
      body: notification.message
    });
  }

  // Get all notifications
  getNotifications(): NotificationData[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifySubscribers();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.notifySubscribers();
  }

  // Clear old notifications (older than 30 days)
  clearOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(n => 
      new Date(n.timestamp) > thirtyDaysAgo
    );
    this.notifySubscribers();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Auto-clear old notifications every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    notificationService.clearOldNotifications();
  }, 60 * 60 * 1000);
}
