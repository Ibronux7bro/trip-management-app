'use client';

import { ThemeToggle } from '@/components/features/theme-toggle';
import NotificationCenter from '@/components/features/notification-center';
import { LanguageToggleCompact } from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Search } from 'lucide-react';
import {
  ClipboardList,
  Home,
  Map as MapIcon,
  Navigation,
  Route,
  Truck,
  User,
  Users,
} from 'lucide-react';
import React from 'react';
import MobileSidebar from '../sidebar/mobile-sidebar';
import { useTranslation } from '@/app/providers/translation-provider';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { t, isRTL } = useTranslation();

  // Helper function to safely get translations with fallback
  const getTranslation = (key: string, defaultValue: string): string => {
    try {
      const value = t(key);
      return value || defaultValue;
    } catch (e) {
      console.warn(`Translation key "${key}" not found, using default: ${defaultValue}`);
      return defaultValue;
    }
  };

  // Navigation items with fallback translations
  const quickSettings = [
    { id: 'home', Icon: Home, label: getTranslation('nav.dashboard', 'Dashboard') },
    { id: 'trips-summary', Icon: Route, label: getTranslation('nav.trips', 'Trips') },
    { id: 'list', Icon: ClipboardList, label: getTranslation('nav.orders', 'Orders') },
    { id: 'driver-list', Icon: Users, label: getTranslation('nav.drivers', 'Drivers') },
  ];

  const managementOptions = [
    { id: 'fleet-management', Icon: Truck, label: getTranslation('nav.vehicles', 'Vehicles') },
    { id: 'driver-management', Icon: User, label: getTranslation('nav.drivers', 'Drivers') },
    { id: 'trip-management', Icon: MapIcon, label: getTranslation('nav.trips', 'Trips') },
    { id: 'route-management', Icon: Navigation, label: getTranslation('nav.routes', 'Routes') },
  ];

  // Common translations
  const translations = {
    search: getTranslation('common.search', 'Search'),
    signOut: getTranslation('auth.signOut', 'Sign Out'),
    quickSettings: getTranslation('nav.quickSettings', 'Quick Settings'),
    management: getTranslation('nav.management', 'Management'),
  };

  return (
    <>
      <nav className={`flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm animate-slideInFromTop ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Left side - Mobile menu and search */}
        <div className={`flex items-center gap-4 animate-slideInFromLeft ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant={'ghost'}
                  className="text-sm text-muted-foreground px-2.5 py-1 md:hidden hover:animate-wiggle transition-all duration-300"
                >
                  <Menu className="size-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-72 p-0 animate-slideInFromLeft">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
            <Button
              variant={'ghost'}
              className={`text-sm text-muted-foreground px-2.5 py-1 flex flex-row gap-1 items-center hover:scale-105 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
              onClick={() => setOpen(true)}
            >
              <Search className={`size-5 text-foreground animate-pulse ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="hidden md:flex">{translations.search}</span>
            </Button>
          </div>
        </div>
        {/* Right side - Language, Theme toggle, notifications, and user menu */}
        <div className={`flex items-center gap-2 animate-slideInFromRight ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LanguageToggleCompact />
          <ThemeToggle />
          <NotificationCenter />
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm font-medium animate-scaleIn hover:scale-105 transition-all duration-300"
            style={{ animationDelay: '0.3s' }}
          >
            <LogOut className="w-4 h-4" />
            {translations.signOut}
          </Button>
        </div>
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full h-full sm:max-w-xl sm:h-2/3 p-0">
          <div className="flex flex-col w-full">
            {/* Search Input */}
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                className="flex h-16 w-full rounded-md bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
                placeholder={translations.search + '...'}
                aria-label="Search"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] h-full w-full place-content-center gap-8">
              {/* Quick Settings Section */}
              <div className="flex flex-col items-start pl-16">
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground">
                  {translations.quickSettings}
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  {quickSettings.map(({ id, Icon, label }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className="w-full justify-start gap-3 pl-0 hover:bg-background hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator orientation="vertical" className="h-auto" />

              {/* Management Section */}
              <div className="flex flex-col items-start pr-16">
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground">
                  {translations.management}
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  {managementOptions.map(({ id, Icon, label }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className="w-full justify-start gap-3 pl-0 hover:bg-background hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
