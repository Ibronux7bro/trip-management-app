'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState('');
  
  useEffect(() => {
    const id = searchParams.get('bookingId');
    if (id) {
      setBookingId(id);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-2xl font-bold mb-2">تم تأكيد حجزك بنجاح!</h2>
          <p>شكراً لثقتك بخدماتنا</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">رقم الحجز:</h3>
            <p className="text-blue-600 font-mono text-xl">{bookingId || '--'}</p>
          </div>
          
          <p className="mb-4">
            تم استلام طلبك وسيتم التواصل معك قريباً لتأكيد التفاصيل النهائية.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">ماذا بعد؟</h4>
            <ul className="text-right space-y-2">
              <li>✓ ستصلك رسالة تأكيد على بريدك الإلكتروني</li>
              <li>✓ يمكنك تتبع حالة حجزك في أي وقت</li>
              <li>✓ للاستفسارات، يرجى الاتصال بالدعم الفني</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/clients/booking"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
          >
            حجز جديد
          </a>
          <a 
            href={`/clients/tracking?bookingId=${bookingId}`}
            className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-center"
          >
            تتبع الحجز
          </a>
        </div>
      </div>
    </div>
  );
}
