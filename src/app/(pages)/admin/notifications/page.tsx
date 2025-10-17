"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Phone,
  Users,
  Settings
} from "lucide-react";
import { toast } from "@/lib/toast";

const orderStatuses = [
  { value: 'received', label: 'Order Received', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_transit', label: 'In Transit', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'delayed', label: 'Delayed', color: 'bg-red-100 text-red-800' }
];

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testForm, setTestForm] = useState({
    orderId: 'ORD-1001',
    customerName: 'Ahmed Al-Rashid',
    customerEmail: 'ahmed@example.com',
    customerPhone: '+966501234567',
    status: 'in_transit',
    currentLocation: 'Riyadh, King Fahd Road',
    estimatedDelivery: '2024-01-20 14:30',
    driverName: 'Mohammed Ali',
    driverPhone: '+966509876543'
  });

  const [bulkForm, setBulkForm] = useState({
    customerEmails: 'test1@example.com\ntest2@example.com\ntest3@example.com',
    customerPhones: '+966501111111\n+966502222222\n+966503333333',
    status: 'delivered',
    message: 'Your orders have been delivered successfully!'
  });

  const handleTestNotification = async (type: 'email' | 'sms' | 'both') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_status_change',
          data: {
            orderId: testForm.orderId,
            status: testForm.status,
            customerEmail: type === 'email' || type === 'both' ? testForm.customerEmail : undefined,
            customerPhone: type === 'sms' || type === 'both' ? testForm.customerPhone : undefined,
            additionalData: {
              customerName: testForm.customerName,
              currentLocation: testForm.currentLocation,
              estimatedDelivery: testForm.estimatedDelivery,
              driverName: testForm.driverName,
              driverPhone: testForm.driverPhone
            }
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Test ${type} notification sent successfully!`);
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      toast.error('Error sending notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkNotifications = async () => {
    setIsLoading(true);
    try {
      const emails = bulkForm.customerEmails.split('\n').filter(email => email.trim());
      const phones = bulkForm.customerPhones.split('\n').filter(phone => phone.trim());
      
      const notifications: any[] = [];
      
      // Create notifications for emails
      emails.forEach((email, index) => {
        notifications.push({
          orderId: `BULK-${index + 1}`,
          customerName: `Customer ${index + 1}`,
          customerEmail: email.trim(),
          status: bulkForm.status
        });
      });

      // Create notifications for phones
      phones.forEach((phone, index) => {
        const existingNotification = notifications[index];
        if (existingNotification) {
          existingNotification.customerPhone = phone.trim();
        } else {
          notifications.push({
            orderId: `BULK-${notifications.length + 1}`,
            customerName: `Customer ${notifications.length + 1}`,
            customerPhone: phone.trim(),
            status: bulkForm.status
          });
        }
      });

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bulk_notifications',
          data: { notifications }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Bulk notifications sent! ${result.results.totalSent} successful, ${result.results.failed} failed`);
      } else {
        toast.error('Failed to send bulk notifications');
      }
    } catch (error) {
      toast.error('Error sending bulk notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications?action=test');
      const result = await response.json();
      
      if (result.success) {
        toast.success('Quick test notifications sent!');
      } else {
        toast.error('Quick test failed');
      }
    } catch (error) {
      toast.error('Error running quick test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <Bell className="h-7 w-7 text-blue-600" />
            Notification Management
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Test and manage email and SMS notifications for order status updates
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Notification Test */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Test Single Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={testForm.orderId}
                  onChange={(e) => setTestForm(prev => ({ ...prev, orderId: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={testForm.customerName}
                  onChange={(e) => setTestForm(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={testForm.customerEmail}
                  onChange={(e) => setTestForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={testForm.customerPhone}
                  onChange={(e) => setTestForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select value={testForm.status} onValueChange={(value) => setTestForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  value={testForm.currentLocation}
                  onChange={(e) => setTestForm(prev => ({ ...prev, currentLocation: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                <Input
                  id="estimatedDelivery"
                  value={testForm.estimatedDelivery}
                  onChange={(e) => setTestForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={testForm.driverName}
                  onChange={(e) => setTestForm(prev => ({ ...prev, driverName: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={() => handleTestNotification('email')}
                disabled={isLoading}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Test Email
              </Button>
              <Button 
                onClick={() => handleTestNotification('sms')}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test SMS
              </Button>
              <Button 
                onClick={() => handleTestNotification('both')}
                disabled={isLoading}
                variant="secondary"
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Test Both
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Notifications */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Bulk Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmails">Customer Emails (one per line)</Label>
              <Textarea
                id="customerEmails"
                rows={4}
                value={bulkForm.customerEmails}
                onChange={(e) => setBulkForm(prev => ({ ...prev, customerEmails: e.target.value }))}
                placeholder="customer1@example.com&#10;customer2@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhones">Customer Phones (one per line)</Label>
              <Textarea
                id="customerPhones"
                rows={4}
                value={bulkForm.customerPhones}
                onChange={(e) => setBulkForm(prev => ({ ...prev, customerPhones: e.target.value }))}
                placeholder="+966501111111&#10;+966502222222"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bulkStatus">Status for All</Label>
              <Select value={bulkForm.status} onValueChange={(value) => setBulkForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <Badge className={status.color}>{status.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleBulkNotifications}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Send Bulk Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleQuickTest}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Quick Test (Default Values)
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>All notifications are simulated for testing purposes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Notification Status Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStatuses.map((status) => (
              <div key={status.value} className="bg-white p-4 rounded-lg border">
                <Badge className={`${status.color} mb-2`}>{status.label}</Badge>
                <div className="text-sm text-gray-600">
                  <p className="flex items-center gap-1 mb-1">
                    <Mail className="h-3 w-3" />
                    Email template available
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    SMS template available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
