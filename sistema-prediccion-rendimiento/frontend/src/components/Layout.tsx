import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dark') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('dark', darkMode ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [darkMode]);

  const toggleSidebar = () => setSidebarExpanded((s) => !s);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);
  const toggleDark = () => setDarkMode((d) => !d);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar
        onOpenMobile={openMobile}
        onToggleSidebar={toggleSidebar}
        onToggleDark={toggleDark}
        sidebarExpanded={sidebarExpanded}
        darkMode={darkMode}
      />
      <div className="flex flex-1 container mx-auto px-4 py-6">
        {/* Sidebar: hidden on small screens; mobile overlay handled by Sidebar when mobileOpen is true */}
        <div
          className={`hidden md:block md:mr-4 ${
            sidebarExpanded ? 'w-56' : 'w-16'
          }`}
        >
          <Sidebar expanded={sidebarExpanded} onToggleExpand={toggleSidebar} />
        </div>

        {/* Mobile drawer */}
        <Sidebar
          expanded={sidebarExpanded}
          mobileOpen={mobileOpen}
          onCloseMobile={closeMobile}
          className="md:hidden"
        />

        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
