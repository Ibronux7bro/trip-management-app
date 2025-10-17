"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  Car, 
  Bus,
  Loader2,
  AlertCircle
} from "lucide-react";
import type { Vehicle, VehicleFilters, VehiclesResponse } from "@/types/vehicle";

async function fetchVehicles(filters: VehicleFilters & { page: number; limit: number }): Promise<VehiclesResponse> {
  const params = new URLSearchParams();
  
  if (filters.plateNumber) params.append('plateNumber', filters.plateNumber);
  if (filters.status) params.append('status', filters.status);
  if (filters.vehicleType) params.append('vehicleType', filters.vehicleType);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/vehicles?${params}`);
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  return response.json();
}

const VehicleIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Car':
      return <Car className="h-4 w-4" />;
    case 'Truck':
      return <Truck className="h-4 w-4" />;
    case 'Bus':
      return <Bus className="h-4 w-4" />;
    default:
      return <Truck className="h-4 w-4" />;
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

export default function VehiclesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles', filters, page, limit],
    queryFn: () => fetchVehicles({ ...filters, page, limit }),
  });

  const handleFilterChange = (key: keyof VehicleFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <Truck className="h-7 w-7 text-blue-600" />
              Vehicle Management
            </CardTitle>
            <Button 
              onClick={() => router.push('/vehicles/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
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
                  placeholder="Search by plate number..."
                  value={filters.plateNumber || ''}
                  onChange={(e) => handleFilterChange('plateNumber', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Select 
                value={filters.vehicleType || 'all'} 
                onValueChange={(value) => handleFilterChange('vehicleType', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(filters.plateNumber || filters.status || filters.vehicleType) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Loading vehicles...</p>
            </div>
          )}
          
          {error && (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{(error as Error)?.message || "Failed to load vehicles"}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && data && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Plate Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((vehicle: Vehicle) => (
                      <TableRow key={vehicle.id} className="hover:bg-gray-50/50 border-b">
                        <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <VehicleIcon type={vehicle.vehicleType} />
                            <span>{vehicle.vehicleType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(vehicle.status)} flex items-center gap-1 w-fit`}>
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                              className="text-xs h-8 px-3"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}
                              className="text-xs h-8 px-3"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.data.length === 0 && (
                <div className="p-8 text-center">
                  <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No vehicles found</p>
                  {(filters.plateNumber || filters.status || filters.vehicleType) && (
                    <Button variant="outline" onClick={clearFilters} className="mt-2">
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} vehicles
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
