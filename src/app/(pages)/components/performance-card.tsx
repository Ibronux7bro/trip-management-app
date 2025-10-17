'use client';

import React from 'react';
import { Clock, User2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';

const PerformanceCard = () => {
  const stats = useDashboard();

  return (
    <Card className="bg-card text-muted-foreground rounded-md shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground">
          Performance Overview
        </CardTitle>
        <div className="text-xl font-semibold text-muted-foreground">
          {stats.trips.delayed} - delayed
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <div className="flex justify-between items-center my-6">
          {/* Trip Section */}
          <div className="flex flex-col items-start space-y-2">
            <div className="flex flex-row items-center gap-2">
              <div className="p-1 bg-cyan-600/10 rounded-md">
                <Clock className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="text-base font-medium">Trip</span>
            </div>
            <div className="mt-1 flex flex-col items-start">
              <span className="text-2xl font-semibold">
                {stats.trips.inProgress}
              </span>
              <span className="text-xs text-gray-400 ml-1">delayed</span>
            </div>
          </div>

          {/* VS Divider */}
          <div className="relative text-muted-foreground">
            <div className="absolute h-16 w-px bg-muted-foreground -top-4 left-1/2 transform -translate-x-1/2" />
            <span className="relative text-sm font-medium bg-card py-1">
              vs
            </span>
          </div>

          {/* Drivers Section */}
          <div className="flex flex-col items-end space-y-2">
            <div className="flex flex-row-reverse items-center gap-2">
              <div className="p-1 bg-purple-500/10 rounded-md">
                <User2 className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-base font-medium">Drivers</span>
            </div>
            <div className="mt-1 flex flex-col items-end">
              <span className="text-2xl font-semibold">
                {stats.drivers.available}
              </span>
              <span className="text-xs text-gray-400 ml-1">available</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 rounded-full bg-[hsl(var(--gradient-purple-start))] overflow-hidden">
          <div
            className="h-full bg-cyan-400"
            style={{
              width: `${(stats.trips.inProgress / (stats.trips.inProgress + stats.drivers.available)) * 100}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
