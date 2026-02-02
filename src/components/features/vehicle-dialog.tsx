"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/app/providers/translation-provider';
import type { Vehicle } from '@/types/vehicle';

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, 'رقم اللوحة مطلوب (3 أحرف على الأقل)'),
  vehicleType: z.string().min(1, 'نوع المركبة مطلوب'),
  model: z.string().min(2, 'الموديل مطلوب'),
  year: z.coerce.number().min(1900, 'السنة غير صحيحة').max(2030, 'السنة غير صحيحة'),
  status: z.string().min(1, 'الحالة مطلوبة'),
  capacity: z.coerce.number().optional(),
  fuelType: z.string().optional(),
  mileage: z.coerce.number().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSuccess: () => void;
}

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: VehicleDialogProps) {
  const { t, isRTL } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: vehicle?.plateNumber || '',
      vehicleType: vehicle?.vehicleType || '',
      model: vehicle?.model || '',
      year: vehicle?.year || new Date().getFullYear(),
      status: vehicle?.status || 'Available',
      capacity: vehicle?.capacity || undefined,
      fuelType: vehicle?.fuelType || '',
      mileage: vehicle?.mileage || undefined,
    },
  });

  React.useEffect(() => {
    if (vehicle) {
      form.reset({
        plateNumber: vehicle.plateNumber,
        vehicleType: vehicle.vehicleType,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
        capacity: vehicle.capacity || undefined,
        fuelType: vehicle.fuelType || '',
        mileage: vehicle.mileage || undefined,
      });
    } else {
      form.reset({
        plateNumber: '',
        vehicleType: '',
        model: '',
        year: new Date().getFullYear(),
        status: 'Available',
        capacity: undefined,
        fuelType: '',
        mileage: undefined,
      });
    }
  }, [vehicle, form]);

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    try {
      const url = vehicle ? `/api/vehicles/${vehicle.id}` : '/api/vehicles';
      const method = vehicle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل في حفظ المركبة');
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ المركبة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-scaleIn ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {vehicle ? 'تعديل المركبة' : 'إضافة مركبة جديدة'}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? 'قم بتعديل بيانات المركبة أدناه'
              : 'أدخل بيانات المركبة الجديدة'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plate Number */}
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم اللوحة *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABC-1234"
                        {...field}
                        disabled={!!vehicle}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehicle Type */}
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المركبة *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="smooth-transition">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Car">سيارة</SelectItem>
                        <SelectItem value="Truck">شاحنة</SelectItem>
                        <SelectItem value="Bus">باص</SelectItem>
                        <SelectItem value="Van">فان</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموديل *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Toyota Camry"
                        {...field}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السنة *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2024"
                        {...field}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="smooth-transition">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">متاحة</SelectItem>
                        <SelectItem value="Maintenance">صيانة</SelectItem>
                        <SelectItem value="Out of Service">خارج الخدمة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحمولة (كجم)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fuel Type */}
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الوقود</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="smooth-transition">
                          <SelectValue placeholder="اختر نوع الوقود" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gasoline">بنزين</SelectItem>
                        <SelectItem value="Diesel">ديزل</SelectItem>
                        <SelectItem value="Electric">كهربائي</SelectItem>
                        <SelectItem value="Hybrid">هجين</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mileage */}
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عداد الكيلومترات</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="smooth-transition"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 smooth-transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
