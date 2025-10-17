'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Get theme from localStorage or default to light
    const theme = localStorage.getItem('trip-planner-theme') || 'light';

    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="trip-planner-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
