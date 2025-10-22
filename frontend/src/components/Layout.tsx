import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 container mx-auto px-4 py-6">
        <div className="hidden md:block md:mr-4">
          <Sidebar />
        </div>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
