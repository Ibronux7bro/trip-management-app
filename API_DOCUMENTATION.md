# API Documentation - نظام إدارة الرحلات

## نظرة عامة
تم إنشاء جميع نقاط النهاية المطلوبة للحجز والتتبع والدعم الفني مع التحقق من صحة البيانات ومعالجة الأخطاء.

## 1. نقطة نهاية الحجز (Booking)

### المسار: `/api/clients/booking`

#### POST - إنشاء حجز جديد
```http
POST /api/clients/booking
Content-Type: application/json

{
  "fromCity": "الرياض",
  "toCity": "جدة", 
  "vehicleType": "medium", // small, medium, large, truck
  "clientId": "CLIENT-001",
  "senderName": "أحمد محمد",
  "senderPhone": "0501234567",
  "receiverName": "فاطمة علي", 
  "receiverPhone": "0507654321",
  "receiverAddress": "شارع الملك فهد، جدة",
  "notes": "يرجى التعامل بحذر", // اختياري
  "pickupDate": "2024-01-15T08:00:00Z", // اختياري
  "deliveryDate": "2024-01-16T14:00:00Z", // اختياري
  "packageWeight": 2.5, // اختياري
  "packageDimensions": "30x20x15 سم" // اختياري
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحجز بنجاح",
  "data": {
    "id": "BK-1234567890-abc123",
    "fromCity": "الرياض",
    "toCity": "جدة",
    "vehicleType": "medium",
    "clientId": "CLIENT-001",
    "status": "pending",
    "estimatedPrice": 525,
    "trackingNumber": "TR-1234567890",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET - جلب حجوزات العميل
```http
GET /api/clients/booking?clientId=CLIENT-001
```

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "id": "BK-1234567890-abc123",
      "fromCity": "الرياض",
      "toCity": "جدة",
      "status": "pending",
      "estimatedPrice": 525,
      "trackingNumber": "TR-1234567890",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

## 2. نقطة نهاية التتبع (Tracking)

### المسار: `/api/clients/tracking/[orderId]`

#### GET - جلب تفاصيل التتبع
```http
GET /api/clients/tracking/BK-1234567890
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "orderId": "BK-1234567890",
    "trackingNumber": "TR-1234567890",
    "status": "in_transit",
    "currentLocation": {
      "lat": 24.7136,
      "lng": 46.6753,
      "address": "الرياض، المملكة العربية السعودية"
    },
    "route": [
      {
        "lat": 24.7136,
        "lng": 46.6753,
        "timestamp": "2024-01-15T08:00:00Z",
        "status": "picked_up"
      }
    ],
    "estimatedDelivery": "2024-01-16T14:00:00Z",
    "driver": {
      "name": "أحمد محمد",
      "phone": "+966501234567",
      "vehicleNumber": "أ ب ج 1234"
    },
    "customer": {
      "name": "محمد عبدالله",
      "phone": "+966507654321"
    },
    "shipmentDetails": {
      "fromCity": "الرياض",
      "toCity": "جدة",
      "weight": "2.5 كيلو",
      "dimensions": "30x20x15 سم"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-14T20:00:00Z",
        "description": "تم استلام الطلب"
      },
      {
        "status": "in_transit",
        "timestamp": "2024-01-15T09:30:00Z",
        "description": "الشحنة في الطريق"
      }
    ]
  }
}
```

#### PATCH - تحديث حالة الشحنة (للإدارة/السائق)
```http
PATCH /api/clients/tracking/BK-1234567890
Content-Type: application/json

{
  "status": "delivered",
  "location": {
    "lat": 21.3891,
    "lng": 39.8579,
    "address": "جدة، المملكة العربية السعودية"
  },
  "notes": "تم التسليم بنجاح"
}
```

## 3. نقطة نهاية الدعم الفني (Support)

### المسار: `/api/clients/support`

#### POST - إنشاء تذكرة دعم جديدة
```http
POST /api/clients/support
Content-Type: application/json

