"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/providers/translation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  MapPin, 
  Truck, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Users,
  BarChart3,
  Headphones
} from "lucide-react";

const services = [
  {
    id: 'booking',
    title: 'New Shipment Booking',
    description: 'Book a new shipment with our professional multi-step booking system',
    icon: Package,
    color: 'bg-blue-500',
    href: '/clients/booking',
    features: ['Multi-step form', 'Real-time pricing', 'Vehicle selection', 'Payment integration']
  },
  {
    id: 'tracking',
    title: 'Track Your Shipment',
    description: 'Real-time tracking with live maps and delivery updates',
    icon: MapPin,
    color: 'bg-green-500',
    href: '/tracking',
    features: ['Live GPS tracking', 'Delivery timeline', 'Driver information', 'ETA updates']
  },
  {
    id: 'orders',
    title: 'My Orders',
    description: 'View and manage all your shipment orders in one place',
    icon: BarChart3,
    color: 'bg-purple-500',
    href: '/orders',
    features: ['Order history', 'Status updates', 'Invoice downloads', 'Reorder options']
  },
  {
    id: 'support',
    title: 'Customer Support',
    description: '24/7 customer support for all your shipping needs',
    icon: Headphones,
    color: 'bg-orange-500',
    href: '/clients/support',
    features: ['24/7 availability', 'Live chat', 'Phone support', 'Email support']
  }
];

const stats = [
  { label: 'Active Orders', value: '1,234', icon: Package, color: 'text-blue-600' },
  { label: 'Delivered Today', value: '89', icon: Truck, color: 'text-green-600' },
  { label: 'Total Clients', value: '5,678', icon: Users, color: 'text-purple-600' },
  { label: 'Cities Covered', value: '25', icon: Globe, color: 'text-orange-600' }
];

const features = [
  {
    title: 'Professional Service',
    description: 'Saudi-style delivery service matching Aramex and Saudi Post standards',
    icon: Star
  },
  {
    title: 'Real-time Tracking',
    description: 'Live GPS tracking with detailed delivery timeline and notifications',
    icon: MapPin
  },
  {
    title: 'Secure & Reliable',
    description: 'Your packages are safe with our professional drivers and secure vehicles',
    icon: Shield
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and efficient delivery across all major Saudi cities',
    icon: Clock
  }
];

export default function ClientsPage() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  return (
    <div className={`p-6 space-y-8 max-w-7xl mx-auto animate-fadeIn ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="text-center space-y-4 animate-slideInFromTop">
        <div className={`flex items-center justify-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">نن</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          {t('clients.welcomeTo')} <span className="text-blue-600">نخبة النقل</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('clients.trustedPartner')}
        </p>
        <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
          ✅ {t('clients.professional')} • {t('clients.reliable')} • {t('clients.fast')}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideInFromBottom">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="text-center border-0 shadow-md animate-scaleIn hover:scale-105 transition-all duration-300 hover-lift" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-3 animate-float`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Services */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
          <p className="text-gray-600">Everything you need for your shipping requirements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${service.color} text-white`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{service.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Key Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={() => router.push(service.href)}
                >
                  Access {service.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us</h2>
          <p className="text-gray-600">Professional delivery service you can trust</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with any questions or concerns
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +966 50 123 4567
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@nukhbat-naql.sa
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/clients/support')}
              >
                <Headphones className="h-4 w-4 mr-2" />
                Live Chat Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          size="lg" 
          className="h-16 bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/clients/booking')}
        >
          <Package className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-semibold">New Booking</div>
            <div className="text-sm opacity-90">Ship your package now</div>
          </div>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="h-16"
          onClick={() => router.push('/tracking')}
        >
          <MapPin className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Track Package</div>
            <div className="text-sm text-gray-500">Enter tracking number</div>
          </div>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="h-16"
          onClick={() => router.push('/orders')}
        >
          <BarChart3 className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-semibold">My Orders</div>
            <div className="text-sm text-gray-500">View order history</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
