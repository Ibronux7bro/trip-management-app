import React from 'react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { MENU_STRUCTURE } from '@/constants/sidebar/sidebar';

// Flatten menu structure if needed
const flatMenu = MENU_STRUCTURE.reduce((acc, section) => {
  if (section.items && section.items.length) acc.push(...section.items);
  return acc;
}, []);

export default function DashboardLayout({ children }) {
  // This is a server layout that wraps all dashboard pages.
  // SidebarLayout is a client component and will persist across navigations inside this layout.
  return (
    <SidebarLayout menuSections={MENU_STRUCTURE}>
      {children}
    </SidebarLayout>
  );
}
