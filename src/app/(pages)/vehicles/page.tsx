"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { VehicleDialog } from "@/components/features/vehicle-dialog";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Truck, 
  Car, 
  Bus,
  Loader2,
  AlertCircle,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "@/app/providers/translation-provider";
import { cn } from "@/lib/utils";
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
  const queryClient = useQueryClient();
  const { t, isRTL } = useTranslation();
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['vehicles', filters, page, limit],
    queryFn: () => fetchVehicles({ ...filters, page, limit }),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
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

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('فشل في حذف المركبة');
      }

      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('حدث خطأ أثناء حذف المركبة');
    }
  };

  const handleDialogSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <Card className="border-0 shadow-lg card-entrance animate-stagger-1">
        <CardHeader className="pb-3 px-4 md:px-6">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <CardTitle className={`flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Truck className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
              <span className="truncate">إدارة المركبات</span>
            </CardTitle>
            <div className={`flex gap-2 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex-1 sm:flex-none hover-scale"
              >
                <RefreshCw className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2', isFetching && 'animate-spin')} />
                تحديث
              </Button>
              <Button 
                onClick={handleAddVehicle}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 hover-lift"
                size="sm"
              >
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>إضافة مركبة</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg card-entrance animate-stagger-2">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plate number..."
                  value={filters.plateNumber || ''}
                  onChange={(e) => handleFilterChange('plateNumber', e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-1 sm:flex-none sm:w-48">
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

              <div className="flex-1 sm:flex-none sm:w-48">
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
                <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto" size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="border-0 shadow-lg overflow-hidden card-entrance animate-stagger-3">
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
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="font-semibold">رقم اللوحة</TableHead>
                      <TableHead className="font-semibold">النوع</TableHead>
                      <TableHead className="font-semibold">الموديل</TableHead>
                      <TableHead className="font-semibold">السنة</TableHead>
                      <TableHead className="font-semibold">الحالة</TableHead>
                      <TableHead className="font-semibold text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((vehicle: Vehicle, index: number) => (
                      <TableRow 
                        key={vehicle.id} 
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 smooth-transition animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <VehicleIcon type={vehicle.vehicleType} />
                            <span>{vehicle.vehicleType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(vehicle.status)} flex items-center gap-1 w-fit`}>
                            {vehicle.status === 'Available' ? 'متاحة' : vehicle.status === 'Maintenance' ? 'صيانة' : 'خارج الخدمة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVehicle(vehicle)}
                              className="h-8 px-2 hover-scale"
                              title="تعديل"
                            >
                              <Edit className="h-3.5 w-3.5 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className={cn(
                                'h-8 px-2 hover-scale',
                                deleteConfirm === vehicle.id && 'bg-red-100 dark:bg-red-900/20'
                              )}
                              title={deleteConfirm === vehicle.id ? 'اضغط مرة أخرى للتأكيد' : 'حذف'}
                            >
                              <Trash2 className={cn(
                                'h-3.5 w-3.5',
                                deleteConfirm === vehicle.id ? 'text-red-600 animate-wiggle' : 'text-red-500'
                              )} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.data.length === 0 && (
                <EmptyState
                  icon={Truck}
                  title="لا توجد مركبات"
                  description={(filters.plateNumber || filters.status || filters.vehicleType)
                    ? "لا توجد مركبات تطابق معايير البحث"
                    : "لم يتم إضافة أي مركبات بعد"}
                  action={(filters.plateNumber || filters.status || filters.vehicleType) ? {
                    label: 'مسح الفلاتر',
                    onClick: clearFilters
                  } : undefined}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
                  <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} vehicles
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 px-3"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-8 px-3"
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

      {/* Vehicle Dialog */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={selectedVehicle}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
