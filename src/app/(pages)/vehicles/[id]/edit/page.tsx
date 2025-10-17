"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Edit } from "lucide-react";
import { toast } from "@/lib/toast";
import type { VehicleFormData, VehicleResponse } from "@/types/vehicle";

async function fetchVehicle(id: string): Promise<VehicleResponse> {
  const response = await fetch(`/api/vehicles/${id}`);
  if (!response.ok) throw new Error('Failed to fetch vehicle');
  return response.json();
}

async function updateVehicle(id: string, data: VehicleFormData): Promise<VehicleResponse> {
  const response = await fetch(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update vehicle');
  }
  
  return response.json();
}

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;
  
  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: '',
    vehicleType: 'Car',
    model: '',
    year: new Date().getFullYear(),
    status: 'Available',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch vehicle data
  const { data: vehicleData, isLoading: isLoadingVehicle, error: vehicleError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicle(id),
  });

  // Update form data when vehicle data is loaded
  useEffect(() => {
    if (vehicleData?.success && vehicleData.data) {
      const vehicle = vehicleData.data;
      setFormData({
        plateNumber: vehicle.plateNumber,
        vehicleType: vehicle.vehicleType,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
      });
    }
  }, [vehicleData]);

  const updateMutation = useMutation({
    mutationFn: (data: VehicleFormData) => updateVehicle(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success(`Vehicle ${data.data.plateNumber} updated successfully!`);
      router.push(`/vehicles/${id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'Plate number is required';
    } else if (!/^[A-Z]{3}-\d{4}$/.test(formData.plateNumber)) {
      newErrors.plateNumber = 'Plate number must be in format ABC-1234';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoadingVehicle) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading vehicle data...</span>
        </div>
      </div>
    );
  }

  if (vehicleError || !vehicleData?.success) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <span className="text-red-600">{(vehicleError as Error)?.message || "Vehicle not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
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
              <Edit className="h-7 w-7 text-blue-600" />
              Edit Vehicle - {vehicleData.data.plateNumber}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plate Number */}
              <div className="space-y-2">
                <Label htmlFor="plateNumber">
                  Plate Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plateNumber"
                  placeholder="ABC-1234"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                  className={errors.plateNumber ? 'border-red-500' : ''}
                />
                {errors.plateNumber && (
                  <p className="text-sm text-red-600">{errors.plateNumber}</p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">
                  Vehicle Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => handleInputChange('vehicleType', value)}
                >
                  <SelectTrigger className={errors.vehicleType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">🚗 Car</SelectItem>
                    <SelectItem value="Truck">🚛 Truck</SelectItem>
                    <SelectItem value="Bus">🚌 Bus</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehicleType && (
                  <p className="text-sm text-red-600">{errors.vehicleType}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  placeholder="Toyota Camry"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && (
                  <p className="text-sm text-red-600">{errors.model}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">✅ Available</SelectItem>
                    <SelectItem value="Maintenance">🔧 Maintenance</SelectItem>
                    <SelectItem value="Out of Service">❌ Out of Service</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Vehicle
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📝 Current Vehicle Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Created:</span>
              <br />
              {new Date(vehicleData.data.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <br />
              {new Date(vehicleData.data.updatedAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Age:</span>
              <br />
              {new Date().getFullYear() - vehicleData.data.year} years
            </div>
            <div>
              <span className="font-medium">Maintenance Records:</span>
              <br />
              {vehicleData.data.maintenanceLogs?.length || 0} records
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
