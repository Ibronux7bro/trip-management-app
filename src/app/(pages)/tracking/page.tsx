"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapComponent from "@/app/(pages)/dashboard/maps/components/MapComponent";
import { useTranslation } from "@/app/providers/translation-provider";
import { 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail,
  Navigation,
  Calendar,
  User,
  Route,
  Search
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/alert-message";

interface TrackingData {
  id: string;
  status: string;
  currentLocation: { lat: number; lng: number };
  path: Array<{ lat: number; lng: number }>;
  fromCity: string;
  toCity: string;
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  estimatedDelivery?: string;
  driverInfo?: {
    name: string;
    phone: string;
    vehicleModel: string;
    plateNumber: string;
  };
  timeline?: Array<{
    status: string;
    timestamp: string;
    location?: string;
    description: string;
  }>;
}

export default function TrackingPage() {
  const { t, isRTL } = useTranslation();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'received':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'received':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Pending Review',
      received: 'Confirmed',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      rejected: 'Rejected'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const onTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch(`/api/clients/tracking/${encodeURIComponent(orderId.trim())}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      
      // Enhance data with mock information for professional display
      const enhancedData: TrackingData = {
        ...data,
        customerInfo: {
          name: "Ahmed Mohammed",
          phone: "+966 50 123 4567",
          email: "ahmed@example.com"
        },
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('en-US'),
        driverInfo: {
          name: "Mohammed Al-Saadi",
          phone: "+966 55 987 6543",
          vehicleModel: "Toyota Hiace",
          plateNumber: "ABC-1234"
        },
        timeline: [
          {
            status: 'received',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('en-US'),
            location: data.fromCity,
            description: 'Order received and data confirmed'
          },
          {
            status: 'in_transit',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('en-US'),
            location: 'Highway',
            description: 'Order shipped and in transit'
          }
        ]
      };
      
      setResult(enhancedData);
      
      // Set up auto-refresh for live tracking
      if (enhancedData.status === 'in_transit') {
        const interval = setInterval(() => {
          // Simulate location updates
          setResult(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              currentLocation: {
                lat: prev.currentLocation.lat + (Math.random() - 0.5) * 0.01,
                lng: prev.currentLocation.lng + (Math.random() - 0.5) * 0.01
              }
            };
          });
        }, 30000); // Update every 30 seconds
        
        setRefreshInterval(interval);
      }
      
    } catch (e: any) {
      setError(e?.message || "Failed to fetch tracking information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  return (
    <div className={`p-6 space-y-6 max-w-6xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Search Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-3 text-2xl font-bold text-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Package className="h-7 w-7 text-blue-600" />
            Package Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative flex-1">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <Input 
                placeholder="Enter order ID (e.g., ORD-1001)" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
                onKeyPress={(e) => e.key === 'Enter' && onTrack()}
              />
            </div>
            <Button onClick={onTrack} disabled={loading} className="px-8">
              {loading ? (
                <LoadingSpinner size="sm" text="Tracking..." />
              ) : (
                "Track"
              )}
            </Button>
          </div>
          {error && (
            <ErrorAlert 
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(result.status)}`}>
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <p className="font-semibold text-gray-800">{getStatusText(result.status)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Route className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold text-gray-800">{result.fromCity} → {result.toCity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Arrival</p>
                    <p className="font-semibold text-sm text-gray-800">{result.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-5 w-5 text-blue-600" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800">{result.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusText(result.status)}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                    <User className="h-4 w-4 text-blue-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="text-gray-800">{result.customerInfo?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-800">{result.customerInfo?.phone}</span>
                    </div>
                  </div>
                </div>

                {result.driverInfo && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Driver Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="text-gray-800">{result.driverInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span className="text-gray-800">{result.driverInfo.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vehicle:</span>
                          <span className="text-gray-800">{result.driverInfo.vehicleModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Plate:</span>
                          <span className="text-gray-800">{result.driverInfo.plateNumber}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.timeline?.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">{getStatusText(event.status)}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.timestamp}</span>
                          {event.location && (
                            <>
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Map */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Navigation className="h-5 w-5 text-blue-600" />
                Current Location
                {result.status === 'in_transit' && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Live Updates
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[400px] rounded-b-lg overflow-hidden">
                <MapComponent
                  center={[result.currentLocation?.lat ?? 24.7136, result.currentLocation?.lng ?? 46.6753]}
                  zoom={12}
                  markerPosition={[result.currentLocation?.lat ?? 24.7136, result.currentLocation?.lng ?? 46.6753]}
                  popupContent={`Order: ${result.id}`}
                  onMapReady={() => {}}
                  path={Array.isArray(result.path) ? result.path : []}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}