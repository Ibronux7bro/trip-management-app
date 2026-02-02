'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/app/providers/translation-provider';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export function LanguageToggle({ 
  variant = 'outline', 
  size = 'default', 
  showText = true,
  className 
}: LanguageToggleProps) {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    console.log('🔄 Toggling language from', language, 'to', newLanguage);
    
    // Add smooth transition effect
    document.documentElement.style.transition = 'all 0.3s ease';
    
    // Update language state
    setLanguage(newLanguage);
    
    // Clean up transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

  const currentLangText = language === 'en' ? 'العربية' : 'English';
  const currentLangFlag = language === 'en' ? '🇸🇦' : '🇺🇸';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md',
        language === 'ar' && 'flex-row-reverse',
        className
      )}
      title={language === 'en' ? 'تبديل إلى العربية' : 'Switch to English'}
    >
      <Globe className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
      {showText && (
        <span className="font-medium transition-colors duration-300">
          {currentLangFlag} {currentLangText}
        </span>
      )}
    </Button>
  );
}

// Compact version for mobile
export function LanguageToggleCompact({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    console.log('🔄 Compact toggle: from', language, 'to', newLanguage);
    
    // Add smooth transition effect
    document.documentElement.style.transition = 'all 0.3s ease';
    
    // Update language state
    setLanguage(newLanguage);
    
    // Clean up transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

  const currentLangText = language === 'en' ? 'عربي' : 'EN';
  const currentLangFlag = language === 'en' ? '🇸🇦' : '🇺🇸';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 px-2 h-8 rounded-md hover:bg-accent transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden',
        language === 'ar' && 'flex-row-reverse',
        className
      )}
      title={language === 'en' ? 'تبديل إلى العربية' : 'Switch to English'}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      
      <span className="text-sm transition-transform duration-300 group-hover:scale-110 relative z-10">{currentLangFlag}</span>
      <span className="text-xs font-medium relative z-10 transition-colors duration-300">{currentLangText}</span>
    </Button>
  );
}

// Language selector dropdown (for future use)
export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs"
      >
        🇺🇸 EN
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ar')}
        className="text-xs"
      >
        🇸🇦 AR
      </Button>
    </div>
  );
}
