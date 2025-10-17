

# 🚚 أسطول المملكة - منصة إدارة أسطول ومراقبة لوجستية متقدمة

**أسطول المملكة** هو نظام متكامل لإدارة وتتبع الأسطول (الشاحنات والمركبات) في الوقت الفعلي، مع إدارة السائقين، الرحلات، الصيانة، الوقود، والتقارير التحليلية. يدعم العربية والإنجليزية مع واجهة متجاوبة ويدعم RTL تلقائيًا.

## الوظائف الرئيسية

- تتبع المركبات والسائقين مباشرة على الخريطة
- مراقبة أداء السائقين وسلامتهم
- جدولة وصيانة المركبات وتتبع استهلاك الوقود
- تخطيط ومتابعة الرحلات
- تقارير ولوحات بيانات تفاعلية (Dashboards)
- دعم لغتين (العربية والإنجليزية) مع تحويل تلقائي لاتجاه الواجهة
- واجهة متجاوبة تدعم جميع الأجهزة

## بنية المشروع وأهم الملفات

- `src/app/` :
  - `layout.tsx` : مكون الجذر، يضم مزودي السياق والتخطيط العام
  - `(pages)/` : صفحات التطبيق (الرئيسية، الحجز، الإدارة، التقارير...)
  - `providers/` : مزودو السياق مثل اللغة والثيم
  - `globals.css` : أنماط CSS العامة
- `src/components/` :
  - `features/` : مكونات الميزات (تبديل اللغة، البحث، إلخ)
  - `layouts/` : تخطيطات الواجهة (الشريط الجانبي، الشريط العلوي)
  - `ui/` : مكونات واجهة مستخدم عامة (زر، جدول، بطاقة...)
- `src/constants/` : بيانات ثابتة (السائقين، المركبات، الرحلات، التقارير...)
- `src/services/` : دوال جلب البيانات ومعالجة الإحصائيات
- `src/hooks/` : هوكس مخصصة لجلب البيانات أو إدارة الحالة
- `src/i18n/` : ملفات الترجمة (ar.ts, en.ts)
- `src/types/` : تعريفات الأنواع (TypeScript types)
- `src/utils/` : دوال مساعدة (مثل تلوين الحالة، استخراج الحروف الأولى...)
- `public/` : صور وأيقونات وملفات عامة
- `tailwind.config.ts` : إعدادات الألوان والتنسيق الخاصة بـ Tailwind CSS
- `next.config.mjs` : إعدادات مشروع Next.js

## كيف يعمل المشروع؟

عند تشغيل المشروع:
- تظهر لوحة تحكم تفاعلية تعرض حالة الأسطول، السائقين، الرحلات، والتقارير.
- يمكن للمستخدم التنقل بين الصفحات (الرئيسية، الحجز، الإدارة، التقارير، التتبع...)
- يمكن تغيير اللغة من الشريط العلوي (Globe Icon)
- تعرض البيانات بشكل مباشر من ملفات ثابتة (mock data) أو من الـ API لاحقًا
- يدعم الوضع الليلي وتغيير الألوان عبر الثيم

### أمثلة على الملفات:
- `src/app/(pages)/page.tsx` : الصفحة الرئيسية للوحة التحكم
- `src/app/(pages)/components/driver-analytics.tsx` : تحليل أداء السائقين
- `src/app/(pages)/components/fleets.tsx` : إحصائيات الأسطول
- `src/app/(pages)/components/performance-card.tsx` : أداء الرحلات
- `src/app/(pages)/components/trip-tracker.tsx` : تتبع الرحلات
- `src/constants/drivers.ts` : بيانات السائقين
- `src/constants/trips.ts` : بيانات الرحلات
- `src/constants/vehicles.ts` : بيانات المركبات
- `src/services/index.ts` : دوال معالجة الإحصائيات وجلب البيانات

## ملاحظات تقنية
- المشروع مبني على Next.js (App Router)
- يستخدم Tailwind CSS وshadcn/ui لمكونات الواجهة
- يدعم تعدد اللغات (i18n) مع RTL تلقائي للعربية
- جميع البيانات حالياً mock ويمكن ربطها بقاعدة بيانات أو API بسهولة

