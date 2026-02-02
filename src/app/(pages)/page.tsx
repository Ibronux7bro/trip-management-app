'use client';

import React from 'react';
import DriverAnalysisCard from '@/app/(pages)/components/driver-analytics';
import FleetCard from '@/app/(pages)/components/fleets';
import PerformanceCard from '@/app/(pages)/components/performance-card';
import LocationCard from '@/app/(pages)/components/location-detail';
import TripTrackerCard from '@/app/(pages)/components/trip-tracker';
import { Truck, Users, MapPin, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useDashboard } from '@/hooks/useDashboard';
import { useTranslation } from '@/app/providers/translation-provider';

export default function DashboardHome() {
  const stats = useDashboard();
  const { t, isRTL } = useTranslation();

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 animate-fadeIn">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="إجمالي السائقين"
          value={stats.drivers.total}
          subtitle={`${stats.drivers.available} متاح`}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          trend={{
            value: 12,
            isPositive: true
          }}
        />
        <StatCard
          title="إجمالي المركبات"
          value={stats.vehicles.total}
          subtitle={`${stats.vehicles.available} متاحة`}
          icon={Truck}
          iconColor="text-green-600"
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />
        <StatCard
          title="الرحلات النشطة"
          value={stats.trips.inProgress}
          subtitle={`${stats.trips.total} إجمالي`}
          icon={MapPin}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />
        <StatCard
          title="معدل الإنجاز"
          value={`${Math.round((stats.trips.completed / stats.trips.total) * 100)}%`}
          subtitle="رحلات مكتملة"
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100 dark:bg-orange-900/20"
        />
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-4 rounded-md">
        <DriverAnalysisCard />
        <PerformanceCard />
        <LocationCard />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 rounded-md">
        <FleetCard />
        <TripTrackerCard />
      </div>
    </div>
  );
}
