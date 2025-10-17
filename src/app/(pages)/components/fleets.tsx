'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Truck } from 'lucide-react';
import type { ApexOptions } from 'apexcharts';
import { useDashboard } from '@/hooks/useDashboard';

const ReactApexcharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const getChartOptions = (isDarkMode: boolean): ApexOptions => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    parentHeightOffset: 0,
    background: 'transparent',
    stacked: false,
    sparkline: { enabled: false },
    offsetX: 0,
    offsetY: 0,
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4,
      distributed: true,
      barHeight: '100%',
    },
  },
  grid: {
    show: false,
    padding: { left: 0, right: 0, top: -60, bottom: -10 },
  },
  legend: { show: false },
  tooltip: { enabled: false },
  dataLabels: { enabled: false },
  theme: {
    mode: isDarkMode ? 'dark' : 'light',
  },
  colors: isDarkMode
    ? [
        '#393b64',
        '#393b64',
        '#393b64',
        '#393b64',
        '#7367f0',
        '#393b64',
        '#393b64',
      ]
    : [
        '#e8e6fd',
        '#e8e6fd',
        '#e8e6fd',
        '#e8e6fd',
        '#7367f0',
        '#e8e6fd',
        '#e8e6fd',
      ],
  xaxis: {
    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    labels: {
      style: {
        colors: isDarkMode ? '#cbd5e1' : '#718096',
        fontSize: '14px',
      },
    },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { show: false },
});

const FleetStatsCard = () => {
  const metrics = useDashboard();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [chartSeries, setChartSeries] = React.useState<{ data: number[] }[]>(
    []
  );
  const [options, setOptions] = React.useState(getChartOptions(isDarkMode));

  React.useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    console.log(`the values: ${JSON.stringify(metrics.vehicles)}`);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    setOptions(getChartOptions(isDarkMode));
  }, [isDarkMode]);

  // Trigger animation by updating chart data after mount
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setChartSeries([{ data: [30, 45, 35, 25, 50, 30, 35] }]);
    }, 300); // Delay to allow for mount animation

    return () => clearTimeout(timeout);
  }, []);

  const stats = [
    {
      title: 'Total',
      value: metrics.vehicles.total,
      icon: <Truck className="text-indigo-400" size={18} />,
      color: 'bg-indigo-500/10',
      progressColor: 'bg-indigo-500',
    },
    {
      title: 'Available',
      value: metrics.vehicles.available,
      icon: <Truck className="text-cyan-400" size={18} />,
      color: 'bg-cyan-500/10',
      progressColor: 'bg-cyan-500',
    },
    {
      title: 'On Trip',
      value: metrics.vehicles.onTrip,
      icon: <Truck className="text-red-400" size={18} />,
      color: 'bg-red-400/10',
      progressColor: 'bg-red-400',
    },
  ];

  return (
    <Card className="bg-card text-muted-foreground shadow-xl rounded-md">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-medium">
          Fleets Data
          <p className="text-xs font-normal text-muted-foreground mt-1">
            Vehicle data and efficiency
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-semibold">
                {metrics.vehicles.maintenance}
              </span>
              <span className="bg-green-600/20 text-green-500 px-2 py-1 rounded text-xs font-medium">
                +4.2%
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              You informed of this week compared to last week
            </p>
          </div>
          <div className="md:col-span-3 h-[200px] -mx-4">
            <ReactApexcharts
              options={options}
              series={chartSeries}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded', stat.color)}>
                  {stat.icon}
                </div>
                <span className="text-muted-foreground">{stat.title}</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold text-muted-foreground">
                  {stat.value}
                </span>
                <div className="h-1.5 bg-foreground/10 rounded-full mt-2">
                  <div
                    className={cn('h-full rounded-full', stat.progressColor)}
                    style={{ width: `${(stat.value / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetStatsCard;
