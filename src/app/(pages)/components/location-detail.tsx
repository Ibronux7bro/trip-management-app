'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getDashboardStats } from '@/services';

// Define types for our data structures
interface ChartDataPoint {
  value: number;
}

interface Stats {
  routes: {
    total: number;
  };
}

interface ChartProps {
  data: ChartDataPoint[];
}

// Dynamically import Recharts components with no SSR
const DynamicChart = dynamic(
  () =>
    import('recharts').then((recharts) => {
      const { AreaChart, Area, ResponsiveContainer } = recharts;
      return function Chart({ data }: ChartProps) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );
      };
    }),
  { ssr: false }
);

// Dummy chart data
const chartData: ChartDataPoint[] = [
  { value: 30 },
  { value: 45 },
  { value: 35 },
  { value: 50 },
  { value: 40 },
  { value: 60 },
];

const LocationStatsCard = () => {
  const [stats, setStats] = useState<Stats>({ routes: { total: 0 } });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  // Constants for reused styles
  const metricClasses = 'text-4xl font-semibold';
  const subtitleClasses = 'text-xs text-gray-400';
  const iconContainerClasses =
    'size-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-2';
  const iconClasses = 'size-5 text-emerald-500';

  return (
    <Card className="bg-card text-muted-foreground w-full relative rounded-md overflow-hidden shadow-xl">
      <CardContent className="pt-6 pb-0">
        <div className="relative z-10">
          <div className={iconContainerClasses}>
            <MapPin className={iconClasses} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className={metricClasses}>{stats.routes.total}</span>
            <span className={subtitleClasses}>All Locations</span>
          </div>
        </div>
        <div className="h-24 mt-4 -mx-6">
          <DynamicChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationStatsCard;
