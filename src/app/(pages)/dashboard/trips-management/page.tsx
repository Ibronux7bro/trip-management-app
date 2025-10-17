"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Truck, 
  Users,
  MapPin,
  Calendar,
  Clock,
  Package,
  Route,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Trip {
  id: string;
  tripNumber: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  route: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  orders: Order[];
  totalCapacity: number;
  usedCapacity: number;
  estimatedDuration: string;
  totalDistance: number;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  fromAddress: string;
  toAddress: string;
  packageType: string;
  weight: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
}

// Mock data
const mockTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TRP-001',
    driverId: '1',
    driverName: 'Ahmed Al-Rashid',
    vehicleId: '1',
    vehiclePlate: 'ABC-1234',
    route: 'Riyadh → Jeddah → Makkah',
    status: 'planned',
    scheduledDate: '2024-01-20',
    scheduledTime: '08:00',
    totalCapacity: 1000,
    usedCapacity: 750,
    estimatedDuration: '6 hours',
    totalDistance: 950,
    createdAt: '2024-01-15T10:00:00Z',
    orders: [
      {
        id: '1',
        orderNumber: 'ORD-1001',
        customerName: 'Mohammed Ali',
        fromAddress: 'Riyadh, King Fahd Road',
        toAddress: 'Jeddah, Corniche',
        packageType: 'Electronics',
        weight: 25,
        priority: 'high',
        status: 'pending'
      },
      {
        id: '2',
        orderNumber: 'ORD-1002',
        customerName: 'Sara Ahmed',
        fromAddress: 'Riyadh, Olaya District',
        toAddress: 'Makkah, Al-Aziziyah',
        packageType: 'Documents',
        weight: 5,
        priority: 'medium',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    tripNumber: 'TRP-002',
    driverId: '2',
    driverName: 'Omar Hassan',
    vehicleId: '2',
    vehiclePlate: 'XYZ-5678',
    route: 'Dammam → Khobar → Dhahran',
    status: 'in_progress',
    scheduledDate: '2024-01-19',
    scheduledTime: '14:00',
    totalCapacity: 800,
    usedCapacity: 600,
    estimatedDuration: '4 hours',
    totalDistance: 120,
    createdAt: '2024-01-14T09:00:00Z',
    orders: [
      {
        id: '3',
        orderNumber: 'ORD-1003',
        customerName: 'Khalid Bin Salman',
        fromAddress: 'Dammam, King Abdulaziz Road',
        toAddress: 'Khobar, Prince Faisal Road',
        packageType: 'Furniture',
        weight: 150,
        priority: 'low',
        status: 'picked_up'
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function TripsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Filter trips based on search and status
  const filteredTrips = mockTrips.filter(trip => {
    const matchesSearch = trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTrip = () => {
    toast.success('Create trip functionality would be implemented here');
  };

  const handleOptimizeRoute = (tripId: string) => {
    toast.success(`Route optimization started for trip ${tripId}`);
  };

  const handleAssignDriver = (tripId: string) => {
    toast.success(`Driver assignment dialog would open for trip ${tripId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <Route className="h-7 w-7 text-blue-600" />
              Trip Management & Pooling
            </CardTitle>
            <Button 
              onClick={handleCreateTrip}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Trip
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Manage trips and optimize routes with pooling system for multiple orders
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trips, drivers, or routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Trip Info</TableHead>
                  <TableHead>Driver & Vehicle</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => (
                  <TableRow key={trip.id} className="hover:bg-gray-50/50 border-b">
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.tripNumber}</div>
                        <div className="text-sm text-gray-500">
                          {trip.totalDistance} km • {trip.estimatedDuration}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.driverName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {trip.vehiclePlate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{trip.route}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm">{trip.scheduledDate}</div>
                          <div className="text-xs text-gray-500">{trip.scheduledTime}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">
                          {trip.usedCapacity}/{trip.totalCapacity} kg
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(trip.usedCapacity / trip.totalCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{trip.orders.length}</span>
                        <span className="text-xs text-gray-500">orders</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(trip.status)} flex items-center gap-1 w-fit`}>
                        {trip.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {trip.status === 'in_progress' && <Clock className="h-3 w-3" />}
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTrip(trip)}
                          className="text-xs h-8 px-3"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptimizeRoute(trip.id)}
                          className="text-xs h-8 px-3"
                        >
                          <Route className="h-3 w-3 mr-1" />
                          Optimize
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTrips.length === 0 && (
            <div className="p-8 text-center">
              <Route className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No trips found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trip Details Modal/Card */}
      {selectedTrip && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Trip Details - {selectedTrip.tripNumber}
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedTrip(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trip Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Driver & Vehicle</span>
                </div>
                <p className="text-sm">{selectedTrip.driverName}</p>
                <p className="text-xs text-gray-600">{selectedTrip.vehiclePlate}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Route</span>
                </div>
                <p className="text-sm">{selectedTrip.route}</p>
                <p className="text-xs text-gray-600">{selectedTrip.totalDistance} km</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Schedule</span>
                </div>
                <p className="text-sm">{selectedTrip.scheduledDate}</p>
                <p className="text-xs text-gray-600">{selectedTrip.scheduledTime}</p>
              </div>
            </div>

            {/* Orders in this Trip */}
            <div>
              <h4 className="font-semibold mb-3">Pooled Orders ({selectedTrip.orders.length})</h4>
              <div className="space-y-3">
                {selectedTrip.orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-gray-600">From: {order.fromAddress}</p>
                        <p className="text-gray-600">To: {order.toAddress}</p>
                      </div>
                      <div>
                        <p>Package: {order.packageType}</p>
                        <p>Weight: {order.weight} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => handleAssignDriver(selectedTrip.id)}>
                <Users className="h-4 w-4 mr-2" />
                Reassign Driver
              </Button>
              <Button variant="outline" onClick={() => handleOptimizeRoute(selectedTrip.id)}>
                <Route className="h-4 w-4 mr-2" />
                Optimize Route
              </Button>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Track Live
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
