"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Wrench, 
  Archive, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Truck,
  Car,
  Bus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "@/lib/toast";
import type { Vehicle, VehicleResponse } from "@/types/vehicle";

async function fetchVehicle(id: string): Promise<VehicleResponse> {
  const response = await fetch(`/api/vehicles/${id}`);
  if (!response.ok) throw new Error('Failed to fetch vehicle');
  return response.json();
}

async function updateVehicleStatus(id: string, status: string): Promise<VehicleResponse> {
  const response = await fetch(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update vehicle');
  }
  
  return response.json();
}

const VehicleIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Car':
      return <Car className="h-5 w-5" />;
    case 'Truck':
      return <Truck className="h-5 w-5" />;
    case 'Bus':
      return <Bus className="h-5 w-5" />;
    default:
      return <Truck className="h-5 w-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Maintenance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Out of Service':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Minor':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Major':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicle(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => updateVehicleStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success(`Vehicle status updated to ${data.data.status}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleStatusChange = (status: string) => {
    if (confirm(`Are you sure you want to change the status to ${status}?`)) {
      statusMutation.mutate({ status });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading vehicle details...</span>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">{(error as Error)?.message || "Vehicle not found"}</span>
        </div>
      </div>
    );
  }

  const vehicle = data.data;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
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
                <VehicleIcon type={vehicle.vehicleType} />
                {vehicle.plateNumber}
              </CardTitle>
              <Badge className={`${getStatusColor(vehicle.status)} text-sm`}>
                {vehicle.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/vehicles/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {vehicle.status !== 'Maintenance' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('Maintenance')}
                  disabled={statusMutation.isPending}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Mark as Maintenance
                </Button>
              )}
              {vehicle.status !== 'Out of Service' && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange('Out of Service')}
                  disabled={statusMutation.isPending}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plate Number</p>
                  <p className="font-semibold text-lg">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <div className="flex items-center gap-2">
                    <VehicleIcon type={vehicle.vehicleType} />
                    <p className="font-semibold">{vehicle.vehicleType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-semibold">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-semibold">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={`${getStatusColor(vehicle.status)} w-fit`}>
                    {vehicle.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-semibold">{new Date().getFullYear() - vehicle.year} years</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{new Date(vehicle.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Logs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Wrench className="h-5 w-5 text-blue-600" />
                Maintenance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.maintenanceLogs && vehicle.maintenanceLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Next Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicle.maintenanceLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(log.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              {log.cost} SAR
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.nextDue ? new Date(log.nextDue).toLocaleDateString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No maintenance records found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accident Logs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Accident History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.accidentLogs && vehicle.accidentLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicle.accidentLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(log.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityColor(log.severity)} w-fit`}>
                              {log.severity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No accident records found</p>
                  <p className="text-sm text-gray-400 mt-1">This is good news! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push(`/vehicles/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </Button>
              
              {vehicle.status === 'Available' && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange('Maintenance')}
                  disabled={statusMutation.isPending}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              )}
              
              {vehicle.status === 'Maintenance' && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange('Available')}
                  disabled={statusMutation.isPending}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Available
                </Button>
              )}
              
              <Button
                className="w-full justify-start"
                variant="destructive"
                onClick={() => handleStatusChange('Out of Service')}
                disabled={statusMutation.isPending}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Vehicle
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Maintenance</span>
                <span className="font-semibold">
                  {vehicle.maintenanceLogs?.length || 0} records
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Accidents</span>
                <span className="font-semibold">
                  {vehicle.accidentLogs?.length || 0} incidents
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Maintenance Cost</span>
                <span className="font-semibold">
                  {vehicle.maintenanceLogs?.reduce((sum, log) => sum + log.cost, 0) || 0} SAR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Vehicle Age</span>
                <span className="font-semibold">
                  {new Date().getFullYear() - vehicle.year} years
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
