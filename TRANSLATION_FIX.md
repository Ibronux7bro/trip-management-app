# حل مشاكل الترجمة

## ✅ ما تم إصلاحه

### 1. تحديث مكون `LanguageToggle`
- إضافة `console.log` لتتبع تغيير اللغة
- تحديث فوري لـ `document.documentElement` attributes
- إصلاح مشكلة عدم تحديث الواجهة

### 2. كيفية استخدام الترجمة

#### في المكونات:
```tsx
import { useTranslation } from '@/app/providers/translation-provider';

function MyComponent() {
  const { t, language, setLanguage, isRTL } = useTranslation();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
        {t('common.changeLanguage')}
      </button>
    </div>
  );
}
```

#### استخدام زر الترجمة الجاهز:
```tsx
import { LanguageToggle } from '@/components/ui/language-toggle';

// في الـ Header أو Navbar
<LanguageToggle />

// نسخة مدمجة للموبايل
<LanguageToggleCompact />

// مع خيارات مخصصة
<LanguageToggle 
  variant="ghost" 
  size="sm" 
  showText={false} 
/>
```

## 🔍 التحقق من عمل الترجمة

### 1. افتح Developer Tools (F12)
- اذهب إلى Console
- اضغط على زر الترجمة
- يجب أن ترى: `"Toggling language from en to ar"`

### 2. تحقق من localStorage
```javascript
// في Console
localStorage.getItem('language')
// يجب أن يعرض: "ar" أو "en"
```

### 3. تحقق من document attributes
```javascript
// في Console
console.log(document.documentElement.lang)
console.log(document.documentElement.dir)
// يجب أن يعرض: "ar" و "rtl" أو "en" و "ltr"
```

## 📝 إضافة ترجمات جديدة

### في ملف `src/i18n/translations.ts`:

```typescript
export const translations = {
  en: {
    mySection: {
      title: 'My Title',
      description: 'My Description',
    },
  },
  ar: {
    mySection: {
      title: 'عنواني',
      description: 'وصفي',
    },
  },
};
```

### استخدامها:
```tsx
const { t } = useTranslation();
<h1>{t('mySection.title')}</h1>
```

## 🐛 حل المشاكل الشائعة

### المشكلة 1: الترجمة لا تتغير
**الحل:**
1. امسح localStorage: `localStorage.clear()`
2. حدّث الصفحة (Ctrl+F5)
3. جرب تبديل اللغة مرة أخرى

### المشكلة 2: النص يظهر كـ key بدلاً من الترجمة
**الحل:**
- تأكد أن المفتاح موجود في `translations.ts`
- تحقق من التهجئة الصحيحة
- استخدم نقاط للوصول للمفاتيح المتداخلة: `section.subsection.key`

### المشكلة 3: RTL/LTR لا يعمل
**الحل:**
```tsx
// استخدم isRTL من useTranslation
const { isRTL } = useTranslation();

<div className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
  {/* محتوى */}
</div>
```

## 🎯 أمثلة عملية

### مثال 1: صفحة بسيطة
```tsx
'use client';

import { useTranslation } from '@/app/providers/translation-provider';
import { LanguageToggle } from '@/components/ui/language-toggle';

export default function MyPage() {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1>{t('common.title')}</h1>
        <LanguageToggle />
      </div>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### مثال 2: جدول مع ترجمة
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>{t('table.id')}</TableHead>
      <TableHead>{t('table.name')}</TableHead>
      <TableHead>{t('table.status')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{t(`status.${item.status}`)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 📊 الترجمات المتوفرة حالياً

### الأقسام الرئيسية:
- ✅ `common.*` - نصوص عامة
- ✅ `nav.*` - القوائم
- ✅ `sidebar.*` - الشريط الجانبي
- ✅ `auth.*` - المصادقة
- ✅ `dashboard.*` - لوحة التحكم
- ✅ `orders.*` - الطلبات
- ✅ `vehicles.*` - المركبات
- ✅ `drivers.*` - السائقين
- ✅ `clients.*` - العملاء

## 🚀 نصائح للأداء

1. **استخدم useMemo للترجمات المعقدة:**
```tsx
const translatedItems = useMemo(() => 
  items.map(item => ({
    ...item,
    label: t(`items.${item.key}`)
  })),
  [items, t]
);
```

2. **تجنب استدعاء t() في loops:**
```tsx
// ❌ سيء
{items.map(item => <div>{t(`item.${item.id}`)}</div>)}

// ✅ جيد
const translations = useMemo(() => 
  items.reduce((acc, item) => ({
    ...acc,
    [item.id]: t(`item.${item.id}`)
  }), {}),
  [items, t]
);
```

## 📞 الدعم

إذا استمرت المشكلة:
1. تحقق من Console للأخطاء
2. تأكد أن `TranslationProvider` يغلف التطبيق
3. تحقق من `src/app/layout.tsx` أن Provider موجود
