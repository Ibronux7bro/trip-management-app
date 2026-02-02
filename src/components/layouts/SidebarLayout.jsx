"use client";

"use client";

import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';

/**
 * SidebarLayout.jsx
 * Usage: Wrap your page in <SidebarLayout menuItems={MENU_STRUCTURE}>...page content...</SidebarLayout>
 * - On desktop (md+) the sidebar is fixed with width 260px and content is shifted using md:ml-[260px]
 * - On mobile/tablet the sidebar is hidden and slides in from the left; overlay closes it.
 */

const SidebarLayout = ({ children, menuSections = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  // Initialize pinned state from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarPinned');
      if (saved !== null) setIsPinned(saved === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist pinned state
  React.useEffect(() => {
    try {
      localStorage.setItem('sidebarPinned', isPinned ? 'true' : 'false');
    } catch (e) {}
  }, [isPinned]);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const togglePin = useCallback(() => setIsPinned((v) => !v), []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar (example) */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-30 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Menu button for mobile */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
            onClick={openSidebar}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {/* Brand small */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6f4ff2] to-purple-400 text-white flex items-center justify-center font-semibold">N</div>
            <div className="font-semibold">Nukhbat Naql</div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">عربـي</div>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/></svg>
          </button>
        </div>
      </header>

      {/* Sidebar component (mobile controlled) */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} menuSections={menuSections} isPinned={isPinned} onTogglePin={togglePin} />

      {/* Main content area. On desktop leave margin for sidebar (md:ml-64 when pinned, md:ml-20 when collapsed). On mobile full width. */}
      <main className={`pt-14 transition-all duration-300 ${isPinned ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="max-w-[1200px] mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
