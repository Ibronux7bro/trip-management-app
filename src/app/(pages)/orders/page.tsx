"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Package, 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  Plus,
  Eye,
  Truck
} from "lucide-react";
import type { Order } from "@/types/order";
import { useTranslation } from "@/app/providers/translation-provider";
import { cn } from "@/lib/utils";

// Status badge colors
const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'قيد الانتظار', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    confirmed: { label: 'مؤكد', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    in_transit: { label: 'قيد التوصيل', className: 'bg-purple-100 text-purple-800 border-purple-300' },
    delivered: { label: 'تم التوصيل', className: 'bg-green-100 text-green-800 border-green-300' },
    cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800 border-red-300' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return (
    <Badge className={cn('border', config.className)}>
      {config.label}
    </Badge>
  );
};

export default function OrdersPage() {
  const { t, isRTL } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, error, refetch, isFetching } = useQuery<Order[]>({
    queryKey: ["orders", searchQuery, statusFilter, page],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const json = await res.json();
      return json.data || [];
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
  
  // Filter data
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter(order => {
      const matchesSearch = searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold">
              <Package className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
              <span>إدارة الطلبات</span>
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', isFetching && 'animate-spin')} />
                <span>تحديث</span>
              </Button>
              <Button 
                size="sm"
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>طلب جديد</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث برقم الطلب، رقم اللوحة، أو نوع السيارة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-1 sm:flex-none sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="حالة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="in_transit">قيد التوصيل</SelectItem>
                    <SelectItem value="delivered">تم التوصيل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="w-full sm:w-auto"
                >
                  مسح الفلاتر
                </Button>
              )}
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
              <p className="mt-2 text-sm text-gray-500">جاري تحميل الطلبات...</p>
            </div>
          )}
          
          {error && (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{String((error as any)?.message || 'فشل في تحميل الطلبات')}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2" size="sm">
                إعادة المحاولة
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredData && (
            <>
              {filteredData.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="لا توجد طلبات"
                  description={searchQuery || statusFilter !== 'all' 
                    ? "لا توجد طلبات تطابق معايير البحث"
                    : "لم يتم إنشاء أي طلبات بعد"}
                  action={searchQuery || statusFilter !== 'all' ? {
                    label: 'مسح الفلاتر',
                    onClick: () => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }
                  } : undefined}
                />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                          <TableHead className="font-semibold">رقم الطلب</TableHead>
                          <TableHead className="font-semibold">السيارة</TableHead>
                          <TableHead className="font-semibold">من</TableHead>
                          <TableHead className="font-semibold">إلى</TableHead>
                          <TableHead className="font-semibold">السعر</TableHead>
                          <TableHead className="font-semibold">الحالة</TableHead>
                          <TableHead className="font-semibold text-center">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="font-medium">{order.carModel}</div>
                                  <div className="text-xs text-gray-500">{order.carType}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{order.fromCity}</div>
                              <div className="text-xs text-gray-500">{order.plateNumber}</div>
                            </TableCell>
                            <TableCell className="font-medium">{order.toCity}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {order.price?.toFixed?.(2) ?? 0} ر.س
                            </TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Stats Footer */}
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      عرض {filteredData.length} من إجمالي {data?.length || 0} طلب
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
