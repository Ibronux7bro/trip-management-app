'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TruckIcon, 
  Package, 
  Users, 
  MapPin, 
  Activity,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  drivers: {
    total: number;
    available: number;
    onTrip: number;
    offline: number;
  };
  vehicles: {
    total: number;
    available: number;
    onTrip: number;
    maintenance: number;
  };
  trips: {
    total: number;
    inProgress: number;
    scheduled: number;
    completed: number;
    delayed: number;
  };
  routes: {
    total: number;
    active: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    inProgress: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          مرحباً، {session.user.name || 'المستخدم'} 👋
        </h1>
        <p className="text-muted-foreground">
          نظرة عامة على نظام إدارة الرحلات - نخبة النقل
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-scaleIn">
        {/* Vehicles Card */}
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المركبات</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vehicles.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.vehicles.available || 0} متاحة
            </p>
          </CardContent>
        </Card>

        {/* Drivers Card */}
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">السائقين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.drivers.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.drivers.available || 0} متاحين
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.orders.pending || 0} قيد الانتظار
            </p>
          </CardContent>
        </Card>

        {/* Trips Card */}
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرحلات</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.trips.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.trips.inProgress || 0} قيد التنفيذ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slideInFromBottom">
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
          <CardDescription>الوصول السريع إلى الميزات الأكثر استخداماً</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            onClick={() => router.push('/orders')} 
            className="w-full"
            variant="outline"
          >
            <Package className="mr-2 h-4 w-4" />
            إدارة الطلبات
          </Button>
          <Button 
            onClick={() => router.push('/vehicles')} 
            className="w-full"
            variant="outline"
          >
            <TruckIcon className="mr-2 h-4 w-4" />
            إدارة المركبات
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/trips-management')} 
            className="w-full"
            variant="outline"
          >
            <MapPin className="mr-2 h-4 w-4" />
            إدارة الرحلات
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/driver-management')} 
            className="w-full"
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            إدارة السائقين
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="animate-slideInFromBottom" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>آخر التحديثات في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">لا توجد أنشطة حديثة</p>
                  <p className="text-xs text-muted-foreground">ابدأ بإضافة طلبات أو رحلات جديدة</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
