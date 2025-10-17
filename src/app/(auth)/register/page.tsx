'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الجوال غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'حدث خطأ ما');
      }

      // Auto sign-in after registration
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            قم بإنشاء حسابك للبدء في استخدام المنصة
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                  form.formState.errors.name && 'border-red-500'
                )}
                {...form.register('name')}
                disabled={isLoading}
                placeholder="أدخل اسمك الكامل"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                  form.formState.errors.email && 'border-red-500'
                )}
                {...form.register('email')}
                disabled={isLoading}
                placeholder="أدخل بريدك الإلكتروني"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">رقم الجوال</Label>
              <Input
                id="phone"
                type="tel"
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                  form.formState.errors.phone && 'border-red-500',
                  'text-left ltr'
                )}
                {...form.register('phone')}
                disabled={isLoading}
                dir="ltr"
                placeholder="مثال: 0512345678"
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                  form.formState.errors.password && 'border-red-500'
                )}
                {...form.register('password')}
                disabled={isLoading}
                placeholder="أدخل كلمة المرور"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                  form.formState.errors.confirmPassword && 'border-red-500'
                )}
                {...form.register('confirmPassword')}
                disabled={isLoading}
                placeholder="أعد إدخال كلمة المرور"
              />
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