{
  "subject": "استفسار عن حالة الشحنة",
  "message": "أريد معرفة حالة شحنتي رقم TR-1234567890",
  "clientId": "CLIENT-001",
  "priority": "medium", // low, medium, high (اختياري)
  "category": "tracking" // general, booking, tracking, payment, technical (اختياري)
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء تذكرة الدعم بنجاح",
  "data": {
    "id": "TKT-1234567890-abc123",
    "subject": "استفسار عن حالة الشحنة",
    "message": "أريد معرفة حالة شحنتي رقم TR-1234567890",
    "clientId": "CLIENT-001",
    "priority": "medium",
    "category": "tracking",
    "status": "open",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "replies": []
  }
}
```

#### GET - جلب تذاكر الدعم للعميل
```http
GET /api/clients/support?clientId=CLIENT-001&status=open&category=tracking
```

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TKT-1234567890",
      "subject": "استفسار عن حالة الشحنة",
      "status": "open",
      "priority": "medium",
      "category": "tracking",
      "createdAt": "2024-01-15T10:00:00Z",
      "replies": []
    }
  ],
  "total": 1,
  "summary": {
    "open": 1,
    "in_progress": 0,
    "resolved": 0,
    "closed": 0
  }
}
```

## 4. نقطة نهاية ردود الدعم

### المسار: `/api/clients/support/[ticketId]/reply`

#### POST - إضافة رد على تذكرة
```http
POST /api/clients/support/TKT-1234567890/reply
Content-Type: application/json

{
  "message": "شكراً لردكم السريع",
  "clientId": "CLIENT-001"
}
```

#### GET - جلب ردود التذكرة
```http
GET /api/clients/support/TKT-1234567890/reply?clientId=CLIENT-001
```

## 5. نقطة نهاية الاختبار

### المسار: `/api/test`

#### GET - معلومات الاختبار
```http
GET /api/test
GET /api/test?endpoint=booking
```

#### POST - اختبار النقاط
```http
POST /api/test
Content-Type: application/json

{
  "testType": "booking" // أو "support"
}
```

## حالات الأخطاء

### 400 - بيانات غير صحيحة
```json
{
  "success": false,
  "message": "بيانات الحجز غير صحيحة",
  "errors": [
    {
      "field": "fromCity",
      "message": "مدينة الانطلاق مطلوبة"
    }
  ]
}
```

### 404 - غير موجود
```json
{
  "success": false,
  "message": "لم يتم العثور على الطلب"
}
```

### 500 - خطأ خادم
```json
{
  "success": false,
  "message": "حدث خطأ أثناء معالجة الطلب"
}
```

## حالات الشحنة المتاحة
- `pending` - في الانتظار
- `confirmed` - مؤكد
- `picked_up` - تم الاستلام
- `in_transit` - في الطريق
- `out_for_delivery` - خارج للتسليم
- `delivered` - تم التسليم
- `failed_delivery` - فشل التسليم
- `returned` - مرتجع

## أنواع المركبات
- `small` - صغيرة (سعر أساسي: 50 ريال)
- `medium` - متوسطة (سعر أساسي: 75 ريال)
- `large` - كبيرة (سعر أساسي: 100 ريال)
- `truck` - شاحنة (سعر أساسي: 150 ريال)

## أولويات الدعم
- `low` - منخفضة
- `medium` - متوسطة
- `high` - عالية

## فئات الدعم
- `general` - عام
- `booking` - حجز
- `tracking` - تتبع
- `payment` - دفع
- `technical` - تقني

## ملاحظات مهمة
1. جميع التواريخ بصيغة ISO 8601
2. أرقام الهواتف بصيغة سعودية (05xxxxxxxx)
3. الأسعار محسوبة بالريال السعودي
4. جميع النصوص باللغة العربية
5. البيانات الحالية تستخدم قاعدة بيانات وهمية (Mock Database)
6. في التطبيق الحقيقي، يجب استخدام قاعدة بيانات حقيقية مثل PostgreSQL أو MongoDB
