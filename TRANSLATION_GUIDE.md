# 🌐 دليل الترجمة الشامل

## ✅ ما تم إنجازه

### 1. نظام الترجمة الموحد
- ✅ جميع المكونات تستخدم `useTranslation` من `translation-provider`
- ✅ زر الترجمة في Navbar (🇸🇦 عربي / 🇺🇸 EN)
- ✅ تبديل تلقائي بين RTL/LTR
- ✅ حفظ اللغة في localStorage

### 2. المكونات المترجمة

#### ✅ Dashboard Components:
- **driver-analytics.tsx** - تحليل السائقين
- **performance-card.tsx** - بطاقة الأداء
- **location-detail.tsx** - تفاصيل الموقع
- **fleets.tsx** - الأسطول
- **trip-tracker.tsx** - متتبع الرحلات

#### ✅ Pages:
- **orders/page.tsx** - صفحة الطلبات
- **Dashboard** - لوحة التحكم

#### ✅ Layout Components:
- **navbar.tsx** - شريط التنقل
- **sidebar** - القائمة الجانبية
- **notification-center.tsx** - مركز الإشعارات

### 3. الترجمات المتوفرة

#### Dashboard (لوحة التحكم):
```typescript
t('dashboard.welcome')          // "Welcome to" / "مرحباً بك في"
t('dashboard.siteName')         // "Nukhbat Al-Naql" / "نخبة النقل"
t('dashboard.driverAnalytics')  // "Driver Analytics" / "تحليل السائقين"
t('dashboard.drivers')          // "Drivers" / "السائقين"
t('dashboard.availableDrivers') // "Available" / "متاح"
t('dashboard.offlineDrivers')   // "Offline Drivers" / "سائقين غير متصلين"
t('dashboard.onTripDrivers')    // "On-Trip Drivers" / "سائقين في رحلة"
t('dashboard.totalDrivers')     // "Total Drivers" / "إجمالي السائقين"
```

#### Orders (الطلبات):
```typescript
t('orders.title')           // "Orders" / "الطلبات"
t('orders.refresh')         // "Refresh" / "تحديث"
t('orders.table.id')        // "ID" / "الرقم"
t('orders.table.car')       // "Car" / "السيارة"
t('orders.table.from')      // "From" / "من"
t('orders.table.to')        // "To" / "إلى"
t('orders.table.price')     // "Price" / "السعر"
t('orders.table.status')    // "Status" / "الحالة"
```

#### Navigation (التنقل):
```typescript
t('nav.dashboard')  // "Dashboard" / "لوحة التحكم"
t('nav.orders')     // "Orders" / "الطلبات"
t('nav.drivers')    // "Drivers" / "السائقين"
t('nav.vehicles')   // "Vehicles" / "المركبات"
t('nav.clients')    // "Clients" / "العملاء"
t('nav.settings')   // "Settings" / "الإعدادات"
```

#### Notifications (الإشعارات):
```typescript
t('notifications.title')           // "Notifications" / "الإشعارات"
t('notifications.markAllRead')     // "Mark all as read" / "تعليم الكل كمقروء"
t('notifications.noNotifications') // "No notifications" / "لا توجد إشعارات"
t('notifications.unread')          // "unread" / "غير مقروء"
```

#### Common (عام):
```typescript
t('common.search')      // "Search" / "بحث"
t('common.save')        // "Save" / "حفظ"
t('common.cancel')      // "Cancel" / "إلغاء"
t('common.delete')      // "Delete" / "حذف"
t('common.edit')        // "Edit" / "تعديل"
t('common.add')         // "Add" / "إضافة"
t('common.loading')     // "Loading..." / "جاري التحميل..."
t('common.error')       // "Error" / "خطأ"
t('common.success')     // "Success" / "نجح"
```

## 🎯 كيفية استخدام الترجمة

### في المكونات:
```tsx
'use client';

import { useTranslation } from '@/app/providers/translation-provider';

export default function MyComponent() {
  const { t, language, isRTL } = useTranslation();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### مع RTL Support:
```tsx
<div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
  <span>{t('label')}</span>
  <input />
</div>
```

### في الجداول:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>{t('table.id')}</TableHead>
      <TableHead>{t('table.name')}</TableHead>
    </TableRow>
  </TableHeader>
</Table>
```

