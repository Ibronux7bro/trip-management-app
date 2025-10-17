import { Order, OrderStatus, PaymentMethod } from "@/types/order";
import { notificationService } from "./notification-service";

let ORDERS: Order[] = [];

function seed() {
  if (ORDERS.length > 0) return;
  const now = new Date();
  ORDERS = [
    {
      id: "ORD-1001",
      carType: "Sedan",
      carModel: "Toyota Camry",
      plateNumber: "ABC-1234",
      fromCity: "Riyadh",
      toCity: "Jeddah",
      paymentMethod: "mada" as PaymentMethod,
      price: 250.0,
      status: "in_transit" as OrderStatus,
      createdAt: now.toISOString(),
      currentLocation: { lat: 24.774265, lng: 46.738586 },
      path: [
        { lat: 24.774265, lng: 46.738586 },
        { lat: 24.5, lng: 46.2 },
        { lat: 24.0, lng: 45.8 },
      ],
    },
    {
      id: "ORD-1002",
      carType: "SUV",
      carModel: "Hyundai Tucson",
      plateNumber: "XYZ-5678",
      fromCity: "Dammam",
      toCity: "Riyadh",
      paymentMethod: "card",
      price: 180.0,
      status: "received",
      createdAt: now.toISOString(),
    },
  ];
}

seed();

export function listOrders(): Order[] {
  return ORDERS;
}

export function getOrder(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export function createOrder(data: Omit<Order, "id" | "status" | "createdAt">): Order {
  const id = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
  const order: Order = {
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...data,
  };
  ORDERS.unshift(order);
  return order;
}

export function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status" | "price" | "currentLocation" | "path">>
): Order | undefined {
  const idx = ORDERS.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  
  const oldOrder = ORDERS[idx];
  const oldStatus = oldOrder.status;
  
  ORDERS[idx] = { ...ORDERS[idx], ...patch };
  
  // Trigger notifications for status changes
  if (patch.status && patch.status !== oldStatus) {
    notificationService.onOrderStatusChange(ORDERS[idx], oldStatus, patch.status);
  }
  
  // Trigger location update notifications
  if (patch.currentLocation) {
    notificationService.onLocationUpdate(ORDERS[idx], patch.currentLocation);
  }
  
  return ORDERS[idx];
}
