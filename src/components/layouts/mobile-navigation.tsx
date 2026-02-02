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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className={`flex items-center justify-around px-2 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.href)}
            className={`
              flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
              transition-all duration-200 ease-in-out min-w-[64px] touch-manipulation
              ${item.isActive 
                ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
              }
              ${isRTL ? 'flex-col-reverse' : 'flex-col'}
            `}
            title={item.label}
            aria-label={item.label}
            aria-current={item.isActive ? 'page' : undefined}
          >
            <item.icon className={`h-5 w-5 transition-transform duration-200 ${
              item.isActive ? 'scale-110' : ''
            }`} />
            <span className="text-[10px] sm:text-xs font-medium truncate max-w-[60px] leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
