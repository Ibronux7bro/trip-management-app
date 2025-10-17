'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Hourglass, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useDashboard } from '@/hooks/useDashboard';

const ReactApexcharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function TripsTracker() {
  const stats = useDashboard();
  const [chartSeries, setChartSeries] = React.useState<number[]>([0]);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const completionRate = Math.round(
        (stats.trips.completed / stats.trips.total) * 100
      );
      setChartSeries([completionRate || 0]);
    }, 300); // Delay to allow for smooth animation

    return () => clearTimeout(timeout);
  }, [stats.trips.completed, stats.trips.total]);

  // Chart options
  const options: ApexOptions = {
    chart: {
      height: isMobile ? 200 : 325,
      type: 'radialBar',
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },
    stroke: {
      dashArray: isMobile ? 5 : 10,
      lineCap: 'butt',
      width: isMobile ? 12 : 20,
      show: true,
      curve: 'smooth',
    },
    labels: ['Completed Trips'],
    colors: ['hsl(var(--gradient-purple-start))'],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: ['hsl(var(--gradient-purple-start))'],
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -140,
        endAngle: 130,
        hollow: { size: '60%' },
        track: {
          background: 'transparent',
          startAngle: -140,
          endAngle: 130,
        },
        dataLabels: {
          name: {
            offsetY: isMobile ? -10 : -15,
            color: 'hsl(var(--muted-foreground))',
            fontSize: isMobile ? '12px' : '16px',
            fontWeight: '400',
          },
          value: {
            offsetY: isMobile ? 10 : 15,
            fontSize: isMobile ? '24px' : '36px',
            fontWeight: '600',
            formatter: (val) => `${val}%`,
            color: 'hsl(var(--foreground))',
            show: true,
          },
        },
      },
    },
  };

  // Data for stats
  const data = [
    {
      title: 'In Progress',
      subtitle: stats.trips.inProgress,
      icon: <Loader2 className="h-5 w-5" />,
      color: 'hsl(var(--chart-1))',
    },
    {
      title: 'Scheduled',
      subtitle: stats.trips.scheduled,
      icon: <Clock className="h-5 w-5" />,
      color: 'hsl(var(--chart-2))',
    },
    {
      title: 'Delayed',
      subtitle: stats.trips.delayed,
      icon: <Hourglass className="h-5 w-5" />,
      color: 'hsl(var(--chart-3))',
    },
  ];

  return (
    <Card className="h-full w-full rounded-md shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">
          Trips Tracker
          <p className="text-xs font-normal text-muted-foreground mt-1">
            Last 7 Days
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-8">
          <div className="col-span-1 md:col-span-5">
            <h2 className="text-2xl md:text-4xl font-semibold mb-2">
              {stats.trips.total}
            </h2>
            <p className="mb-4 md:mb-8 text-sm md:text-base text-muted-foreground">
              Total Trips
            </p>
            <div className="space-y-3 md:space-y-6">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="mr-3 md:mr-4 flex h-8 md:h-12 w-8 md:w-12 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                    }}
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                  </div>
                  <div className="flex flex-col">
                    <h6 className="text-xs md:text-sm font-medium">
                      {item.title}
                    </h6>
                    <span className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center col-span-2 md:col-span-7">
            <ReactApexcharts
              type="radialBar"
              height={isMobile ? 200 : 325}
              options={options}
              series={chartSeries}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
