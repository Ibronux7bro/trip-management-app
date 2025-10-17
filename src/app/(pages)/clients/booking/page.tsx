"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/app/providers/translation-provider";
import { Truck, MapPin, CreditCard, Calendar, Phone, User, Package, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface BookingForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carType: string;
  carModel: string;
  plateNumber: string;
  fromCity: string;
  toCity: string;
  fromAddress: string;
  toAddress: string;
  paymentMethod: string;
  scheduledDate: string;
  scheduledTime: string;
  packageType: string;
  specialInstructions: string;
}

const SAUDI_CITIES = [
  "Riyadh", "Jeddah", "Makkah", "Madinah",
  "Dammam", "Khobar", "Dhahran", "Tabuk",
  "Buraidah", "Khamis Mushait", "Hail", "Najran",
  "Taif", "Jubail", "Yanbu", "Abha"
];

const CAR_TYPES = [
  { value: "sedan", label: "Sedan", icon: "🚗" },
  { value: "suv", label: "SUV", icon: "🚙" },
  { value: "pickup", label: "Pickup", icon: "🛻" },
  { value: "van", label: "Van", icon: "🚐" },
  { value: "truck", label: "Truck", icon: "🚚" }
];

const PACKAGE_TYPES = [
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "electronics", label: "Electronics", icon: "📱" },
  { value: "clothing", label: "Clothing", icon: "👕" },
  { value: "food", label: "Food", icon: "🍽️" },
  { value: "furniture", label: "Furniture", icon: "🪑" },
  { value: "other", label: "Other", icon: "📦" }
];

const PAYMENT_METHODS = [
  { value: "mada", label: "Mada", icon: "💳" },
  { value: "card", label: "Credit Card", icon: "💳" },
  { value: "apple_pay", label: "Apple Pay", icon: "📱" }
];

export default function BookingPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    carType: "",
    carModel: "",
    plateNumber: "",
    fromCity: "",
    toCity: "",
    fromAddress: "",
    toAddress: "",
    paymentMethod: "",
    scheduledDate: "",
    scheduledTime: "",
    packageType: "",
    specialInstructions: ""
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order created successfully! Order ID: ${data.id}`);
      setStep(4); // Success step
    },
    onError: (error: Error) => {
      toast.error(`Failed to create order: ${error.message}`);
    }
  });

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const orderData = {
      carType: form.carType,
      carModel: form.carModel,
      plateNumber: form.plateNumber,
      fromCity: form.fromCity,
      toCity: form.toCity,
      paymentMethod: form.paymentMethod,
      price: calculatePrice(),
      customerInfo: {
        name: form.customerName,
        phone: form.customerPhone,
        email: form.customerEmail,
        fromAddress: form.fromAddress,
        toAddress: form.toAddress,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        packageType: form.packageType,
        specialInstructions: form.specialInstructions
      }
    };
    createOrderMutation.mutate(orderData);
  };

  const calculatePrice = (): number => {
    const basePrice = 100;
    const carTypeMultiplier = {
      sedan: 1,
      suv: 1.3,
      pickup: 1.5,
      van: 1.8,
      truck: 2.5
    }[form.carType] || 1;
    
    return Math.round(basePrice * carTypeMultiplier * (1 + Math.random() * 0.5));
  };

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(form.customerName && form.customerPhone && form.customerEmail);
      case 2:
        return !!(form.fromCity && form.toCity && form.fromAddress && form.toAddress);
      case 3:
        return !!(form.carType && form.paymentMethod && form.scheduledDate);
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <p className="text-sm text-muted-foreground">Enter your personal details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Full Name *</Label>
          <Input
            id="customerName"
            placeholder="Enter your full name"
            value={form.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone Number *</Label>
          <Input
            id="customerPhone"
            placeholder="+966 5X XXX XXXX"
            value={form.customerPhone}
            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="customerEmail">Email Address *</Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="example@email.com"
            value={form.customerEmail}
            onChange={(e) => handleInputChange("customerEmail", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <MapPin className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Shipment Details</h3>
          <p className="text-sm text-muted-foreground">Specify pickup and delivery locations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-700">Pickup Location</span>
          </div>
          <div className="space-y-3">
            <Select value={form.fromCity} onValueChange={(value) => handleInputChange("fromCity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {SAUDI_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Detailed address"
              value={form.fromAddress}
              onChange={(e) => handleInputChange("fromAddress", e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-4 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-700">Delivery Location</span>
          </div>
          <div className="space-y-3">
            <Select value={form.toCity} onValueChange={(value) => handleInputChange("toCity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {SAUDI_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Detailed address"
              value={form.toAddress}
              onChange={(e) => handleInputChange("toAddress", e.target.value)}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="packageType">Package Type</Label>
        <Select value={form.packageType} onValueChange={(value) => handleInputChange("packageType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select package type" />
          </SelectTrigger>
          <SelectContent>
            {PACKAGE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Truck className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Transport & Payment</h3>
          <p className="text-sm text-muted-foreground">Select vehicle type and payment method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Vehicle Type *</Label>
          <div className="grid grid-cols-1 gap-2">
            {CAR_TYPES.map((car) => (
              <Card 
                key={car.value}
                className={`p-3 cursor-pointer transition-all ${
                  form.carType === car.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange("carType", car.value)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{car.icon}</span>
                  <span className="font-medium">{car.label}</span>
                  {form.carType === car.value && <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carModel">Vehicle Model</Label>
            <Input
              id="carModel"
              placeholder="e.g., Toyota Camry"
              value={form.carModel}
              onChange={(e) => handleInputChange("carModel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plateNumber">License Plate</Label>
            <Input
              id="plateNumber"
              placeholder="e.g., ABC-1234"
              value={form.plateNumber}
              onChange={(e) => handleInputChange("plateNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Shipping Date *</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={form.scheduledDate}
            onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduledTime">Shipping Time</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={form.scheduledTime}
            onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Payment Method *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((payment) => (
            <Card
              key={payment.value}
              className={`p-3 cursor-pointer transition-all ${
                form.paymentMethod === payment.value ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleInputChange("paymentMethod", payment.value)}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{payment.icon}</span>
                <span className="font-medium">{payment.label}</span>
                {form.paymentMethod === payment.value && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Special Instructions</Label>
        <textarea
          id="specialInstructions"
          className="w-full p-3 border rounded-md resize-none"
          rows={3}
          placeholder="Any additional instructions for the driver..."
          value={form.specialInstructions}
          onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
        />
      </div>

      {form.carType && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Estimated Cost</h4>
              <p className="text-sm text-blue-700">Including VAT</p>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {calculatePrice()} SAR
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-green-100 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Order Created Successfully!</h3>
        <p className="text-muted-foreground">We will contact you shortly to confirm details</p>
      </div>
      <Card className="p-6 bg-green-50 border-green-200">
        <h4 className="font-semibold mb-4">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>From:</span>
            <span className="font-medium">{form.fromCity}</span>
          </div>
          <div className="flex justify-between">
            <span>To:</span>
            <span className="font-medium">{form.toCity}</span>
          </div>
          <div className="flex justify-between">
            <span>Vehicle Type:</span>
            <span className="font-medium">{CAR_TYPES.find(c => c.value === form.carType)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium">{form.scheduledDate}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total Cost:</span>
            <span>{calculatePrice()} SAR</span>
          </div>
        </div>
      </Card>
      <Button onClick={() => window.location.href = '/orders'} className="w-full">
        View My Orders
      </Button>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            New Shipment Booking
          </CardTitle>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-8 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {step < 4 && (
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid(step)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(step) || createOrderMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}