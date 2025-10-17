// DELETED - This component is no longer needed
export default function AuthForm() {
  return null;
}

// Define schemas for each form type
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الجوال غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
});

export function AuthForm({ type, onSubmit, isLoading, error, className }: AuthFormProps) {
  // Get the appropriate schema based on form type
  const getSchema = () => {
    switch (type) {
      case 'login':
        return loginSchema;
      case 'register':
        return registerSchema;
      case 'forgot-password':
        return forgotPasswordSchema;
      case 'reset-password':
        return resetPasswordSchema;
      default:
        return loginSchema;
    }
  };

  const schema = getSchema();
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  return (
    <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className={cn('space-y-4', className)}
      dir="rtl"
    >
      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            placeholder="أدخل اسمك الكامل"
            {...form.register('name')}
            className={cn(form.formState.errors.name && 'border-red-500')}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>
      )}

      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الجوال</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="أدخل رقم الجوال"
            {...form.register('phone')}
            className={cn(form.formState.errors.phone && 'border-red-500')}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
          )}
        </div>
      )}

      {type !== 'reset-password' && (
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            {...form.register('email')}
            className={cn(form.formState.errors.email && 'border-red-500')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>
      )}

      {type !== 'forgot-password' && type !== 'reset-password' && (
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            placeholder="أدخل كلمة المرور"
            {...form.register('password')}
            className={cn(form.formState.errors.password && 'border-red-500')}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
          )}
        </div>
      )}

      {type === 'reset-password' && (
        <>
          <Input type="hidden" {...form.register('token')} />
          <div className="space-y-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              {...form.register('newPassword')}
              className={cn(form.formState.errors.newPassword && 'border-red-500')}
            />
            {form.formState.errors.newPassword && (
              <p className="text-sm text-red-600">{form.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              {...form.register('confirmPassword')}
              className={cn(form.formState.errors.confirmPassword && 'border-red-500')}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'جاري المعالجة...' : (
          <>
            {type === 'login' && 'تسجيل الدخول'}
            {type === 'register' && 'إنشاء حساب'}
            {type === 'forgot-password' && 'إرسال رابط إعادة التعيين'}
            {type === 'reset-password' && 'تغيير كلمة المرور'}
          </>
        )}
      </Button>
    </form>
  );
}
