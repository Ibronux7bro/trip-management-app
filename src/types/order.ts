export type PaymentMethod = 'card' | 'apple_pay' | 'mada';
export type OrderStatus = 'received' | 'in_transit' | 'delivered' | 'rejected' | 'pending';

export interface Order {
  id: string;
  carType: string;
  carModel: string;
  plateNumber: string;
  fromCity: string;
  toCity: string;
  paymentMethod: PaymentMethod;
  price: number;
  status: OrderStatus;
  createdAt: string; // ISO
  // tracking
  currentLocation?: {
    lat: number;
    lng: number;
  };
  path?: Array<{ lat: number; lng: number }>; // polyline
  // customer info for notifications
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
    fromAddress: string;
    toAddress: string;
    scheduledDate: string;
    scheduledTime: string;
    packageType: string;
    specialInstructions: string;
  };
}
