'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type TrackingStatus = {
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  currentLocation: string;
  estimatedDelivery: string;
  history: Array<{
    status: string;
    location: string;
    timestamp: string;
  }>;
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('bookingId');
    if (id) {
      setTrackingId(id);
      fetchTrackingData(id);
    }
  }, [searchParams]);

  const fetchTrackingData = async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/clients/tracking/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setTrackingData(result.data);
      } else {
        setError('لم يتم العثور على بيانات التتبع');
      }
    } catch (err) {
      console.error('Error fetching tracking data:', err);
      setError('حدث خطأ أثناء جلب بيانات التتبع');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد المعالجة';
      case 'in_transit':
        return 'في الطريق';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">تتبع شحنتك</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم التتبع
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="أدخل رقم التتبع"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={() => fetchTrackingData(trackingId)}
                disabled={isLoading || !trackingId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'جاري التحميل...' : 'تتبع'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {trackingData && (
            <div className="mt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">حالة الشحنة:</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                  {getStatusText(trackingData.status)}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">الموقع الحالي:</h3>
                <p>{trackingData.currentLocation}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">الموعد المتوقع للتسليم:</h3>
                <p>{new Date(trackingData.estimatedDelivery).toLocaleDateString('ar-SA')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">سجل التتبع</h3>
                <div className="space-y-4 border-r-2 border-gray-200 pr-4">
                  {trackingData.history.map((item, index) => (
                    <div key={index} className="relative">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -right-2 top-1.5"></div>
                      <div className="mr-6">
                        <div className="flex justify-between">
                          <span className="font-medium">{getStatusText(item.status)}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>للاستفسارات، يرجى الاتصال بفريق الدعم الفني</p>
          <p>هاتف: 920000000+ | البريد الإلكتروني: support@example.com</p>
        </div>
      </div>
    </div>
  );
}