للمزيد من التفاصيل حول كل ميزة أو ملف، راجع التعليقات داخل الكود أو تواصل مع فريق التطوير.

## 🚀 Key Features

- 🗺️ Live vehicle tracking and route monitoring
- 👨‍✈️ Driver performance and safety analytics
- 🚛 Vehicle maintenance and fuel management
- 📝 Comprehensive trip planning and tracking
- 🔔 Real-time alerts and notifications
- 📊 Detailed reporting and analytics
- ✅ Driver safety and compliance monitoring
- 🔧 Vehicle health and status tracking

## 🛠️ Built With

- ⚡ **Next.js** - React framework for production
- ⚛️ **React** - JavaScript library for user interfaces
- 📘 **TypeScript** - Type-safe JavaScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🎭 **shadcn/ui** - Unstyled, accessible components
- 🖼️ **Lucide React** - Modern icon pack
- 📊 **Recharts** - Data visualization library
- 🌙 **next-themes** - Theme management
- 📱 **Responsive Design** - Mobile-first approach

## 👥 Target Audience

- 🏢 Fleet Managers
- 📦 Logistics Coordinators
- 🚛 Transportation Companies
- 📋 Operations Managers
- 🔧 Field Service Managers

## 🏃‍♂️ Running the Project

لتشغيل أسطول المملكة محليًا، اتبع الخطوات التالية:

1. 📥 Clone the repository:

```bash
git clone https://github.com/yourusername/fleet-ksa.git
cd fleet-ksa
```

2.📦 Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Add other required environment variables
```

3.📦 Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

4.🚀 Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5.🌐 Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 Core Functionality

### 1. Real-Time Tracking

- Live GPS tracking of vehicles
- Route visualization and optimization
- Geofencing capabilities

### 2. Driver Management

- Performance metrics
- Safety scoring
- License and compliance tracking
- Real-time status monitoring

### 3. Vehicle Management

- Maintenance scheduling
- Fuel consumption tracking
- Vehicle health monitoring
- Service history

### 4. Trip Management

- Route planning
- Schedule optimization
- Real-time progress tracking
- Delivery confirmation

### 5. Analytics & Reporting

- Customizable dashboards
- Performance metrics
- Cost analysis
- Efficiency reports

## UI/UX Features

- Light/Dark theme support
- Responsive design
- Multi-language support (ar, en) with RTL for Arabic
  - Accessibility-focused interface
  - Interactive data visualizations

### Localization (ar / en)


أسطول المملكة يدعم العربية والإنجليزية مع تحويل تلقائي لاتجاه الواجهة (RTL للعربية، LTR للإنجليزية).

- اللغة الافتراضية تُكتشف تلقائيًا من المتصفح (العربية إذا كانت لغة المتصفح تبدأ بـ `ar`، وإلا الإنجليزية).
- يمكنك تبديل اللغة من الشريط العلوي عبر زر الكرة الأرضية `AR/EN`.
- عند تفعيل العربية، تتحول الواجهة تلقائيًا إلى RTL.

Environment variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notes:

- If your dev server runs on port 3001, you can set `NEXT_PUBLIC_BASE_URL=http://localhost:3001` in `.env.local`.
- Language preference is saved in localStorage under the key `trip-planner-locale`.

## Deployment

التطبيق منشور على Netlify ويمكن الوصول إليه عبر:
[https://fleet-ksa.netlify.app/](https://fleet-ksa.netlify.app/)

## Security
## 🔐 Security

- Secure authentication system
- Role-based access control
- Data encryption
- Regular security updates

## 📱 Mobile Responsiveness

The dashboard is fully responsive and optimized for:

- 💻 Desktop workstations
- 💻 Laptops
- 📱 Tablets
- 📱 Mobile devices

---

Created with ❤️ by Manjunath R

For support or inquiries, please contact us through our [support portal](https://voyagerpro.netlify.app/support).
