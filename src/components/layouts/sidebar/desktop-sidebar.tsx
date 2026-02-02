'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MENU_STRUCTURE } from '@/constants/sidebar/sidebar';
import CircularButton from '@/custom/svgs/circular-button';
import { LogoIcon } from '@/components/ui/logo';
import { LanguageToggleCompact } from '@/components/ui/language-toggle';
import { siteConfig } from '@/configs/site';
import type {
  DesktopSidebarProps,
  MenuGroupProps,
  MenuItemProps,
} from '@/types/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { useTranslation } from '@/app/providers/translation-provider';

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
  isPinned,
  isDisabled = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      router.push(href);
    }
  };

  return (
    <Button
      variant="ghost"
      className={`
        relative w-full justify-start px-4 py-3 h-auto mb-1 group
        transition-all duration-300 ease-in-out
        ${isActive && !isDisabled 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
          : 'hover:bg-accent hover:shadow-md hover:transform hover:scale-102'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg mx-2 hover-lift
      `}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {/* Active indicator */}
      {isActive && !isDisabled && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
      )}
      
      <div
        className={`
          relative flex items-center w-full transition-all duration-300 ease-in-out
          ${!isPinned ? 'justify-center group-hover:justify-start' : ''}
        `}
      >
        <span
          className={`
            transition-all duration-300 ease-in-out transform
            ${isActive && !isDisabled 
              ? 'text-white scale-110' 
              : 'text-muted-foreground group-hover:text-primary group-hover:scale-105'
            }
          `}
        >
          {icon}
        </span>
        <span
          className={`
            ml-3 transition-all duration-300 ease-in-out whitespace-nowrap font-medium
            ${isActive && !isDisabled 
              ? 'text-white' 
              : 'text-muted-foreground group-hover:text-primary'
            }
            ${!isPinned ? 'hidden group-hover:inline-block opacity-0 group-hover:opacity-100' : ''}
          `}
        >
          {label}
        </span>
      </div>
      
      {/* Hover effect */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 
        transition-opacity duration-300 ease-in-out
        ${!isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
      `} />
    </Button>
  );
};

const MenuGroup: React.FC<MenuGroupProps> = ({ title, showTitle }) => (
  <div className="px-4 py-2">
    {showTitle ? (
      <div className="relative">
        <h3 className="text-xs uppercase font-semibold text-muted-foreground/70 my-3 transition-all duration-500 ease-in-out tracking-wider">
          {title}
        </h3>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    ) : (
      <div className="my-3 mx-2">
        <Separator
          orientation="horizontal"
          className="bg-gradient-to-r from-transparent via-border to-transparent transition-opacity duration-500 ease-in-out"
        />
      </div>
    )}
  </div>
);

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isPinned,
  onPinChange,
}) => {
  const { t, isRTL } = useTranslation();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const sidebarWidth = isPinned || isHovered ? 'wide' : 'narrow';
  const getPadding = () => (sidebarWidth === 'wide' ? 'px-4' : 'px-2');

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col h-screen max-h-screen z-50 ${
        isPinned ? 'w-64' : 'w-16 hover:w-64 group'
      } transition-all duration-500 ease-in-out bg-card shadow-lg border-r border-border/50 backdrop-blur-sm ${
        isRTL ? 'border-r-0 border-l border-l-border/50' : ''
      }`}
    >
      <div className="flex items-center justify-between py-6 px-4 w-full overflow-hidden border-b border-border/30 bg-gradient-to-r from-background to-accent/5">
        <div className="flex flex-row items-center gap-3 group/logo cursor-pointer animate-slideInFromLeft">
          <div className="relative animate-rotateIn">
            <LogoIcon size="sm" variant="default" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover/logo:opacity-20 transition-opacity duration-300 animate-glow" />
          </div>
          <span
            className={`
              font-semibold whitespace-nowrap transition-all duration-500 ease-in-out
              bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent
              ${isPinned ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
            `}
          >
            {siteConfig.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <LanguageToggleCompact />
          </div>
          <Button
            variant="ghost"
            onClick={onPinChange}
            className="w-8 h-8 p-0 justify-center hover:bg-accent/50 rounded-full transition-all duration-300 hover:scale-110"
          >
            <CircularButton
              stroke="currentColor"
              strokeWidth={2}
              className={`transition-all duration-500 ease-in-out hover:text-primary ${isPinned ? 'rotate-0' : 'rotate-180'}`}
            />
          </Button>
        </div>
      </div>

      <nav className={`flex-1 overflow-y-auto py-6 ${getPadding()} pr-2 space-y-1 sidebar-scroll min-h-0`}>
        {MENU_STRUCTURE.map((section, sectionIndex) => (
          <React.Fragment key={section.group || `section-${sectionIndex}`}>
            {section.group && (
              <MenuGroup
                title={section.group}
                showTitle={isPinned || isHovered}
              />
            )}
            {section.items.map((item, itemIndex) => (
              <div 
                key={item.label}
                className="animate-slideInFromLeft"
                style={{ animationDelay: `${(sectionIndex * 0.1) + (itemIndex * 0.05)}s` }}
              >
                <MenuItem
                  icon={<item.icon size={22} />}
                  label={item.label}
                  href={item.href}
                  isActive={pathname === item.href}
                  isPinned={isPinned}
                  isDisabled={item.isDisabled}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </nav>
      
      {/* Scroll indicator - position adjusted for RTL */}
      <div className={`absolute bottom-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-50 ${isRTL ? 'left-2 right-0' : 'left-0 right-2'}`} />
    </aside>
  );
};

export default DesktopSidebar;
