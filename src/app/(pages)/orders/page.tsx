"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PageLoading, InlineLoading } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/alert-message";
import type { Order } from "@/types/order";
import { useTranslation } from "@/app/providers/translation-provider";

export default function OrdersPage() {
  const { t, isRTL } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const json = await res.json();
      return json.data || [];
    },
  });

  return (
    <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-xl font-semibold">{t('orders.title')}</h2>
            <button onClick={() => refetch()} className="text-sm underline">{t('orders.refresh')}</button>
          </div>
          <Separator />

          {isLoading && <PageLoading />}
          {error && (
            <ErrorAlert 
              message={String((error as any)?.message || error)}
              onClose={() => refetch()}
            />
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('orders.table.id')}</TableHead>
                  <TableHead>{t('orders.table.car')}</TableHead>
                  <TableHead>{t('orders.table.from')}</TableHead>
                  <TableHead>{t('orders.table.to')}</TableHead>
                  <TableHead>{t('orders.table.price')}</TableHead>
                  <TableHead>{t('orders.table.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.carType} - {o.carModel}</TableCell>
                    <TableCell>{o.fromCity}</TableCell>
                    <TableCell>{o.toCity}</TableCell>
                    <TableCell>{o.price?.toFixed?.(2) ?? 0}</TableCell>
                    <TableCell className="capitalize">{o.status.replaceAll('_',' ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