## 📝 إضافة ترجمات جديدة

### 1. افتح `src/i18n/translations.ts`

### 2. أضف المفتاح في القسم الإنجليزي:
```typescript
export const translations = {
  en: {
    mySection: {
      title: 'My Title',
      description: 'My Description',
    },
  },
  // ...
}
```

### 3. أضف الترجمة العربية:
```typescript
export const translations = {
  // ...
  ar: {
    mySection: {
      title: 'عنواني',
      description: 'وصفي',
    },
  },
}
```

### 4. استخدمها في المكون:
```tsx
const { t } = useTranslation();
<h1>{t('mySection.title')}</h1>
```

## 🔍 التحقق من الترجمة

### 1. افتح المتصفح
- اذهب إلى http://localhost:3000

### 2. ابحث عن زر الترجمة
- في أعلى الصفحة (Navbar)
- بجانب زر الثيم
- يعرض: 🇸🇦 عربي أو 🇺🇸 EN

### 3. اضغط على الزر
- النصوص ستتغير فوراً
- اتجاه الصفحة سيتغير (RTL/LTR)
- اللغة ستحفظ في localStorage

### 4. تحقق من Console (F12)
```
Compact toggle: from en to ar
```

## 🎨 RTL/LTR Styling

### Tailwind Classes:
```tsx
// التبديل بين left و right
<div className={isRTL ? 'text-right' : 'text-left'}>

// عكس اتجاه Flex
<div className={isRTL ? 'flex-row-reverse' : 'flex-row'}>

// عكس المسافات
<div className={isRTL ? 'space-x-reverse' : ''}>

// استخدام RTL/LTR modifiers
<div className="ltr:ml-4 rtl:mr-4">
```

### CSS Custom:
```css
/* في globals.css */
[dir="rtl"] .my-class {
  margin-right: 1rem;
}

[dir="ltr"] .my-class {
  margin-left: 1rem;
}
```

## 📊 الإحصائيات

### عدد الترجمات:
- **الإنجليزية**: ~250 مفتاح
- **العربية**: ~250 مفتاح
- **الأقسام**: 12 قسم رئيسي

### الأقسام المترجمة:
1. ✅ Common - عام
2. ✅ Navigation - التنقل
3. ✅ Sidebar - القائمة الجانبية
4. ✅ Auth - المصادقة
5. ✅ Dashboard - لوحة التحكم
6. ✅ Orders - الطلبات
7. ✅ Vehicles - المركبات
8. ✅ Drivers - السائقين
9. ✅ Clients - العملاء
10. ✅ Notifications - الإشعارات
11. ✅ Trips - الرحلات
12. ✅ UI - عناصر الواجهة

## 🐛 حل المشاكل

### المشكلة: النصوص لا تترجم
**الحل**:
1. تأكد أن المكون يستخدم `useTranslation()`
2. تحقق من أن المفتاح موجود في `translations.ts`
3. امسح localStorage: `localStorage.clear()`
4. حدّث الصفحة: `Ctrl + F5`

### المشكلة: RTL لا يعمل
**الحل**:
```tsx
const { isRTL } = useTranslation();
<div className={isRTL ? 'text-right' : 'text-left'}>
```

### المشكلة: اللغة لا تحفظ
**الحل**:
- تحقق من Console للأخطاء
- تأكد أن `TranslationProvider` موجود في `layout.tsx`

## 🎯 أفضل الممارسات

### 1. استخدم مفاتيح وصفية:
```typescript
// ✅ جيد
t('orders.table.customerName')

// ❌ سيء
t('name')
```

### 2. نظم الترجمات في أقسام:
```typescript
orders: {
  title: '...',
  table: {
    id: '...',
    name: '...',
  },
  actions: {
    create: '...',
    edit: '...',
  }
}
```

### 3. استخدم fallback:
```typescript
{t('key') || 'Default Text'}
```

### 4. اختبر كلا اللغتين:
- اختبر الواجهة بالعربية
- اختبر الواجهة بالإنجليزية
- تأكد من RTL/LTR

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع `TRANSLATION_FIX.md`
2. راجع `TEST_TRANSLATION.md`
3. تحقق من Console للأخطاء

---

**🎉 الترجمة تعمل على كامل الموقع!**
