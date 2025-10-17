// components/features/status-cards/index.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Battery, Signal, Shield, Clock, Car, UserX } from 'lucide-react';
import { EnhancedDriver } from '@/types';

interface StatusCardsProps {
  overviewMetrics: {
    criticalIssues: {
      lowBattery: number;
      poorSignal: number;
    };
    licenseAlerts: {
      expired: number;
      expiringSoon: number;
    };
  };
  drivers: EnhancedDriver[];
}

const MetricRow = ({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: number;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Icon className={iconColor} size={16} />
      <span className="text-sm">{label}</span>
    </div>
    <span>{value}</span>
  </div>
);

export const StatusCards = ({ overviewMetrics, drivers }: StatusCardsProps) => {
  const assignedDrivers = React.useMemo(
    () => drivers.filter((d) => d.currentVehicle).length,
    [drivers]
  );

  const cardData = [
    {
      title: 'Device Status',
      metrics: [
        {
          icon: Battery,
          iconColor: 'text-warning-500',
          label: 'Low Battery',
          value: overviewMetrics.criticalIssues.lowBattery,
        },
        {
          icon: Signal,
          iconColor: 'text-warning-500',
          label: 'Poor Signal',
          value: overviewMetrics.criticalIssues.poorSignal,
        },
      ],
    },
    {
      title: 'License Status',
      metrics: [
        {
          icon: Shield,
          iconColor: 'text-destructive-500',
          label: 'Expired',
          value: overviewMetrics.licenseAlerts.expired,
        },
        {
          icon: Clock,
          iconColor: 'text-warning-500',
          label: 'Expiring Soon',
          value: overviewMetrics.licenseAlerts.expiringSoon,
        },
      ],
    },
    {
      title: 'Vehicle Assignment',
      metrics: [
        {
          icon: Car,
          iconColor: 'text-primary-500',
          label: 'Assigned',
          value: assignedDrivers,
        },
        {
          icon: UserX,
          iconColor: 'text-muted-foreground',
          label: 'Unassigned',
          value: drivers.filter((d) => !d.currentVehicle).length,
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cardData.map((card, index) => (
        <Card key={index} className="rounded-md">
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-4">{card.title}</h4>
            <div className="space-y-4">
              {card.metrics.map((metric, metricIndex) => (
                <MetricRow key={metricIndex} {...metric} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
