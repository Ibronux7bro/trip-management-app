"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Navigation,
  User,
  Star,
  Calendar,
  Route
} from "lucide-react";
import { LogoIcon } from "@/components/ui/logo";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fromAddress: string;
  toAddress: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  priority: 'low' | 'medium' | 'high';
  estimatedDelivery: string;
  packageType: string;
  weight: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-1001',
    customerName: 'أحمد محمد العلي',
    customerPhone: '+966501234567',
    fromAddress: 'الرياض، طريق الملك فهد',
    toAddress: 'جدة، الكورنيش',
    status: 'assigned',
    priority: 'high',
    estimatedDelivery: '2024-01-20 14:30',
    packageType: 'إلكترونيات',
    weight: 25
  },
  {
    id: '2',
    orderNumber: 'ORD-1002',
    customerName: 'سارة أحمد الخالد',
    customerPhone: '+966509876543',
    fromAddress: 'الرياض، حي العليا',
    toAddress: 'مكة المكرمة، العزيزية',
    status: 'picked_up',
    priority: 'medium',
    estimatedDelivery: '2024-01-20 16:00',
    packageType: 'مستندات',
    weight: 5
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'assigned':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'picked_up':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'in_transit':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'assigned':
      return 'مُعيَّن';
    case 'picked_up':
      return 'تم الاستلام';
    case 'in_transit':
      return 'في الطريق';
    case 'delivered':
      return 'تم التسليم';
    default:
      return status;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function DriverDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const driverInfo = {
    name: 'محمد عبدالله السعد',
    id: 'DRV-001',
    vehicle: 'تويوتا هايلكس 2023',
    plateNumber: 'ABC-1234',
    phone: '+966505555555',
    rating: 4.8,
    completedOrders: 156,
    todayOrders: 3
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // Here you would call the API to update the order status
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogoIcon size="md" variant="default" />
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  مرحباً {driverInfo.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  لوحة تحكم السائق - نخبة النقل
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{driverInfo.rating}</span>
              </div>
              <p className="text-sm text-gray-500">{driverInfo.completedOrders} طلب مكتمل</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{driverInfo.todayOrders}</div>
            <div className="text-sm text-gray-500">طلبات اليوم</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{driverInfo.completedOrders}</div>
            <div className="text-sm text-gray-500">إجمالي الطلبات</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 mb-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{driverInfo.rating}</div>
            <div className="text-sm text-gray-500">التقييم</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-3">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{driverInfo.plateNumber}</div>
            <div className="text-sm text-gray-500">رقم اللوحة</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-600" />
            الطلبات النشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority === 'high' ? 'عالي' : order.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        عرض الخريطة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${order.customerPhone}`)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        اتصال
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">العميل</p>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">نوع الشحنة</p>
                      <p className="font-medium">{order.packageType}</p>
                      <p className="text-sm text-gray-600">{order.weight} كجم</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">من</p>
                        <p className="font-medium">{order.fromAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">إلى</p>
                        <p className="font-medium">{order.toAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">موعد التسليم المتوقع</p>
                        <p className="font-medium">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2 pt-3 border-t">
                    {order.status === 'assigned' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        تأكيد الاستلام
                      </Button>
                    )}
                    {order.status === 'picked_up' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'in_transit')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        بدء الرحلة
                      </Button>
                    )}
                    {order.status === 'in_transit' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        تأكيد التسليم
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">لا توجد طلبات نشطة حالياً</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Profile */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            معلومات السائق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">الاسم</p>
                <p className="font-semibold">{driverInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم السائق</p>
                <p className="font-semibold">{driverInfo.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-semibold">{driverInfo.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">المركبة</p>
                <p className="font-semibold">{driverInfo.vehicle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم اللوحة</p>
                <p className="font-semibold">{driverInfo.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">التقييم</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{driverInfo.rating}</span>
                  <span className="text-sm text-gray-500">({driverInfo.completedOrders} تقييم)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
