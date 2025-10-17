"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, OrderStatus } from "@/types/order";
import { useTranslation } from "@/app/providers/translation-provider";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Loader2
} from "lucide-react";
import { toast } from "@/lib/toast";

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to load orders");
  const json = await res.json();
  return json.data || [];
}

async function updateOrderStatus(id: string, status: OrderStatus, location?: { lat: number; lng: number }): Promise<Order> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      status,
      currentLocation: location,
      path: location ? [location] : undefined
    }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export default function AdminPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data, isLoading, error } = useQuery<Order[]>({ 
    queryKey: ["orders"], 
    queryFn: fetchOrders,
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  const { mutate: setStatus, isPending } = useMutation({
    mutationFn: ({ id, status, location }: { id: string; status: OrderStatus; location?: { lat: number; lng: number } }) => 
      updateOrderStatus(id, status, location),
    onSuccess: (updatedOrder) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order ${updatedOrder.id} status updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order: ${error.message}`);
    }
  });

  const filteredOrders = (data || []).filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.toCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-3 w-3" />;
      case 'received':
        return <CheckCircle className="h-3 w-3" />;
      case 'in_transit':
        return <Truck className="h-3 w-3" />;
      case 'delivered':
        return <Package className="h-3 w-3" />;
      case 'rejected':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      pending: 'Pending',
      received: 'Confirmed',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      rejected: 'Rejected'
    };
    return statusMap[status] || status;
  };

  const onUpdateStatus = (id: string, status: OrderStatus) => {
    const location = status === 'in_transit' ? {
      lat: 24.7136 + (Math.random() - 0.5) * 0.1,
      lng: 46.6753 + (Math.random() - 0.5) * 0.1
    } : undefined;
    
    setStatus({ id, status, location });
  };

  const orderStats = {
    total: data?.length || 0,
    pending: data?.filter(o => o.status === 'pending').length || 0,
    received: data?.filter(o => o.status === 'received').length || 0,
    in_transit: data?.filter(o => o.status === 'in_transit').length || 0,
    delivered: data?.filter(o => o.status === 'delivered').length || 0,
    rejected: data?.filter(o => o.status === 'rejected').length || 0
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <Package className="h-7 w-7 text-blue-600" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { value: orderStats.total, label: 'Total Orders', color: 'text-blue-600' },
          { value: orderStats.pending, label: 'Pending', color: 'text-yellow-600' },
          { value: orderStats.received, label: 'Confirmed', color: 'text-blue-600' },
          { value: orderStats.in_transit, label: 'In Transit', color: 'text-purple-600' },
          { value: orderStats.delivered, label: 'Delivered', color: 'text-green-600' },
          { value: orderStats.rejected, label: 'Rejected', color: 'text-red-600' }
        ].map((stat, index) => (
          <Card key={index} className="shadow-md border-0">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="received">Confirmed</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
            </div>
          )}
          
          {error && (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{(error as Error)?.message || "Failed to load orders"}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 border-b">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.carType}</div>
                          <div className="text-sm text-gray-500">{order.carModel}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.fromCity}</TableCell>
                      <TableCell>{order.toCity}</TableCell>
                      <TableCell className="font-medium">{order.price} SAR</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || order.status === 'received'}
                            onClick={() => onUpdateStatus(order.id, "received")}
                            className="text-xs h-8 px-3"
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || order.status === 'in_transit'}
                            onClick={() => onUpdateStatus(order.id, "in_transit")}
                            className="text-xs h-8 px-3"
                          >
                            Ship
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || order.status === 'delivered'}
                            onClick={() => onUpdateStatus(order.id, "delivered")}
                            className="text-xs h-8 px-3"
                          >
                            Deliver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isPending || order.status === 'rejected'}
                            onClick={() => onUpdateStatus(order.id, "rejected")}
                            className="text-xs h-8 px-3"
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOrders.length === 0 && !isLoading && (
                <div className="p-8 text-center">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}