// Validation schemas using Zod
import { z } from 'zod';

// Vehicle validation schema
export const VehicleSchema = z.object({
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب").max(20, "رقم اللوحة طويل جداً"),
  vehicleType: z.enum(['Car', 'Truck', 'Bus'], {
    errorMap: () => ({ message: "نوع المركبة غير صالح" })
  }),
  model: z.string().min(1, "الموديل مطلوب").max(50, "اسم الموديل طويل جداً"),
  year: z.number()
    .int("السنة يجب أن تكون رقم صحيح")
    .min(1900, "السنة يجب أن تكون بعد 1900")
    .max(new Date().getFullYear() + 1, "السنة غير صالحة"),
  status: z.enum(['Available', 'Maintenance', 'Out of Service'], {
    errorMap: () => ({ message: "حالة المركبة غير صالحة" })
  }),
  capacity: z.number().int().positive().optional().nullable(),
  fuelType: z.string().max(30).optional().nullable(),
  mileage: z.number().nonnegative().optional().nullable(),
});

export const VehicleUpdateSchema = VehicleSchema.partial();

// Order validation schema
export const OrderSchema = z.object({
  carType: z.string().min(1, "نوع السيارة مطلوب"),
  carModel: z.string().min(1, "موديل السيارة مطلوب"),
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
  fromCity: z.string().min(1, "مدينة الانطلاق مطلوبة"),
  toCity: z.string().min(1, "مدينة الوصول مطلوبة"),
  fromAddress: z.string().optional().nullable(),
  toAddress: z.string().optional().nullable(),
  paymentMethod: z.enum(['cash', 'card', 'mada', 'apple_pay'], {
    errorMap: () => ({ message: "طريقة الدفع غير صالحة" })
  }),
  price: z.number().nonnegative("السعر يجب أن يكون موجباً"),
  notes: z.string().max(500).optional().nullable(),
});

// Driver validation schema
export const DriverSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: "الجنس غير صالح" })
  }),
  dateOfBirth: z.string().or(z.date()),
  contactNumber: z.string().min(10, "رقم الهاتف غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().nullable(),
  address: z.string().min(5, "العنوان مطلوب"),
  licenseNumber: z.string().min(1, "رقم الرخصة مطلوب"),
  licenseExpiry: z.string().or(z.date()),
  status: z.enum(['available', 'busy', 'offline']).optional(),
});

// Trip validation schema
export const TripSchema = z.object({
  driverId: z.string().min(1, "السائق مطلوب"),
  vehicleId: z.string().min(1, "المركبة مطلوبة"),
  routeId: z.string().optional().nullable(),
  startLocation: z.string().min(1, "موقع البداية مطلوب"),
  endLocation: z.string().min(1, "موقع النهاية مطلوب"),
  startTime: z.string().or(z.date()).optional().nullable(),
  endTime: z.string().or(z.date()).optional().nullable(),
  estimatedTime: z.number().int().positive().optional().nullable(),
  distance: z.number().positive().optional().nullable(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  notes: z.string().max(500).optional().nullable(),
});

// Route validation schema
export const RouteSchema = z.object({
  name: z.string().min(1, "اسم المسار مطلوب"),
  startPoint: z.string().min(1, "نقطة البداية مطلوبة"),
  endPoint: z.string().min(1, "نقطة النهاية مطلوبة"),
  distance: z.number().positive("المسافة يجب أن تكون موجبة"),
  duration: z.number().int().positive("المدة يجب أن تكون موجبة"),
  waypoints: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Format Zod errors for API response
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });
  
  return formattedErrors;
}
