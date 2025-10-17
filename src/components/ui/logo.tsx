import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl'
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
};

const variantClasses = {
  default: 'bg-gradient-to-br from-blue-600 to-purple-600 text-white',
  white: 'bg-white text-blue-600 border-2 border-blue-600',
  dark: 'bg-gray-800 text-white'
};

export function Logo({ size = 'md', variant = 'default', showText = true, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon */}
      <div className={cn(
        'rounded-xl flex items-center justify-center font-bold shadow-lg',
        sizeClasses[size],
        variantClasses[variant]
      )}>
        <span>نن</span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold text-gray-800',
            textSizeClasses[size]
          )}>
            نخبة النقل
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-500">
              Nukhbat Al-Naql
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 'md', variant = 'default', className }: Omit<LogoProps, 'showText'>) {
  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center font-bold shadow-lg',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <span>نن</span>
    </div>
  );
}
