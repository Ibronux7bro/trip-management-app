"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Headphones, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Globe
} from "lucide-react";
import { toast } from "@/lib/toast";

const supportCategories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'booking', label: 'Booking Issues' },
  { value: 'tracking', label: 'Tracking Problems' },
  { value: 'payment', label: 'Payment Issues' },
  { value: 'delivery', label: 'Delivery Problems' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'feedback', label: 'Feedback & Suggestions' }
];

const urgencyLevels = [
  { value: 'low', label: 'Low - General Question', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium - Need Help', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High - Urgent Issue', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical - Emergency', color: 'bg-red-100 text-red-800' }
];

export default function SupportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    urgency: '',
    subject: '',
    message: '',
    orderId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Support ticket submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        urgency: '',
        subject: '',
        message: '',
        orderId: ''
      });
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Support Ticket Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for contacting us. Our support team will get back to you within 24 hours.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>Ticket Reference:</strong> #SUP-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Please save this reference number for future correspondence
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Submit Another Ticket
              </Button>
              <Button onClick={() => router.push('/clients')}>
                Back to Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <Headphones className="h-7 w-7 text-blue-600" />
              Customer Support
            </CardTitle>
          </div>
          <p className="text-gray-600 mt-2">
            We're here to help! Submit a support ticket and our team will get back to you promptly.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Submit Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID (Optional)</Label>
                    <Input
                      id="orderId"
                      value={formData.orderId}
                      onChange={(e) => handleChange('orderId', e.target.value)}
                      placeholder="e.g., ORD-1001"
                    />
                  </div>
                </div>

                {/* Support Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleChange('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Please provide detailed information about your issue or question..."
                    rows={6}
                    required
                  />
                </div>

                {formData.urgency && (
                  <div className="p-3 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Selected Priority: 
                      </span>
                      <Badge className={urgencyLevels.find(l => l.value === formData.urgency)?.color}>
                        {urgencyLevels.find(l => l.value === formData.urgency)?.label}
                      </Badge>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Support Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">+966 50 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@nukhbat-naql.sa</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-gray-600">Sun - Thu: 8 AM - 5 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Globe className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Languages</p>
                  <p className="text-sm text-gray-600">Arabic & English</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Response Times</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Issues:</span>
                  <Badge className="bg-red-100 text-red-800">1-2 hours</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Priority:</span>
                  <Badge className="bg-orange-100 text-orange-800">4-6 hours</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medium Priority:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">12-24 hours</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Priority:</span>
                  <Badge className="bg-green-100 text-green-800">1-2 days</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
