'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface AlertMessageProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function AlertMessage({
  type = 'info',
  title,
  message,
  onClose,
  className,
  showIcon = true
}: AlertMessageProps) {
  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'rounded-lg border p-4',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('h-5 w-5 mt-0.5', config.iconColor)} />
        )}
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold mb-1', config.textColor)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', config.textColor)}>
            {message}
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function SuccessAlert({ message, title, onClose, className }: Omit<AlertMessageProps, 'type'>) {
  return (
    <AlertMessage
      type="success"
      message={message}
      title={title}
      onClose={onClose}
      className={className}
    />
  );
}

export function ErrorAlert({ message, title, onClose, className }: Omit<AlertMessageProps, 'type'>) {
  return (
    <AlertMessage
      type="error"
      message={message}
      title={title}
      onClose={onClose}
      className={className}
    />
  );
}

export function WarningAlert({ message, title, onClose, className }: Omit<AlertMessageProps, 'type'>) {
  return (
    <AlertMessage
      type="warning"
      message={message}
      title={title}
      onClose={onClose}
      className={className}
    />
  );
}

export function InfoAlert({ message, title, onClose, className }: Omit<AlertMessageProps, 'type'>) {
  return (
    <AlertMessage
      type="info"
      message={message}
      title={title}
      onClose={onClose}
      className={className}
    />
  );
}
