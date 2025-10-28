import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AccessibilityMenu from './AccessibilityMenu';
import TranscriptProvider from './TranscriptProvider';
import VideoSubtitles from './VideoSubtitles';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para controlar el sidebar en móvil (overlay)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <VideoSubtitles>
      <TranscriptProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <div className="flex flex-1">
            {/* Sidebar: pasa el estado móvil para que pueda mostrarse como overlay */}
            <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

            {/* Contenido principal */}
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Footer />
          <AccessibilityMenu />
        </div>
      </TranscriptProvider>
    </VideoSubtitles>
  );
};

export default Layout;
