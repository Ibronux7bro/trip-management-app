import { DriverStatus } from '@/types';

export const getStatusColor = (status: DriverStatus): string =>
  ({
    available: 'bg-success-100 text-success-700 hover:bg-success-200',
    'on-trip': 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    offline: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    active: 'bg-info-100 text-info-700 hover:bg-info-200',
  })[status] || 'bg-muted text-muted-foreground hover:bg-muted/80';
