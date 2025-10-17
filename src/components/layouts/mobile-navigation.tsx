'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/app/providers/translation-provider';
import { 
  Home, 
  Package, 
  MapPin, 
  BarChart3, 
  User,
  Settings
} from 'lucide-react';

const MobileNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: t('sidebar.items.home'),
      href: '/',
      isActive: pathname === '/'
    },
    {
      id: 'orders',
      icon: Package,
      label: t('sidebar.items.myOrders'),
      href: '/orders',
      isActive: pathname === '/orders'
    },
    {
      id: 'tracking',
      icon: MapPin,
      label: t('sidebar.items.tracking'),
      href: '/tracking',
      isActive: pathname === '/tracking'
    },
    {
      id: 'booking',
      icon: BarChart3,
      label: t('sidebar.items.booking'),
      href: '/clients/booking',
      isActive: pathname === '/clients/booking'
    },
    {
      id: 'profile',
      icon: User,
      label: t('nav.profile'),
      href: '/profile',
      isActive: pathname === '/profile'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="mobile-nav md:hidden">
      <div className={`flex items-center justify-around ${isRTL ? 'flex-row-reverse' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.href)}
            className={`mobile-nav-item ${item.isActive ? 'active' : ''} ${
              isRTL ? 'flex-col-reverse' : 'flex-col'
            }`}
            title={item.label}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate max-w-[60px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
