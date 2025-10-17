# حل سريع للمشاكل

## المشكلة الحالية
خطأ 500 في `/api/auth/session` و `/api/orders`

## الحل خطوة بخطوة

### 1. أوقف الخادم الحالي
```bash
npx kill-port 3000
```

### 2. احذف مجلد .next
```bash
Remove-Item -Recurse -Force .next
```

### 3. تأكد من وجود ملف .env.local
يجب أن يحتوي على:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production-min-32-chars-long
DATABASE_URL=file:./prisma/dev.db
```

### 4. أعد توليد Prisma Client
```bash
npx prisma generate
npx prisma db push
```

### 5. شغل الخادم
```bash
npm run dev
```

## حسابات الاختبار
- Admin: admin@example.com / admin123
- Driver: driver@example.com / driver123  
- Client: client@example.com / client123

## إذا استمرت المشكلة
افتح Developer Tools في المتصفح (F12) وتحقق من:
1. Console للأخطاء
2. Network tab لرؤية تفاصيل الطلبات
3. تأكد أن الخادم يعمل على المنفذ 3000
