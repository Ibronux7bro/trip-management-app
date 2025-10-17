import type { MenuSection } from '@/types/sidebar';
import {
  Activity,
  AlertCircle,
  Fuel,
  Home,
  MapPin,
  Navigation,
  Route,
  Truck,
  Users,
  Package,
  ShoppingCart,
} from 'lucide-react';

// Update the MenuSection type to include isDisabled
declare module '@/types/sidebar' {
  interface MenuItem {
    icon: any;
    label: string;
    href: string;
    isDisabled?: boolean;
  }
}

export const MENU_STRUCTURE: MenuSection[] = [
  {
    items: [{ icon: Home, label: 'Dashboard', labelKey: 'home', href: '/', isDisabled: false }],
  },
  {
    group: 'ORDERS & TRACKING',
    groupKey: 'tracking',
    items: [
      {
        icon: ShoppingCart,
        label: 'My Orders',
        labelKey: 'myOrders',
        href: '/orders',
        isDisabled: false,
      },
      {
        icon: Package,
        label: 'Track Shipment',
        labelKey: 'tracking',
        href: '/tracking',
        isDisabled: false,
      },
      {
        icon: Route,
        label: 'New Booking',
        labelKey: 'booking',
        href: '/clients/booking',
        isDisabled: false,
      },
    ],
  },
  {
    group: 'MANAGEMENT',
    groupKey: 'management',
    items: [
      {
        icon: MapPin,
        label: 'Live Maps',
        labelKey: 'liveMaps',
        href: '/dashboard/maps',
        isDisabled: false,
      },
      {
        icon: Users,
        label: 'Drivers',
        labelKey: 'drivers',
        href: '/dashboard/driver-management',
        isDisabled: false,
      },
      {
        icon: Truck,
        label: 'Vehicles',
        labelKey: 'vehicles',
        href: '/vehicles',
        isDisabled: false,
      },
      {
        icon: Route,
        label: 'Trip Management',
        labelKey: 'trips',
        href: '/dashboard/trips-management',
        isDisabled: false,
      },
    ],
  },
  {
    group: 'ADMIN',
    groupKey: 'admin',
    items: [
      {
        icon: Activity,
        label: 'Admin Dashboard',
        labelKey: 'adminDashboard',
        href: '/admin',
        isDisabled: false,
      },
      {
        icon: Users,
        label: 'Clients',
        labelKey: 'clients',
        href: '/clients',
        isDisabled: false,
      },
    ],
  },
  {
    group: 'REPORTS',
    groupKey: 'reports',
    items: [
      {
        icon: Activity,
        label: 'Trip Activity',
        labelKey: 'tripActivity',
        href: '/dashboard/reports/trip-activity',
        isDisabled: false,
      },
      {
        icon: AlertCircle,
        label: 'Trip Alerts',
        labelKey: 'tripAlerts',
        href: '/dashboard/reports/alerts',
        isDisabled: false,
      },
      {
        icon: Fuel,
        label: 'Fuel & Maintenance',
        labelKey: 'fuelMaintenance',
        href: '/dashboard/reports/maintenance',
        isDisabled: false,
      },
    ],
  },
];
